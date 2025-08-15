import axios, { AxiosInstance, AxiosRequestConfig, AxiosError, Method } from 'axios';
import { Logger } from '../utils/logger.js';
import { getValue } from '../utils/requestContext.js';

const logger = new Logger({ service: 'apiRequestService' });

const axiosClient: AxiosInstance = axios.create({
  baseURL: process.env.BOTSIFY_API_BASE_URL || 'https://app.botsify.com/api',
  headers: {
    'Content-Type': 'application/json',
    ...(getValue('accessToken') && { Authorization: `Bearer ${getValue('accessToken')}` }),
  },
});

/**
 * Axios request and response interceptors for logging
 */
axiosClient.interceptors.request.use(
    (config) => {
      logger.debug(`Making request to ${config.url}`, {
        method: config.method,
        data: config.data,
      });
      return config;
    },
    (error) => {
      logger.error('Request interceptor error', error);
      return Promise.reject(error);
    }
);

/**
 * Response interceptor to log responses
 */
axiosClient.interceptors.response.use(
    (response) => {
      logger.debug(`Received response from ${response.config.url}`, {
        status: response.status,
        statusText: response.statusText,
      });
      return response;
    },
    (error) => {
      logger.error('Response interceptor error', error);
      return Promise.reject(error);
    }
);

/**
 * Standardized API response format
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  status: number;
  statusText: string;
  error?: string;
}

/**
 * Standardized error message helper (optional improvement)
 */
function getErrorMessage(status: number, data?: any): string {
  switch (status) {
    case 400: return 'Bad request - invalid parameters provided';
    case 401: return 'Unauthorized - invalid API credentials';
    case 403: return 'Forbidden - insufficient permissions';
    case 404: return 'Resource not found';
    case 429: return 'Rate limit exceeded - please try again later';
    case 500: return 'Internal server error - please try again later';
    case 502: return 'Bad gateway - service temporarily unavailable';
    case 503: return 'Service unavailable - please try again later';
    default: return data?.message || data?.error || `HTTP ${status} error`;
  }
}

/**
 * The universal REST API helper
 */
export async function apiRequest<T = any>(
    method: Method,
    endpoint: string,
    options: {
      data?: any;
      params?: any;
      headers?: Record<string, string>;
    } = {}
): Promise<ApiResponse<T>> {
  try {
    /**
     * If the method is POST, PUT, or PATCH, include the apikey in the payload.
     */
    console.log("apiRequest called with method:", method, "and endpoint:", endpoint, "bot api key:", getValue('botsifyChatBotApiKey'));
    let payload = options.data;
    let params = options.params || {};
    if (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT' || method.toUpperCase() === 'PATCH') {
      payload = { ...options.data, apikey: getValue('botsifyChatBotApiKey') };
    } else if (method.toUpperCase() === 'GET') {
      params = { ...options.params, apikey: getValue('botsifyChatBotApiKey') };
    }

    const axiosConfig: AxiosRequestConfig = {
      url: endpoint,
      method,
      data: payload,
      params: params,
      headers: {
        Authorization: `Bearer ${getValue('accessToken')}`,
        ...options.headers
      }
    };

    logger.info(`Making API ${method!.toUpperCase()} request to ${endpoint}`);
    const response = await axiosClient.request<T>(axiosConfig);

    return {
      success: true,
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error: unknown) {
    const err = error as AxiosError;
    const errorResponse: ApiResponse = {
      success: false,
      error: 'Unknown error occurred',
      status: 500,
      statusText: 'Internal Server Error',
    };
    if (err.response) {
      errorResponse.status = err.response.status;
      errorResponse.statusText = err.response.statusText;
      errorResponse.data = err.response.data;
      errorResponse.error = getErrorMessage(err.response.status, err.response.data);
      logger.error('API request failed with server error', {
        status: err.response.status,
        statusText: err.response.statusText,
        data: err.response.data,
      });
    } else if (err.request) {
      errorResponse.status = 0;
      errorResponse.statusText = 'No Response';
      errorResponse.error = 'No response received from server';
      logger.error('API request failed - no response received', {
        request: err.request,
      });
    } else {
      errorResponse.error = err.message || 'Request setup failed';
      logger.error('API request setup failed', {
        message: err.message,
      });
    }
    return errorResponse;
  }
}