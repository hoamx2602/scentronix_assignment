import { Test, TestingModule } from '@nestjs/testing';
import { SlackWebhookService } from './slack.service';
import axios from 'axios';
import { Logger } from '@nestjs/common';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SlackWebhookService', () => {
  let service: SlackWebhookService;
  let loggerErrorMock: jest.SpyInstance;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SlackWebhookService, Logger],
    }).compile();

    service = module.get<SlackWebhookService>(SlackWebhookService);
    loggerErrorMock = jest
      .spyOn(service['logger'], 'error')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendNotification', () => {
    it('should send a notification with the correct parameters', async () => {
      const webhookUrl = 'https://example.com/webhook';
      const message = 'Test message';

      // Mock axios.post to resolve successfully
      mockedAxios.post.mockResolvedValue({});

      await service.sendNotification(webhookUrl, message);

      expect(mockedAxios.post).toHaveBeenCalledWith(webhookUrl, {
        text: message,
      });
    });

    it('should log an error if sending notification fails', async () => {
      const webhookUrl = 'https://example.com/webhook';
      const message = 'Test message';
      const error = new Error('Slack notification failed');

      // Mock axios.post to reject with an error
      mockedAxios.post.mockRejectedValue(error);

      await service.sendNotification(webhookUrl, message);

      // Check if logger.error was called with the correct message and error
      expect(loggerErrorMock).toHaveBeenCalledWith(
        'sendNotificationFailed',
        error,
      );
    });
  });
});
