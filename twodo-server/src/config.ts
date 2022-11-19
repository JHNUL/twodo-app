import { ok } from 'assert';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const config = {
  PORT: parseInt(process.env.PORT as string),
  HOST: process.env.HOST as string,
  DB_PATH: path.join(__dirname, '..', 'db.sqlite'),
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS as string),
  COOKIE_SECRET: process.env.COOKIE_SECRET as string,
};

Object.entries(config).forEach(([key, val]) =>
  ok(val, `Environment variable ${key} not set.`)
);

export default config;
