import { Todo } from '../interfaces';
import { ITodoRepository } from '../repositories/todo';

interface ITodoService {
  getAll: (userId: number) => Promise<Todo[]>;
  get: (id: number) => Promise<Todo>;
  createNew: (todo: Todo) => Promise<Todo>;
  edit: (todo: Todo) => Promise<Todo>;
  delete: (id: number) => Promise<boolean>;
}

class TodoService implements ITodoService {
  private todoRepository;
  constructor(todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository;
  }

  async getAll(userId: number) {
    return this.todoRepository.getAll(userId);
  }

  async get(id: number) {
    return this.todoRepository.get(id);
  }

  async createNew(todo: Todo) {
    return this.todoRepository.add(todo);
  }

  async edit(todo: Todo) {
    return this.todoRepository.edit(todo);
  }

  async delete(id: number) {
    return this.todoRepository.delete(id);
  }
}

export default TodoService;
