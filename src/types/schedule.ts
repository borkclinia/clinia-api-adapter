export interface Schedule {
  id: string;
  professionalId: string;
  professionalName: string;
  date: string;
  timeSlots: TimeSlot[];
}

export interface TimeSlot {
  time: string;
  available: boolean;
  duration?: number;
}

export interface ClinicaSaluteHorario {
  horario: string;
  disponivel: boolean;
  duracao?: number;
}

export interface ClinicaSaluteAgenda {
  profissionalId: number;
  profissionalNome?: string;
  data: string;
  horarios: ClinicaSaluteHorario[];
}