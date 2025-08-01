import { Request, Response, NextFunction } from 'express';
import { serviceService } from '../services/serviceService';

export class ServiceController {
  async getServices(req: Request, res: Response, next: NextFunction) {
    try {
      const { 
        location, 
        professional, 
        healthInsurance, 
        specialty, 
        plan, 
        client, 
        enabled 
      } = req.query;
      
      const result = await serviceService.getServices({
        locationId: location as string,
        professionalId: professional as string,
        healthInsuranceId: healthInsurance as string,
        specialtyId: specialty as string,
        planId: plan as string,
        clientId: client as string,
        enabled: enabled === 'true' ? true : enabled === 'false' ? false : undefined,
      });

      // Return array directly as expected by Clinia
      res.json(result.data || []);
    } catch (error) {
      next(error);
    }
  }

  async getServiceById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const service = await serviceService.getServiceById(id);

      if (!service) {
        return res.status(404).json({
          error: `Service with id ${id} not found`,
        });
      }

      // Return service object directly as expected by Clinia
      res.json(service);
    } catch (error) {
      next(error);
    }
  }
}

export const serviceController = new ServiceController();