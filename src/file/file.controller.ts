import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter, fileNamer } from './helpers';
import { diskStorage } from 'multer';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { Response } from 'express';
import { PaginationDto } from '../common/dto/pagination.dto';
import { FileStatus } from './entities/file.entity';
import { UpdateNameDto } from './dto/update-name.dto';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  private async findUserFile(fileId: string, userId: string) {
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
  findAll(@ActiveUser() user, @Query() data: PaginationDto) {
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
    @ActiveUser() user,
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
    @ActiveUser() user: any,
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
    @ActiveUser() user: any,
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
}
