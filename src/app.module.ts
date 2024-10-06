import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { AuthModule } from './auth/auth.module';
import authConfig from './auth/config/auth.config';
import cryptoConfig from './common/encrypting/config/crypto.config';
import { TypedEventEmitterModule } from './common/types/typed-event-emitter/typed-event-emitter.module';
import appConfig from './config/app.config';
import databaseConfig from './database/config/database.config';
import { DatabaseModule } from './database/database.module';
import { TaskModule } from './task/task.module';
import redisConfig from './redis/config/redis.config';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_PROVIDERS } from './app.providers';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        authConfig,
        cryptoConfig,
        databaseConfig,
        redisConfig,
      ],
      envFilePath: '.env',
      ignoreEnvFile: process.env.NODE_ENV === 'production',
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60,
        limit: 10,
      },
    ]),
    TaskModule,
    EventEmitterModule.forRoot(),
    TypedEventEmitterModule,
    DatabaseModule,
    AuthModule,
  ],
  providers: [...APP_PROVIDERS],
})
export class AppModule {}
