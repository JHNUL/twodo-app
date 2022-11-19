type TodoStatus = 'not started' | 'in progress' | 'done';

export interface Todo {
  id: number;
  name: string;
  status: TodoStatus;
  created_at: string;
  updated_at: string | null;
  user_id?: number;
}

export interface User {
  id: number;
  username: string;
  created_at: string;
  last_login: string | null;
  passwordhash?: string;
}
