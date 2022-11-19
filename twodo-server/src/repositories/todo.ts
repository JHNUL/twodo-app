import { Database } from 'sqlite3';
import { Todo } from '../interfaces';

export interface ITodoRepository {
  getAll: (userId: number) => Promise<Todo[]>;
  get: (id: number) => Promise<Todo>;
  add: (todo: Todo) => Promise<Todo>;
  edit: (todo: Todo) => Promise<Todo>;
}

class TodoRepository implements ITodoRepository {
  private db;
  constructor(db: Database) {
    this.db = db;
  }
  async getAll(userId: number) {
    return new Promise<Todo[]>((resolve, reject) => {
      this.db.all(
        `SELECT T.id, T.name, S.name as status, T.created_at, T.updated_at
         FROM Todos T
         LEFT JOIN Todostatus S
         ON S.code = T.status
         WHERE T.user_id = (?);`,
        [userId],
        (err: Error, rows: Array<any>) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  }

  async get(id: number) {
    return new Promise<Todo>((resolve, reject) => {
      this.db.get(
        `SELECT T.id, T.name, S.name as status, T.created_at, T.updated_at
         FROM Todos T
         LEFT JOIN Todostatus S
         ON S.code = T.status
         WHERE T.id = (?);`,
        [id],
        (err: Error, row: any) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });
  }

  async add(todo: Todo) {
    const newRowId = await new Promise<number>((resolve, reject) => {
      this.db.run(
        'INSERT INTO Todos(name, status, created_at, user_id) VALUES (?,?,?,?);',
        [todo.name, 1, new Date().toISOString(), todo.user_id],
        function (err: Error | null) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
    return this.get(newRowId);
  }

  async edit(todo: Todo) {
    await new Promise<number>((resolve, reject) => {
      this.db.run(
        `UPDATE Todos
         SET
          name = ?,
          status = (SELECT S.code FROM Todostatus S WHERE S.name = ?),
          updated_at = ?
         WHERE Todos.id = ?;`,
        [todo.name, todo.status, new Date().toISOString(), todo.id],
        function (err: Error | null) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
    return this.get(todo.id);
  }
}

export default TodoRepository;