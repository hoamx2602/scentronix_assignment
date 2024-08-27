import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractDocument } from '../database/abstract.schema';
import { getUnixTime } from 'date-fns';
import { AlertMethodTypes } from '../enums';

export type AlertMethodDocument = AlertMethod & Document;
export class AlertMethodDetails {
  @Prop({ type: String, required: false })
  email?: string;

  @Prop({ type: String, required: false })
  slack_webhook_url?: string;

  @Prop({ type: String, required: false })
  phone_number?: string;

  @Prop({ type: String, required: false })
  google_chat_url?: string;
}

@Schema({
  collection: 'alert_methods',
  versionKey: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    currentTime: () => getUnixTime(new Date()),
  },
})
export class AlertMethod extends AbstractDocument {
  @Prop({ required: true, type: String })
  user_id: string;

  @Prop({
    type: String,
    enum: AlertMethodTypes,
    default: AlertMethodTypes.SLACK,
  })
  method_type: AlertMethodTypes;

  @Prop({
    type: AlertMethodDetails,
  })
  details: AlertMethodDetails;
}

export const AlertMethodSchema = SchemaFactory.createForClass(AlertMethod);
