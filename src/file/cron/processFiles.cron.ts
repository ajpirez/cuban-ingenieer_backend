import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { FILE_QUEUE } from '../constants';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as fs from 'fs';
import * as path from 'path';
import { Queue } from 'bull';

@Injectable()
export class ProcessFilesCron {
  private readonly logger = new Logger(ProcessFilesCron.name);
  private readonly folderPath = './static/files';
  private readonly format = ['.zip', '.gitkeep'];

  constructor(@InjectQueue(FILE_QUEUE) private fileCompressionQueue: Queue) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleFileCompression() {
    this.logger.debug('Starting file compression...');

    const files = fs.readdirSync(this.folderPath);

    const nonZippedFiles = files
  .filter((file) => {
    const ext = path.extname(file);
    return ext && !this.format.includes(ext);
  })
  .map((file) => ({
    filePath: path.join(this.folderPath, file),
    fileName: file,
  }));

    if (nonZippedFiles.length === 0) {
      this.logger.debug('No files to compress');
      return;
    }

    await this.fileCompressionQueue.add({ files: nonZippedFiles });
  }
}
