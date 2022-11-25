import sqlite3 from 'sqlite3';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

sqlite3.verbose();
const isTest = process.env.NODE_ENV === 'test';

const db = new sqlite3.Database(
  join(
    dirname(fileURLToPath(import.meta.url)),
    '..',
    `db.${isTest ? 'test.' : ''}sqlite`
  )
);

const dropUsers = `DROP TABLE IF EXISTS Users;`;
const createUsers = `CREATE TABLE Users (
  id INTEGER PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  created_at VARCHAR(25) NOT NULL,
  last_login VARCHAR(25),
  passwordhash TEXT NOT NULL,
  UNIQUE(username)
);`;
const dropTodoStatus = `DROP TABLE IF EXISTS Todostatus;`;
const createTodostatus = `CREATE TABLE Todostatus (
  id INTEGER PRIMARY KEY,
  code INTEGER NOT NULL,
  name VARCHAR(25) NOT NULL
);`;
const dropTodos = `DROP TABLE IF EXISTS Todos;`;
const createTodos = `CREATE TABLE Todos (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  status INTEGER NOT NULL,
  created_at VARCHAR(25) NOT NULL,
  updated_at VARCHAR(25),
  user_id INTEGER NOT NULL,
  FOREIGN KEY(user_id) REFERENCES Users(id),
  FOREIGN KEY(status) REFERENCES Todostatus(code)
);`;

db.serialize(() => {
  const cmds = [
    dropUsers,
    createUsers,
    dropTodoStatus,
    createTodostatus,
    dropTodos,
    createTodos,
  ];

  for (const cmd of cmds) {
    db.run(cmd);
  }

  const statuses = ['', 'not started', 'in progress', 'done'];
  const statement = db.prepare(
    'INSERT INTO Todostatus(code, name) VALUES (?,?);'
  );
  for (let i = 1; i < 4; i++) {
    statement.run([i, statuses[i]]);
  }
  statement.finalize();
  console.log(`Database initialized${isTest ? ' for tests' : ''}!`);
});

db.close();
