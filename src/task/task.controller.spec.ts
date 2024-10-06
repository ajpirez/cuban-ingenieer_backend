// import { Test, TestingModule } from '@nestjs/testing';
// import { TaskController } from './task.controller';
// import { TaskService } from './task.service';
// import { CreateTaskDto } from './dto/create-task.dto';
// import { UpdateTaskDto } from './dto/update-task.dto';
// import { NotFoundException } from '@nestjs/common';
//
// describe('TaskController', () => {
//   let controller: TaskController;
//   let taskService: TaskService;
//
//   // Simulamos los métodos del servicio que hereda de BaseService
//   const mockTaskService = {
//     create: jest.fn((createTaskDto) => ({
//       id: '41daa4e0-b383-42cc-a7e4-d7a71d0e4679',
//       ...createTaskDto,
//       completed: false,
//       created_at: new Date(),
//       updated_at: new Date(),
//       user: { id: '1', username: 'testuser' },
//     })),
//     findAll: jest.fn(() => [
//       {
//         id: '41daa4e0-b383-42cc-a7e4-d7a71d0e4679',
//         title: 'Task 1',
//         completed: false,
//         created_at: new Date(),
//         updated_at: new Date(),
//         user: { id: '1', username: 'testuser' },
//       },
//     ]),
//     findOne: jest.fn((query) => {
//       if (query.id === '41daa4e0-b383-42cc-a7e4-d7a71d0e4679') {
//         return {
//           id: query.id,
//           title: 'Task 1',
//           completed: false,
//           created_at: new Date(),
//           updated_at: new Date(),
//           user: { id: '1', username: 'testuser' },
//         };
//       }
//       return null;
//     }),
//     update: jest.fn((id, updateTaskDto) => ({
//       id,
//       ...updateTaskDto,
//       updated_at: new Date(),
//       user: { id: '1', username: 'testuser' },
//     })),
//     softRemove: jest.fn(() => null),
//   };
//
//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       controllers: [TaskController],
//       providers: [TaskService],
//     })
//       .overrideProvider(TaskService)
//       .useValue(mockTaskService)
//       .compile();
//
//     controller = module.get<TaskController>(TaskController);
//     taskService = module.get<TaskService>(TaskService);
//   });
//
//   it('should be defined', () => {
//     expect(controller).toBeDefined();
//   });
//
//   it('should create a task', async () => {
//     const createTaskDto: CreateTaskDto = {
//       title: 'New Task',
//     };
//
//     const result = await controller.create({ sub: '1' }, createTaskDto);
//
//     expect(result).toEqual({
//       id: expect.any(String),
//       title: 'New Task',
//       completed: false,
//       created_at: expect.any(Date),
//       updated_at: expect.any(Date),
//       user: { id: '1', username: 'testuser' },
//     });
//
//     expect(mockTaskService.create).toHaveBeenCalledWith({
//       title: 'New Task',
//       user: { id: '1' },
//     });
//   });
//
//   it('should return all tasks', async () => {
//     const result = await controller.findAll({ sub: '1' }, {});
//
//     expect(result).toEqual([
//       {
//         id: expect.any(String),
//         title: 'Task 1',
//         completed: false,
//         created_at: expect.any(Date),
//         updated_at: expect.any(Date),
//         user: { id: '1', username: 'testuser' },
//       },
//     ]);
//
//     expect(mockTaskService.findAll).toHaveBeenCalled();
//   });
//
//   it('should return one task', async () => {
//     const taskId = '41daa4e0-b383-42cc-a7e4-d7a71d0e4679';
//     const result = await controller.findOne(taskId);
//
//     expect(result).toEqual({
//       id: taskId,
//       title: expect.any(String),
//       completed: expect.any(Boolean),
//       created_at: expect.any(Date),
//       updated_at: expect.any(Date),
//       user: { id: '1', username: 'testuser' },
//     });
//
//     expect(mockTaskService.findOne).toHaveBeenCalledWith({ id: taskId });
//   });
//
//   it('should throw NotFoundException if task not found', async () => {
//     jest.spyOn(mockTaskService, 'findOne').mockReturnValueOnce(null);
//
//     await expect(
//       controller.findOne('invalid-id'),
//     ).rejects.toThrow(NotFoundException);
//   });
//
//   it('should update a task', async () => {
//     const updateTaskDto: UpdateTaskDto = {
//       title: 'Updated Task',
//       completed: true,
//     };
//
//     const taskId = '41daa4e0-b383-42cc-a7e4-d7a71d0e4679';
//     const result = await controller.update(taskId, updateTaskDto);
//
//     expect(result).toEqual({
//       id: taskId,
//       title: 'Updated Task',
//       completed: true,
//       updated_at: expect.any(Date),
//       user: { id: '1', username: 'testuser' },
//     });
//
//     expect(mockTaskService.update).toHaveBeenCalledWith(taskId, updateTaskDto, { new: true });
//   });
//
//   it('should toggle task completion', async () => {
//     const taskId = '41daa4e0-b383-42cc-a7e4-d7a71d0e4679';
//
//     const taskBeforeToggle = {
//       id: taskId,
//       title: 'Task 1',
//       completed: false,
//       created_at: new Date(),
//       updated_at: new Date(),
//       user: { id: '1', username: 'testuser' },
//     };
//
//     jest.spyOn(mockTaskService, 'findOne').mockResolvedValueOnce(taskBeforeToggle);
//
//     const result = await controller.updateCompleted(taskId);
//
//     expect(result).toEqual({
//       ...taskBeforeToggle,
//       completed: true,
//     });
//
//     expect(mockTaskService.findOne).toHaveBeenCalledWith({ id: taskId });
//     expect(mockTaskService.create).toHaveBeenCalled();
//   });
//
//   // it('should delete a task', async () => {
//   //   const taskId = '41daa4e0-b383-42cc-a7e4-d7a71d0e4679';
//   //   const result = await controller.remove({ sub: '1' }, taskId);
//   //
//   //   expect(result).toBeTrue();
//   //   expect(mockTaskService.softRemove).toHaveBeenCalledWith(taskId, { id: '1' });
//   // });
// });
