import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HotelRoom, HotelRoomDocument } from './hotel-room.schema';
import { IHotelRoomService, SearchRoomsParams } from './interfaces';

@Injectable()
export class HotelRoomsService implements IHotelRoomService {
  constructor(
    @InjectModel(HotelRoom.name)
    private hotelRoomModel: Model<HotelRoomDocument>,
  ) {}

  async create(data: Partial<HotelRoom>): Promise<HotelRoomDocument> {
    console.log(data);
    const createdRoom = new this.hotelRoomModel(data);
    return (await createdRoom.populate('hotel')).save(); // это для загрузки данных гостиницы
  }

  async findById(id: string): Promise<HotelRoomDocument> {
    return this.hotelRoomModel.findById(id);
  }

  async search(params: SearchRoomsParams): Promise<HotelRoomDocument[]> {
    const { limit, offset, hotel, isEnabled } = params;

    const query: any = {};
    if (hotel) query.hotel = hotel;
    if (typeof isEnabled === 'boolean') {
      query.isEnabled = isEnabled;
    }

    return this.hotelRoomModel
      .find(query)
      .limit(limit)
      .skip(offset)
      .select('-__v -createdAt -updatedAt')
      .exec();
  }

  async update(
    id: string,
    data: Partial<HotelRoom>,
  ): Promise<HotelRoomDocument> {
    return this.hotelRoomModel.findByIdAndUpdate(id, data, { new: true });
  }
}
