import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractDocument } from '../database/abstract.schema';
import { getUnixTime } from 'date-fns';
import { AlertHistoryStatus } from '../enums';
import { ApiProperty } from '@nestjs/swagger';

export type AlertHistoryDocument = AlertHistory & Document;

@Schema({
  collection: 'alert_history',
  versionKey: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    currentTime: () => getUnixTime(new Date()),
  },
})
export class AlertHistory extends AbstractDocument {
  @Prop({ required: true, type: String })
  user_id: string;

  @Prop({ type: String })
  @ApiProperty({
    description: 'Alert method id',
    example: '66cd1a05b84953b1b570c00f',
  })
  alert_method_id?: string;

  @Prop({
    type: String,
    enum: AlertHistoryStatus,
    default: AlertHistoryStatus.SUCCESS,
  })
  @ApiProperty({
    description: 'Status of this alert hsitory',
    example: AlertHistoryStatus.SUCCESS,
  })
  status: AlertHistoryStatus;

  @Prop({ type: String })
  @ApiProperty({
    description: 'Alert message',
    example: 'Warning you',
  })
  alert_message: string;
}

export const AlertHistorySchema = SchemaFactory.createForClass(AlertHistory);
