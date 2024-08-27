import {
  AlertHistoryRepository,
  AlertMethod,
  AlertMethodRepository,
  User,
} from '@app/common';
import { AlertHistoryStatus, AlertMethodTypes } from '@app/common/enums';
import {
  ConflictException,
  NotFoundException,
  NotImplementedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AlertService } from './alert.service';
import {
  CreateAlertMethodDto,
  SaveAlertHistoryDto,
  UpdateAlertMethodDto,
} from './dto';
import { EmailService } from './methods/email.service';
import { SlackWebhookService } from './methods/slack.service';

describe('AlertService', () => {
  let service: AlertService;
  let alertMethodRepository: AlertMethodRepository;
  let alertHistoryRepository: AlertHistoryRepository;
  let emailService: EmailService;
  let slackService: SlackWebhookService;

  const mockUser: User = {
    _id: new Types.ObjectId(),
    username: 'testuser',
    password: 'hashed_password',
    roles: [],
  } as User;

  const mockAlertMethod: AlertMethod = {
    _id: new Types.ObjectId(),
    user_id: 'user_id',
    method_type: AlertMethodTypes.EMAIL,
    details: { email: 'user@example.com' },
  };

  const mockAlertMethodRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    findOneAndUpdate: jest.fn(),
  };

  const mockAlertHistoryRepository = {
    create: jest.fn(),
  };

  const mockEmailService = {
    sendEmail: jest.fn(),
  };

  const mockSlackService = {
    sendNotification: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AlertService,
        { provide: AlertMethodRepository, useValue: mockAlertMethodRepository },
        {
          provide: AlertHistoryRepository,
          useValue: mockAlertHistoryRepository,
        },
        { provide: EmailService, useValue: mockEmailService },
        { provide: SlackWebhookService, useValue: mockSlackService },
      ],
    }).compile();

    service = module.get<AlertService>(AlertService);
    alertMethodRepository = module.get<AlertMethodRepository>(
      AlertMethodRepository,
    );
    alertHistoryRepository = module.get<AlertHistoryRepository>(
      AlertHistoryRepository,
    );
    emailService = module.get<EmailService>(EmailService);
    slackService = module.get<SlackWebhookService>(SlackWebhookService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createNewAlertMethodForUser', () => {
    it('should create a new alert method for the user', async () => {
      mockAlertMethodRepository.findOne.mockResolvedValue(null);
      mockAlertMethodRepository.create.mockResolvedValue(mockAlertMethod);

      const createAlertDto: CreateAlertMethodDto = {
        method_type: AlertMethodTypes.EMAIL,
        details: { email: 'user@example.com' },
      };

      const result = await service.createNewAlertMethodForUser(
        mockUser,
        createAlertDto,
      );

      expect(alertMethodRepository.findOne).toHaveBeenCalledWith({
        user_id: mockUser._id,
      });
      expect(alertMethodRepository.create).toHaveBeenCalledWith({
        user_id: mockUser._id.toString(),
        method_type: createAlertDto.method_type,
        details: createAlertDto.details,
      });
      expect(result).toEqual(mockAlertMethod);
    });

    it('should throw ConflictException if alert method already exists', async () => {
      mockAlertMethodRepository.findOne.mockResolvedValue(mockAlertMethod);

      const createAlertDto: CreateAlertMethodDto = {
        method_type: AlertMethodTypes.EMAIL,
        details: { email: 'user@example.com' },
      };

      await expect(
        service.createNewAlertMethodForUser(mockUser, createAlertDto),
      ).rejects.toThrow(ConflictException);

      expect(alertMethodRepository.findOne).toHaveBeenCalledWith({
        user_id: mockUser._id,
      });
      expect(alertMethodRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('updateAlertMethodForUser', () => {
    it('should update the alert method for the user', async () => {
      mockAlertMethodRepository.findOneAndUpdate.mockResolvedValue(
        mockAlertMethod,
      );

      const updateAlertDto: UpdateAlertMethodDto = {
        method_type: AlertMethodTypes.EMAIL,
        details: { email: 'user_new@example.com' },
      };

      const result = await service.updateAlertMethodForUser(
        mockUser,
        updateAlertDto,
      );

      expect(alertMethodRepository.findOneAndUpdate).toHaveBeenCalledWith(
        { user_id: mockUser._id.toString() },
        {
          $set: {
            details: updateAlertDto.details,
            method_type: updateAlertDto.method_type,
          },
        },
      );
      expect(result).toEqual(mockAlertMethod);
    });
  });

  describe('sendAlert', () => {
    it('should send an email alert if the method type is EMAIL', async () => {
      mockAlertMethodRepository.findOne.mockResolvedValue(mockAlertMethod);

      await service.sendAlert(mockUser._id.toString(), 'Test Alert Message');

      expect(alertMethodRepository.findOne).toHaveBeenCalledWith({
        user_id: mockUser._id.toString(),
      });
      expect(emailService.sendEmail).toHaveBeenCalledWith(
        'user@example.com',
        'ALERT',
        'Test Alert Message',
      );
      expect(slackService.sendNotification).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if no alert method is found', async () => {
      mockAlertMethodRepository.findOne.mockResolvedValue(null);

      await expect(
        service.sendAlert(mockUser._id.toString(), 'Test Alert Message'),
      ).rejects.toThrow(NotFoundException);

      expect(alertMethodRepository.findOne).toHaveBeenCalledWith({
        user_id: mockUser._id.toString(),
      });
      expect(emailService.sendEmail).not.toHaveBeenCalled();
      expect(slackService.sendNotification).not.toHaveBeenCalled();
    });

    it('should throw NotImplementedException for unsupported alert method types', async () => {
      const unsupportedAlertMethod: AlertMethod = {
        ...mockAlertMethod,
        method_type: 'UNSUPPORTED_METHOD_TYPE' as AlertMethodTypes,
      };

      mockAlertMethodRepository.findOne.mockResolvedValue(
        unsupportedAlertMethod,
      );

      await expect(
        service.sendAlert(mockUser._id.toString(), 'Test Alert Message'),
      ).rejects.toThrow(NotImplementedException);

      expect(emailService.sendEmail).not.toHaveBeenCalled();
      expect(slackService.sendNotification).not.toHaveBeenCalled();
    });
  });

  describe('saveAlertHistory', () => {
    it('should save the alert history', async () => {
      const saveAlertHistoryDto: SaveAlertHistoryDto = {
        user_id: mockUser._id.toString(),
        alert_method_id: mockAlertMethod._id.toString(),
        alert_message: 'Test Alert Message',
        status: AlertHistoryStatus.SUCCESS,
      };

      await service.saveAlertHistory(saveAlertHistoryDto);

      expect(alertHistoryRepository.create).toHaveBeenCalledWith({
        user_id: saveAlertHistoryDto.user_id,
        alert_method_id: saveAlertHistoryDto.alert_method_id,
        alert_message: saveAlertHistoryDto.alert_message,
        status: saveAlertHistoryDto.status,
      });
    });
  });
});
