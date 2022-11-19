import { Todo } from '../interfaces';
import { ITodoRepository } from '../repositories/todo';

interface ITodoService {
  getAll: (userId: number) => Promise<Todo[]>;
  get: (id: number) => Promise<Todo>;
  createNew: (todo: Todo) => Promise<Todo>;
  edit: (todo: Todo) => Promise<Todo>;
}

class TodoService implements ITodoService {
  private todoRepository;
  constructor(todoRepository: ITodoRepository) {
    this.todoRepository = todoRepository;
  }

  async getAll(userId: number) {
    return await this.todoRepository.getAll(userId);
  }

  async get(id: number) {
    return await this.todoRepository.get(id);
  }

  async createNew(todo: Todo) {
    return await this.todoRepository.add(todo);
  }

  async edit(todo: Todo) {
    return await this.todoRepository.edit(todo);
  }
}

export default TodoService;
