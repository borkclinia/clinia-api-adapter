export interface Service {
  id: string;
  name: string;
  price?: number;
  duration?: number;
  description?: string;
  preparation?: string;
}

export interface ClinicaSaluteServico {
  id: number;
  nome: string;
  valor?: number;
  duracao?: number;
  descricao?: string;
  preparacao?: string;
  ativo?: boolean;
}