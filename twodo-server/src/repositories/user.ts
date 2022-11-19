import { Database } from 'sqlite3';
import { User } from '../interfaces';

export interface IUserRepository {
  add: (username: string, passwordhash: string) => Promise<boolean>;
  get: (username: string, includePasswordHash?: boolean) => Promise<User>;
  getAll: () => Promise<User[]>;
}

class UserRepository implements IUserRepository {
  private db;
  constructor(db: Database) {
    this.db = db;
  }
  async add(username: string, passwordhash: string) {
    const newRowId = await new Promise<number>((resolve, reject) => {
      this.db.run(
        'INSERT INTO Users(username, created_at, passwordhash) VALUES (?,?,?);',
        [username, new Date().toISOString(), passwordhash],
        function (err: Error | null) {
          if (err) reject(err);
          resolve(this.lastID);
        }
      );
    });
    return newRowId > 0;
  }
  async get(username: string, includePasswordHash = false) {
    const fields = ['id', 'username', 'created_at', 'last_login'];
    if (includePasswordHash) fields.push('passwordhash');
    return new Promise<User>((resolve, reject) => {
      this.db.get(
        `SELECT ${fields.join(', ')} FROM Users WHERE username = ?;`,
        [username],
        (err: Error, row: any) => {
          if (err) reject(err);
          resolve(row);
        }
      );
    });
  }
  async getAll() {
    const fields = ['username'];
    return new Promise<User[]>((resolve, reject) => {
      this.db.all(
        `SELECT ${fields.join(', ')} FROM Users;`,
        (err: Error, rows: any) => {
          if (err) reject(err);
          resolve(rows);
        }
      );
    });
  }
}

export default UserRepository;
