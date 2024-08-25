import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { AbstractDocument } from '../database/abstract.schema';
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

  @Prop({ required: true, min: 1 })
  priority: number;

  @Prop({ type: String })
  serviceOwner: string;
}

export const UrlSchema = SchemaFactory.createForClass(Url);
