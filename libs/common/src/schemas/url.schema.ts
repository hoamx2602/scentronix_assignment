import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractDocument } from '../database/abstract.schema';
import { UrlStatus } from '../enums';
import { getUnixTime } from 'date-fns';

export type UrlDocument = Url & Document;

@Schema({
  collection: 'urls',
  versionKey: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    currentTime: () => getUnixTime(new Date()),
  },
})
export class Url extends AbstractDocument {
  @Prop({ required: true })
  url: string;

  @Prop({ required: true, min: 1, max: 5 })
  priority: number;

  @Prop({ type: String, enum: UrlStatus, default: UrlStatus.ONLINE })
  status: UrlStatus;

  @Prop({ type: String, default: 'general' })
  category: string;

  @Prop({ type: String })
  serviceOwner: string;

  // URL check frequency (in minutes)
  @Prop({ type: Number, default: 5 })
  checkInterval: number;

  @Prop({ type: Number })
  lastChecked: number;

  @Prop({ type: [String], default: [] })
  alertChannels: string[];

  @Prop({ type: Map, of: String, default: {} })
  metadata: Map<string, string>;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
