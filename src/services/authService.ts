import axios, { AxiosInstance } from 'axios';
import { config } from '../config';
import { AuthToken } from '../types';
import { ApiError } from '../middleware/errorHandler';

class AuthService {
  private token: string | null = null;
  private tokenExpiry: Date | null = null;
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: config.clinicaSalute.baseUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '1.0',
      },
    });

    // Add request interceptor to include token
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await this.getValidToken();
        if (token) {
          // Use Basic Auth instead of Bearer
          const basicAuth = Buffer.from(`clinia.salutehomolo:${token}`).toString('base64');
          config.headers.Authorization = `Basic ${basicAuth}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired, try to refresh
          this.token = null;
          this.tokenExpiry = null;
          
          // Retry the original request once
          const originalRequest = error.config;
          if (!originalRequest._retry) {
            originalRequest._retry = true;
            const token = await this.getValidToken();
            if (token) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return this.axiosInstance(originalRequest);
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private async authenticate(): Promise<AuthToken> {
    // Using static token for homologation environment
    if (config.clinicaSalute.staticToken) {
      // Static token doesn't expire
      const expiresAt = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000); // 1 year
      return {
        token: config.clinicaSalute.staticToken,
        expiresAt,
      };
    }

    throw new ApiError(
      401,
      'AUTH_FAILED',
      'No authentication token configured'
    );
  }

  public async getValidToken(): Promise<string> {
    // For static token, always use it directly
    if (config.clinicaSalute.staticToken) {
      return config.clinicaSalute.staticToken;
    }

    // Check if we have a valid token
    if (this.token && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.token;
    }

    // Get a new token
    const authData = await this.authenticate();
    this.token = authData.token;
    this.tokenExpiry = authData.expiresAt;

    return this.token;
  }

  public getAxiosInstance(): AxiosInstance {
    return this.axiosInstance;
  }
}

// Export singleton instance
export const authService = new AuthService();