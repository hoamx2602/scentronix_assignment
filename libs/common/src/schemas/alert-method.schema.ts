import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractDocument } from '../database/abstract.schema';
import { getUnixTime } from 'date-fns';
import { AlertMethodTypes } from '../enums';
import { ApiProperty } from '@nestjs/swagger';

export type AlertMethodDocument = AlertMethod & Document;
export class AlertMethodDetails {
  @Prop({ type: String, required: false })
  @ApiProperty({
    description: 'Email address',
    example: 'example@email.com',
  })
  email?: string;

  @Prop({ type: String, required: false })
  @ApiProperty({
    description: 'Slack webhook url',
    example:
      'https://hooks.slack.com/services/T12345678/B12345678/abcdefghijklmno1234567890',
  })
  slack_webhook_url?: string;

  @Prop({ type: String, required: false })
  @ApiProperty({
    description: 'Phone number',
    example: '0966566xxx',
  })
  phone_number?: string;

  @Prop({ type: String, required: false })
  @ApiProperty({
    description: 'Phone number',
    example:
      'https://chat.googleapis.com/v1/spaces/AAAA12345678/messages?key=abcdefg12345&token=xyz123',
  })
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
  @ApiProperty({
    description: 'User Id',
    example: '66cd1a05b84953b1b570c00f',
  })
  user_id: string;

  @Prop({
    type: String,
    enum: AlertMethodTypes,
    default: AlertMethodTypes.SLACK,
  })
  @ApiProperty({
    description: 'Alert method type',
    example: AlertMethodTypes.SLACK,
  })
  method_type: AlertMethodTypes;

  @Prop({
    type: AlertMethodDetails,
  })
  @ApiProperty({
    description: 'Details for this alert',
  })
  details: AlertMethodDetails;
}

export const AlertMethodSchema = SchemaFactory.createForClass(AlertMethod);
