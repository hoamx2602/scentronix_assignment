import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from '@app/common';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { Types } from 'mongoose';

describe('UsersService', () => {
  let service: UsersService;

  const mockUser = {
    _id: new Types.ObjectId(),
    username: 'testuser',
    password: 'hashed_password',
  };

  const mockUserRepository = {
    findUserByUsername: jest.fn(),
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: UserRepository, useValue: mockUserRepository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user if username does not exist', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'testpassword',
      };

      mockUserRepository.findUserByUsername.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(mockUser);
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(async () => 'hashed_password');

      const result = await service.createUser(createUserDto);

      expect(mockUserRepository.findUserByUsername).toHaveBeenCalledWith(
        'testuser',
      );
      expect(bcrypt.hash).toHaveBeenCalledWith('testpassword', 10);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...createUserDto,
        password: 'hashed_password',
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if username already exists', async () => {
      const createUserDto: CreateUserDto = {
        username: 'existinguser',
        password: 'testpassword',
      };

      mockUserRepository.findUserByUsername.mockResolvedValue(mockUser);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        ConflictException,
      );
      expect(mockUserRepository.findUserByUsername).toHaveBeenCalledWith(
        'existinguser',
      );
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('validateUser', () => {
    it('should return the user if password is valid', async () => {
      const username = 'testuser';
      const password = 'testpassword';

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

      const result = await service.validateUser(username, password);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ username });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
      expect(result).toEqual(mockUser);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const username = 'testuser';
      const password = 'wrongpassword';

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      await expect(service.validateUser(username, password)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ username });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
    });
  });

  describe('getUser', () => {
    it('should return the user based on the given criteria', async () => {
      const getUserRequest = { _id: new Types.ObjectId() };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getUser(getUserRequest);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith(getUserRequest);
      expect(result).toEqual(mockUser);
    });
  });
});
