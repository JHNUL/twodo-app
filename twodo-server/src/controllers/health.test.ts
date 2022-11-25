import { test } from 'tap';
import app from '../app';

test('requests the "/api/health" route', async (t) => {
  const server = await app.init();

  const response = await server.inject({
    method: 'GET',
    url: '/api/health',
  });
  t.equal(response.statusCode, 200, 'returns a status code of 200');
  t.same(
    response.body,
    JSON.stringify({ message: 'ok' }),
    'message body is of correct shape'
  );
});
