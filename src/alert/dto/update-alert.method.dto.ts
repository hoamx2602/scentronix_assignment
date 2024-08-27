import { AlertMethodTypes } from '@app/common/enums';
import { IsEnum, IsOptional } from 'class-validator';
import { AlertMethodDetailsDto } from './alert-method-details.dto';

export class UpdateAlertMethodDto {
  @IsEnum(AlertMethodTypes)
  method_type: AlertMethodTypes;

  @IsOptional()
  details?: AlertMethodDetailsDto;
}
