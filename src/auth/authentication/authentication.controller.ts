import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { User } from '../../users/entities/user.entity';
import { apiResponseHandler } from '../../utils/apiResponseHandler';
import { AuthenticationService } from './authentication.service';
import { Auth } from './decorators/auth.decorator';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthType } from './enums/auth-type.enum';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationController {
  private readonly logger = new Logger(AuthenticationController.name);

  constructor(private readonly authenticationService: AuthenticationService) {}

  @ApiOperation({
    summary: 'Sign up',
    description: 'Sign up',
  })
  @ApiBody({ type: SignUpDto })
  @Auth(AuthType.None)
  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const { id, email, role } =
      await this.authenticationService.create(signUpDto);

    return apiResponseHandler(
      'User registered successfully',
      HttpStatus.CREATED,
      { id, email, role },
    );
  }

  @ApiOperation({
    summary: 'Sign in',
    description: 'Sign in',
  })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {
          type: 'string',
          example: 'ajpirez1994@gmail.com',
        },
        password: {
          type: 'string',
          example: '123456',
        },
      },
      required: ['email', 'password'],
    },
  })
  @Auth(AuthType.None)
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const accessToken = await this.authenticationService.generateTokens(
      request.user as User,
      response,
    );

    return apiResponseHandler('Login successful', HttpStatus.OK, {
      ...accessToken,
      user: request.user as User,
    });
  }

  // @Auth(AuthType.None)
  // @HttpCode(HttpStatus.OK)
  // @Post('refresh')
  // refreshToken(
  //   @Req() request: Request,
  //   @Res({ passthrough: true }) response: Response,
  // ) {
  //   const refreshToken = request.cookies[REFRESH_TOKEN_KEY];
  //   return this.authenticationService.refreshToken(refreshToken, response);
  // }
  //
  // @Get('current-user')
  // getCurrentUser(@ActiveUser() activeUser: ActiveUserData) {
  //   return this.authenticationService.findOne({
  //     id: activeUser.sub,
  //     relations: ['role', 'permission'],
  //   });
  // }
  //
  // @Auth(AuthType.None)
  // @Get('logout')
  // logout(@Res({ passthrough: true }) response: Response) {
  //   response.clearCookie(REFRESH_TOKEN_KEY);
  //   return apiResponseHandler('Logout successful', HttpStatus.OK);
  // }
  //
  // @Patch('change-password')
  // async changePassword(
  //   @Body() changePasswordDto: ChangePasswordDto,
  //   @ActiveUser() activeUser: ActiveUserData,
  // ) {
  //   this.logger.log(`Changing password for user with id ${activeUser.sub}`);
  //
  //   const { email, oldPassword, password, confirmPassword } = changePasswordDto;
  //
  //   const user = await this.authenticationService.validateUser(
  //     email,
  //     oldPassword,
  //   );
  //
  //   if (user.id !== activeUser.sub) {
  //     throw new BadRequestException(
  //       'No es posible cambiar la contraseña de otro usuario',
  //     );
  //   }
  //
  //   if (password !== confirmPassword) {
  //     throw new BadRequestException('Credenciales incorrectas');
  //   }
  //
  //   await this.authenticationService.update(
  //     user.id,
  //     { password },
  //     { new: false },
  //   );
  //
  //   this.logger.log(
  //     `Password changed successfully for user with id ${activeUser.sub}`,
  //   );
  //
  //   return apiResponseHandler(
  //     `Contraseña actualizada exitosamente`,
  //     HttpStatus.OK,
  //   );
  // }
}
