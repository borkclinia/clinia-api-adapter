import { Request, Response, NextFunction } from 'express';
import { locationService } from '../services/locationService';
import { ApiResponse } from '../types';

export class LocationController {
  async getLocations(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, pageSize, search, service, professional, specialty, client } = req.query;
      
      const result = await locationService.getLocations({
        page: page ? parseInt(page as string) : undefined,
        pageSize: pageSize ? parseInt(pageSize as string) : undefined,
        search: search as string,
        specialtyId: specialty as string,
        professionalId: professional as string,
      });

      // Return array directly as expected by Clinia
      res.json(result.data || []);
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
          error: `Location with id ${id} not found`,
        });
      }

      // Return location object directly as expected by Clinia
      res.json(location);
    } catch (error) {
      next(error);
    }
  }
}

export const locationController = new LocationController();