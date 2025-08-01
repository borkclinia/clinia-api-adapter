import { Request, Response, NextFunction } from 'express';
import { appointmentService } from '../services/appointmentService';
import { ApiResponse } from '../types';
import { ApiError } from '../middleware/errorHandler';

export class AppointmentController {
  async getAppointments(req: Request, res: Response, next: NextFunction) {
    try {
      const { start, end, client, professional, location, service, state } = req.query;
      
      const result = await appointmentService.getAppointments({
        patientId: client as string,
        professionalId: professional as string,
        startDate: start as string,
        endDate: end as string,
        status: state as string,
      });

      // Return array directly as expected by Clinia
      res.json(result.data || []);
    } catch (error) {
      console.error('Error in getAppointments:', error);
      // Return empty array on error to prevent 500
      res.json([]);
    }
  }

  async getAppointmentById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const appointment = await appointmentService.getAppointmentById(id);

      if (!appointment) {
        return res.status(404).json({
          error: `Appointment with id ${id} not found`,
        });
      }

      // Return appointment object directly as expected by Clinia
      res.json(appointment);
    } catch (error) {
      next(error);
    }
  }

  async createAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const appointment = await appointmentService.createAppointment(req.body);

      // Return appointment object directly as expected by Clinia
      res.status(201).json(appointment);
    } catch (error) {
      next(error);
    }
  }

  async updateAppointmentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { state } = req.body;

      if (!state) {
        throw new ApiError(
          400,
          'MISSING_PARAMS',
          'state is required'
        );
      }

      const appointment = await appointmentService.updateAppointmentStatus(id, state);

      // Return appointment object directly as expected by Clinia
      res.json(appointment);
    } catch (error) {
      next(error);
    }
  }

  async cancelAppointment(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { reason } = req.body;

      const appointment = await appointmentService.cancelAppointment(id, reason);

      // Return appointment object directly as expected by Clinia
      res.json(appointment);
    } catch (error) {
      next(error);
    }
  }
}

export const appointmentController = new AppointmentController();