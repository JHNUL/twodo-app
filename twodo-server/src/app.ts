import Fastify, { FastifyServerOptions } from 'fastify';
import { join } from 'path';
import fastCookie from '@fastify/cookie';
import fastSession from '@fastify/session';
import fastStatic from '@fastify/static';
import todoRoute from './controllers/todo';
import userRoute from './controllers/user';
import healthRoute from './controllers/health';
import servicePlugin from './services/servicePlugin';
import config from './config';

const init = async (opts?: FastifyServerOptions) => {
  const fastify = Fastify(opts);
  await fastify
    .register(fastCookie)
    .register(fastSession, {
      secret: config.COOKIE_SECRET,
      cookie: {
        secure: false,
        maxAge: 60 * 60 * 1000,
        httpOnly: true,
        path: '/',
      },
    })
    .register(fastStatic, {
      root: join(__dirname, '..', 'html'),
    })
    .register(servicePlugin)
    .register(todoRoute, { prefix: '/api' })
    .register(userRoute, { prefix: '/api' })
    .register(healthRoute, { prefix: '/api' })
    .setNotFoundHandler(async (_, reply) => {
      return reply.sendFile('index.html');
    })
    .setErrorHandler((error, _, reply) => {
      fastify.log.error(error);
      reply.status(error.statusCode || 500).send({ message: error.message });
    });
  return fastify;
};

export default {
  init,
};
