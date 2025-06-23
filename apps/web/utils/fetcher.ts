import axios, { AxiosError, AxiosResponse } from 'axios';
import { ErrorResponse, FetchOptions } from '../types/shared';
import { buildQueryString } from './query';
import axiosInstance from './axiosConfig';
import { log } from './logger';

export async function fetcher<T = unknown>(options: FetchOptions): Promise<T> {
  let url = options.path;
  if (options.params) {
    url += buildQueryString(
      options.params as Record<string, string | number | boolean> as never
    );
  }

  // Log URL, method, params
  if (typeof window !== 'undefined') {
    console.log(
      '[API CALL]',
      options.method || 'GET',
      url,
      options.params || ''
    );
  }

  try {
    const response: AxiosResponse<T> = await axiosInstance({
      url,
      method: options.method || 'GET',
      timeout: options.timeout || 10000,
      responseType: options.responseType || 'json',
      data: options.body,
      headers: options.headers,
      onUploadProgress: options.onUploadProgress
        ? progressEvent => {
            if (progressEvent.total) {
              const progress = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              options.onUploadProgress!(progress);
            }
          }
        : undefined,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw new Error(
        (axiosError.response?.data.message as string) || 'An error occurred'
      );
    }
    log('Unknown error occurred', error);
    throw new Error('Unknown error occurred');
  }
}
