import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import {
  ReservationsController,
  ReservationsManagerController,
} from './reservations.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Reservation, ReservationSchema } from './reservation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
  ],
  controllers: [ReservationsController, ReservationsManagerController],
  providers: [ReservationsService],
})
export class ReservationsModule {}
