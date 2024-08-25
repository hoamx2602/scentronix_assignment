import { UserRole } from '@app/common/enums';
import { SetMetadata } from '@nestjs/common';
import { ROLES_KEY } from '../const';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
