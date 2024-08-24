import { AuthGuard } from '@nestjs/passport';
import { JWT_AUTH_GUARD } from '../const';

export default class JwtAuthGuard extends AuthGuard(JWT_AUTH_GUARD) {}
