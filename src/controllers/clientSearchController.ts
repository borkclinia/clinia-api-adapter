import { Request, Response, NextFunction } from 'express';
import { patientService } from '../services/patientService';
import { ApiError } from '../middleware/errorHandler';

export class ClientSearchController {
  // Endpoint principal para listar clientes (com paginação)
  async getClients(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit, offset } = req.query;
      
      const limitNum = limit ? parseInt(limit as string) : 20;
      const offsetNum = offset ? parseInt(offset as string) : 0;
      const page = Math.floor(offsetNum / limitNum) + 1;
      
      const result = await patientService.getPatients({
        page: page,
        pageSize: limitNum,
      });

      // Return array directly as expected by Clinia
      res.json(result.data || []);
    } catch (error) {
      console.error('Error in getClients:', error);
      // Return empty array on error to prevent 500
      res.json([]);
    }
  }

  // Endpoint específico para busca de cliente usado pela Clinia
  async searchClient(req: Request, res: Response, next: NextFunction) {
    try {
      const { cpf, telefone, email, search } = req.query;
      
      // Validar que pelo menos um parâmetro de busca foi fornecido
      if (!cpf && !telefone && !email && !search) {
        throw new ApiError(
          400,
          'MISSING_SEARCH_PARAMS',
          'Pelo menos um parâmetro de busca deve ser fornecido: cpf, telefone, email ou search'
        );
      }

      // Buscar pacientes baseado nos parâmetros
      const result = await patientService.getPatients({
        cpf: cpf as string,
        search: search as string || telefone as string || email as string,
        page: 1,
        pageSize: 50, // Limitar resultados para performance
      });

      // Formato simplificado esperado pela Clinia
      const clients = result.data?.map(patient => ({
        id: patient.id,
        nome: patient.name,
        cpf: patient.cpf,
        telefone: patient.phone,
        email: patient.email,
        dataNascimento: patient.birthDate,
        ativo: patient.active,
        // Informações adicionais que podem ser úteis
        convenio: patient.healthInsurance ? {
          id: patient.healthInsurance.id,
          nome: patient.healthInsurance.name,
          plano: patient.healthInsurance.planName,
          numeroCarteirinha: patient.healthInsurance.cardNumber,
        } : null,
      })) || [];

      // Return array directly as expected by Clinia
      res.json(result.data || []);

    } catch (error) {
      next(error);
    }
  }

  // Busca de cliente por ID específico
  async getClientById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const patient = await patientService.getPatientById(id);

      if (!patient) {
        return res.status(404).json({
          error: `Client with id ${id} not found`,
        });
      }

      // Return client object directly as expected by Clinia
      res.json(patient);

    } catch (error) {
      console.error('Error in getClientById:', error);
      res.status(404).json({
        error: `Client with id ${req.params.id} not found`,
      });
    }
  }
}

export const clientSearchController = new ClientSearchController();