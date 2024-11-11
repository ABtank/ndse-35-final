import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ReservationDocument = Reservation & Document;

@Schema()
export class Reservation {
  @Prop({ required: true, type: MongooseSchema.Types.ObjectId }) // ID пользователя
  userId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId }) // ID гостиницы
  hotelId: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId }) // ID комнаты
  roomId: string;

  @Prop({ required: true }) // Дата начала бронирования
  dateStart: Date;

  @Prop({ required: true }) // Дата окончания бронирования
  dateEnd: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
