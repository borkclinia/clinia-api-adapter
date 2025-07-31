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
      },
    });

    // Add request interceptor to include token
    this.axiosInstance.interceptors.request.use(
      async (config) => {
        const token = await this.getValidToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
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
    try {
      const response = await axios.post(
        `${config.clinicaSalute.baseUrl}/Token/generate`,
        {
          login: config.clinicaSalute.login,
          senha: config.clinicaSalute.password,
        }
      );

      if (response.data && response.data.token) {
        const expiresIn = response.data.expiresIn || 3600; // Default to 1 hour
        const expiresAt = new Date(Date.now() + expiresIn * 1000);

        return {
          token: response.data.token,
          expiresAt,
        };
      }

      throw new ApiError(
        401,
        'AUTH_FAILED',
        'Failed to authenticate with Clinica Salute API'
      );
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }

      throw new ApiError(
        500,
        'AUTH_ERROR',
        'Error authenticating with Clinica Salute API',
        error.response?.data || error.message
      );
    }
  }

  public async getValidToken(): Promise<string> {
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