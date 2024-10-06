import {
  BadRequestException,
  Controller,
  Get,
  Param,
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

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get()
  findAll(@ActiveUser() user, @Query() data: PaginationDto) {
    const { page, limit } = data;
    return this.fileService.findAll(
      {
        // relations: ['user'],
        user: { id: user.sub },
        file_status: FileStatus.COMPRESSED,
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
    console.log(file);
    const savedFile = await this.fileService.create({
      user: { id: user.sub },
      file_name: file.filename,
      file_size: file.size,
      original_file_path: file.path,
    });

    return { secureUrl: file.path };
  }

  @Get('download/:id')
  async downloadFile(
    @ActiveUser() user: any,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const file = await this.fileService.findOne({ id, user: { id: user.sub } });

    if (!file) {
      throw new BadRequestException(
        'File not found or you do not have permission to access it.',
      );
    }

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
