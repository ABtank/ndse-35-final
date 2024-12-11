import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Message } from './message.schema';

export type SupportRequestDocument = SupportRequest & Document;

@Schema()
export class SupportRequest {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId }) // ID пользователя
  user: string;

  @Prop({ default: Date.now }) // Дата создания обращения
  createdAt: Date;

  @Prop({ type: [Message], default: [] }) // Сообщения в обращении
  messages: Message[];

  @Prop({ default: true }) // Флаг активности обращения
  isActive: boolean;
}

export const SupportRequestSchema =
  SchemaFactory.createForClass(SupportRequest);
