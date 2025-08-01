import { Request, Response, NextFunction } from 'express';
import { patientService } from '../services/patientService';
import { ApiError } from '../middleware/errorHandler';

export class ClientSearchController {
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

      // Resposta no formato que a Clinia espera
      res.json({
        success: true,
        total: result.pagination?.totalRecords || clients.length,
        clients: clients,
        timestamp: new Date().toISOString(),
      });

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
          success: false,
          error: 'Cliente não encontrado',
          timestamp: new Date().toISOString(),
        });
      }

      // Formato simplificado para a Clinia
      const client = {
        id: patient.id,
        nome: patient.name,
        cpf: patient.cpf,
        telefone: patient.phone,
        email: patient.email,
        dataNascimento: patient.birthDate,
        sexo: patient.gender,
        endereco: patient.address ? {
          logradouro: patient.address.street,
          numero: patient.address.number,
          complemento: patient.address.complement,
          bairro: patient.address.neighborhood,
          cidade: patient.address.city,
          estado: patient.address.state,
          cep: patient.address.zipCode,
        } : null,
        convenio: patient.healthInsurance ? {
          id: patient.healthInsurance.id,
          nome: patient.healthInsurance.name,
          plano: patient.healthInsurance.planName,
          numeroCarteirinha: patient.healthInsurance.cardNumber,
        } : null,
        ativo: patient.active,
      };

      res.json({
        success: true,
        client: client,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      next(error);
    }
  }
}

export const clientSearchController = new ClientSearchController();