import { AxiosInstance, AxiosResponse } from 'axios';
import { authService } from './authService';
import { ApiError } from '../middleware/errorHandler';

export abstract class BaseService {
  protected axios: AxiosInstance;

  constructor() {
    this.axios = authService.getAxiosInstance();
  }

  protected async handleRequest<T>(
    request: Promise<AxiosResponse<T>>
  ): Promise<T> {
    try {
      const response = await request;
      return response.data;
    } catch (error: any) {
      if (error.response) {
        // Server responded with error
        throw new ApiError(
          error.response.status,
          'API_ERROR',
          error.response.data?.message || 'External API error',
          error.response.data
        );
      } else if (error.request) {
        // Request made but no response
        throw new ApiError(
          503,
          'SERVICE_UNAVAILABLE',
          'External service is unavailable'
        );
      } else {
        // Something else happened
        throw new ApiError(
          500,
          'INTERNAL_ERROR',
          error.message || 'Internal server error'
        );
      }
    }
  }

  protected buildQueryString(params: Record<string, any>): string {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, String(value));
      }
    });

    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
  }
}