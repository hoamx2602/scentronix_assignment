import { User } from '@app/common';
import { UserRole } from '@app/common/enums';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { AddUrlsDto, GetReachableUrlsDto, QueryDto, UrlDto } from './dto';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';

describe('UrlsController', () => {
  let controller: UrlsController;
  let service: UrlsService;

  const mockUser: User = {
    _id: new Types.ObjectId(),
    username: 'testuser',
    password: 'hashed_password',
    roles: [UserRole.USER],
  } as User;

  const mockUrlsService = {
    getReachableUrls: jest.fn(),
    addUserUrls: jest.fn(),
    getOnlineServicesForUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlsController],
      providers: [{ provide: UrlsService, useValue: mockUrlsService }],
    }).compile();

    controller = module.get<UrlsController>(UrlsController);
    service = module.get<UrlsService>(UrlsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getReachableUrls', () => {
    it('should return reachable URLs list for admin or moderator', async () => {
      const reachableUrlsDto: GetReachableUrlsDto = {
        urls: [{ url: 'http://example.com', priority: 1 }],
      };

      const expectedUrls: UrlDto[] = [
        { url: 'http://example.com', priority: 1 },
      ];

      mockUrlsService.getReachableUrls.mockResolvedValue(expectedUrls);

      const result = await controller.getReachableUrls(reachableUrlsDto);

      expect(service.getReachableUrls).toHaveBeenCalledWith(reachableUrlsDto);
      expect(result).toEqual(expectedUrls);
    });
  });

  describe('addUserUrls', () => {
    it('should add new URLs for the current user', async () => {
      const addUrlsDto: AddUrlsDto = {
        urls: [{ url: 'http://example.com', priority: 1 }],
      };

      await controller.addUserUrls(mockUser, addUrlsDto);

      expect(service.addUserUrls).toHaveBeenCalledWith(mockUser, addUrlsDto);
    });

    it('should throw BadRequestException if URLs already exist', async () => {
      const addUrlsDto: AddUrlsDto = {
        urls: [{ url: 'http://example.com', priority: 1 }],
      };

      mockUrlsService.addUserUrls.mockRejectedValue(new BadRequestException());

      await expect(
        controller.addUserUrls(mockUser, addUrlsDto),
      ).rejects.toThrow(BadRequestException);

      expect(service.addUserUrls).toHaveBeenCalledWith(mockUser, addUrlsDto);
    });
  });

  describe('getOnlineServicesForUser', () => {
    it('should return online services for the current user', async () => {
      const query: QueryDto = { filterPriority: 1 };

      const expectedUrls: UrlDto[] = [
        { url: 'http://example.com', priority: 1 },
      ];

      mockUrlsService.getOnlineServicesForUser.mockResolvedValue(expectedUrls);

      const result = await controller.getOnlineServicesForUser(mockUser, query);

      expect(service.getOnlineServicesForUser).toHaveBeenCalledWith(
        mockUser,
        query,
      );
      expect(result).toEqual(expectedUrls);
    });

    it('should return an empty array if no URLs found', async () => {
      const query: QueryDto = { filterPriority: 1 };

      mockUrlsService.getOnlineServicesForUser.mockResolvedValue([]);

      const result = await controller.getOnlineServicesForUser(mockUser, query);

      expect(service.getOnlineServicesForUser).toHaveBeenCalledWith(
        mockUser,
        query,
      );
      expect(result).toEqual([]);
    });
  });
});
