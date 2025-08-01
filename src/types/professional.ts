export interface Professional {
  id: string;
  name: string;
  description?: string;
  image?: string;
  expertise?: string;
  register?: string;
  specialties?: Specialty[];
}

export interface Specialty {
  id: string;
  name: string;
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