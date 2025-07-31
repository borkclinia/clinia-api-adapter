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
      id: convenio.id.toString(),
      name: convenio.nome,
      registrationNumber: convenio.cnpj,
      plans: convenio.planos?.map(plano => this.mapPlanoToPlan(plano)) || [],
      active: convenio.ativo,
    };
  }

  async getHealthInsurances(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    active?: boolean;
  }): Promise<PaginatedResponse<HealthInsurance>> {
    const queryParams: any = {};
    
    if (params?.search) {
      queryParams.pesquisa = params.search;
    }
    if (params?.active !== undefined) {
      queryParams.ativo = params.active;
    }

    const queryString = this.buildQueryString(queryParams);
    
    try {
      const response = await this.handleRequest<any>(
        this.axios.get(`/ConvenioIntegracao/Pesquisar${queryString}`)
      );

      const convenios = response || [];
      const healthInsurances = convenios.map((convenio: ClinicaSaluteConvenio) => 
        this.mapConvenioToHealthInsurance(convenio)
      );

      const page = params?.page || 1;
      const pageSize = params?.pageSize || 20;
      const totalRecords = healthInsurances.length;
      const totalPages = Math.ceil(totalRecords / pageSize);
      
      // Implement pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = healthInsurances.slice(startIndex, endIndex);

      return {
        success: true,
        data: paginatedData,
        pagination: {
          page,
          pageSize,
          totalRecords,
          totalPages,
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
        this.axios.get(`/ConvenioIntegracao/Buscar/${id}`)
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