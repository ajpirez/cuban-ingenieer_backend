import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { UserRol } from 'src/users/enums/user.rol';
import { AuthenticationService } from 'src/auth/authentication/authentication.service';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

// jest.setTimeout(120000);

describe('TaskController (e2e)', () => {
  let app: INestApplication;
  let taskId: string;
  let authToken: string;
  let authService: AuthenticationService;
  let usersRepository: Repository<User>;

  const user = {
    name: 'Alejandro Pírez',
    email: 'ajpirez1994@gmail.com',
    password: '123qwe123',
    role: UserRol.User,
  };

  beforeAll(async () => {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('this is not a testing environment');
    }
    const module = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        AppModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'postgres',
          database: 'e2e_test',
          entities: ['./**/*.entity.ts'],
          synchronize: true,
          namingStrategy: new SnakeNamingStrategy(),
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    authService = module.get<AuthenticationService>(AuthenticationService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  beforeEach(async () => {
    await usersRepository.delete({ email: user.email });

    await authService.create({
      name: user.name,
      email: user.email,
      password: user.password,
    });

    const { body } = await request
      .agent(app.getHttpServer())
      .post('/auth/sign-in')
      .send({
        email: user.email,
        password: '123qwe123',
      });
    expect(body.data.accessToken).toBeDefined();
    authToken = body.data.accessToken;

    await request(app.getHttpServer())
      .post('/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        title: 'Sample Task',
      })
      .expect(201)
      .then((response) => {
        taskId = response.body.id;
      });
  });

  afterEach(async () => {
    await usersRepository.manager.transaction(async (manager) => {
      await manager.query('DELETE FROM "task" WHERE true');
      await manager.query('DELETE FROM "user" WHERE email = $1', [user.email]);
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('/tasks (GET) - should get all tasks', () => {
    return request(app.getHttpServer())
      .get('/tasks')
      .set('Authorization', `Bearer ${authToken}`)
      .query({ page: 1, limit: 10 })
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty('elements');
        expect(response.body.elements).toBeInstanceOf(Array);

        if (response.body.elements.length > 0) {
          expect(response.body.elements[0]).toMatchObject({
            id: expect.any(String),
            title: expect.any(String),
            completed: expect.any(Boolean),
          });
        }
        expect(response.body).toHaveProperty('pagination');
      });
  });

  it('/tasks/:id (GET) - should get a task by id', async () => {
    await request(app.getHttpServer())
      .get(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
          id: taskId,
          title: 'Sample Task',
          completed: false,
        });
      });
  });

  it('/tasks/:id (PATCH) - should update a task', async () => {
    const updateTaskDto = { title: 'Updated Task', completed: true };

    await request(app.getHttpServer())
      .patch(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateTaskDto)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
          id: taskId,
          title: 'Updated Task',
          completed: true,
        });
      });
  });

  it('/tasks/:id/completed (PATCH) - should toggle task completion', async () => {
    await request(app.getHttpServer())
      .patch(`/tasks/${taskId}/completed`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toMatchObject({
          id: taskId,
          completed: expect.any(Boolean),
        });
      });
  });

  it('/tasks/:id (DELETE) - should delete a task', async () => {
    await request(app.getHttpServer())
      .delete(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .then((response) => {
        expect(Boolean(response.text)).toBe(true);
      });
  });
});
