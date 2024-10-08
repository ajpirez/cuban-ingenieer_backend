import { Controller, Get, HttpStatus } from '@nestjs/common';
import { apiResponseHandler } from 'src/utils/apiResponseHandler';
import { UsersService } from './users.service';
import { ActiveUser } from 'src/auth/decorators/active-user.decorator';
import { ActiveUserData } from 'src/auth/interfaces/active-user-data.interface';

// @Roles(UserRol.Admin)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('')
  async findAll(@ActiveUser() activeUser: ActiveUserData) {
    const users = await this.usersService.findAllWithoutPagination({
      select: ['id', 'avatar', 'email', 'name'],
      exclusions: { id: activeUser.sub },
    });

    users.elements = users.elements.map((x) => {
      x.email = x.email.split('@')[0];
      return x;
    });
    return users;
  }

  // @Post()
  // async create(
  //   @Body() createUserDto: CreateUserDto,
  //   @ActiveUser() activeUser: ActiveUserData,
  // ) {
  //   const password = this.usersService.generatePassword(12);
  //
  //   const newUser = await this.usersService.create(
  //     { ...createUserDto, password },
  //     activeUser,
  //   );
  //
  //   return apiResponseHandler(
  //     'User created successfully',
  //     HttpStatus.CREATED,
  //     newUser,
  //   );
  // }
}
