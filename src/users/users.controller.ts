import {
  Body,
  Controller,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';
import { apiResponseHandler } from 'src/utils/apiResponseHandler';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { UserRol } from './enums/user.rol';
import { Roles } from '../auth/authorization/decorators/roles.decorator';

@Roles(UserRol.Admin)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(
    @Body() createUserDto: CreateUserDto,
    @ActiveUser() activeUser: ActiveUserData,
  ) {
    const password = this.usersService.generatePassword(12);

    const newUser = await this.usersService.create(
      { ...createUserDto, password },
      activeUser,
    );

    return apiResponseHandler(
      'User created successfully',
      HttpStatus.CREATED,
      newUser,
    );
  }
}
