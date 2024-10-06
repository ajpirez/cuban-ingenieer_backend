import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FILE_QUEUE } from './constants';
import { ProcessFilesCron } from './cron/processFiles.cron';
import { FileProcessor } from './queue/files.consumer';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: configService.get('REDIS_PORT'),
          password: configService.get('REDIS_PASSWORD'),
          db: configService.get('REDIS_DB'),
        },
        defaultJobOptions: {
          removeOnComplete: true,
          removeOnFail: true,
          ttl: configService.get('REDIS_TTL'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: FILE_QUEUE,
    }),
    TypeOrmModule.forFeature([File]),
  ],
  controllers: [FileController],
  providers: [FileService, ProcessFilesCron, FileProcessor],
  exports: [TypeOrmModule],
})
export class FileModule {}
