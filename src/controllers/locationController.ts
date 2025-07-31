import { Request, Response, NextFunction } from 'express';
import { locationService } from '../services/locationService';
import { ApiResponse } from '../types';

export class LocationController {
  async getLocations(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, pageSize, search } = req.query;
      
      const result = await locationService.getLocations({
        page: page ? parseInt(page as string) : undefined,
        pageSize: pageSize ? parseInt(pageSize as string) : undefined,
        search: search as string,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getLocationById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const location = await locationService.getLocationById(id);

      if (!location) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Location with id ${id} not found`,
          },
          metadata: {
            timestamp: new Date().toISOString(),
            version: 'v1',
          },
        } as ApiResponse);
      }

      const response: ApiResponse = {
        success: true,
        data: location,
        metadata: {
          timestamp: new Date().toISOString(),
          version: 'v1',
        },
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const locationController = new LocationController();