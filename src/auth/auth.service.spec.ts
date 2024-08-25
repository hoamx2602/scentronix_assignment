/* eslint-disable @typescript-eslint/no-unused-vars */
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserRepository } from '@app/common';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { Types } from 'mongoose';
import { UserRole } from '@app/common/enums';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;
  let userRepository: UserRepository;

  const mockUser = {
    _id: new Types.ObjectId(),
    username: 'testuser',
    role: UserRole.USER,
    password: 'hashed_password',
  };

  const mockUsersService = {
    createUser: jest.fn().mockResolvedValue(mockUser),
  };

  const mockUserRepository = {
    findOne: jest.fn().mockResolvedValue(mockUser),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock_token'),
  };

  const mockConfigService = {
    get: jest.fn().mockReturnValue(3600),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('login', () => {
    it('should return access token and set cookie', async () => {
      const response: Partial<Response> = {
        cookie: jest.fn(),
      };
      const result = await service.login(mockUser, response as Response);

      expect(result).toEqual({ access_token: 'mock_token' });
      expect(jwtService.sign).toHaveBeenCalledWith({
        username: mockUser.username,
        userId: mockUser._id,
        role: mockUser.role,
      });
      expect((response.cookie as jest.Mock).mock.calls[0][1]).toBe(
        'mock_token',
      );
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerDto = { username: 'testuser', password: 'testpassword' };
      const result = await service.register(registerDto);

      expect(result).toEqual(mockUser);
      expect(usersService.createUser).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('validateUser', () => {
    it('should return user if password is valid', async () => {
      const email = 'test@example.com';
      const password = 'testpassword';

      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(
          async (inputPassword: string, _storedPassword: string) =>
            inputPassword === 'testpassword',
        );

      const result = await service.validateUser(email, password);

      expect(result).toEqual(mockUser);
      expect(userRepository.findOne).toHaveBeenCalledWith({ email });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';

      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(
          async (inputPassword: string, storedPassword: string) => false,
        );

      await expect(service.validateUser(email, password)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
