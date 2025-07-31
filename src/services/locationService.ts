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
    // Note: The Clinica Salute API documentation doesn't show a specific endpoint for units/locations
    // This would need to be implemented based on the actual available endpoints
    // For now, returning a mock response structure
    
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 20;

    return {
      success: true,
      data: [],
      pagination: {
        page,
        pageSize,
        totalRecords: 0,
        totalPages: 0,
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