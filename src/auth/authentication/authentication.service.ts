import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { Response } from 'express';
import { BaseService } from '../../base/base.service';
import { HashingService } from '../../common/hashing/hashing.service';
import { AllConfigType } from '../../config/config.type';
import { User } from '../../users/entities/user.entity';
import { REFRESH_TOKEN_KEY } from '../auth.constants';
import { ActiveUserData } from '../interfaces/active-user-data.interface';
import {
  InvalidateRefreshTokenError,
  RefreshTokenIdsStorage,
} from './refresh-token-ids.storage/refresh-token-ids.storage';

@Injectable()
export class AuthenticationService extends BaseService<User>(User) {
  constructor(
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AllConfigType>,
    private readonly refreshTokenIdsStorage: RefreshTokenIdsStorage,
  ) {
    super();
  }

  async refreshToken(refreshToken: string, response: Response) {
    try {
      const { sub, refreshTokenId } = await this.jwtService.verifyAsync<
        Pick<ActiveUserData, 'sub'> & { refreshTokenId: string }
      >(refreshToken, {
        secret: this.configService.get('auth.refreshTokenSecret', {
          infer: true,
        }),
        audience: this.configService.get('auth.audience', { infer: true }),
        issuer: this.configService.get('auth.issuer', { infer: true }),
      });

      const user = await this.genericRepository.findOne({
        where: { id: sub },
      });

      const isValid = await this.refreshTokenIdsStorage.validate(
        user.id,
        refreshTokenId,
      );

      if (isValid) {
        await this.refreshTokenIdsStorage.invalidate(user.id);
      } else {
        throw new Error('Refresh token is invalid');
      }

      return await this.generateTokens(user, response);
    } catch (e) {
      if (e instanceof InvalidateRefreshTokenError) {
        //TODO: notify the user that his refresh token might have been stolen
        throw new UnauthorizedException('Access denied');
      }

      throw new UnauthorizedException();
    }
  }

  private async signAccessToken<T>(
    userId: string,
    expiresIn: number,
    payload?: T,
  ) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.configService.get('auth.audience', { infer: true }),
        issuer: this.configService.get('auth.issuer', { infer: true }),
        secret: this.configService.get('auth.secret', { infer: true }),
        expiresIn,
      },
    );
  }

  private async signRefreshToken<T>(
    userId: string,
    expiresIn: number,
    payload?: T,
  ) {
    return await this.jwtService.signAsync(
      {
        sub: userId,
        ...payload,
      },
      {
        audience: this.configService.get('auth.audience', { infer: true }),
        issuer: this.configService.get('auth.issuer', { infer: true }),
        secret: this.configService.get('auth.refreshTokenSecret', {
          infer: true,
        }),
        expiresIn,
      },
    );
  }

  async generateTokens(user: User, response: Response) {
    const refreshTokenId = randomUUID();
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken<Partial<ActiveUserData>>(
        user.id,
        this.configService.get('auth.accessTokenTTL', { infer: true }),
        { email: user.email, role: user.role },
      ),
      this.signRefreshToken(
        user.id,
        this.configService.get('auth.refreshTokenTTL', { infer: true }),
        {
          refreshTokenId,
        },
      ),
    ]);
    await this.refreshTokenIdsStorage.insert(user.id, refreshTokenId);

    response.cookie(REFRESH_TOKEN_KEY, refreshToken, {
      httpOnly: true,
      path: '/',
      maxAge:
        this.configService.get('auth.refreshTokenTTL', { infer: true }) * 1000,
      secure: true,
    });
    return { accessToken };
  }

  async validateUser(email: string, pass: string): Promise<User> {
    const user = await this.genericRepository.findOne({
      where: { email },
      select: ['id', 'email', 'password', 'role', 'avatar'],
    });

    if (!user) {
      throw new UnauthorizedException('Bad credentials');
    }

    if (!user.password) {
      throw new UnauthorizedException();
    }

    const isValidPassword = await this.hashingService.compare(
      pass,
      user.password,
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Bad credentials');
    }

    const { password, ...rest } = user;

    return rest;
  }
}
