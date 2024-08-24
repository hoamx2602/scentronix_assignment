import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { UserRole } from '../enums';
import { AbstractDocument } from '../database/abstract.schema';
import { getUnixTime } from 'date-fns';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema({
  collection: 'users',
  versionKey: false,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    currentTime: () => getUnixTime(new Date()),
  },
})
export class User extends AbstractDocument {
  @Prop({ required: true })
  @ApiProperty({
    example: 'your_username',
    minimum: 5,
    maximum: 20,
  })
  username: string;

  @ApiProperty({
    example: 'your_password',
    minimum: 8,
    maximum: 20,
  })
  @Prop({ required: true })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.USER })
  role?: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
