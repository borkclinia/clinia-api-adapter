import { BaseService } from './baseService';
import { 
  Professional, 
  Specialty, 
  Service, 
  ClinicaSaluteProfissional, 
  ClinicaSaluteEspecialidade,
  ClinicaSaluteProcedimento 
} from '../types/professional';
import { PaginatedResponse } from '../types';

export class ProfessionalService extends BaseService {
  private mapEspecialidadeToSpecialty(especialidade: ClinicaSaluteEspecialidade): Specialty {
    return {
      id: (especialidade.id || especialidade.Id)?.toString() || '',
      name: especialidade.nome || especialidade.Nome || '',
      code: especialidade.codigo || especialidade.Codigo || '',
    };
  }

  private mapProcedimentoToService(procedimento: ClinicaSaluteProcedimento): Service {
    return {
      id: procedimento.id.toString(),
      name: procedimento.nome,
      duration: procedimento.duracao,
      price: procedimento.valor,
    };
  }

  private mapProfissionalToProfessional(profissional: ClinicaSaluteProfissional): Professional {
    return {
      id: (profissional.id || profissional.Id)?.toString() || '',
      name: profissional.nome || profissional.Nome || '',
      email: profissional.email || profissional.Email || '',
      phone: profissional.telefone || profissional.Telefone || '',
      cpf: profissional.cpf || profissional.CPF || '',
      registrationNumber: profissional.numeroConselho || profissional.NumeroConselho || '',
      registrationCouncil: profissional.conselho || profissional.Conselho || '',
      specialties: profissional.especialidades?.map(e => this.mapEspecialidadeToSpecialty(e)) || [],
      services: profissional.procedimentos?.map(p => this.mapProcedimentoToService(p)) || [],
      active: profissional.ativo !== undefined ? profissional.ativo : true,
    };
  }

  async getProfessionals(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    specialtyId?: string;
    active?: boolean;
  }): Promise<PaginatedResponse<Professional>> {
    const queryParams: any = {};
    
    if (params?.search) {
      queryParams.pesquisa = params.search;
    }
    if (params?.specialtyId) {
      queryParams.especialidadeId = params.specialtyId;
    }
    if (params?.active !== undefined) {
      queryParams.ativo = params.active;
    }

    const queryString = this.buildQueryString(queryParams);
    
    try {
      const response = await this.handleRequest<any>(
        this.axios.post(`/api/ProfissionalIntegracao/Pesquisar`, {
          IdUnidade: undefined, // Try without unit ID
          IdConvenio: 70, // Try ASSINANTE SALUTE convenio
          IdEspecialidade: params?.specialtyId ? parseInt(params.specialtyId) : undefined,
          IdProcedimento: undefined
        })
      );

      const profissionais = response || [];
      const professionals = profissionais.map((prof: ClinicaSaluteProfissional) => 
        this.mapProfissionalToProfessional(prof)
      );

      const page = params?.page || 1;
      const pageSize = params?.pageSize || 20;
      const totalRecords = professionals.length;
      const totalPages = Math.ceil(totalRecords / pageSize);
      
      // Implement pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = professionals.slice(startIndex, endIndex);

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

  async getProfessionalById(id: string): Promise<Professional | null> {
    try {
      const response = await this.handleRequest<ClinicaSaluteProfissional[]>(
        this.axios.post('/api/ProfissionalIntegracao/Pesquisar', {
          IdProfissional: parseInt(id),
          IdUnidade: undefined,
          IdConvenio: undefined,
          IdEspecialidade: undefined,
          IdProcedimento: undefined
        })
      );

      const profissionais = response || [];
      if (profissionais.length > 0) {
        return this.mapProfissionalToProfessional(profissionais[0]);
      }

      return null;
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async getSpecialties(): Promise<Specialty[]> {
    try {
      const response = await this.handleRequest<ClinicaSaluteEspecialidade[]>(
        this.axios.post('/api/EspecialidadeIntegracao/Pesquisar', {})
      );

      return response.map(e => this.mapEspecialidadeToSpecialty(e));
    } catch (error) {
      throw error;
    }
  }
}

export const professionalService = new ProfessionalService();