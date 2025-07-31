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
      id: especialidade.id.toString(),
      name: especialidade.nome,
      code: especialidade.codigo,
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
      id: profissional.id.toString(),
      name: profissional.nome,
      email: profissional.email,
      phone: profissional.telefone,
      cpf: profissional.cpf,
      registrationNumber: profissional.numeroConselho,
      registrationCouncil: profissional.conselho,
      specialties: profissional.especialidades?.map(e => this.mapEspecialidadeToSpecialty(e)) || [],
      services: profissional.procedimentos?.map(p => this.mapProcedimentoToService(p)) || [],
      active: profissional.ativo,
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
        this.axios.get(`/ProfissionalIntegracao/Pesquisar${queryString}`)
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
      const response = await this.handleRequest<ClinicaSaluteProfissional>(
        this.axios.get(`/ProfissionalIntegracao/Buscar/${id}`)
      );

      if (!response) {
        return null;
      }

      return this.mapProfissionalToProfessional(response);
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
        this.axios.get('/EspecialidadeIntegracao/Listar')
      );

      return response.map(e => this.mapEspecialidadeToSpecialty(e));
    } catch (error) {
      throw error;
    }
  }
}

export const professionalService = new ProfessionalService();