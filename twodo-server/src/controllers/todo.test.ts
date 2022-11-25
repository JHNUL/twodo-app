import { LightMyRequestResponse } from 'fastify';
import Tap, { test } from 'tap';
import app from '../app';

test('unauthorized requests to the "/api/todo" route', ({ end }) => {
  const checkUnauthorizedResponse = (
    t: Tap.Test,
    response: LightMyRequestResponse
  ) => {
    t.equal(response.statusCode, 401, 'returns a status code of 401');
    t.same(
      response.body,
      JSON.stringify({ message: 'Unauthorized' }),
      'message body is of correct shape'
    );
  };
  test('GET todos', async (t) => {
    const server = await app.init();
    const response = await server.inject({
      method: 'GET',
      url: '/api/todo',
    });
    checkUnauthorizedResponse(t, response);
  });
  test('POST todo', async (t) => {
    const server = await app.init();

    const response = await server.inject({
      method: 'POST',
      url: '/api/todo',
      payload: { name: 'foo' },
    });
    checkUnauthorizedResponse(t, response);
  });
  test('PUT todo', async (t) => {
    const server = await app.init();

    const response = await server.inject({
      method: 'PUT',
      url: '/api/todo',
      payload: { name: 'foo', status: 'bar' },
    });
    checkUnauthorizedResponse(t, response);
  });
  test('DELETE todo', async (t) => {
    const server = await app.init();

    const response = await server.inject({
      method: 'DELETE',
      url: '/api/todo/1',
    });
    checkUnauthorizedResponse(t, response);
  });
  end();
});
