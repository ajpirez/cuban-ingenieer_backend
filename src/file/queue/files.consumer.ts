import { OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';
import { FileService } from '../file.service';
import { Logger } from '@nestjs/common';
import { FILE_QUEUE } from '../constants';
import { FileStatus } from '../entities/file.entity';
import { EventsService } from 'src/file/events.service';

type File = {
  filePath: string;
  fileName: string;
};

export type NestNotificationJob = {
  files: File[];
};

export type InvalidateParams = {
  internalReason: string;
  message?: string;
};

@Processor({ name: FILE_QUEUE })
export class FileProcessor {
  private readonly logger = new Logger(FileProcessor.name);

  constructor(
    private readonly fileService: FileService,
    private readonly eventsService: EventsService,
  ) {}

  private compressFile(filePath: string, zipPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const output = fs.createWriteStream(zipPath);
      const archive = archiver('zip', {
        zlib: { level: 9 },
      });

      output.on('close', () => {
        resolve();
      });

      archive.on('error', (err) => {
        reject(err);
      });

      archive.pipe(output);
      archive.file(filePath, { name: path.basename(filePath) });
      archive.finalize();
    });
  }

  @Process()
  async handleFileCompression(job: Job<NestNotificationJob>) {
    const { files } = job.data;

    const updates = [];
    for (const file of files) {
      const { filePath, fileName } = file;
      const lastDotIndex = filePath.lastIndexOf('.');
      const name =
        lastDotIndex === -1 ? filePath : filePath.substring(0, lastDotIndex);
      const zipPath = `${name}.zip`;

      try {
        await this.compressFile(filePath, zipPath);

        updates.push({ fileName, filePath, zipPath });

        this.logger.debug(`Archivo comprimido: ${fileName}`);
      } catch (error) {
        this.logger.error(`Error al comprimir el archivo: ${fileName}`, error);
      }
    }

    await Promise.all(
      updates.map((update) =>
        this.fileService.genericRepository.update(
          { file_name: update.fileName },
          {
            compressed_file_path: update.zipPath,
            file_status: FileStatus.COMPRESSED,
            compressed_at: new Date(),
          },
        ),
      ),
    );
    await Promise.all(
      updates.map((update) => {
        return new Promise<void>((resolve, reject) => {
          fs.unlink(update.filePath, (err) => {
            if (err) {
              this.logger.error(
                `Erro deleting original file: ${update.fileName}`,
                err,
              );
              reject(err);
            } else {
              this.logger.debug(
                `Original file was deleted: ${update.fileName}`,
              );
              resolve();
            }
          });
        });
      }),
    );

    this.eventsService.broadcastMessage(
      'notification',
      '✅ Success File compression, process done.',
    );
    await job.moveToCompleted('', true);
  }

  @OnQueueFailed({ name: FILE_QUEUE })
  async generationFailed(job: Job<unknown>) {
    this.logger.error('Verification process failed:', job.failedReason);
    return {};
  }

  async invalidateVerification(
    job: Job<any>,
    invalidateParams: InvalidateParams,
  ) {
    this.logger.error(`Rejected verification:
    internalReason: ${invalidateParams.internalReason}`);

    await job.moveToFailed({ message: invalidateParams.internalReason }, true);
  }
}
