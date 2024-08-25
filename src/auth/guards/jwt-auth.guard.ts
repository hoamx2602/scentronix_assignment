import { AuthGuard } from '@nestjs/passport';
import { JWT_AUTH_GUARD } from '../const';

export class JwtAuthGuard extends AuthGuard(JWT_AUTH_GUARD) {}
