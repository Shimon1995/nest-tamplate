import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Token extends Document {
  @Prop()
  token: string;

  @Prop()
  expiresAt: string;

  @Prop()
  uId: string;
}

export const TokenSchema = SchemaFactory.createForClass(Token);
