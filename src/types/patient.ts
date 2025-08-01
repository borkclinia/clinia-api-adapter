export interface Patient {
  id: string;
  name: string;
  description?: string;
  phone?: string;
  allPhones?: string[];
  cpf?: string;
  image?: string;
  email?: string;
  birthday?: string;
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