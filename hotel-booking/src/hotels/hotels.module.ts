import { Module } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { HotelRoomsController, HotelsController } from './hotels.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { HotelRoom, HotelRoomSchema } from './hotel-room.schema';
import { HotelRoomsService } from './hotel-rooms.service';
import { Hotel, HotelSchema } from './hotel.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hotel.name, schema: HotelSchema }]),
    MongooseModule.forFeature([
      { name: HotelRoom.name, schema: HotelRoomSchema },
    ]),
  ],
  controllers: [HotelsController, HotelRoomsController],
  providers: [HotelsService, HotelRoomsService],
})
export class HotelsModule {}
