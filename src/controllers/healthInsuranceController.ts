import { Request, Response, NextFunction } from 'express';
import { healthInsuranceService } from '../services/healthInsuranceService';
import { ApiResponse } from '../types';

export class HealthInsuranceController {
  async getHealthInsurances(req: Request, res: Response, next: NextFunction) {
    try {
      const { service, location, professional } = req.query;
      
      const result = await healthInsuranceService.getHealthInsurances({
        serviceId: service as string,
        locationId: location as string,
        professionalId: professional as string,
      });

      // Return array directly as expected by Clinia
      res.json(result.data || []);
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
          error: `Health insurance with id ${id} not found`,
        });
      }

      // Return health insurance object directly as expected by Clinia
      res.json(healthInsurance);
    } catch (error) {
      next(error);
    }
  }
}

export const healthInsuranceController = new HealthInsuranceController();