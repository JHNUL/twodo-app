import { FastifyInstance } from 'fastify';

const health = async (fastify: FastifyInstance) => {
  fastify.get('/health', async (_request, reply) => {
    /* Health check returns no data, just checks the DB is reachable */
    await fastify.userService.count();
    return reply.code(200).send({ message: 'ok' });
  });
};

export default health;
