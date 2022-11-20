import { FastifyInstance } from 'fastify';
import fastifyPlugin from 'fastify-plugin';
import sqlite3 from 'sqlite3';
import config from '../config';
import TodoRepository from '../repositories/todo';
import UserRepository from '../repositories/user';
import TodoService from './todo';
import UserService from './user';

declare module 'fastify' {
  interface FastifyInstance {
    todoService: TodoService;
    userService: UserService;
  }
  interface Session {
    user_id: number;
    authenticated: boolean;
  }
}

const createDB = async (): Promise<sqlite3.Database> => {
  let db = null;
  await new Promise((resolve, reject) => {
    db = new sqlite3.Database(config.DB_PATH, (err: Error | null) => {
      if (err) reject(err);
      resolve(true);
    });
  });
  if (db === null) {
    throw Error('Unable to connect to sqlite3');
  }
  return db as sqlite3.Database;
};

/* TODO: see how this could be request-scoped, maybe extract DB connection somewhere else */
const plugin = async (fastify: FastifyInstance) => {
  const db = await createDB();
  const todoRepo = new TodoRepository(db);
  const todoService = new TodoService(todoRepo);
  const userRepo = new UserRepository(db);
  const userService = new UserService(userRepo);
  fastify.log.info(
    `Initialized repositories and services with DB: ${config.DB_PATH}`
  );
  fastify.decorate('todoService', todoService);
  fastify.decorate('userService', userService);
};

export default fastifyPlugin(plugin);
