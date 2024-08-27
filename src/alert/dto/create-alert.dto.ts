import { IsEnum, IsOptional, IsString } from 'class-validator';
import { AlertMethodDetailsDto } from './alert-method-details.dto';
import { AlertMethodTypes } from '@app/common/enums';

export class CreateAlertMethodDto {
  @IsString()
  user_id: string;

  @IsEnum(AlertMethodTypes)
  method_type: AlertMethodTypes;

  @IsOptional()
  details?: AlertMethodDetailsDto;
}
