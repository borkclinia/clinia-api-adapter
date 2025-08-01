import { Request, Response, NextFunction } from 'express';
import { scheduleService } from '../services/scheduleService';
import { ApiResponse } from '../types';
import { ApiError } from '../middleware/errorHandler';

export class ScheduleController {
  async getSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const { 
        start, 
        end, 
        professional, 
        service, 
        location, 
        healthInsurance, 
        specialty, 
        client, 
        plan 
      } = req.query;

      if (!start || !end) {
        throw new ApiError(
          400,
          'MISSING_PARAMS',
          'start and end dates are required'
        );
      }

      const schedules = await scheduleService.getSchedule({
        professionalId: professional as string,
        startDate: start as string,
        endDate: end as string,
        procedureId: service as string,
        specialtyId: specialty as string,
        locationId: location as string,
        healthInsuranceId: healthInsurance as string,
        clientId: client as string,
        planId: plan as string,
      });

      // Return schedule object directly as expected by Clinia
      res.json(schedules);
    } catch (error) {
      next(error);
    }
  }

  async getAvailableSlots(req: Request, res: Response, next: NextFunction) {
    try {
      const { professionalId, specialtyId, procedureId, date } = req.query;

      if (!date) {
        throw new ApiError(
          400,
          'MISSING_PARAMS',
          'date is required'
        );
      }

      const result = await scheduleService.getAvailableSlots({
        professionalId: professionalId as string,
        specialtyId: specialtyId as string,
        procedureId: procedureId as string,
        date: date as string,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

export const scheduleController = new ScheduleController();