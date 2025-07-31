import { Request, Response, NextFunction } from 'express';
import { appointmentService } from '../services/appointmentService';
import { ApiResponse } from '../types';
import { ApiError } from '../middleware/errorHandler';

export class AppointmentController {
  async getAppointments(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, pageSize, patientId, professionalId, startDate, endDate, status } = req.query;
      
      const result = await appointmentService.getAppointments({
        page: page ? parseInt(page as string) : undefined,
        pageSize: pageSize ? parseInt(pageSize as string) : undefined,
        patientId: patientId as string,
        professionalId: professionalId as string,
        startDate: startDate as string,
        endDate: endDate as string,
        status: status as string,
      });

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async getAppointmentById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const appointment = await appointmentService.getAppointmentById(id);

      if (!appointment) {
        return res.status(404).json({
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Appointment with id ${id} not found`,
          },
          metadata: {
            timestamp: new Date().toISOString(),
            version: 'v1',
          },
        } as ApiResponse);
      }

      const response: ApiResponse = {
        success: true,
        data: appointment,
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

  async createAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const appointment = await appointmentService.createAppointment(req.body);

      const response: ApiResponse = {
        success: true,
        data: appointment,
        metadata: {
          timestamp: new Date().toISOString(),
          version: 'v1',
        },
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateAppointmentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        throw new ApiError(
          400,
          'MISSING_PARAMS',
          'status is required'
        );
      }

      const appointment = await appointmentService.updateAppointmentStatus(id, status);

      const response: ApiResponse = {
        success: true,
        data: appointment,
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

  async cancelAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const appointment = await appointmentService.cancelAppointment(id, reason);

      const response: ApiResponse = {
        success: true,
        data: appointment,
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

export const appointmentController = new AppointmentController();