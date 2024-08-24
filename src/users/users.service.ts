import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserRepository } from '@app/common';
import { hash, compare } from 'bcrypt';
import { USER_ALREADY_EXISTS } from '@app/common/error-messages';

@Injectable()
export class UsersService {
  protected readonly logger = new Logger(UsersService.name);
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(dto: CreateUserDto) {
    const existUser = await this.userRepository.findUserByUsername(
      dto.username,
    );

    if (existUser) {
      this.logger.debug(USER_ALREADY_EXISTS, existUser);
      throw new ConflictException(USER_ALREADY_EXISTS);
    }

    const newUser = await this.userRepository.create({
      ...dto,
      password: await hash(dto.password, 10),
    });
    return newUser;
  }

  async validateUser(username: string, password: string) {
    const user = await this.userRepository.findOne({ username });
    const passwordIsValid = await compare(password, user.password);
    if (!passwordIsValid) {
      throw new UnauthorizedException('Credentials are not valid.');
    }
    return user;
  }

  async getUser(getUserRequest: Partial<User>) {
    return this.userRepository.findOne(getUserRequest);
  }
}
