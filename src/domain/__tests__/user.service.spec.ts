import { UserService } from '../services/user.service';
import { UserDataStorage } from '../types/data-sources';
import { User } from '../types/user';

class TestingUserDataStorage implements UserDataStorage {
  createUser(user: Omit<User, 'id'>): Promise<User> {
    return Promise.resolve({ id: 'id', ...user });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getUserByUsername(username: string): Promise<User> {
    return null;
  }
}

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    userService = new UserService(new TestingUserDataStorage());
  });

  describe('createUser', () => {
    it('should return user response shape', async () => {
      const newUser = await userService.createUser({
        username: 'test@test.com',
        name: 'Tester',
        password: '123qwe',
      });

      expect(newUser).toMatchObject({
        username: 'test@test.com',
        name: 'Tester',
        id: expect.any(String),
      });
    });
  });
});
