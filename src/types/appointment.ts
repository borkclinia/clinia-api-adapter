export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  professionalId: string;
  professionalName: string;
  specialtyId?: string;
  specialtyName?: string;
  procedureId?: string;
  procedureName?: string;
  date: string;
  time: string;
  duration?: number;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  notes?: string;
  healthInsurance?: {
    id: string;
    name: string;
    planId?: string;
    planName?: string;
  };
  createdAt: string;
  updatedAt?: string;
}

export interface CreateAppointmentRequest {
  patientId: string;
  professionalId: string;
  procedureId?: string;
  date: string;
  time: string;
  notes?: string;
  healthInsuranceId?: string;
  healthInsurancePlanId?: string;
}

export interface ClinicaSaluteAgendamento {
  id: number;
  pacienteId: number;
  pacienteNome?: string;
  profissionalId: number;
  profissionalNome?: string;
  especialidadeId?: number;
  especialidadeNome?: string;
  procedimentoId?: number;
  procedimentoNome?: string;
  data: string;
  horario: string;
  duracao?: number;
  status: string;
  observacoes?: string;
  convenioId?: number;
  convenioNome?: string;
  planoId?: number;
  planoNome?: string;
  dataCriacao: string;
  dataAtualizacao?: string;
}

export interface ClinicaSaluteAgendarRequest {
  pacienteId: number;
  profissionalId: number;
  procedimentoId?: number;
  data: string;
  horario: string;
  observacoes?: string;
  convenioId?: number;
  planoId?: number;
}