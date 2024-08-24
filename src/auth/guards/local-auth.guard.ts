import { AuthGuard } from '@nestjs/passport';
import { LOCAL_AUTH_GUARD } from '../const';

export class LocalAuthGuard extends AuthGuard(LOCAL_AUTH_GUARD) {}
