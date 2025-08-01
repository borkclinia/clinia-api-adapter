import { BaseService } from './baseService';
import { HealthInsurance, HealthInsurancePlan, ClinicaSaluteConvenio, ClinicaSalutePlano } from '../types/healthInsurance';
import { PaginatedResponse } from '../types';

export class HealthInsuranceService extends BaseService {
  private mapPlanoToPlan(plano: ClinicaSalutePlano): HealthInsurancePlan {
    return {
      id: plano.id.toString(),
      name: plano.nome,
      code: plano.codigo,
      type: plano.tipo,
      active: plano.ativo,
    };
  }

  private mapConvenioToHealthInsurance(convenio: ClinicaSaluteConvenio): HealthInsurance {
    return {
      id: convenio.id?.toString() || convenio.Id?.toString() || '',
      name: convenio.nome || convenio.Nome || '',
      color: '#3d5aee', // Default color, could be configurable
    };
  }

  async getHealthInsurances(params?: {
    serviceId?: string;
    locationId?: string;
    professionalId?: string;
  }): Promise<PaginatedResponse<HealthInsurance>> {
    try {
      const response = await this.handleRequest<any>(
        this.axios.post(`/api/ConvenioIntegracao/Pesquisar`, {
          IdUnidade: params?.locationId ? parseInt(params.locationId) : undefined,
          IdEspecialidade: undefined,
          IdProfissional: params?.professionalId ? parseInt(params.professionalId) : undefined,
          IdProcedimento: params?.serviceId ? parseInt(params.serviceId) : undefined,
        })
      );

      const convenios = response || [];
      const healthInsurances = convenios.map((convenio: ClinicaSaluteConvenio) => 
        this.mapConvenioToHealthInsurance(convenio)
      );

      return {
        success: true,
        data: healthInsurances,
        pagination: {
          page: 1,
          pageSize: healthInsurances.length,
          totalRecords: healthInsurances.length,
          totalPages: 1,
        },
        metadata: {
          timestamp: new Date().toISOString(),
          version: 'v1',
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async getHealthInsuranceById(id: string): Promise<HealthInsurance | null> {
    try {
      const response = await this.handleRequest<ClinicaSaluteConvenio>(
        this.axios.get(`/api/ConvenioIntegracao/Buscar/${id}`)
      );

      if (!response) {
        return null;
      }

      return this.mapConvenioToHealthInsurance(response);
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }
}

export const healthInsuranceService = new HealthInsuranceService();