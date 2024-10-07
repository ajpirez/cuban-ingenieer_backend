import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { UserRol } from '../../users/enums/user.rol';
import { apiResponseHandler } from '../../utils/apiResponseHandler';
import { LocalAuthGuard } from '../../auth/authentication/guards/local-auth.guard';
import { createMocks } from 'node-mocks-http';

jest.mock('../../utils/apiResponseHandler', () => ({
  apiResponseHandler: jest.fn().mockImplementation((message, status, data) => ({
    message,
    status,
    data,
  })),
}));

describe('AuthenticationController', () => {
  let controller: AuthenticationController;

  const mockAuthService = {
    generateTokens: jest.fn().mockResolvedValue({
      accessToken: 'mockAccessToken',
    }),
    signIn: jest.fn().mockImplementation((loginUserDto) => ({
      message: expect.any(String),
      status: 200,
      data: {
        accessToken: expect.any(String),
        user: {
          id: expect.any(String),
          email: loginUserDto.email,
          role: UserRol.User,
        },
      },
    })),
    signUp: jest.fn().mockImplementation((userDTO) => ({
      message: expect.any(String),
      status: 200,
      data: {
        id: expect.any(String),
        email: userDTO.email,
        role: UserRol.User,
      },
    })),
    create: jest.fn().mockImplementation((signUpDto) => ({
      id: 'mockId',
      email: signUpDto.email,
      role: UserRol.User,
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticationController],
      providers: [
        {
          provide: AuthenticationService,
          useValue: mockAuthService,
        },
      ],
    })
      .overrideGuard(LocalAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<AuthenticationController>(AuthenticationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should signin a user', async () => {
    const { req, res } = createMocks({
      method: 'POST',
      url: '/sign-in',
      body: {
        email: 'ajpirez1994@gmail.com',
        password: '123qwe123',
      },
    });

    req.user = {
      id: 'mockUserId',
      email: 'ajpirez1994@gmail.com',
      role: UserRol.User,
    };

    const result = await controller.signIn(req, res);

    expect(result).toEqual({
      message: 'Login successful',
      status: 200,
      data: {
        accessToken: 'mockAccessToken',
        user: {
          id: 'mockUserId',
          email: 'ajpirez1994@gmail.com',
          role: UserRol.User,
        },
      },
    });

    expect(result).toEqual({
      message: 'Login successful',
      status: 200,
      data: {
        accessToken: 'mockAccessToken',
        user: {
          id: 'mockUserId',
          email: 'ajpirez1994@gmail.com',
          role: UserRol.User,
        },
      },
    });

    expect(mockAuthService.generateTokens).toHaveBeenCalledWith(req.user, res);
  });

  it('should sign up a user and call apiResponseHandler', async () => {
    const userDTO = {
      email: 'ajpirez1994@gmail.com',
      password: '123qwe123',
    };

    const result = await controller.signUp(userDTO);

    expect(apiResponseHandler).toHaveBeenCalledWith(
      'User registered successfully',
      expect.any(Number),
      expect.objectContaining({
        id: expect.any(String),
        email: userDTO.email,
        role: UserRol.User,
      }),
    );
    expect(result).toEqual({
      message: 'User registered successfully',
      status: expect.any(Number),
      data: expect.objectContaining({
        id: expect.any(String),
        email: userDTO.email,
        role: UserRol.User,
      }),
    });
  });
});
