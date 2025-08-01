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

    try {
      const searchData: any = {};
      
      if (params?.search) {
        searchData.nome = params.search;
      }
      if (params?.cpf) {
        searchData.cpf = params.cpf.replace(/\D/g, ''); // Remove formatting
      }

      const response = await this.handleRequest<ClinicaSalutePaciente[]>(
        this.axios.post('/api/PacienteIntegracao/Buscar', searchData)
      );

      const pacientes = response || [];
      let patients = pacientes.map(paciente => this.mapPacienteToPatient(paciente));

      // Apply active filter if provided
      if (params?.active !== undefined) {
        patients = patients.filter(patient => patient.active === params.active);
      }

      const totalRecords = patients.length;
      const totalPages = Math.ceil(totalRecords / pageSize);
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = patients.slice(startIndex, endIndex);

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

  async getPatientById(id: string): Promise<Patient | null> {
    try {
      const response = await this.handleRequest<ClinicaSalutePaciente[]>(
        this.axios.post('/api/PacienteIntegracao/Buscar', {
          id: parseInt(id)
        })
      );

      const pacientes = response || [];
      if (pacientes.length > 0) {
        return this.mapPacienteToPatient(pacientes[0]);
      }

      return null;
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
        this.axios.post('/api/PacienteIntegracao/Inserir', pacienteData)
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
        this.axios.post('/api/PacienteIntegracao/Alterar', pacienteData)
      );

      return this.mapPacienteToPatient(response);
    } catch (error) {
      throw error;
    }
  }
}

export const patientService = new PatientService();