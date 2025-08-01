export interface HealthInsurance {
  id: string;
  name: string;
  color?: string;
}

export interface HealthInsurancePlan {
  id: string;
  name: string;
  code?: string;
  type?: string;
  coverage?: string[];
  active: boolean;
}

export interface ClinicaSaluteConvenio {
  id: number;
  nome: string;
  cnpj?: string;
  ativo: boolean;
  planos?: ClinicaSalutePlano[];
}

export interface ClinicaSalutePlano {
  id: number;
  nome: string;
  codigo?: string;
  tipo?: string;
  ativo: boolean;
}