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
    return await fastify.todoService.get(parseInt(request.params.id));
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

  fastify.post<{ Body: Todo }>('/todo', { schema }, async (request) => {
    const payload = { ...request.body, user_id: request.session.user_id };
    return await fastify.todoService.createNew(payload);
  });

  fastify.put<{ Body: Todo }>('/todo', { schema }, async (request) => {
    const payload = { ...request.body, user_id: request.session.user_id };
    return await fastify.todoService.edit(payload);
  });
};

export default todoRoutes;
