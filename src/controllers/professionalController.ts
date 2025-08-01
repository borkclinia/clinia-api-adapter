import { Request, Response, NextFunction } from 'express';
import { professionalService } from '../services/professionalService';
import { ApiResponse } from '../types';

export class ProfessionalController {
  async getProfessionals(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, pageSize, search, location, service, healthInsurance, specialty, enabled } = req.query;
      
      const result = await professionalService.getProfessionals({
        page: page ? parseInt(page as string) : undefined,
        pageSize: pageSize ? parseInt(pageSize as string) : undefined,
        search: search as string,
        specialtyId: specialty as string,
        active: enabled === 'true' ? true : enabled === 'false' ? false : undefined,
      });

      // Return array directly as expected by Clinia
      res.json(result.data || []);
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
          error: `Professional with id ${id} not found`,
        });
      }

      // Return professional object directly as expected by Clinia
      res.json(professional);
    } catch (error) {
      next(error);
    }
  }

  async getSpecialties(req: Request, res: Response, next: NextFunction) {
    try {
      const { healthInsurance, location, plan, professional } = req.query;
      
      const specialties = await professionalService.getSpecialties({
        healthInsuranceId: healthInsurance as string,
        locationId: location as string,
        planId: plan as string,
        professionalId: professional as string,
      });

      // Return array directly as expected by Clinia
      res.json(specialties);
    } catch (error) {
      next(error);
    }
  }

  async getSpecialtyById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const specialty = await professionalService.getSpecialtyById(id);

      if (!specialty) {
        return res.status(404).json({
          error: `Specialty with id ${id} not found`,
        });
      }

      // Return specialty object directly as expected by Clinia
      res.json(specialty);
    } catch (error) {
      next(error);
    }
  }
}

export const professionalController = new ProfessionalController();