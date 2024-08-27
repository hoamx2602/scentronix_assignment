import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractDocument } from '../database/abstract.schema';
import { getUnixTime } from 'date-fns';
import { AlertHistoryStatus } from '../enums';

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

  @Prop({ required: true, type: String })
  alert_method_id: string;

  @Prop({
    type: String,
    enum: AlertHistoryStatus,
    default: AlertHistoryStatus.SUCCESS,
  })
  status: AlertHistoryStatus;

  @Prop({ type: String })
  response_message: string;
}

export const AlertHistorySchema = SchemaFactory.createForClass(AlertHistory);
