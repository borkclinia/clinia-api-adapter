export interface Plan {
  id: string;
  name: string;
}

export interface ClinicaSalutePlano {
  id: number;
  nome: string;
  convenioId?: number;
  ativo?: boolean;
}