import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { HashingService } from '../../common/hashing/hashing.service';
import { RefreshTokenIdsStorage } from './refresh-token-ids.storage/refresh-token-ids.storage';
import { User } from '../../users/entities/user.entity';
import { Response } from 'express';
import { REFRESH_TOKEN_KEY } from '../auth.constants';
import { UserRol } from '../../users/enums/user.rol';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('AuthenticationService', () => {
  const mockUser = new User();
  mockUser.id = '1234-1234-1234-1234-1234';
  mockUser.email = 'ajpirez1994@gmail.com';
  mockUser.role = UserRol.User;
  mockUser.password = '123qwe123';

  let service: AuthenticationService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let hashingService: HashingService;
  let refreshTokenIdsStorage: RefreshTokenIdsStorage;
  let userRepository: Repository<User>;

  const mockJwtService = {
    verifyAsync: jest.fn(),
    signAsync: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn().mockImplementation(() => mockUser),
    save: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
      const config = {
        'auth.refreshTokenSecret': 'refreshSecret',
        'auth.secret': 'accessSecret',
        'auth.audience': 'testAudience',
        'auth.issuer': 'testIssuer',
        'auth.accessTokenTTL': 3600,
        'auth.refreshTokenTTL': 86400,
      };
      return config[key];
    }),
  };

  const mockHashingService = {
    compare: jest.fn(),
  };

  const mockRefreshTokenIdsStorage = {
    validate: jest.fn(),
    insert: jest.fn(),
    invalidate: jest.fn(),
  };

  const mockResponse = {
    cookie: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: HashingService, useValue: mockHashingService },
        {
          provide: RefreshTokenIdsStorage,
          useValue: mockRefreshTokenIdsStorage,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    hashingService = module.get<HashingService>(HashingService);
    refreshTokenIdsStorage = module.get<RefreshTokenIdsStorage>(
      RefreshTokenIdsStorage,
    );
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateTokens', () => {
    it('should generate access and refresh tokens and set the refresh token in cookies', async () => {
      mockJwtService.signAsync
        .mockResolvedValueOnce('accessToken')
        .mockResolvedValueOnce('refreshToken');

      await service.generateTokens(mockUser, mockResponse);

      expect(mockJwtService.signAsync).toHaveBeenCalledTimes(2);
      expect(mockResponse.cookie).toHaveBeenCalledWith(
        REFRESH_TOKEN_KEY,
        'refreshToken',
        expect.any(Object),
      );
      expect(mockRefreshTokenIdsStorage.insert).toHaveBeenCalledWith(
        mockUser.id,
        expect.any(String),
      );
    });
  });

  describe('refreshToken', () => {
    it('should refresh tokens if refresh token is valid', async () => {
      mockJwtService.verifyAsync.mockResolvedValue({
        sub: mockUser.id,
        refreshTokenId: 'refreshTokenId',
      });
      mockRefreshTokenIdsStorage.validate.mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('newAccessToken');

      const result = await service.refreshToken(
        'validRefreshToken',
        mockResponse,
      );

      expect(mockRefreshTokenIdsStorage.invalidate).toHaveBeenCalledWith(
        mockUser.id,
      );
      expect(result).toEqual({ accessToken: 'newAccessToken' });
    });

    it('should throw UnauthorizedException if refresh token is invalid', async () => {
      mockJwtService.verifyAsync.mockRejectedValue(new Error('invalid token'));

      await expect(
        service.refreshToken('invalidRefreshToken', mockResponse),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser', () => {
    it('should return the user without password if credentials are valid', async () => {
      mockHashingService.compare.mockResolvedValue(true);

      const result = await service.validateUser(mockUser.email, '123qwe123');

      expect(result).toEqual({
        id: mockUser.id,
        email: mockUser.email,
        role: mockUser.role,
      });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

      await expect(
        service.validateUser('nonexistent@example.com', 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      mockHashingService.compare.mockResolvedValue(false);

      await expect(
        service.validateUser(mockUser.email, 'wrongPassword'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
