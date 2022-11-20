import config from './config';
import app from './app';

const start = async () => {
  const server = await app.init({ logger: false }); // 5) Insufficient logging and monitoring
  try {
    await server.listen({ port: config.PORT, host: config.HOST });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
