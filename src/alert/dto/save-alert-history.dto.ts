import { AlertHistory } from '@app/common';
import { PartialType } from '@nestjs/swagger';

export class SaveAlertHistoryDto extends PartialType(AlertHistory) {}
