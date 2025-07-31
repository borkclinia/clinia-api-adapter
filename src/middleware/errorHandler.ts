import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err instanceof ApiError ? err.statusCode : 500;
  const code = err instanceof ApiError ? err.code : 'INTERNAL_SERVER_ERROR';
  
  const response: ApiResponse = {
    success: false,
    error: {
      code,
      message: err.message,
      details: err instanceof ApiError ? err.details : undefined,
    },
    metadata: {
      timestamp: new Date().toISOString(),
      version: process.env.API_VERSION || 'v1',
    },
  };

  console.error(`Error ${statusCode}: ${err.message}`, err.stack);

  res.status(statusCode).json(response);
};