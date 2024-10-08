import { Controller, Get } from '@nestjs/common';
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
}
