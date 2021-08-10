import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserService } from './services/user.service';
import { UserOrmRepository } from '../repository/user/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmRepository])],
  providers: [UserService],
  exports: [UserService],
})
export class DomainModule {}
