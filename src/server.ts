import app from './app';
import { config } from './config';

const port = config.server.port;

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
  console.log(`📍 Environment: ${config.server.env}`);
  console.log(`🔗 API Base: ${config.api.prefix}/${config.api.version}`);
});