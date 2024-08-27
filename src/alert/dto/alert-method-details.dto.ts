import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class AlertMethodDetailsDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Email',
  })
  email?: string;

  @IsOptional()
  @ApiPropertyOptional({
    description: 'Slack webhook url',
  })
  @IsString()
  slack_webhook_url?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Phone',
  })
  phone_number?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Google chat url',
  })
  google_chat_url?: string;
}
