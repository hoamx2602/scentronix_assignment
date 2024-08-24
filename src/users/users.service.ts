import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserRepository } from '@app/common';
import { hash, compare } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(dto: CreateUserDto) {
    await this.checkUsernameExistOrNot(dto.username);

    const user = await this.userRepository.create({
      ...dto,
      password: await hash(dto.password, 10),
    });
    return user;
  }

  private async checkUsernameExistOrNot(username: string) {
    let user: User;
    try {
      user = await this.userRepository.findUserByUsername(username);
    } catch (err) {}

    if (user) {
      throw new UnprocessableEntityException('Username already exists.');
    }
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findOne({ email });
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
