import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('Tasks')
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

  @ApiOperation({ summary: 'Create a new task' })
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

  @ApiOperation({ summary: 'Get all tasks By User' })
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

  @ApiOperation({ summary: 'Get a single task' })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne({ id });
  }

  @ApiOperation({ summary: 'Update a task' })
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

  @ApiOperation({ summary: 'Update a task to completed' })
  @Patch(':id/completed')
  async updateCompleted(@ActiveUser() user, @Param('id') id: string) {
    const task = await this.findUserTask(id, user.sub);

    task.completed = !task.completed;

    return await this.taskService.genericRepository.save(task);
  }

  @ApiOperation({ summary: 'Delete a task' })
  @Delete(':id')
  async remove(@ActiveUser() user, @Param('id') id: string) {
    await this.findUserTask(id, user.sub);

    await this.taskService.softRemove(id, user);
    return true;
  }
}
