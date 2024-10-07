import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashingModule } from 'src/common/hashing/hashing.module';
import { UserSubscriber } from 'src/subscribers/user.subscriber';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HashingModule],
  providers: [UserSubscriber],
  exports: [TypeOrmModule],
})
export class UsersModule {}
