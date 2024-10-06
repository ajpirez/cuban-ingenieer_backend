import { Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { File } from './entities/file.entity';

@Injectable()
export class FileService extends BaseService<File>(File) {}
