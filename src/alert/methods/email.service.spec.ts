import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { Logger } from '@nestjs/common';
import { ALERT_NOTIFICATION_TEMPLATE } from '@app/common/template';

// Mock the Resend class and its methods
jest.mock('resend', () => {
  return {
    Resend: jest.fn().mockImplementation(() => ({
      emails: {
        send: jest.fn(),
      },
    })),
  };
});

describe('EmailService', () => {
  let service: EmailService;
  let resend: any; // Mocked Resend instance

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService, Logger],
    }).compile();

    service = module.get<EmailService>(EmailService);
    resend = (service as any).resend; // Accessing private resend property
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('sendEmail', () => {
    it('should send an email with the correct parameters', async () => {
      const sendMock = jest
        .spyOn(resend.emails, 'send')
        .mockResolvedValue({ data: null, error: null });

      const to = 'user@example.com';
      const subject = 'Test Subject';
      const text = 'Test Alert Message';

      const expectedMessage = ALERT_NOTIFICATION_TEMPLATE.replace(
        '{{ALERT_DETAILS_JSON}}',
        text,
      );

      await service.sendEmail(to, subject, text);

      expect(sendMock).toHaveBeenCalledWith({
        from: 'onboarding@resend.dev',
        to,
        subject,
        html: expectedMessage,
      });
    });
  });
});
