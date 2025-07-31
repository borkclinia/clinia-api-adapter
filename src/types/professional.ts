export interface Professional {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  registrationNumber?: string;
  registrationCouncil?: string;
  specialties: Specialty[];
  services: Service[];
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Specialty {
  id: string;
  name: string;
  code?: string;
}

export interface Service {
  id: string;
  name: string;
  duration?: number;
  price?: number;
}

export interface ClinicaSaluteProfissional {
  id: number;
  nome: string;
  email?: string;
  telefone?: string;
  cpf?: string;
  numeroConselho?: string;
  conselho?: string;
  especialidades?: ClinicaSaluteEspecialidade[];
  procedimentos?: ClinicaSaluteProcedimento[];
  ativo: boolean;
}

export interface ClinicaSaluteEspecialidade {
  id: number;
  nome: string;
  codigo?: string;
}

export interface ClinicaSaluteProcedimento {
  id: number;
  nome: string;
  duracao?: number;
  valor?: number;
}