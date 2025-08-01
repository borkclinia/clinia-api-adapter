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
  private mapStatusToAppointment(status: string): Appointment['state'] {
    const statusMap: Record<string, Appointment['state']> = {
      'AGENDADO': 'WAITING',
      'CONFIRMADO': 'CONFIRMED',
      'CANCELADO': 'CANCELLED',
      'REALIZADO': 'COMPLETED',
      'FALTOU': 'NO_SHOW',
    };
    
    return statusMap[status.toUpperCase()] || 'WAITING';
  }

  private mapAgendamentoToAppointment(agendamento: ClinicaSaluteAgendamento): Appointment {
    // Calculate end hour if duration is available
    let endHour: string | undefined;
    if (agendamento.duracao && agendamento.horario) {
      const [hours, minutes] = agendamento.horario.split(':').map(Number);
      const totalMinutes = hours * 60 + minutes + agendamento.duracao;
      const endHours = Math.floor(totalMinutes / 60);
      const endMins = totalMinutes % 60;
      endHour = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
    }

    return {
      id: agendamento.id.toString(),
      date: agendamento.data,
      hour: agendamento.horario,
      endHour,
      state: this.mapStatusToAppointment(agendamento.status),
      classification: agendamento.observacoes,
      client: {
        id: agendamento.pacienteId.toString(),
        name: agendamento.pacienteNome || '',
        phone: '', // Would need to fetch from patient data
      },
      location: undefined, // Would need location mapping
      professional: agendamento.profissionalId ? {
        id: agendamento.profissionalId.toString(),
        name: agendamento.profissionalNome || '',
      } : undefined,
      service: agendamento.procedimentoId ? {
        id: agendamento.procedimentoId.toString(),
        name: agendamento.procedimentoNome || '',
      } : undefined,
      healthInsurance: agendamento.convenioId ? {
        id: agendamento.convenioId.toString(),
        name: agendamento.convenioNome || '',
      } : undefined,
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
    const requestData: any = {};
    
    if (params?.patientId) {
      requestData.IdPaciente = parseInt(params.patientId);
    }
    if (params?.professionalId) {
      requestData.IdProfissional = parseInt(params.professionalId);
    }
    if (params?.startDate) {
      requestData.DataInicio = params.startDate;
    }
    if (params?.endDate) {
      requestData.DataFim = params.endDate;
    }
    if (params?.status) {
      requestData.Status = params.status;
    }
    
    try {
      const response = await this.handleRequest<any>(
        this.axios.post('/api/AgendamentoIntegracao/BuscaAgendamentoPaciente', requestData)
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
      const response = await this.handleRequest<ClinicaSaluteAgendamento[]>(
        this.axios.post('/api/AgendamentoIntegracao/BuscaAgendamentoPaciente', {
          IdAgendamento: parseInt(id)
        })
      );

      const agendamentos = response || [];
      if (agendamentos.length > 0) {
        return this.mapAgendamentoToAppointment(agendamentos[0]);
      }

      return null;
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  async createAppointment(appointmentData: CreateAppointmentRequest): Promise<Appointment> {
    const agendarRequest: ClinicaSaluteAgendarRequest = {
      pacienteId: parseInt(appointmentData.client.id),
      profissionalId: appointmentData.professional ? parseInt(appointmentData.professional.id) : 0,
      procedimentoId: appointmentData.service ? parseInt(appointmentData.service.id) : undefined,
      data: appointmentData.date,
      horario: appointmentData.hour,
      observacoes: undefined,
      convenioId: appointmentData.healthInsurance ? parseInt(appointmentData.healthInsurance.id) : undefined,
      planoId: undefined,
    };

    try {
      const response = await this.handleRequest<ClinicaSaluteAgendamento>(
        this.axios.post('/api/AgendamentoIntegracao/Agendar', agendarRequest)
      );

      return this.mapAgendamentoToAppointment(response);
    } catch (error) {
      throw error;
    }
  }

  async updateAppointmentStatus(id: string, state: Appointment['state']): Promise<Appointment> {
    const statusMap: Record<Appointment['state'], string> = {
      'WAITING': 'AGENDADO',
      'CONFIRMED': 'CONFIRMADO',
      'CANCELLED': 'CANCELADO',
      'COMPLETED': 'REALIZADO',
      'NO_SHOW': 'FALTOU',
    };

    const clinicaStatus = statusMap[state];
    if (!clinicaStatus) {
      throw new ApiError(
        400,
        'INVALID_STATUS',
        `Invalid appointment status: ${state}`
      );
    }

    // Use Confirmar endpoint for confirmed status
    if (state === 'CONFIRMED') {
      try {
        const response = await this.handleRequest<ClinicaSaluteAgendamento>(
          this.axios.post('/api/AgendamentoIntegracao/Confirmar', {
            IdAgendamento: parseInt(id),
          })
        );

        return this.mapAgendamentoToAppointment(response);
      } catch (error) {
        throw error;
      }
    }

    // For other status updates, use generic endpoint if available
    try {
      const response = await this.handleRequest<ClinicaSaluteAgendamento>(
        this.axios.post(`/api/AgendamentoIntegracao/AtualizarStatus`, {
          IdAgendamento: parseInt(id),
          Status: clinicaStatus,
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
        this.axios.post('/api/AgendamentoIntegracao/Cancelar', {
          IdAgendamento: parseInt(id),
          Motivo: reason,
        })
      );

      return this.mapAgendamentoToAppointment(response);
    } catch (error) {
      throw error;
    }
  }
}

export const appointmentService = new AppointmentService();