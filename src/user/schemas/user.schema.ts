import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

import { Document } from 'mongoose';

import { ERoles } from '../enums/roles.enum';
import { EStatus } from '../enums/status.enum';

@Schema()
export class User extends Document {
  @Prop({ type: String, required: true })
  fullName: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: [String], required: true, enum: Object.values(ERoles) })
  roles: Array<ERoles>;

  @Prop({ type: String, required: true, enum: Object.values(EStatus) })
  status: EStatus;
}

export const UserSchema = SchemaFactory.createForClass(User);
