import { FastifyInstance } from 'fastify';
import { throwAppError } from '../utils/error';

const userRoutes = async (fastify: FastifyInstance) => {
  const usernamePasswordBody = {
    type: 'object',
    required: ['username', 'password'],
    properties: {
      username: { type: 'string' },
      password: { type: 'string' },
    },
  };

  const schema = { body: usernamePasswordBody };

  const validateUsernameAndPasswordFormat = (
    username: string,
    password: string
  ) => {
    if (username.match(/^(.{0,2}|.{51,})$/)) {
      throwAppError('FST_INVALID_USERNAME');
    }
    if (password.match(/^(.{0,7}|.{21,}|[A-Za-z0-9]{8,20})$/)) {
      throwAppError('FST_INVALID_PASSWORD');
    }
  };

  fastify.post<{ Body: { username: string; password: string } }>(
    '/user/register',
    { schema },
    async (request, reply) => {
      const { username, password } = request.body;
      validateUsernameAndPasswordFormat(username, password);
      const status = await fastify.userService.register(username, password);
      if (status) {
        return reply.code(201).send({ message: 'ok' });
      }
      throwAppError('FST_REGISTER_USER_FAILURE');
    }
  );

  fastify.post<{ Body: { username: string; password: string } }>(
    '/user/login',
    { schema },
    async (request, reply) => {
      const { username, password } = request.body;
      const user = await fastify.userService.login(username, password);
      if (user) {
        request.session.authenticated = true;
        request.session.user_id = user.id;
        return reply.code(200).send({ message: 'ok' });
      } else {
        return reply.code(401).send({ message: 'Unauthorized' });
      }
    }
  );

  fastify.post('/user/logout', async (request, reply) => {
    await request.session.destroy();
    return reply.code(200).send({ message: 'logout successful' });
  });
};

export default userRoutes;
