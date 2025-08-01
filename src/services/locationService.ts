import { BaseService } from './baseService';
import { Location, ClinicaSaluteUnidade } from '../types/location';
import { PaginatedResponse } from '../types';

export class LocationService extends BaseService {
  private mapClinicaToLocation(unidade: ClinicaSaluteUnidade): Location {
    return {
      id: (unidade.id || unidade.Id)?.toString() || '',
      name: unidade.nome || unidade.Nome || '',
      address: {
        street: unidade.endereco || unidade.Endereco || '',
        number: unidade.numero || unidade.Numero || '',
        complement: unidade.complemento || unidade.Complemento || '',
        neighborhood: unidade.bairro || unidade.Bairro || '',
        city: unidade.cidade || unidade.Cidade || '',
        state: unidade.estado || unidade.Estado || '',
        zipCode: unidade.cep || unidade.CEP || '',
        country: 'Brasil',
      },
      phone: unidade.telefone || unidade.Telefone || '',
      email: unidade.email || unidade.Email || '',
      active: unidade.ativo !== undefined ? unidade.ativo : true,
    };
  }

  async getLocations(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    specialtyId?: string;
    professionalId?: string;
  }): Promise<PaginatedResponse<Location>> {
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 20;

    try {
      const response = await this.handleRequest<ClinicaSaluteUnidade[]>(
        this.axios.post('/api/EmpresaIntegracao/PesquisarUnidadesConsulta', {
          IdEspecialidade: params?.specialtyId ? parseInt(params.specialtyId) : undefined,
          IdProfissional: params?.professionalId ? parseInt(params.professionalId) : undefined,
        })
      );

      const unidades = response || [];
      let locations = unidades.map(unidade => this.mapClinicaToLocation(unidade));

      // Apply search filter if provided
      if (params?.search) {
        const searchTerm = params.search.toLowerCase();
        locations = locations.filter(location =>
          location.name.toLowerCase().includes(searchTerm) ||
          location.address.city.toLowerCase().includes(searchTerm) ||
          location.address.neighborhood.toLowerCase().includes(searchTerm)
        );
      }

      const totalRecords = locations.length;
      const totalPages = Math.ceil(totalRecords / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = locations.slice(startIndex, endIndex);

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

  async getLocationById(id: string): Promise<Location | null> {
    try {
      const response = await this.handleRequest<ClinicaSaluteUnidade[]>(
        this.axios.post('/api/EmpresaIntegracao/PesquisarUnidadesConsulta', {
          IdUnidade: parseInt(id),
        })
      );

      const unidades = response || [];
      if (unidades.length > 0) {
        return this.mapClinicaToLocation(unidades[0]);
      }

      return null;
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }
}

export const locationService = new LocationService();