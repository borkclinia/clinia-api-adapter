# Clinia API Adapter

Este projeto é um adaptador de API que segue o padrão da documentação Clinia.io e busca dados da API Clinica Salute.

## Visão Geral

O adaptador fornece uma interface RESTful que mapeia os dados da API Clinica Salute para o formato esperado pelo padrão Clinia.io, permitindo integração transparente entre os dois sistemas.

## Recursos

- **Autenticação**: Sistema de autenticação automático com a API Clinica Salute
- **Endpoints Implementados**:
  - Locations (Localizações)
  - Health Insurances (Convênios)
  - Professionals (Profissionais)
  - Patients/Clients (Pacientes/Clientes)
  - Schedules (Agendas)
  - Appointments (Consultas)
  - Specialties (Especialidades)

## Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd clinia-api-adapter
```

2. Instale as dependências:
```bash
bun install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Edite o arquivo `.env` com suas credenciais:
```env
CLINICA_SALUTE_LOGIN=seu_login
CLINICA_SALUTE_PASSWORD=sua_senha
```

## Uso

### Desenvolvimento
```bash
bun run dev
```

### Produção
```bash
bun run build
bun start
```

## Endpoints da API

Base URL: `http://localhost:3000/api/v1`

### Health Check
```
GET /health
```

### Locations
```
GET /api/v1/locations
GET /api/v1/locations/:id
```

### Health Insurances (Convênios)
```
GET /api/v1/health-insurances
GET /api/v1/health-insurances/:id
```

### Professionals (Profissionais)
```
GET /api/v1/professionals
GET /api/v1/professionals/:id
GET /api/v1/specialties
```

### Patients/Clients (Pacientes)
```
GET /api/v1/patients
GET /api/v1/patients/:id
POST /api/v1/patients
PUT /api/v1/patients/:id

# Aliases
GET /api/v1/clients
GET /api/v1/clients/:id
POST /api/v1/clients
PUT /api/v1/clients/:id
```

### Schedules (Agendas)
```
GET /api/v1/schedules
GET /api/v1/schedules/available-slots
```

### Appointments (Consultas)
```
GET /api/v1/appointments
GET /api/v1/appointments/:id
POST /api/v1/appointments
PATCH /api/v1/appointments/:id/status
POST /api/v1/appointments/:id/cancel
```

## Formato de Resposta

Todas as respostas seguem o formato padrão:

```json
{
  "success": true,
  "data": {},
  "metadata": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "v1"
  }
}
```

Respostas paginadas incluem informações de paginação:

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "totalRecords": 100,
    "totalPages": 5
  },
  "metadata": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "v1"
  }
}
```

## Tratamento de Erros

Erros são retornados no formato:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descrição do erro",
    "details": {}
  },
  "metadata": {
    "timestamp": "2024-01-01T00:00:00.000Z",
    "version": "v1"
  }
}
```

## Desenvolvimento

### Estrutura do Projeto

```
src/
├── config/         # Configurações
├── controllers/    # Controladores da API
├── middleware/     # Middlewares Express
├── routes/         # Definições de rotas
├── services/       # Lógica de negócio
├── types/          # Definições TypeScript
├── utils/          # Utilitários
├── app.ts         # Configuração Express
└── server.ts      # Entrada da aplicação
```

### Scripts Disponíveis

- `bun run dev` - Inicia o servidor em modo desenvolvimento
- `bun run build` - Compila o TypeScript
- `bun start` - Inicia o servidor em produção
- `bun run lint` - Verifica tipos TypeScript

## Tecnologias Utilizadas

- Bun (runtime JavaScript/TypeScript)
- Express.js
- TypeScript
- Axios
- Helmet (segurança)
- CORS
- Morgan (logging)

## Licença

ISC