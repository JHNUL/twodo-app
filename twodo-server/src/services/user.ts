import bcrypt from 'bcrypt';
import { IUserRepository } from '../repositories/user';
// import config from '../config';
import { throwAppError } from '../utils/error';
import { User } from '../interfaces';

interface IUserService {
  register: (
    username: string,
    password: string
  ) => Promise<boolean | undefined>;
  login: (username: string, password: string) => Promise<User | null>;
  count: () => Promise<number>;
}

class UserService implements IUserService {
  private userRepository;
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async count() {
    const allUsers = await this.userRepository.getAll();
    return allUsers.length;
  }

  async register(username: string, password: string) {
    const passwordhash = await bcrypt.hash(password, 0); // 3) Unsalted password hashes
    return this.userRepository.add(username, passwordhash);
  }

  async login(username: string, password: string) {
    const user = await this.userRepository.get(username, true);
    if (!user) throwAppError('FST_USER_NOT_FOUND');
    const match = await bcrypt.compare(password, user.passwordhash as string);
    if (match) return user;
    return null;
  }
}

export default UserService;
