import { BaseService } from './baseService';
import { Patient, ClinicaSalutePaciente } from '../types/patient';
import { PaginatedResponse } from '../types';

export class PatientService extends BaseService {
  private mapPacienteToPatient(paciente: ClinicaSalutePaciente): Patient {
    let gender: 'M' | 'F' | 'O' | undefined;
    if (paciente.sexo) {
      if (paciente.sexo.toUpperCase() === 'M' || paciente.sexo.toUpperCase() === 'MASCULINO') {
        gender = 'M';
      } else if (paciente.sexo.toUpperCase() === 'F' || paciente.sexo.toUpperCase() === 'FEMININO') {
        gender = 'F';
      } else {
        gender = 'O';
      }
    }

    return {
      id: paciente.id.toString(),
      name: paciente.nome,
      email: paciente.email,
      phone: paciente.telefone || paciente.celular,
      cpf: paciente.cpf,
      birthDate: paciente.dataNascimento,
      gender,
      address: paciente.endereco ? {
        street: paciente.endereco,
        number: paciente.numero || '',
        complement: paciente.complemento,
        neighborhood: paciente.bairro || '',
        city: paciente.cidade || '',
        state: paciente.estado || '',
        zipCode: paciente.cep || '',
      } : undefined,
      healthInsurance: paciente.convenioId ? {
        id: paciente.convenioId.toString(),
        name: paciente.convenioNome || '',
        planId: paciente.planoId?.toString(),
        planName: paciente.planoNome,
        cardNumber: paciente.numeroCarteirinha,
      } : undefined,
      active: paciente.ativo,
    };
  }

  async getPatients(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    cpf?: string;
    active?: boolean;
  }): Promise<PaginatedResponse<Patient>> {
    const page = params?.page || 1;
    const pageSize = params?.pageSize || 20;

    // Dados mock realistas para demonstração
    // Em produção, isso deveria buscar dados reais da API Clinica Salute
    const mockPatients: Patient[] = [
      {
        id: '1',
        name: 'João Silva Santos',
        email: 'joao.silva@email.com',
        phone: '(11) 99999-1234',
        cpf: '123.456.789-00',
        birthDate: '1985-03-15',
        gender: 'M',
        address: {
          street: 'Rua das Palmeiras',
          number: '456',
          neighborhood: 'Vila Mariana',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '04567-890',
        },
        healthInsurance: {
          id: '1',
          name: 'Unimed',
          planId: '1',
          planName: 'Plano Básico',
          cardNumber: '123456789012345',
        },
        active: true,
      },
      {
        id: '2',
        name: 'Maria Oliveira Costa',
        email: 'maria.oliveira@email.com',
        phone: '(11) 88888-5678',
        cpf: '987.654.321-00',
        birthDate: '1990-07-22',
        gender: 'F',
        address: {
          street: 'Avenida Brigadeiro',
          number: '789',
          complement: 'Apto 101',
          neighborhood: 'Liberdade',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
        },
        healthInsurance: {
          id: '2',
          name: 'Bradesco Saúde',
          planId: '2',
          planName: 'Plano Premium',
          cardNumber: '987654321098765',
        },
        active: true,
      },
      {
        id: '3',
        name: 'Carlos Roberto Lima',
        email: 'carlos.lima@email.com',
        phone: '(11) 77777-9012',
        cpf: '456.789.123-00',
        birthDate: '1978-12-08',
        gender: 'M',
        active: true,
      },
    ];

    // Filtrar por parâmetros
    let filteredPatients = mockPatients;

    // Filtro por CPF (busca exata)
    if (params?.cpf) {
      const cpfSearch = params.cpf.replace(/\D/g, ''); // Remove formatação
      filteredPatients = filteredPatients.filter(patient => 
        patient.cpf?.replace(/\D/g, '').includes(cpfSearch)
      );
    }

    // Filtro por search (nome, email, telefone)
    if (params?.search && !params?.cpf) {
      const searchTerm = params.search.toLowerCase();
      filteredPatients = filteredPatients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm) ||
        patient.email?.toLowerCase().includes(searchTerm) ||
        patient.phone?.includes(searchTerm) ||
        patient.cpf?.includes(searchTerm)
      );
    }

    // Filtro por ativo
    if (params?.active !== undefined) {
      filteredPatients = filteredPatients.filter(patient => patient.active === params.active);
    }

    const totalRecords = filteredPatients.length;
    const totalPages = Math.ceil(totalRecords / pageSize);
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedData = filteredPatients.slice(startIndex, endIndex);

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

  async getPatientById(id: string): Promise<Patient | null> {
    try {
      const response = await this.handleRequest<ClinicaSalutePaciente>(
        this.axios.get(`/PacienteIntegracao/Buscar/${id}`)
      );

      if (!response) {
        return null;
      }

      return this.mapPacienteToPatient(response);
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async createPatient(patientData: Partial<Patient>): Promise<Patient> {
    const pacienteData: any = {
      nome: patientData.name,
      email: patientData.email,
      telefone: patientData.phone,
      cpf: patientData.cpf,
      dataNascimento: patientData.birthDate,
      sexo: patientData.gender,
      endereco: patientData.address?.street,
      numero: patientData.address?.number,
      complemento: patientData.address?.complement,
      bairro: patientData.address?.neighborhood,
      cidade: patientData.address?.city,
      estado: patientData.address?.state,
      cep: patientData.address?.zipCode,
      convenioId: patientData.healthInsurance?.id ? parseInt(patientData.healthInsurance.id) : undefined,
      planoId: patientData.healthInsurance?.planId ? parseInt(patientData.healthInsurance.planId) : undefined,
      numeroCarteirinha: patientData.healthInsurance?.cardNumber,
    };

    try {
      const response = await this.handleRequest<ClinicaSalutePaciente>(
        this.axios.post('/PacienteIntegracao/Cadastrar', pacienteData)
      );

      return this.mapPacienteToPatient(response);
    } catch (error) {
      throw error;
    }
  }

  async updatePatient(id: string, patientData: Partial<Patient>): Promise<Patient> {
    const pacienteData: any = {
      id: parseInt(id),
      nome: patientData.name,
      email: patientData.email,
      telefone: patientData.phone,
      cpf: patientData.cpf,
      dataNascimento: patientData.birthDate,
      sexo: patientData.gender,
      endereco: patientData.address?.street,
      numero: patientData.address?.number,
      complemento: patientData.address?.complement,
      bairro: patientData.address?.neighborhood,
      cidade: patientData.address?.city,
      estado: patientData.address?.state,
      cep: patientData.address?.zipCode,
      convenioId: patientData.healthInsurance?.id ? parseInt(patientData.healthInsurance.id) : undefined,
      planoId: patientData.healthInsurance?.planId ? parseInt(patientData.healthInsurance.planId) : undefined,
      numeroCarteirinha: patientData.healthInsurance?.cardNumber,
    };

    try {
      const response = await this.handleRequest<ClinicaSalutePaciente>(
        this.axios.put('/PacienteIntegracao/Atualizar', pacienteData)
      );

      return this.mapPacienteToPatient(response);
    } catch (error) {
      throw error;
    }
  }
}

export const patientService = new PatientService();