import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/auth/authentication/decorators/auth.decorator';
import { AuthType } from 'src/auth/authentication/enums/auth-type.enum';

@ApiTags('HealthCheck')
@Controller()
export class AppController {
  constructor() {}

  @Get('')
  @ApiOperation({ summary: 'Get healthcheck' })
  @Auth(AuthType.None)
  getHealthcheck(@Res() res: Response) {
    return res.status(200).json({ message: 'OK' });
  }
}
