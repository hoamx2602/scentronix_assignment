import { AlertMethodTypes } from '@app/common/enums';
import { IsEnum, IsOptional } from 'class-validator';
import { AlertMethodDetailsDto } from './alert-method-details.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAlertMethodDto {
  @IsEnum(AlertMethodTypes)
  @ApiProperty({
    description: 'Method type',
    example: AlertMethodTypes.EMAIL,
  })
  method_type: AlertMethodTypes;

  @IsOptional()
  @ApiProperty()
  details?: AlertMethodDetailsDto;
}
