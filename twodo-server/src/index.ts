import config from './config';
import app from './app';

const start = async () => {
  const server = await app.init({ logger: true });
  try {
    await server.listen({ port: config.PORT, host: config.HOST });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
