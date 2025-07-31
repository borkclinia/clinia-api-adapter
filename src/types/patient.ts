export interface Patient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  cpf?: string;
  birthDate?: string;
  gender?: 'M' | 'F' | 'O';
  address?: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  healthInsurance?: {
    id: string;
    name: string;
    planId?: string;
    planName?: string;
    cardNumber?: string;
  };
  active: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClinicaSalutePaciente {
  id: number;
  nome: string;
  email?: string;
  telefone?: string;
  celular?: string;
  cpf?: string;
  dataNascimento?: string;
  sexo?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  convenioId?: number;
  convenioNome?: string;
  planoId?: number;
  planoNome?: string;
  numeroCarteirinha?: string;
  ativo: boolean;
}