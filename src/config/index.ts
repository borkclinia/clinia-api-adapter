import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    env: process.env.NODE_ENV || 'development',
    host: process.env.HOST || '0.0.0.0',
  },
  api: {
    version: process.env.API_VERSION || 'v1',
    prefix: process.env.API_PREFIX || '/api',
  },
  clinicaSalute: {
    baseUrl: process.env.CLINICA_SALUTE_BASE_URL || 'https://clinicasalute.realclinic.com.br/ClinicaSalute',
    login: process.env.CLINICA_SALUTE_LOGIN || '',
    password: process.env.CLINICA_SALUTE_PASSWORD || '',
    timeout: parseInt(process.env.CLINICA_SALUTE_TIMEOUT || '30000', 10),
  },
  cors: {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : '*',
    credentials: process.env.CORS_CREDENTIALS === 'true',
  },
};