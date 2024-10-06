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

  // @Get()
  // findAll(@Query() { page = 1, limit = 10 }: { page: number; limit: number }) {
  //   return this.usersService.findAll({}, { page, limit });
  // }
  //
  // @Get('assigned')
  // findAllWithoutPagination() {
  //   return this.usersService.findAllWithoutPagination({
  //     select: ['email', 'id'],
  //     role: UserRol.Inspector,
  //   });
  // }
  //
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne({ id });
  // }
  //
  // @Patch(':id')
  // async update(
  //   @Param('id') id: string,
  //   @Body() updateUserDto: UpdateUserDto,
  //   @ActiveUser() activeUser: ActiveUserData,
  // ) {
  //   const updatedUser = await this.usersService.update(
  //     id,
  //     updateUserDto,
  //     { new: true },
  //     activeUser,
  //   );
  //
  //   return apiResponseHandler(
  //     'User updated successfully',
  //     HttpStatus.OK,
  //     updatedUser,
  //   );
  // }
  //
  // @Delete(':id')
  // async remove(@Param('id') id: string) {
  //   await this.usersService.remove(id);
  //
  //   return apiResponseHandler('User deleted successfully', HttpStatus.OK);
  // }
}
