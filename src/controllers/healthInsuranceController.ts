import { Request, Response, NextFunction } from 'express';
import { healthInsuranceService } from '../services/healthInsuranceService';
import { ApiResponse } from '../types';

export class HealthInsuranceController {
  async getHealthInsurances(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, pageSize, search, active } = req.query;
      
      const result = await healthInsuranceService.getHealthInsurances({
        page: page ? parseInt(page as string) : undefined,
        pageSize: pageSize ? parseInt(pageSize as string) : undefined,
        search: search as string,
        active: active === 'true' ? true : active === 'false' ? false : undefined,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getHealthInsuranceById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const healthInsurance = await healthInsuranceService.getHealthInsuranceById(id);

      if (!healthInsurance) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Health insurance with id ${id} not found`,
          },
          metadata: {
            timestamp: new Date().toISOString(),
            version: 'v1',
          },
        } as ApiResponse);
      }

      const response: ApiResponse = {
        success: true,
        data: healthInsurance,
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

export const healthInsuranceController = new HealthInsuranceController();