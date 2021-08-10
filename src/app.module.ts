import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { ControllerModule } from './controller/controller.module';
import { UserOrmEntity } from './repository/user/user.orm-entity';

@Module({
  imports: [
    ControllerModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'qwerty',
      database: 'postgres',
      entities: [UserOrmEntity],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
