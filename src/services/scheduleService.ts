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
    const requestData: any = {
      IdProfissional: parseInt(params.professionalId),
      DataInicio: params.startDate,
      DataFim: params.endDate || params.startDate,
    };

    if (params.procedureId) {
      requestData.IdProcedimento = parseInt(params.procedureId);
    }
    
    try {
      const response = await this.handleRequest<ClinicaSaluteAgenda[]>(
        this.axios.post('/api/AgendaIntegracao/ConsultarHorarios', requestData)
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
    unitId?: string;
  }): Promise<ApiResponse<TimeSlot[]>> {
    const requestData: any = {
      Data: params.date,
    };

    if (params.professionalId) {
      requestData.IdProfissional = parseInt(params.professionalId);
    }
    if (params.specialtyId) {
      requestData.IdEspecialidade = parseInt(params.specialtyId);
    }
    if (params.procedureId) {
      requestData.IdProcedimento = parseInt(params.procedureId);
    }
    if (params.unitId) {
      requestData.IdUnidade = parseInt(params.unitId);
    }
    
    try {
      const response = await this.handleRequest<ClinicaSaluteHorario[]>(
        this.axios.post('/api/AgendamentoIntegracao/ConsultarHorariosDisponiveis', requestData)
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