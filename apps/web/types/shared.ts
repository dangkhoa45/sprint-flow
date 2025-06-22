import { User } from './user';

export const enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export type ListOptions<T> = Partial<T> & {
  limit?: number;
  offset?: number;
  search?: string;
  searchFields?: (keyof T)[];
  sortField?: keyof T;
  sortOrder?: SortOrder;
  populate?: (keyof T)[];
};

export interface ListResponse<T> {
  items: T[];
  total: number;
  query: ListOptions<T>;
}

export interface ErrorResponse {
  statusCode: number;
  message: string[] | string;
}

export interface QueryParamsProps<T> {
  search?: string;
  sortField: keyof T;
  sortOrder: SortOrder;
  offset: number;
}

export type FetchMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface FetchOptions<Params = unknown, Body = unknown> {
  timeout?: number;
  method?: FetchMethod;
  path: string;
  params?: Params;
  body?: Body;
  headers?: Record<string, string>;
  responseType?: 'json' | 'blob' | 'text';
  onUploadProgress?: (progress: number) => void;
}

export interface BaseObject {
  _id: string;
  updatedAt?: string;
  createdAt?: string;
  updatedBy?: User;
  createdBy?: User;
}

export type ThemeColor =
  | 'default'
  | 'error'
  | 'success'
  | 'info'
  | 'warning'
  | 'primary'
  | 'secondary';

export interface TimeFilter<T> {
  startTime?: string;
  endTime?: string;
  timeField?: keyof T;
  timeUnit?: 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export type SortDirection = 'asc' | 'desc';
