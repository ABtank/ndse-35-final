import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId }) // ID автора сообщения
  author: string;

  @Prop({ default: Date.now }) // Дата отправки
  sentAt: Date;

  @Prop({ required: true }) // Текст сообщения
  text: string;

  @Prop() // Дата прочтения
  readAt?: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
