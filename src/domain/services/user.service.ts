import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserOrmRepository } from '../../repository/user/user.repository';
import { UserDataStorage } from '../types/data-sources';
import { UserResponseShape, CreateUserPayload } from '../types/user';
import { CryptoUtil } from '../../utils/crypto.util';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserService {
  public constructor(
    @InjectRepository(UserOrmRepository)
    private readonly userRepository: UserDataStorage, // Depend from interface !!!
  ) {}

  public async createUser(
    payload: CreateUserPayload,
  ): Promise<UserResponseShape> {
    const existingUser = await this.userRepository.getUserByUsername(
      payload.username,
    );

    if (existingUser) {
      throw new Error('User already exists!!!');
    }

    const { hash, salt } = await CryptoUtil.hashPassword(payload.password);

    const newUser = await this.userRepository.createUser({
      name: payload.name,
      username: payload.username,
      passwordHash: hash,
      salt,
    });

    return UserMapper.mapUserToResponse(newUser);
  }
}
