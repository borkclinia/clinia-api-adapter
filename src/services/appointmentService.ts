import { BaseService } from './baseService';
import { 
  Appointment, 
  CreateAppointmentRequest, 
  ClinicaSaluteAgendamento,
  ClinicaSaluteAgendarRequest 
} from '../types/appointment';
import { PaginatedResponse } from '../types';
import { ApiError } from '../middleware/errorHandler';

export class AppointmentService extends BaseService {
  private mapStatusToAppointment(status: string): Appointment['status'] {
    const statusMap: Record<string, Appointment['status']> = {
      'AGENDADO': 'scheduled',
      'CONFIRMADO': 'confirmed',
      'CANCELADO': 'cancelled',
      'REALIZADO': 'completed',
      'FALTOU': 'no-show',
    };
    
    return statusMap[status.toUpperCase()] || 'scheduled';
  }

  private mapAgendamentoToAppointment(agendamento: ClinicaSaluteAgendamento): Appointment {
    return {
      id: agendamento.id.toString(),
      patientId: agendamento.pacienteId.toString(),
      patientName: agendamento.pacienteNome || '',
      professionalId: agendamento.profissionalId.toString(),
      professionalName: agendamento.profissionalNome || '',
      specialtyId: agendamento.especialidadeId?.toString(),
      specialtyName: agendamento.especialidadeNome,
      procedureId: agendamento.procedimentoId?.toString(),
      procedureName: agendamento.procedimentoNome,
      date: agendamento.data,
      time: agendamento.horario,
      duration: agendamento.duracao,
      status: this.mapStatusToAppointment(agendamento.status),
      notes: agendamento.observacoes,
      healthInsurance: agendamento.convenioId ? {
        id: agendamento.convenioId.toString(),
        name: agendamento.convenioNome || '',
        planId: agendamento.planoId?.toString(),
        planName: agendamento.planoNome,
      } : undefined,
      createdAt: agendamento.dataCriacao,
      updatedAt: agendamento.dataAtualizacao,
    };
  }

  async getAppointments(params?: {
    page?: number;
    pageSize?: number;
    patientId?: string;
    professionalId?: string;
    startDate?: string;
    endDate?: string;
    status?: string;
  }): Promise<PaginatedResponse<Appointment>> {
    const queryParams: any = {};
    
    if (params?.patientId) {
      queryParams.pacienteId = params.patientId;
    }
    if (params?.professionalId) {
      queryParams.profissionalId = params.professionalId;
    }
    if (params?.startDate) {
      queryParams.dataInicio = params.startDate;
    }
    if (params?.endDate) {
      queryParams.dataFim = params.endDate;
    }
    if (params?.status) {
      queryParams.status = params.status;
    }

    const queryString = this.buildQueryString(queryParams);
    
    try {
      const response = await this.handleRequest<any>(
        this.axios.get(`/AgendamentoIntegracao/Pesquisar${queryString}`)
      );

      const agendamentos = response || [];
      const appointments = agendamentos.map((ag: ClinicaSaluteAgendamento) => 
        this.mapAgendamentoToAppointment(ag)
      );

      const page = params?.page || 1;
      const pageSize = params?.pageSize || 20;
      const totalRecords = appointments.length;
      const totalPages = Math.ceil(totalRecords / pageSize);
      
      // Implement pagination
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = appointments.slice(startIndex, endIndex);

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

  async getAppointmentById(id: string): Promise<Appointment | null> {
    try {
      const response = await this.handleRequest<ClinicaSaluteAgendamento>(
        this.axios.get(`/AgendamentoIntegracao/Buscar/${id}`)
      );

      if (!response) {
        return null;
      }

      return this.mapAgendamentoToAppointment(response);
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async createAppointment(appointmentData: CreateAppointmentRequest): Promise<Appointment> {
    const agendarRequest: ClinicaSaluteAgendarRequest = {
      pacienteId: parseInt(appointmentData.patientId),
      profissionalId: parseInt(appointmentData.professionalId),
      procedimentoId: appointmentData.procedureId ? parseInt(appointmentData.procedureId) : undefined,
      data: appointmentData.date,
      horario: appointmentData.time,
      observacoes: appointmentData.notes,
      convenioId: appointmentData.healthInsuranceId ? parseInt(appointmentData.healthInsuranceId) : undefined,
      planoId: appointmentData.healthInsurancePlanId ? parseInt(appointmentData.healthInsurancePlanId) : undefined,
    };

    try {
      const response = await this.handleRequest<ClinicaSaluteAgendamento>(
        this.axios.post('/AgendamentoIntegracao/Agendar', agendarRequest)
      );

      return this.mapAgendamentoToAppointment(response);
    } catch (error) {
      throw error;
    }
  }

  async updateAppointmentStatus(id: string, status: Appointment['status']): Promise<Appointment> {
    const statusMap: Record<Appointment['status'], string> = {
      'scheduled': 'AGENDADO',
      'confirmed': 'CONFIRMADO',
      'cancelled': 'CANCELADO',
      'completed': 'REALIZADO',
      'no-show': 'FALTOU',
    };

    const clinicaStatus = statusMap[status];
    if (!clinicaStatus) {
      throw new ApiError(
        400,
        'INVALID_STATUS',
        `Invalid appointment status: ${status}`
      );
    }

    try {
      const response = await this.handleRequest<ClinicaSaluteAgendamento>(
        this.axios.put(`/AgendamentoIntegracao/AtualizarStatus/${id}`, {
          status: clinicaStatus,
        })
      );

      return this.mapAgendamentoToAppointment(response);
    } catch (error) {
      throw error;
    }
  }

  async cancelAppointment(id: string, reason?: string): Promise<Appointment> {
    try {
      const response = await this.handleRequest<ClinicaSaluteAgendamento>(
        this.axios.post(`/AgendamentoIntegracao/Cancelar/${id}`, {
          motivo: reason,
        })
      );

      return this.mapAgendamentoToAppointment(response);
    } catch (error) {
      throw error;
    }
  }
}

export const appointmentService = new AppointmentService();