import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from 'src/auth/auth.constants';
import { UserRol } from '../../../users/enums/user.rol';

export const Roles = (...roles: UserRol[]) => SetMetadata(ROLES_KEY, roles);
