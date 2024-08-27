import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from './urls.service';
import { UrlRepository } from '@app/common';
import { BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { AddUrlsDto, GetReachableUrlsDto, QueryDto, UrlDto } from './dto';
import { Types } from 'mongoose';
import { User } from '@app/common';

jest.mock('axios');

describe('UrlsService', () => {
  let service: UrlsService;

  const mockUrl = {
    _id: new Types.ObjectId(),
    url: 'http://example.com',
    priority: 1,
    serviceOwner: new Types.ObjectId().toHexString(),
  };

  const mockUser: User = {
    _id: new Types.ObjectId(),
    username: 'testuser',
    password: 'hashed_password',
  } as User;

  const mockUrlRepository = {
    find: jest.fn(),
    insertMany: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlsService,
        { provide: UrlRepository, useValue: mockUrlRepository },
      ],
    }).compile();

    service = module.get<UrlsService>(UrlsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getReachableUrls', () => {
    it('should return filtered and sorted reachable URLs', async () => {
      const reachableUrlsDto: GetReachableUrlsDto = {
        urls: [mockUrl],
        filterPriority: 1,
      };

      jest.spyOn(service, 'getOnlineServices').mockResolvedValue([mockUrl]);

      const result = await service.getReachableUrls(reachableUrlsDto);

      expect(result).toEqual([mockUrl]);
      expect(service.getOnlineServices).toHaveBeenCalledWith([mockUrl]);
    });
  });

  describe('getOnlineServices', () => {
    it('should return filtered and sorted URLs based on their status', async () => {
      const urlsDto: UrlDto[] = [mockUrl];
      const urlStatus = [{ url: mockUrl.url, online: true }];

      jest.spyOn(service, 'checkUrlStatus').mockResolvedValueOnce(urlStatus[0]);
      jest.spyOn(service, 'filterAndSortUrls').mockReturnValue(urlsDto);

      const result = await service.getOnlineServices(urlsDto);

      expect(service.checkUrlStatus).toHaveBeenCalledWith(mockUrl.url);
      expect(service.filterAndSortUrls).toHaveBeenCalledWith(
        urlsDto,
        urlStatus,
      );
      expect(result).toEqual(urlsDto);
    });
  });

  describe('addUserUrls', () => {
    it('should create new URLs if none exist', async () => {
      const addUrlsDto: AddUrlsDto = {
        urls: [mockUrl],
      };

      mockUrlRepository.find.mockResolvedValue([]);
      mockUrlRepository.insertMany.mockResolvedValue([mockUrl]);

      const result = await service.addUserUrls(mockUser, addUrlsDto);

      expect(mockUrlRepository.find).toHaveBeenCalledWith({
        url: { $in: [mockUrl.url] },
        serviceOwner: mockUser._id.toHexString(),
      });
      expect(mockUrlRepository.insertMany).toHaveBeenCalledWith([
        { ...mockUrl, serviceOwner: mockUser._id.toHexString() },
      ]);
      expect(result).toEqual([mockUrl]);
    });

    it('should throw BadRequestException if URLs already exist', async () => {
      const addUrlsDto: AddUrlsDto = {
        urls: [mockUrl],
      };

      mockUrlRepository.find.mockResolvedValue([mockUrl]);

      await expect(service.addUserUrls(mockUser, addUrlsDto)).rejects.toThrow(
        BadRequestException,
      );
      expect(mockUrlRepository.insertMany).not.toHaveBeenCalled();
    });
  });

  describe('getOnlineServicesForUser', () => {
    it('should return online services filtered by user and priority', async () => {
      const query: QueryDto = { filterPriority: 1 };

      mockUrlRepository.find.mockResolvedValue([mockUrl]);

      jest.spyOn(service, 'getOnlineServices').mockResolvedValue([mockUrl]);

      const result = await service.getOnlineServicesForUser(mockUser, query);

      expect(mockUrlRepository.find).toHaveBeenCalledWith(
        { serviceOwner: mockUser._id.toHexString(), priority: 1 },
        { url: 1, priority: 1 },
      );
      expect(service.getOnlineServices).toHaveBeenCalledWith([mockUrl]);
      expect(result).toEqual([mockUrl]);
    });

    it('should return an empty array if no URLs found', async () => {
      const query: QueryDto = { filterPriority: 1 };

      mockUrlRepository.find.mockResolvedValue([]);

      const result = await service.getOnlineServicesForUser(mockUser, query);

      expect(mockUrlRepository.find).toHaveBeenCalledWith(
        { serviceOwner: mockUser._id.toHexString(), priority: 1 },
        { url: 1, priority: 1 },
      );
      expect(result).toEqual([]);
    });
  });

  describe('checkUrlStatus', () => {
    it('should return online status if URL is reachable', async () => {
      const url = 'http://example.com';

      (axios.get as jest.Mock).mockResolvedValue({ status: 200 });

      const result = await service.checkUrlStatus(url);

      expect(axios.get).toHaveBeenCalledWith(url, { timeout: 5000 });
      expect(result).toEqual({ url, online: true });
    });

    it('should return offline status if URL is not reachable', async () => {
      const url = 'http://example.com';

      (axios.get as jest.Mock).mockRejectedValue(new Error('Network error'));

      const result = await service.checkUrlStatus(url);

      expect(axios.get).toHaveBeenCalledWith(url, { timeout: 5000 });
      expect(result).toEqual({ url, online: false });
    });
  });
});
