import { User, UserResponseShape } from '../types/user';

export class UserMapper {
  static mapUserToResponse(user: User): UserResponseShape {
    return {
      id: user.id,
      username: user.username,
      name: user.name,
    };
  }
}
