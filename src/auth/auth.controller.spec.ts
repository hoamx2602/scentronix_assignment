import { User } from '@app/common';
import { UserRole } from '@app/common/enums';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { Types } from 'mongoose'; // Import từ Mongoose
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockUser = {
    _id: new Types.ObjectId(),
    username: 'testuser',
    role: UserRole.USER,
    password: 'somepassword',
  };

  const loginResponse = {
    access_token: 'token',
  };
  const mockAuthService = {
    register: jest.fn().mockResolvedValueOnce(mockUser),
    login: jest.fn().mockResolvedValueOnce(loginResponse),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should register a user with username and password', async () => {
      const registerDto: RegisterDto = {
        username: 'testuser',
        password: 'testpassword',
      };

      const result = await authController.register(registerDto);

      expect(result).toBe(mockUser);
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });

    it('should throw an error if input is username too short', async () => {
      const registerDto: RegisterDto = {
        username: 'us',
        password: 'short',
      };

      try {
        await authController.register(registerDto);
      } catch (error) {
        expect(error).not.toBeInstanceOf(BadRequestException);
        expect(error).toHaveProperty('statusCode', 400);
      }
    });

    it('should throw an error if password too weak', async () => {
      const registerDto: RegisterDto = {
        username: 'username',
        password: 'short',
      };

      try {
        await authController.register(registerDto);
      } catch (error) {
        expect(error).not.toBeInstanceOf(BadRequestException);
        expect(error).toHaveProperty('statusCode', 400);
      }
    });
  });

  describe('login', () => {
    it('should login a user', async () => {
      const loginDto = {
        username: 'testuser',
        password: 'somepassword',
      } as User;
      const response = {} as Response;

      const result = await authController.login(loginDto, response);

      expect(authService.login).toHaveBeenCalledWith(loginDto, response);
      expect(result).toBe(loginResponse);
    });

    it('Cannot login with incorrect credentials', async () => {
      const loginDto = {
        username: 'testuser',
        password: 'some',
      } as User;
      const response = {} as Response;

      try {
        await authController.login(loginDto, response);
      } catch (error) {
        expect(error).not.toBeInstanceOf(NotFoundException);
        expect(error).toHaveProperty('statusCode', 404);
      }
    });
  });
});
