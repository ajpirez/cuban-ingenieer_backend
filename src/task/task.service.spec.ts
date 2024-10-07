import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('TaskService', () => {
  let service: TaskService;
  let repository: Repository<Task>;

  const mockTask = new Task();
  mockTask.id = '1234-1234-1234-1234-1234';
  mockTask.title = 'Test Task';
  mockTask.completed = false;

  const mockQueryBuilder = {
    select: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getOne: jest.fn().mockResolvedValue(mockTask),
    getMany: jest.fn(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[mockTask], 1]),
    update: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    execute: jest
      .fn()
      .mockResolvedValue({ ...mockTask, title: 'Updated Task' }),
  } as unknown as SelectQueryBuilder<Task>;

  const mockTaskRepository = {
    createQueryBuilder: jest.fn(() => mockQueryBuilder),
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn().mockResolvedValue(mockTask),
    update: jest.fn().mockResolvedValue({ ...mockTask, title: 'Updated Task' }),
    softRemove: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      mockTaskRepository.findOne.mockResolvedValue({
        where: { id: '1' },
      });
      const result = await service.findOne({ id: '1' });

      expect(result).toEqual(mockTask);
    });

    it('should throw NotFoundException if task not found', async () => {
      mockTaskRepository.findOne.mockResolvedValue({
        where: { id: 'non-existent-id' },
      });

      const result = await service.findOne({ id: 'non-existent-id' });
      await expect(result).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return an array of tasks', async () => {
      mockTaskRepository.find.mockResolvedValue([mockTask]);

      const result = await service.findAll(
        { user: { id: 'user-id' } },
        { page: 1, limit: 10 },
      );

      expect(result).toEqual({
        elements: [mockTask],
        pagination: {
          totalElements: 1,
          hasNextPage: false,
          nextPage: null,
          previousPage: null,
          lastPage: 1,
        },
      });
    });
  });

  describe('create', () => {
    it('should create and save a new task', async () => {
      mockTaskRepository.save.mockResolvedValue(mockTask);

      const result = await service.genericRepository.save(mockTask);

      expect(result).toEqual(mockTask);
      expect(mockTaskRepository.save).toHaveBeenCalledWith(mockTask);
    });
  });

  describe('update', () => {
    it('should update a task', async () => {
      mockTaskRepository.update.mockResolvedValue({ affected: 1 });

      mockTaskRepository.findOne.mockResolvedValueOnce({
        ...mockTask,
        title: 'Test Task',
      });
      const updatedTask = { ...mockTask, title: 'Test Task' };

      const result = await service.update(
        '1',
        { title: 'Test Task' },
        { new: true },
      );

      expect(result).toEqual(updatedTask);
      expect(mockQueryBuilder.execute).toHaveBeenCalled();
      expect(mockQueryBuilder.getOne).toHaveBeenCalled();
    });
  });
});
