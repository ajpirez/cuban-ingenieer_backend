import { UUID } from 'crypto';
import { UserRol } from '../../users/enums/user.rol';

export interface ActiveUserData {
  sub: UUID;

  email: string;

  role: UserRol;
}
