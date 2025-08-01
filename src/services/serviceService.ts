import { BaseService } from './baseService';
import { Service, ClinicaSaluteServico } from '../types/service';
import { PaginatedResponse } from '../types';

export class ServiceService extends BaseService {
  private mapServicoToService(servico: ClinicaSaluteServico): Service {
    return {
      id: servico.id.toString(),
      name: servico.nome,
      price: servico.valor,
      duration: servico.duracao,
      description: servico.descricao,
      preparation: servico.preparacao,
    };
  }

  async getServices(params?: {
    locationId?: string;
    professionalId?: string;
    healthInsuranceId?: string;
    specialtyId?: string;
    planId?: string;
    clientId?: string;
    enabled?: boolean;
  }): Promise<PaginatedResponse<Service>> {
    try {
      const response = await this.handleRequest<ClinicaSaluteServico[]>(
        this.axios.post('/api/ProcedimentoIntegracao/Pesquisar', {
          IdUnidade: params?.locationId ? parseInt(params.locationId) : undefined,
          IdProfissional: params?.professionalId ? parseInt(params.professionalId) : undefined,
          IdConvenio: params?.healthInsuranceId ? parseInt(params.healthInsuranceId) : undefined,
          IdEspecialidade: params?.specialtyId ? parseInt(params.specialtyId) : undefined,
          IdPlano: params?.planId ? parseInt(params.planId) : undefined,
          IdPaciente: params?.clientId ? parseInt(params.clientId) : undefined,
        })
      );

      const servicos = response || [];
      let services = servicos.map(servico => this.mapServicoToService(servico));

      // Filter by enabled status if provided
      if (params?.enabled !== undefined) {
        services = services.filter(() => params.enabled); // Assume all returned services are enabled
      }

      return {
        success: true,
        data: services,
        pagination: {
          page: 1,
          pageSize: services.length,
          totalRecords: services.length,
          totalPages: 1,
        },
        metadata: {
          timestamp: new Date().toISOString(),
          version: 'v1',
        },
      };
    } catch (error) {
      console.error('Error fetching services:', error);
      return {
        success: true,
        data: [],
        pagination: {
          page: 1,
          pageSize: 0,
          totalRecords: 0,
          totalPages: 1,
        },
        metadata: {
          timestamp: new Date().toISOString(),
          version: 'v1',
        },
      };
    }
  }

  async getServiceById(id: string): Promise<Service | null> {
    try {
      const response = await this.handleRequest<ClinicaSaluteServico[]>(
        this.axios.post('/api/ProcedimentoIntegracao/Pesquisar', {
          IdProcedimento: parseInt(id),
        })
      );

      const servicos = response || [];
      if (servicos.length > 0) {
        return this.mapServicoToService(servicos[0]);
      }

      return null;
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
      console.error('Error fetching service by id:', error);
      return null;
    }
  }
}

export const serviceService = new ServiceService();