import { BaseService } from './baseService';
import { Plan, ClinicaSalutePlano } from '../types/plan';
import { PaginatedResponse } from '../types';

export class PlanService extends BaseService {
  private mapPlanoToPlan(plano: ClinicaSalutePlano): Plan {
    return {
      id: plano.id.toString(),
      name: plano.nome,
    };
  }

  async getPlans(params?: {
    healthInsuranceId?: string;
    locationId?: string;
    professionalId?: string;
  }): Promise<PaginatedResponse<Plan>> {
    try {
      const response = await this.handleRequest<ClinicaSalutePlano[]>(
        this.axios.post('/api/PlanoIntegracao/Pesquisar', {
          IdConvenio: params?.healthInsuranceId ? parseInt(params.healthInsuranceId) : undefined,
          IdUnidade: params?.locationId ? parseInt(params.locationId) : undefined,
          IdProfissional: params?.professionalId ? parseInt(params.professionalId) : undefined,
        })
      );

      const planos = response || [];
      const plans = planos.map(plano => this.mapPlanoToPlan(plano));

      return {
        success: true,
        data: plans,
        pagination: {
          page: 1,
          pageSize: plans.length,
          totalRecords: plans.length,
          totalPages: 1,
        },
        metadata: {
          timestamp: new Date().toISOString(),
          version: 'v1',
        },
      };
    } catch (error) {
      console.error('Error fetching plans:', error);
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

  async getPlanById(id: string): Promise<Plan | null> {
    try {
      const response = await this.handleRequest<ClinicaSalutePlano[]>(
        this.axios.post('/api/PlanoIntegracao/Pesquisar', {
          IdPlano: parseInt(id),
        })
      );

      const planos = response || [];
      if (planos.length > 0) {
        return this.mapPlanoToPlan(planos[0]);
      }

      return null;
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
      console.error('Error fetching plan by id:', error);
      return null;
    }
  }
}

export const planService = new PlanService();