### Typeorm and Nest.js

This is my investigation, how to use Typeorm with Nest.js. The main goal - make domain as independent as possible


**./src/domain/types/user.ts**
```ts
export interface User {
  id: string;
  name: string;
  username: string;

  passwordHash: string;
  salt: string;
}

export interface CreateUserPayload {
  name: string;
  username: string;
  password: string;
}

export interface UserResponseShape {
  id: string;
  name: string;
  username: string;
}
```

Create interface for data storage
**./src/domain/types/data-sources.ts**
```ts
import { User } from './user';

export interface UserDataStorage {
  createUser(payload: Omit<User, 'id'>): Promise<User>;

  getUserByUsername(username: string): Promise<User>;
}

```

Create typeorm entity that implements interface of our domain user entity

**./src/repository/user/user.orm-entity.ts**
```ts
import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';
import { User } from 'src/domain/types/user';

@Entity('users')
export class UserOrmEntity implements User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false })
  passwordHash: string;

  @Column({ nullable: false })
  salt: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

Then we can create typeorm repository that implements `UserDataStorage` interface

**./src/repository/user/user.orm-repository.ts**
```ts
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
```

And finally we can add dependency for `UserService`

**./src/repository/user/user.orm-repository.ts**
```ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserOrmRepository } from '../../repository/user/user.repository';
import { UserDataStorage } from '../types/data-sources';
import { UserResponseShape, CreateUserPayload } from '../types/user';

@Injectable()
export class UserService {
  public constructor(
    @InjectRepository(UserOrmRepository)
    private readonly userRepository: UserDataStorage, // Depend from interface !!!
  ) {}

  public async createUser(
    payload: CreateUserPayload,
  ): Promise<UserResponseShape> {
    // implementation
  }
}
```

As far, as our service depends on interface, we can test our business logic:
**src/domain/_\_tests__/user.service.spec.ts**

```ts
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

```