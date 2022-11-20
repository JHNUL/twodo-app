import { FastifyInstance } from 'fastify';
import { Todo } from '../interfaces';

const todoRoutes = async (fastify: FastifyInstance) => {
  fastify.addHook('preHandler', (request, reply, done) => {
    if (!request.session.authenticated) {
      return reply.code(401).send({ message: 'Unauthorized' });
    }
    done();
  });

  fastify.get('/todo', async (request) => {
    return await fastify.todoService.getAll(request.session.user_id);
  });

  fastify.get<{ Params: { id: string } }>('/todo/:id', async (request) => {
    return await fastify.todoService.get(request.params.id);
  });

  const schema = {
    body: {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        status: { type: 'string' },
        created_at: { type: 'string' },
        updated_at: { type: 'string' },
        user_id: { type: 'number' },
      },
    },
  };

  fastify.post<{ Body: Todo }>('/todo', { schema }, async (request, reply) => {
    const payload = { ...request.body, user_id: request.session.user_id };
    const res = await fastify.todoService.createNew(payload);
    return reply.code(201).send(res);
  });

  fastify.put<{ Body: Todo }>('/todo', { schema }, async (request, reply) => {
    const payload = { ...request.body, user_id: request.session.user_id };
    const res = await fastify.todoService.edit(payload);
    return reply.code(200).send(res);
  });

  fastify.delete<{ Params: { id: string } }>(
    '/todo/:id',
    async (request, reply) => {
      await fastify.todoService.delete(parseInt(request.params.id));
      return reply
        .code(200)
        .send({ message: `deleted todo with id ${request.params.id}` });
    }
  );
};

export default todoRoutes;
