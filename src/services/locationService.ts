import { BaseService } from './baseService';
import { Location, ClinicaSaluteUnidade } from '../types/location';
import { PaginatedResponse } from '../types';

export class LocationService extends BaseService {
  private mapClinicaToLocation(unidade: ClinicaSaluteUnidade): Location {
    return {
      id: unidade.id.toString(),
      name: unidade.nome,
      address: {
        street: unidade.endereco || '',
        number: unidade.numero || '',
        complement: unidade.complemento,
        neighborhood: unidade.bairro || '',
        city: unidade.cidade || '',
        state: unidade.estado || '',
        zipCode: unidade.cep || '',
        country: 'Brasil',
      },
      phone: unidade.telefone,
      email: unidade.email,
      active: unidade.ativo,
    };
  }

  async getLocations(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
  }): Promise<PaginatedResponse<Location>> {
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 20;

    // Implementação com dados mock realistas para demonstração
    // Em produção, isso deveria buscar dados reais da API Clinica Salute
    const mockLocations: Location[] = [
      {
        id: '1',
        name: 'Clinica Salute - Unidade Centro',
        address: {
          street: 'Rua das Flores',
          number: '123',
          complement: 'Sala 45',
          neighborhood: 'Centro',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
          country: 'Brasil',
        },
        phone: '(11) 1234-5678',
        email: 'centro@clinicasalute.com.br',
        active: true,
      },
      {
        id: '2',
        name: 'Clinica Salute - Unidade Zona Sul',
        address: {
          street: 'Avenida Paulista',
          number: '1000',
          neighborhood: 'Bela Vista',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01310-100',
          country: 'Brasil',
        },
        phone: '(11) 9876-5432',
        email: 'zonasul@clinicasalute.com.br',
        active: true,
      },
    ];

    // Filtrar por search se fornecido
    let filteredLocations = mockLocations;
    if (params?.search) {
      const searchTerm = params.search.toLowerCase();
      filteredLocations = mockLocations.filter(location =>
        location.name.toLowerCase().includes(searchTerm) ||
        location.address.city.toLowerCase().includes(searchTerm) ||
        location.address.neighborhood.toLowerCase().includes(searchTerm)
      );
    }

    const totalRecords = filteredLocations.length;
    const totalPages = Math.ceil(totalRecords / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredLocations.slice(startIndex, endIndex);

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
  }

  async getLocationById(id: string): Promise<Location | null> {
    // Implementation would go here based on actual API endpoints
    return null;
  }
}

export const locationService = new LocationService();