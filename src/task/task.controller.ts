import {
  BadRequestException,
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

  private async findUserTask(taskId: string, userId: string) {
    const task = await this.taskService.findOne({
      id: taskId,
      user: { id: userId },
    });

    if (!task) {
      throw new BadRequestException(
        'Task not found or you do not have permission to access it.',
      );
    }

    return task;
  }

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
  async update(
    @ActiveUser() user,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    await this.findUserTask(id, user.sub);

    return await this.taskService.update(id, updateTaskDto, {
      new: true,
    });
  }

  @Patch(':id/completed')
  async updateCompleted(@ActiveUser() user, @Param('id') id: string) {
    const task = await this.findUserTask(id, user.sub);

    task.completed = !task.completed;

    return await this.taskService.genericRepository.save(task);
  }

  @Delete(':id')
  async remove(@ActiveUser() user, @Param('id') id: string) {
    await this.findUserTask(id, user.sub);

    await this.taskService.softRemove(id, user);
    return true;
  }
}
