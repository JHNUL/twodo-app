import { test } from 'tap';
import app from '../app';

test('requests the "/" route', async (t) => {
  const server = await app.init();

  const response = await server.inject({
    method: 'GET',
    url: '/todo',
  });
  t.equal(response.statusCode, 200, 'returns a status code of 200');
});
