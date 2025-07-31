import { Request, Response } from 'express';
import { ApiResponse } from '../types';

export const notFoundHandler = (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: `Route ${req.method} ${req.path} not found`,
    },
    metadata: {
      timestamp: new Date().toISOString(),
      version: process.env.API_VERSION || 'v1',
    },
  };

  res.status(404).json(response);
};