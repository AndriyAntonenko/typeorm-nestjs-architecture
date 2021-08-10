import { Module } from '@nestjs/common';

import { DomainModule } from '../domain/domain.module';
import { UserController } from './user.controller';

@Module({
  imports: [DomainModule],
  controllers: [UserController],
})
export class ControllerModule {}
