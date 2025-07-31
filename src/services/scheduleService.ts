import { BaseService } from './baseService';
import { Schedule, TimeSlot, ClinicaSaluteAgenda, ClinicaSaluteHorario } from '../types/schedule';
import { ApiResponse } from '../types';

export class ScheduleService extends BaseService {
  private mapHorarioToTimeSlot(horario: ClinicaSaluteHorario): TimeSlot {
    return {
      time: horario.horario,
      available: horario.disponivel,
      duration: horario.duracao,
    };
  }

  private mapAgendaToSchedule(agenda: ClinicaSaluteAgenda): Schedule {
    return {
      id: `${agenda.profissionalId}-${agenda.data}`,
      professionalId: agenda.profissionalId.toString(),
      professionalName: agenda.profissionalNome || '',
      date: agenda.data,
      timeSlots: agenda.horarios.map(h => this.mapHorarioToTimeSlot(h)),
    };
  }

  async getSchedule(params: {
    professionalId: string;
    startDate: string;
    endDate?: string;
    procedureId?: string;
  }): Promise<Schedule[]> {
    const queryParams: any = {
      profissionalId: params.professionalId,
      dataInicio: params.startDate,
      dataFim: params.endDate || params.startDate,
    };

    if (params.procedureId) {
      queryParams.procedimentoId = params.procedureId;
    }

    const queryString = this.buildQueryString(queryParams);
    
    try {
      const response = await this.handleRequest<ClinicaSaluteAgenda[]>(
        this.axios.get(`/AgendaIntegracao/ConsultarHorarios${queryString}`)
      );

      return response.map(agenda => this.mapAgendaToSchedule(agenda));
    } catch (error) {
      throw error;
    }
  }

  async getAvailableSlots(params: {
    professionalId?: string;
    specialtyId?: string;
    procedureId?: string;
    date: string;
  }): Promise<ApiResponse<TimeSlot[]>> {
    const queryParams: any = {
      data: params.date,
    };

    if (params.professionalId) {
      queryParams.profissionalId = params.professionalId;
    }
    if (params.specialtyId) {
      queryParams.especialidadeId = params.specialtyId;
    }
    if (params.procedureId) {
      queryParams.procedimentoId = params.procedureId;
    }

    const queryString = this.buildQueryString(queryParams);
    
    try {
      const response = await this.handleRequest<ClinicaSaluteHorario[]>(
        this.axios.get(`/AgendaIntegracao/HorariosDisponiveis${queryString}`)
      );

      const timeSlots = response.map(h => this.mapHorarioToTimeSlot(h));

      return {
        success: true,
        data: timeSlots,
        metadata: {
          timestamp: new Date().toISOString(),
          version: 'v1',
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

export const scheduleService = new ScheduleService();