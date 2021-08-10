import { Controller, Post, Body } from '@nestjs/common';

import { UserService } from '../domain/services/user.service';
import { UserResponseShape, CreateUserPayload } from '../domain/types/user';

@Controller('/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body() payload: CreateUserPayload,
  ): Promise<UserResponseShape> {
    const newUser = await this.userService.createUser(payload);
    return newUser;
  }
}
