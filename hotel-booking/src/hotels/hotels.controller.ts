import { Controller, Post, Get, Put, Body, Param, Query } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { HotelRoomsService } from './hotel-rooms.service';
import {
  SearchHotelParams,
  UpdateHotelParams,
  SearchRoomsParams,
} from './interfaces';
import { Hotel } from './hotel.schema';
import { HotelRoom } from './hotel-room.schema';

// @UseGuards(new RolesGuard(['admin']))
@Controller('api/admin/hotels')
export class HotelsController {
  constructor(private readonly hotelsService: HotelsService) {}

  @Post()
  async create(@Body() data: Partial<Hotel>): Promise<any> {
    const hotel = await this.hotelsService.create(data);
    return {
      id: hotel._id,
      title: hotel.title,
      description: hotel.description,
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<any> {
    const hotel = await this.hotelsService.findById(id);
    return {
      id: hotel._id,
      title: hotel.title,
      description: hotel.description,
    };
  }

  @Get()
  async search(@Query() params: SearchHotelParams): Promise<any> {
    const hotels = await this.hotelsService.search(params);
    return hotels.map((hotel) => ({
      id: hotel._id,
      title: hotel.title,
      description: hotel.description,
    }));
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: UpdateHotelParams,
  ): Promise<any> {
    const hotel = await this.hotelsService.update(id, data);
    return {
      id: hotel._id,
      title: hotel.title,
      description: hotel.description,
    };
  }
}

// Контроллер для управления комнатами
// @UseGuards(new RolesGuard(['admin']))
@Controller('api/admin/hotel-rooms')
export class HotelRoomsController {
  constructor(private readonly hotelRoomsService: HotelRoomsService) {}

  @Post()
  async create(@Body() data: Partial<HotelRoom>): Promise<any> {
    const room = await this.hotelRoomsService.create(data);
    return {
      id: room._id,
      description: room.description,
      images: room.images,
      isEnabled: room.isEnabled,
      hotel: room.hotel,
    };
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<any> {
    const room = await this.hotelRoomsService.findById(id);
    return {
      id: room._id,
      description: room.description,
      images: room.images,
      isEnabled: room.isEnabled,
      hotel: room.hotel,
    };
  }

  @Get()
  async search(@Query() params: SearchRoomsParams): Promise<any> {
    console.log('ssssss');
    const rooms = await this.hotelRoomsService.search(params);
    return Promise.all(rooms.map((room) => room.populate('hotel'))); // Заполняем данные гостиницы
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() data: Partial<HotelRoom>,
  ): Promise<any> {
    const room = await this.hotelRoomsService.update(id, data);
    return {
      id: room._id,
      description: room.description,
      images: room.images,
      isEnabled: room.isEnabled,
      hotel: room.hotel,
    };
  }
}
