import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hotel, HotelDocument } from './hotel.schema';
import { HotelRoom, HotelRoomDocument } from './hotel-room.schema';
import {
  IHotelService,
  SearchHotelParams,
  UpdateHotelParams,
} from './interfaces';

@Injectable()
export class HotelsService implements IHotelService {
  constructor(
    @InjectModel(Hotel.name) private hotelModel: Model<HotelDocument>,
    @InjectModel(HotelRoom.name)
    private hotelRoomModel: Model<HotelRoomDocument>,
  ) {}

  async create(data: Partial<Hotel>): Promise<HotelDocument> {
    const createdHotel = new this.hotelModel(data);
    return createdHotel.save();
  }

  async findById(id: string): Promise<HotelDocument> {
    return this.hotelModel.findById(id);
  }

  async search(params: SearchHotelParams): Promise<HotelDocument[]> {
    const { limit, offset, title } = params;
    const query: any = {};
    if (title) query.title = { $regex: title, $options: 'i' };
    return this.hotelModel
      .find(query)
      .limit(limit)
      .skip(offset)
      .select('-__v -createdAt -updatedAt');
  }

  async update(id: string, data: UpdateHotelParams): Promise<HotelDocument> {
    return this.hotelModel.findByIdAndUpdate(id, data, { new: true });
  }
}
