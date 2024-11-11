import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation, ReservationDocument } from './reservation.schema';
import {
  ReservationDto,
  IReservation,
  ReservationSearchOptions,
} from './interfaces';

@Injectable()
export class ReservationsService implements IReservation {
  constructor(
    @InjectModel(Reservation.name)
    private reservationModel: Model<ReservationDocument>,
  ) {}

  async addReservation(data: ReservationDto): Promise<Reservation> {
    // Проверяем доступность номера на указанные даты
    const existingReservation = await this.reservationModel.findOne({
      roomId: data.roomId,
      $or: [
        { dateStart: { $lt: data.dateEnd, $gte: data.dateStart } },
        { dateEnd: { $gt: data.dateStart, $lte: data.dateEnd } },
      ],
    });

    if (existingReservation) {
      throw new HttpException(
        'Номер уже забронированн в выбранные даты',
        HttpStatus.BAD_REQUEST,
      );
    }

    const reservation = new this.reservationModel(data);
    return reservation.save();
  }

  async removeReservation(id: string): Promise<void> {
    await this.reservationModel.findByIdAndDelete(id);
  }

  async getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Reservation[]> {
    return this.reservationModel.find(filter);
  }
}
