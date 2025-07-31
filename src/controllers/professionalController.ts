import { Request, Response, NextFunction } from 'express';
import { professionalService } from '../services/professionalService';
import { ApiResponse } from '../types';

export class ProfessionalController {
  async getProfessionals(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, pageSize, search, specialtyId, active } = req.query;
      
      const result = await professionalService.getProfessionals({
        page: page ? parseInt(page as string) : undefined,
        pageSize: pageSize ? parseInt(pageSize as string) : undefined,
        search: search as string,
        specialtyId: specialtyId as string,
        active: active === 'true' ? true : active === 'false' ? false : undefined,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getProfessionalById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const professional = await professionalService.getProfessionalById(id);

      if (!professional) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Professional with id ${id} not found`,
          },
          metadata: {
            timestamp: new Date().toISOString(),
            version: 'v1',
          },
        } as ApiResponse);
      }

      const response: ApiResponse = {
        success: true,
        data: professional,
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

  async getSpecialties(req: Request, res: Response, next: NextFunction) {
    try {
      const specialties = await professionalService.getSpecialties();

      const response: ApiResponse = {
        success: true,
        data: specialties,
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

export const professionalController = new ProfessionalController();