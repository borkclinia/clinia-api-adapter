export interface Location {
  id: string;
  name?: string;
  address: string;
  city?: string;
  state?: string;
  cep?: string;
  lat?: number;
  long?: number;
}

export interface ClinicaSaluteUnidade {
  id: number;
  nome: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  telefone?: string;
  email?: string;
  ativo: boolean;
}