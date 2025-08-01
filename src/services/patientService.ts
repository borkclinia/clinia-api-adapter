import { BaseService } from './baseService';
import { Patient, ClinicaSalutePaciente } from '../types/patient';
import { PaginatedResponse } from '../types';

export class PatientService extends BaseService {
  private mapPacienteToPatient(paciente: ClinicaSalutePaciente): Patient {
    try {
      const phones = [];
      if (paciente.telefone) phones.push(paciente.telefone);
      if (paciente.celular) phones.push(paciente.celular);
      
      return {
        id: (paciente.id || paciente.Id)?.toString() || '',
        name: paciente.nome || paciente.Nome || '',
        phone: paciente.telefone || paciente.celular || paciente.Telefone || paciente.Celular || '',
        allPhones: phones.length > 0 ? phones : undefined,
        cpf: paciente.cpf || paciente.CPF || '',
        email: paciente.email || paciente.Email || '',
        birthday: paciente.dataNascimento || paciente.DataNascimento || '',
      };
    } catch (error) {
      console.error('Error mapping patient:', error, paciente);
      // Return null to indicate mapping failure
      return null;
    }
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

      // If no search parameters, try to get first page of results
      if (Object.keys(searchData).length === 0) {
        searchData.pagina = page;
        searchData.tamanhoPagina = pageSize;
      }

      const response = await this.handleRequest<ClinicaSalutePaciente[]>(
        this.axios.post('/api/PacienteIntegracao/Buscar', searchData)
      );

      const pacientes = response || [];
      let patients = pacientes
        .map(paciente => this.mapPacienteToPatient(paciente))
        .filter(patient => patient !== null);

      // Apply search filter if provided (search by name, CPF, phone, email)
      if (params?.search) {
        const searchTerm = params.search.toLowerCase();
        patients = patients.filter(patient =>
          patient.name.toLowerCase().includes(searchTerm) ||
          (patient.cpf && patient.cpf.includes(searchTerm)) ||
          (patient.phone && patient.phone.includes(searchTerm)) ||
          (patient.email && patient.email.toLowerCase().includes(searchTerm))
        );
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
      console.error('Error fetching patients:', error);
      // Return empty result instead of throwing error to prevent 500
      return {
        success: true,
        data: [],
        pagination: {
          page: page,
          pageSize: pageSize,
          totalRecords: 0,
          totalPages: 0,
        },
        metadata: {
          timestamp: new Date().toISOString(),
          version: 'v1',
        },
      };
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