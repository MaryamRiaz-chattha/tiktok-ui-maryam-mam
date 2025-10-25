/**
 * Comprehensive Axios response type definitions
 * This file provides proper TypeScript types for Axios responses
 * to avoid using 'any' types throughout the authentication system
 */

// Base Axios response structure
export interface AxiosResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
  headers: Record<string, string>;
  config: AxiosRequestConfig;
  request?: unknown;
}

// Axios request configuration
export interface AxiosRequestConfig {
  url?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
  baseURL?: string;
  headers?: Record<string, string>;
  params?: Record<string, unknown>;
  data?: unknown;
  timeout?: number;
  withCredentials?: boolean;
  responseType?: 'json' | 'text' | 'blob' | 'arraybuffer' | 'document' | 'stream';
  [key: string]: unknown;
}

// Generic API response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Authentication-specific response types
export interface AuthApiResponse<T = unknown> extends AxiosResponse<T> {
  data: T;
}

// Error response structure
export interface AxiosErrorResponse {
  message: string;
  status?: number;
  statusText?: string;
  data?: {
    detail?: string;
    error?: string;
    message?: string;
  };
}

// Fetch options for authenticated requests
export interface AuthenticatedFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  data?: unknown;
  headers?: Record<string, string | undefined>;
  timeout?: number;
  withCredentials?: boolean;
}

// Generic request/response types
export type RequestMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS';
export type ResponseData<T = unknown> = T;
export type RequestHeaders = Record<string, string | undefined>;
export type RequestParams = Record<string, unknown>;
