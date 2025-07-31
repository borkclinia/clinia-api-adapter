import app from './app';
import { config } from './config';

const port = config.server.port;
const host = config.server.host;

app.listen(port, host, () => {
  console.log(`🚀 Server running on ${host}:${port}`);
  console.log(`📍 Environment: ${config.server.env}`);
  console.log(`🔗 API Base: ${config.api.prefix}/${config.api.version}`);
  console.log(`🌐 Health Check: http://${host}:${port}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('📴 SIGINT received, shutting down gracefully');
  process.exit(0);
});