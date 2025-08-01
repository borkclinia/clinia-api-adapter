import { Request, Response, NextFunction } from 'express';
import { patientService } from '../services/patientService';
import { ApiResponse } from '../types';

export class PatientController {
  async getPatients(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit, offset, search } = req.query;
      
      const result = await patientService.getPatients({
        page: offset ? Math.floor(parseInt(offset as string) / (parseInt(limit as string) || 20)) + 1 : 1,
        pageSize: limit ? parseInt(limit as string) : 20,
        search: search as string,
      });

      // Return array directly as expected by Clinia
      res.json(result.data || []);
    } catch (error) {
      next(error);
    }
  }

  async searchPatients(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, cpf, phone, email } = req.query;
      const searchTerm = (name || cpf || phone || email) as string;
      
      const result = await patientService.getPatients({
        search: searchTerm,
      });

      // Return array directly as expected by Clinia
      res.json(result.data || []);
    } catch (error) {
      next(error);
    }
  }

  async getPatientById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const patient = await patientService.getPatientById(id);

      if (!patient) {
        return res.status(404).json({
          error: `Patient with id ${id} not found`,
        });
      }

      // Return patient object directly as expected by Clinia
      res.json(patient);
    } catch (error) {
      next(error);
    }
  }

  async createPatient(req: Request, res: Response, next: NextFunction) {
    try {
      const patient = await patientService.createPatient(req.body);

      // Return patient object directly as expected by Clinia
      res.status(201).json(patient);
    } catch (error) {
      next(error);
    }
  }

  async updatePatient(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const patient = await patientService.updatePatient(id, req.body);

      // Return patient object directly as expected by Clinia
      res.json(patient);
    } catch (error) {
      next(error);
    }
  }
}

export const patientController = new PatientController();