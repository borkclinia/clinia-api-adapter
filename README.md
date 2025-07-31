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

## Deploy no Render

Este projeto está configurado para deploy automático no Render.

### Opção 1: Deploy via GitHub (Recomendado)

1. **Fork ou clone este repositório**
2. **Conecte ao Render:**
   - Acesse [render.com](https://render.com)
   - Conecte sua conta GitHub
   - Clique em "New +" → "Web Service"
   - Selecione este repositório

3. **Configuração automática:**
   - O Render detectará automaticamente o `render.yaml`
   - As configurações de build serão aplicadas automaticamente

4. **Configure as variáveis de ambiente:**
   ```
   CLINICA_SALUTE_LOGIN=seu_login_aqui
   CLINICA_SALUTE_PASSWORD=sua_senha_aqui
   ```

### Opção 2: Deploy Manual

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/borkclinia/clinia-api-adapter.git
   cd clinia-api-adapter
   ```

2. **Configure as variáveis de ambiente no Render:**
   - `NODE_ENV=production`
   - `CLINICA_SALUTE_BASE_URL=https://clinicasalute.realclinic.com.br/ClinicaSalute`
   - `CLINICA_SALUTE_LOGIN=seu_login`
   - `CLINICA_SALUTE_PASSWORD=sua_senha`

3. **Deploy:**
   - Build Command: `bun install && bun run build`
   - Start Command: `bun start`

### Configurações do Render

O projeto inclui:
- ✅ `render.yaml` para configuração automática
- ✅ `Dockerfile` para containerização (opcional)
- ✅ Health check endpoint (`/health`)
- ✅ Graceful shutdown
- ✅ Configuração de CORS para produção
- ✅ Logging otimizado para produção

### Variáveis de Ambiente Necessárias

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `CLINICA_SALUTE_LOGIN` | ✅ | Login da API Clinica Salute |
| `CLINICA_SALUTE_PASSWORD` | ✅ | Senha da API Clinica Salute |
| `NODE_ENV` | ⚠️ | Ambiente (production/development) |
| `PORT` | ⚠️ | Porta do servidor (padrão: 3000) |
| `CORS_ORIGIN` | ❌ | Origens permitidas (separadas por vírgula) |

### Monitoramento

Após o deploy, você pode verificar o status da aplicação:

- **Health Check:** `https://sua-app.onrender.com/health`
- **API Base:** `https://sua-app.onrender.com/api/v1/`
- **Readiness:** `https://sua-app.onrender.com/ready`

### Troubleshooting

1. **Erro de build:** Verifique se todas as dependências estão no `package.json`
2. **Erro de runtime:** Verifique os logs no dashboard do Render
3. **Erro de autenticação:** Verifique as variáveis de ambiente
4. **Timeout:** A aplicação tem timeout de 30s para requisições

## Licença

ISC