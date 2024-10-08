import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashingModule } from 'src/common/hashing/hashing.module';
import { UserSubscriber } from 'src/subscribers/user.subscriber';
import { User } from './entities/user.entity';
import { UsersController } from 'src/users/users.controller';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HashingModule],
  controllers: [UsersController],
  providers: [UserSubscriber,UsersService],
  exports: [TypeOrmModule],
})
export class UsersModule {}
