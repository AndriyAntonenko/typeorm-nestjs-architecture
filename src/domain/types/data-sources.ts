import { User } from './user';

export interface UserDataStorage {
  createUser(payload: Omit<User, 'id'>): Promise<User>;

  getUserByUsername(username: string): Promise<User>;
}
