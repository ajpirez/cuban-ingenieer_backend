import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers';
import { diskStorage } from 'multer';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FileStatus } from './entities/file.entity';
import { UpdateNameDto } from './dto/update-name.dto';
import { EventsService } from 'src/file/events.service';
import { Request, Response } from 'express';
import { Auth } from 'src/auth/authentication/decorators/auth.decorator';
import { AuthType } from 'src/auth/authentication/enums/auth-type.enum';
import * as fs from 'fs';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

@Controller('file')
export class FileController {
  private readonly logger = new Logger(FileController.name);
  constructor(
    private readonly fileService: FileService,
    private readonly events: EventsService,
  ) {}

  private async findUserFile(fileId: string, userId: ActiveUserData['sub']) {
    const file = await this.fileService.findOne({
      id: fileId,
      user: { id: userId },
    });

    if (!file) {
      throw new BadRequestException(
        'File not found or you do not have permission to access it.',
      );
    }

    if (file.file_status === FileStatus.UPLOADED) {
      throw new BadRequestException('File not compressed');
    }

    return file;
  }

  @Get()
  findAll(@ActiveUser() user:ActiveUserData, @Query() data: PaginationDto) {
    const { page, limit } = data;
    return this.fileService.findAll(
      {
        user: { id: user.sub },
      },
      { page, limit },
    );
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      // limits: {fileSize: 1000}
      storage: diskStorage({
        destination: './static/files',
        filename: fileNamer,
      }),
    }),
  )
  async uploadProductImage(
    @ActiveUser() user:ActiveUserData,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('Make sure that file is an image');
    return this.fileService.create({
      user: { id: user.sub },
      file_name: file.filename,
      file_size: file.size,
      file_original_name: file.originalname,
      original_file_path: file.path,
    });
  }

  @Patch(':id')
  async updateOriginalName(
    @ActiveUser() user: ActiveUserData,
    @Param('id') id: string,
    @Body() body: UpdateNameDto,
  ) {
    await this.findUserFile(id, user.sub);

    return this.fileService.update(
      id,
      {
        file_original_name: body.name,
      },
      { new: true },
    );
  }

  @Get('download/:id')
  async downloadFile(
    @ActiveUser() user: ActiveUserData,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const file = await this.findUserFile(id, user.sub);

    const zipFileName = file.compressed_file_path.endsWith('.zip')
      ? file.compressed_file_path
      : `${file.compressed_file_path}.zip`;

    res.set({
      'Content-Disposition': `attachment; filename="${zipFileName}"`,
      'Content-Type': 'application/zip',
    });

    res.download(file.compressed_file_path, zipFileName, (err) => {
      if (err) {
        throw new BadRequestException('Error downloading file');
      }
    });
  }

  @Delete(':id')
  async deleteFile(@ActiveUser() user: ActiveUserData, @Param('id') id: string) {
    const file = await this.findUserFile(id, user.sub);
    await this.fileService.remove(id);
    new Promise<void>((resolve, reject) => {
      fs.unlink(file.compressed_file_path, (err) => {
        if (err) {
          this.logger.error(
            `Erro deleting compressed file: ${file.compressed_file_path}`,
            err,
          );
          reject(err);
        } else {
          this.logger.debug(
            `Compressed file was deleted: ${file.compressed_file_path}`,
          );
          resolve();
        }
      });
    });
    return true
  }

  @Auth(AuthType.None)
  @Get('sse/:client')
  sse(
    @Param('client') client: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    req.on('close', () => this.events.removeClient(client));
    return this.events.addClient(client, res);
  }
}
