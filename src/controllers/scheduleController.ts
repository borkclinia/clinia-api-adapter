import { Request, Response, NextFunction } from 'express';
import { scheduleService } from '../services/scheduleService';
import { ApiResponse } from '../types';
import { ApiError } from '../middleware/errorHandler';

export class ScheduleController {
  async getSchedule(req: Request, res: Response, next: NextFunction) {
    try {
      const { professionalId, startDate, endDate, procedureId } = req.query;

      if (!professionalId || !startDate) {
        throw new ApiError(
          400,
          'MISSING_PARAMS',
          'professionalId and startDate are required'
        );
      }

      const schedules = await scheduleService.getSchedule({
        professionalId: professionalId as string,
        startDate: startDate as string,
        endDate: endDate as string,
        procedureId: procedureId as string,
      });

      const response: ApiResponse = {
        success: true,
        data: schedules,
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