import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from '../task/task.controller';
import { TaskService } from '../task/task.service';
import { CreateTaskDto } from '../task/dto/create-task.dto';
import { UpdateTaskDto } from '../task/dto/update-task.dto';
import { BadRequestException } from '@nestjs/common';
import { PaginationDto } from '../common/dto/pagination.dto';

describe('TaskController', () => {
  let controller: TaskController;

  const mockTask = {
    id: '1',
    title: 'Test Task',
    completed: false,
    user: { id: 'user-id' },
  };

  const mockTaskService = {
    findOne: jest.fn().mockResolvedValue(mockTask),
    create: jest.fn().mockResolvedValue(mockTask),
    findAll: jest.fn().mockResolvedValue([mockTask]),
    update: jest.fn().mockResolvedValue({ ...mockTask, title: 'Updated Task' }),
    softRemove: jest.fn().mockResolvedValue(true),
    genericRepository: {
      create: jest.fn().mockReturnValue(mockTask),
      save: jest.fn().mockResolvedValue(mockTask),
    },
  };

  const mockUser = { sub: 'e6fa304e-c3b7-4102-a1a2-e147bb4eca84' };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [
        {
          provide: TaskService,
          useValue: mockTaskService,
        },
      ],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new task', async () => {
      const createTaskDto: CreateTaskDto = { title: 'New Task' };
      const result = await controller.create(mockUser, createTaskDto);

      expect(result).toEqual(mockTask);
      expect(mockTaskService.genericRepository.create).toHaveBeenCalledWith({
        title: createTaskDto.title,
        completed: false,
        user: { id: mockUser.sub },
      });
      expect(mockTaskService.genericRepository.save).toHaveBeenCalledWith(
        mockTask,
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of tasks', async () => {
      const paginationDto: PaginationDto = { page: 1, limit: 10 };
      const result = await controller.findAll(mockUser, paginationDto);

      expect(result).toEqual([mockTask]);
      expect(mockTaskService.findAll).toHaveBeenCalledWith(
        { user: { id: mockUser.sub } },
        paginationDto,
      );
    });
  });

  describe('findOne', () => {
    it('should return a single task', async () => {
      const result = await controller.findOne('1');

      expect(result).toEqual(mockTask);
      expect(mockTaskService.findOne).toHaveBeenCalledWith({ id: '1' });
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      const updateTaskDto: UpdateTaskDto = { title: 'Updated Task' };
      mockTaskService.findOne.mockResolvedValue(mockTask);

      const result = await controller.update(mockUser, '1', updateTaskDto);

      expect(result).toEqual({ ...mockTask, title: 'Updated Task' });
      expect(mockTaskService.update).toHaveBeenCalledWith('1', updateTaskDto, {
        new: true,
      });
    });

    it('should throw BadRequestException if task not found', async () => {
      mockTaskService.findOne.mockResolvedValue(null);

      await expect(
        controller.update(mockUser, '1', { title: 'Updated Task' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateCompleted', () => {
    it('should toggle task completed status', async () => {
      const toggledTask = { ...mockTask, completed: !mockTask.completed };
      mockTaskService.genericRepository.save.mockResolvedValue(toggledTask);

      const result = await controller.updateCompleted(mockUser, '1');

      expect(result).toEqual(toggledTask);
      expect(mockTaskService.genericRepository.save).toHaveBeenCalledWith(
        toggledTask,
      );
    });

    it('should throw BadRequestException if task not found', async () => {
      mockTaskService.findOne.mockResolvedValue(null);

      await expect(controller.updateCompleted(mockUser, '1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('remove', () => {
    it('should delete a task', async () => {
      const result = await controller.remove(mockUser, '1');

      expect(result).toEqual(true);
      expect(mockTaskService.softRemove).toHaveBeenCalledWith('1', mockUser);
    });

    it('should throw BadRequestException if task not found', async () => {
      mockTaskService.findOne.mockResolvedValue(null);

      await expect(controller.remove(mockUser, '1')).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
