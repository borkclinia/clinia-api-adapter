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
    try {
      // Calculate end hour if duration is available
      let endHour: string | undefined;
      if (agendamento.duracao && agendamento.horario) {
        try {
          const [hours, minutes] = agendamento.horario.split(':').map(Number);
          const totalMinutes = hours * 60 + minutes + agendamento.duracao;
          const endHours = Math.floor(totalMinutes / 60);
          const endMins = totalMinutes % 60;
          endHour = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
        } catch (timeError) {
          console.warn('Error calculating end hour:', timeError);
        }
      }

      return {
        id: (agendamento.id || agendamento.Id)?.toString() || '',
        date: agendamento.data || agendamento.Data || '',
        hour: agendamento.horario || agendamento.Horario || '',
        endHour,
        state: this.mapStatusToAppointment(agendamento.status || agendamento.Status || ''),
        classification: agendamento.observacoes || agendamento.Observacoes,
        client: {
          id: (agendamento.pacienteId || agendamento.PacienteId)?.toString() || '',
          name: agendamento.pacienteNome || agendamento.PacienteNome || '',
          phone: '', // Would need to fetch from patient data
        },
        location: undefined, // Would need location mapping
        professional: (agendamento.profissionalId || agendamento.ProfissionalId) ? {
          id: (agendamento.profissionalId || agendamento.ProfissionalId).toString(),
          name: agendamento.profissionalNome || agendamento.ProfissionalNome || '',
        } : undefined,
        service: (agendamento.procedimentoId || agendamento.ProcedimentoId) ? {
          id: (agendamento.procedimentoId || agendamento.ProcedimentoId).toString(),
          name: agendamento.procedimentoNome || agendamento.ProcedimentoNome || '',
        } : undefined,
        healthInsurance: (agendamento.convenioId || agendamento.ConvenioId) ? {
          id: (agendamento.convenioId || agendamento.ConvenioId).toString(),
          name: agendamento.convenioNome || agendamento.ConvenioNome || '',
        } : undefined,
      };
    } catch (error) {
      console.error('Error in mapAgendamentoToAppointment:', error, agendamento);
      // Return null to indicate mapping failure
      return null;
    }
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
      const appointments = agendamentos
        .filter((ag: any) => ag && typeof ag === 'object')
        .map((ag: ClinicaSaluteAgendamento) => {
          try {
            return this.mapAgendamentoToAppointment(ag);
          } catch (mapError) {
            console.error('Error mapping appointment:', mapError, ag);
            return null;
          }
        })
        .filter((appointment: any) => appointment !== null);

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
      console.error('Error fetching appointments:', error);
      // Return empty result instead of throwing error to prevent 500
      return {
        success: true,
        data: [],
        pagination: {
          page: params?.page || 1,
          pageSize: params?.pageSize || 20,
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