import { User } from '@app/common';
import { AlertMethodTypes } from '@app/common/enums';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AlertController } from './alert.controller';
import { AlertService } from './alert.service';
import { CreateAlertMethodDto, UpdateAlertMethodDto } from './dto';

describe('AlertController', () => {
  let controller: AlertController;
  let service: AlertService;

  const mockUser: User = {
    _id: new Types.ObjectId(),
    username: 'testuser',
    password: 'hashed_password',
    roles: [],
  } as User;

  const mockAlertService = {
    createNewAlertMethodForUser: jest.fn(),
    updateAlertMethodForUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AlertController],
      providers: [{ provide: AlertService, useValue: mockAlertService }],
    }).compile();

    controller = module.get<AlertController>(AlertController);
    service = module.get<AlertService>(AlertService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewAlertMethodForUser', () => {
    it('should create a new alert method for the user', async () => {
      const createAlertDto: CreateAlertMethodDto = {
        method_type: AlertMethodTypes.EMAIL,
        details: {
          email: 'user@example.com',
        },
      };

      await controller.createNewAlertMethodForUser(mockUser, createAlertDto);

      expect(service.createNewAlertMethodForUser).toHaveBeenCalledWith(
        mockUser,
        createAlertDto,
      );
    });

    it('should throw BadRequestException if alert method creation fails', async () => {
      const createAlertDto: CreateAlertMethodDto = {
        method_type: AlertMethodTypes.EMAIL,
        details: {
          email: 'user@example.com',
        },
      };

      mockAlertService.createNewAlertMethodForUser.mockRejectedValue(
        new BadRequestException(),
      );

      await expect(
        controller.createNewAlertMethodForUser(mockUser, createAlertDto),
      ).rejects.toThrow(BadRequestException);

      expect(service.createNewAlertMethodForUser).toHaveBeenCalledWith(
        mockUser,
        createAlertDto,
      );
    });
  });

  describe('updateAlertMethodForUser', () => {
    it('should update the alert method for the user', async () => {
      const updateAlertDto: UpdateAlertMethodDto = {
        method_type: AlertMethodTypes.EMAIL,
        details: {
          email: 'user@example.com',
        },
      };

      await controller.updateAlertMethodForUser(mockUser, updateAlertDto);

      expect(service.updateAlertMethodForUser).toHaveBeenCalledWith(
        mockUser,
        updateAlertDto,
      );
    });

    it('should throw BadRequestException if alert method update fails', async () => {
      const updateAlertDto: UpdateAlertMethodDto = {
        method_type: AlertMethodTypes.EMAIL,
        details: {
          email: 'user@example.com',
        },
      };

      mockAlertService.updateAlertMethodForUser.mockRejectedValue(
        new BadRequestException(),
      );

      await expect(
        controller.updateAlertMethodForUser(mockUser, updateAlertDto),
      ).rejects.toThrow(BadRequestException);

      expect(service.updateAlertMethodForUser).toHaveBeenCalledWith(
        mockUser,
        updateAlertDto,
      );
    });
  });
});
