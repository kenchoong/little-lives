import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import { AppointmentService } from './appointment.service';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import { AppointmentCreateInput } from './dto/appointment.input';
import { ParseDatePipe } from './dto/validate-date';

dayjs.extend(utc);

@ApiTags('Appointment')
@Controller('appointment')
export class AppointmentController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly service: AppointmentService,
  ) {}

  @Get('/available-slot/:date')
  getAppointment(@Param('date') date: string) {
    return this.service.getAvailableSlots(date);
  }

  @Post('/create')
  createAppointment(@Body() input: AppointmentCreateInput) {
    return this.service.createAppointment(input);
  }
}
