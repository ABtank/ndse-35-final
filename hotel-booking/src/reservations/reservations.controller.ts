import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  Query,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationDto, ReservationSearchOptions } from './interfaces';
import { Reservation } from './reservation.schema';
import { RolesGuard } from 'src/common/guards/roles.guard';

@UseGuards(new RolesGuard(['client']))
@Controller('api/client/reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  async addReservation(@Body() data: ReservationDto): Promise<Reservation> {
    return this.reservationsService.addReservation(data);
  }

  @Delete(':id')
  async removeReservation(@Param('id') id: string): Promise<void> {
    return this.reservationsService.removeReservation(id);
  }

  @Get()
  async getReservations(
    @Query() filter: ReservationSearchOptions,
  ): Promise<Reservation[]> {
    return this.reservationsService.getReservations(filter);
  }
}

@UseGuards(new RolesGuard(['manager']))
@Controller('api/manager/reservations')
export class ReservationsManagerController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  async addReservation(@Body() data: ReservationDto): Promise<Reservation> {
    return this.reservationsService.addReservation(data);
  }

  @Delete(':id')
  async removeReservation(@Param('id') id: string): Promise<void> {
    return this.reservationsService.removeReservation(id);
  }

  @Get()
  async getReservations(
    @Query() filter: ReservationSearchOptions,
  ): Promise<Reservation[]> {
    return this.reservationsService.getReservations(filter);
  }
}
