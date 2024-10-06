import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { ActiveUser } from '../auth/decorators/active-user.decorator';

// @Roles(UserRol.Admin)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  async create(@ActiveUser() user, @Body() createTaskDto: CreateTaskDto) {
    const task = this.taskService.genericRepository.create({
      title: createTaskDto.title,
      completed: false,
      user: { id: user.sub },
    });

    await this.taskService.genericRepository.save(task);
    return task;
  }

  @Get()
  findAll(@ActiveUser() user, @Query() data: PaginationDto) {
    const { page, limit } = data;
    return this.taskService.findAll(
      {
        // relations: ['user'],
        user: { id: user.sub },
      },
      { page, limit },
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne({ id });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    const task = await this.taskService.findOne({ id });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return await this.taskService.update(id, updateTaskDto, {
      new: true,
    });
  }

  @Patch(':id/completed')
  async updateCompleted(@Param('id') id: string) {
    const task = await this.taskService.findOne({
      id,
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    task.completed = !task.completed;

    return await this.taskService.genericRepository.save(task);
  }

  @Delete(':id')
  async remove(@ActiveUser() user, @Param('id') id: string) {
    const task = await this.taskService.findOne({
      id,
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    await this.taskService.softRemove(id, user);
    return true;
  }
}
