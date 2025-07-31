import dotenv from 'dotenv';

dotenv.config();

export const config = {
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development',
  },
  api: {
    version: process.env.API_VERSION || 'v1',
    prefix: process.env.API_PREFIX || '/api',
  },
  clinicaSalute: {
    baseUrl: process.env.CLINICA_SALUTE_BASE_URL || '',
    login: process.env.CLINICA_SALUTE_LOGIN || '',
    password: process.env.CLINICA_SALUTE_PASSWORD || '',
  },
};