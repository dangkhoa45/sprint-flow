import axios, { AxiosError, AxiosResponse } from "axios";
import { ErrorResponse, FetchOptions } from "../types/shared";
import { buildQueryString } from "./query";

export async function fetcher<T = unknown>(options: FetchOptions): Promise<T> {
  let url = options.path;
  if (options.params) {
    url += buildQueryString(
      options.params as Record<string, string | number | boolean> as never,
    );
  }

  try {
    const response: AxiosResponse<T> = await axios({
      url,
      method: options.method || "GET",
      timeout: options.timeout || 10000,
      withCredentials: true,
      responseType: "json",
      data: options.body,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw new Error(
        (axiosError.response?.data.message as string) || "An error occurred",
      );
    }
    throw new Error("Unknown error occurred");
  }
}
