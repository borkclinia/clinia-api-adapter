import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import routes from './routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: config.cors.origin,
  credentials: config.cors.credentials,
}));
app.use(morgan(config.server.env === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  const healthCheck = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: config.api.version,
    environment: config.server.env,
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
    },
    services: {
      clinicaSalute: {
        baseUrl: config.clinicaSalute.baseUrl,
        configured: !!(config.clinicaSalute.login && config.clinicaSalute.password),
      },
    },
  };
  
  res.status(200).json(healthCheck);
});

// Readiness check (for Kubernetes/container orchestration)
app.get('/ready', (req, res) => {
  res.status(200).json({ status: 'ready' });
});

// API routes
app.use(`${config.api.prefix}/${config.api.version}`, routes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

export default app;