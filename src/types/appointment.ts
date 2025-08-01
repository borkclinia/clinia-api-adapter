export interface Appointment {
  id: string;
  date: string;
  hour: string;
  endHour?: string;
  state: 'CONFIRMED' | 'WAITING' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  classification?: string;
  client: {
    id: string;
    name: string;
    phone?: string;
  };
  location?: {
    id: string;
    address: string;
  };
  professional?: {
    id: string;
    name: string;
  };
  service?: {
    id: string;
    name: string;
  };
  healthInsurance?: {
    id: string;
    name: string;
  };
}

export interface CreateAppointmentRequest {
  date: string;
  hour: string;
  endHour?: string;
  client: {
    id: string;
  };
  professional?: {
    id: string;
  };
  service?: {
    id: string;
  };
  location?: {
    id: string;
  };
  healthInsurance?: {
    id: string;
  };
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