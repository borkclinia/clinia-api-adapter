import { Request, Response, NextFunction } from 'express';
import { planService } from '../services/planService';

export class PlanController {
  async getPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const { healthInsurance, location, professional } = req.query;
      
      const result = await planService.getPlans({
        healthInsuranceId: healthInsurance as string,
        locationId: location as string,
        professionalId: professional as string,
      });

      // Return array directly as expected by Clinia
      res.json(result.data || []);
    } catch (error) {
      next(error);
    }
  }

  async getPlanById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const plan = await planService.getPlanById(id);

      if (!plan) {
        return res.status(404).json({
          error: `Plan with id ${id} not found`,
        });
      }

      // Return plan object directly as expected by Clinia
      res.json(plan);
    } catch (error) {
      next(error);
    }
  }
}

export const planController = new PlanController();