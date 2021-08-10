import { Repository, EntityRepository } from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';
import { UserDataStorage } from '../../domain/types/data-sources';
import { User } from '../../domain/types/user';

@EntityRepository(UserOrmEntity)
export class UserOrmRepository
  extends Repository<UserOrmEntity>
  implements UserDataStorage
{
  public async createUser(payload: Omit<User, 'id'>): Promise<User> {
    return await this.save(this.create(payload));
  }

  public async getUserByUsername(username: string): Promise<User> {
    return await this.findOne({ username });
  }
}
