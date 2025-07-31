export interface Location {
  id: string;
  name: string;
  address: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone?: string;
  email?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  workingHours?: {
    dayOfWeek: number;
    openTime: string;
    closeTime: string;
  }[];
  active: boolean;
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