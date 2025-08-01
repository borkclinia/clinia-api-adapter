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
    professionalId?: string;
    startDate: string;
    endDate?: string;
    procedureId?: string;
    specialtyId?: string;
    locationId?: string;
    healthInsuranceId?: string;
    clientId?: string;
    planId?: string;
  }): Promise<Record<string, Array<{start: string, end: string}>>> {
    const requestData: any = {
      DataInicio: params.startDate,
      DataFim: params.endDate || params.startDate,
    };

    if (params.professionalId) {
      requestData.IdProfissional = parseInt(params.professionalId);
    }
    if (params.procedureId) {
      requestData.IdProcedimento = parseInt(params.procedureId);
    }
    if (params.specialtyId) {
      requestData.IdEspecialidade = parseInt(params.specialtyId);
    }
    if (params.locationId) {
      requestData.IdUnidade = parseInt(params.locationId);
    }
    if (params.healthInsuranceId) {
      requestData.IdConvenio = parseInt(params.healthInsuranceId);
    }
    if (params.clientId) {
      requestData.IdPaciente = parseInt(params.clientId);
    }
    if (params.planId) {
      requestData.IdPlano = parseInt(params.planId);
    }
    
    try {
      const response = await this.handleRequest<ClinicaSaluteAgenda[]>(
        this.axios.post('/api/AgendaIntegracao/ConsultarHorarios', requestData)
      );

      // Transform to Clinia's expected format: dates as keys, time intervals as values
      const schedule: Record<string, Array<{start: string, end: string}>> = {};
      
      // Handle empty response
      if (!response || !Array.isArray(response)) {
        return schedule;
      }

      response.forEach(agenda => {
        if (!agenda.horarios || !Array.isArray(agenda.horarios)) {
          return;
        }

        const availableSlots = agenda.horarios
          .filter(h => h && h.disponivel && h.horario)
          .map(h => {
            try {
              const duration = h.duracao || 30; // Default 30 minutes
              const [hours, minutes] = h.horario.split(':').map(Number);
              const totalMinutes = hours * 60 + minutes + duration;
              const endHours = Math.floor(totalMinutes / 60);
              const endMins = totalMinutes % 60;
              const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
              
              return {
                start: h.horario,
                end: endTime
              };
            } catch (timeError) {
              console.warn('Error parsing time slot:', h.horario, timeError);
              return null;
            }
          })
          .filter(slot => slot !== null) as Array<{start: string, end: string}>;
          
        if (availableSlots.length > 0) {
          schedule[agenda.data] = availableSlots;
        }
      });

      return schedule;
    } catch (error) {
      console.error('Error fetching schedule:', error);
      // Return empty schedule instead of throwing error
      return {};
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