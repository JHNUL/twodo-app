import { test } from 'tap';
import app from '../app';

test('requests to the "/api/user" route', ({ end }) => {
  test('register without username', async (t) => {
    const server = await app.init();
    const response = await server.inject({
      method: 'POST',
      url: '/api/user/register',
      payload: { password: 'asdf' },
    });
    t.equal(response.statusCode, 400);
    t.same(
      response.body,
      JSON.stringify({ message: "body must have required property 'username'" })
    );
  });
  test('register without password', async (t) => {
    const server = await app.init();
    const response = await server.inject({
      method: 'POST',
      url: '/api/user/register',
      payload: { username: 'asdf' },
    });
    t.equal(response.statusCode, 400);
    t.same(
      response.body,
      JSON.stringify({ message: "body must have required property 'password'" })
    );
  });
  test('register with too short username', async (t) => {
    const server = await app.init();
    const response = await server.inject({
      method: 'POST',
      url: '/api/user/register',
      payload: { username: 'as', password: 'validvalidvalid__' },
    });
    t.equal(response.statusCode, 400);
    t.same(
      response.body,
      JSON.stringify({ message: 'Username must be 3-50 characters.' })
    );
  });
  test('register with too long username', async (t) => {
    const server = await app.init();
    const response = await server.inject({
      method: 'POST',
      url: '/api/user/register',
      payload: {
        username: 'asdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasdfasd',
        password: 'validvalidvalid__',
      },
    });
    t.equal(response.statusCode, 400);
    t.same(
      response.body,
      JSON.stringify({ message: 'Username must be 3-50 characters.' })
    );
  });
  test('register with too short password', async (t) => {
    const server = await app.init();
    const response = await server.inject({
      method: 'POST',
      url: '/api/user/register',
      payload: {
        username: 'asdfasdfasd',
        password: 'asdfg',
      },
    });
    t.equal(response.statusCode, 400);
    t.same(
      response.body,
      JSON.stringify({
        message:
          'Password must be 8-20 characters with at least one special character.',
      })
    );
  });
  test('register with too long password', async (t) => {
    const server = await app.init();
    const response = await server.inject({
      method: 'POST',
      url: '/api/user/register',
      payload: {
        username: 'asdfasdfasd',
        password: 'asdfgasdfgasdfgasdfgg',
      },
    });
    t.equal(response.statusCode, 400);
    t.same(
      response.body,
      JSON.stringify({
        message:
          'Password must be 8-20 characters with at least one special character.',
      })
    );
  });
  test('register with correct length password but no special character', async (t) => {
    const server = await app.init();
    const response = await server.inject({
      method: 'POST',
      url: '/api/user/register',
      payload: {
        username: 'asdfasdfasd',
        password: 'asdfgasdfgasdfgas',
      },
    });
    t.equal(response.statusCode, 400);
    t.same(
      response.body,
      JSON.stringify({
        message:
          'Password must be 8-20 characters with at least one special character.',
      })
    );
  });
  test('register successful', async (t) => {
    const server = await app.init();
    const response = await server.inject({
      method: 'POST',
      url: '/api/user/register',
      payload: {
        username: 'admin',
        password: 'adminadmin_1',
      },
    });
    t.equal(response.statusCode, 201);
  });
  test('registering two users with same username', async (t) => {
    const server = await app.init();
    const response = await server.inject({
      method: 'POST',
      url: '/api/user/register',
      payload: {
        username: 'samedude',
        password: 'samedude_1',
      },
    });
    t.equal(response.statusCode, 201);
    const response2 = await server.inject({
      method: 'POST',
      url: '/api/user/register',
      payload: {
        username: 'samedude',
        password: 'samedude_1',
      },
    });
    t.equal(response2.statusCode, 500);
  });
  test('login successful', async (t) => {
    const server = await app.init();
    const registerResponse = await server.inject({
      method: 'POST',
      url: '/api/user/register',
      payload: {
        username: 'admin2',
        password: 'adminadmin_2',
      },
    });
    t.equal(registerResponse.statusCode, 201);
    const loginResponse = await server.inject({
      method: 'POST',
      url: '/api/user/login',
      payload: {
        username: 'admin2',
        password: 'adminadmin_2',
      },
    });
    t.equal(loginResponse.statusCode, 200);
    t.match(loginResponse.headers['set-cookie'], /^twodo=.+/);
  });
  end();
});
