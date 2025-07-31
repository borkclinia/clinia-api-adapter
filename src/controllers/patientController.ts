import { Request, Response, NextFunction } from 'express';
import { patientService } from '../services/patientService';
import { ApiResponse } from '../types';

export class PatientController {
  async getPatients(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, pageSize, search, cpf, active } = req.query;
      
      const result = await patientService.getPatients({
        page: page ? parseInt(page as string) : undefined,
        pageSize: pageSize ? parseInt(pageSize as string) : undefined,
        search: search as string,
        cpf: cpf as string,
        active: active === 'true' ? true : active === 'false' ? false : undefined,
      });

      res.json(result);
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
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Patient with id ${id} not found`,
          },
          metadata: {
            timestamp: new Date().toISOString(),
            version: 'v1',
          },
        } as ApiResponse);
      }

      const response: ApiResponse = {
        success: true,
        data: patient,
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

  async createPatient(req: Request, res: Response, next: NextFunction) {
    try {
      const patient = await patientService.createPatient(req.body);

      const response: ApiResponse = {
        success: true,
        data: patient,
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

  async updatePatient(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const patient = await patientService.updatePatient(id, req.body);

      const response: ApiResponse = {
        success: true,
        data: patient,
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

export const patientController = new PatientController();