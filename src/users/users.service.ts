import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserRepository } from '@app/common';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(dto: CreateUserDto) {
    await this.validateCreateUserRequest(dto.username);

    const user = await this.userRepository.create({
      ...dto,
      password: await hash(dto.password, 10),
    });
    return user;
  }

  private async validateCreateUserRequest(username: string) {
    let user: User;
    try {
      user = await this.userRepository.findUserByUsername(username);
    } catch (err) {}

    if (user) {
      throw new UnprocessableEntityException('Username already exists.');
    }
  }

  async getUser(getUserRequest: Partial<User>) {
    return this.userRepository.findOne(getUserRequest);
  }
}
