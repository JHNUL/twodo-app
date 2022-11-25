import { Todo } from '../interfaces';
import { ITodoRepository } from '../repositories/todo';

interface ITodoService {
  getAll: (userId: number) => Promise<Todo[]>;
  get: (id: string) => Promise<Todo[]>;
  createNew: (todo: Todo) => Promise<Todo>;
  edit: (todo: Todo) => Promise<Todo>;
  delete: (id: number, user_id: number) => Promise<boolean>;
}

class TodoService implements ITodoService {
  private todoRepository;
  constructor(todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository;
  }

  async getAll(userId: number) {
    return this.todoRepository.getAll(userId);
  }

  async get(id: string) {
    return this.todoRepository.get(id);
  }

  async createNew(todo: Todo) {
    return this.todoRepository.add(todo);
  }

  async edit(todo: Todo) {
    return this.todoRepository.edit(todo);
  }

  async delete(id: number, user_id: number) {
    return this.todoRepository.delete(id, user_id);
  }
}

export default TodoService;
