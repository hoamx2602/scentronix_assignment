import { IsEnum, IsOptional } from 'class-validator';
import { AlertMethodDetailsDto } from './alert-method-details.dto';
import { AlertMethodTypes } from '@app/common/enums';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAlertMethodDto {
  @IsEnum(AlertMethodTypes)
  @ApiProperty({
    description: 'Alert method',
    example: AlertMethodTypes.SLACK,
  })
  method_type: AlertMethodTypes;

  @IsOptional()
  @ApiProperty({
    description: 'Details for alert method',
  })
  details?: AlertMethodDetailsDto;
}
