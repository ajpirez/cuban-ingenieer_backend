import { Injectable } from '@nestjs/common';
import { BaseService } from '../base/base.service';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService extends BaseService<Task>(Task) {}
