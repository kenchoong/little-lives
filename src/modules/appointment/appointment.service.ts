import { Repository } from 'typeorm';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { AppointmentEntity } from './appointment.entity';
import { FilterQueryBuilder } from '@ptc-org/nestjs-query-typeorm/src/query';
import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { AppointmentCreateInput } from './dto/appointment.input';
import { FindOneConfigurationQuery } from '../configuration/cqrs/configuration.cqrs.input';
import { FindOnePublicHolidayQuery } from '../public-holiday/cqrs/public-holiday.cqrs.input';
import { ConfigService } from '@nestjs/config';
import { FindManyAppointmentQuery } from './cqrs/appointment.cqrs.input';
import * as dayjs from 'dayjs';
import { UnavailableHour } from '../configuration/configuration.entity';

@Injectable()
export class AppointmentService {
  private readonly filterQueryBuilder: FilterQueryBuilder<AppointmentEntity>;
  constructor(
    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepository: Repository<AppointmentEntity>,

    @InjectQueryService(AppointmentEntity)
    private readonly service: QueryService<AppointmentEntity>,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,

    private readonly configService: ConfigService,
  ) {
    this.filterQueryBuilder = new FilterQueryBuilder<AppointmentEntity>(
      this.appointmentRepository,
    );
  }

  getConfig() {
    const eachSlotDuration =
      this.configService.get<number>('EACH_SLOT_DURATION');
    const appointmentAmountPerSlot = this.configService.get<number>(
      'APPOINTMENT_AMOUNT_PER_SLOT',
    );

    return { eachSlotDuration, appointmentAmountPerSlot };
  }

  generateAvailableSlots(input: {
    selectedDate: string;
    startTime: string;
    endTime: string;
    eachSlotDuration: number | string;
    appointmentAmountPerSlot: number | string;
    unavailableHours?: UnavailableHour[];
    existingAppointments?: AppointmentEntity[];
  }) {
    const {
      selectedDate,
      startTime,
      endTime,
      eachSlotDuration,
      appointmentAmountPerSlot,
      unavailableHours = [], // Default to an empty array if not provide
      existingAppointments = [], // Default to an empty array if not provide
    } = input;

    // Convert string numbers to integers
    const slotDuration = parseInt(eachSlotDuration as string, 10);
    const amountPerSlot = parseInt(appointmentAmountPerSlot as string, 10);

    const slots = [];

    // Ensure selectedDate is valid
    if (selectedDate === 'Invalid Date') {
      console.error('selectedDate is invalid');
      return slots;
    }

    // Parse the selected date
    const [day, month, year] = selectedDate.split('-').map(Number);

    // Parse start and end times
    const [startHour, startMinute = 0] = startTime.split(':').map(Number);
    const [endHour, endMinute = 0] = endTime.split(':').map(Number);

    // Create Date objects for start and end times
    let slotTime = new Date(year, month - 1, day, startHour, startMinute);
    const endSlotTime = new Date(year, month - 1, day, endHour, endMinute);

    // Generate slots
    while (slotTime < endSlotTime) {
      const timeString = slotTime.toTimeString().slice(0, 5); // Extract HH:MM

      // Check if the current time is within any unavailable range
      const isUnavailable = unavailableHours.some(({ from, to }) => {
        const [fromHour, fromMinute = 0] = from.split(':').map(Number);
        const [toHour, toMinute = 0] = to.split(':').map(Number);

        const fromTime = new Date(year, month - 1, day, fromHour, fromMinute);
        const toTime = new Date(year, month - 1, day, toHour, toMinute);

        return slotTime >= fromTime && slotTime < toTime;
      });

      // Check if the current slot has an existing appointment
      const matchingAppointment = existingAppointments.find(
        (appointment) => appointment.time === timeString,
      );

      // Calculate available slots
      const availableSlots = isUnavailable
        ? 0
        : amountPerSlot - (matchingAppointment ? 1 : 0);

      // Add slot if it is not unavailable
      if (!isUnavailable) {
        slots.push({
          date: selectedDate,
          time: timeString,
          available_slots: Math.max(availableSlots, 0),
        });
      }

      // Increment the slotTime by the slot duration in minutes
      slotTime = new Date(slotTime.getTime() + slotDuration * 60000);
    }

    return slots;
  }

  convertDate(inputDate: string): string {
    // Split the input date string into day, month, and year
    const [day, month, year] = inputDate.split('-').map(Number);

    // Create a new Date object (month is zero-indexed)
    const date = new Date(year, month - 1, day);

    // Format the date to YYYY-MM-DD
    const formattedDate = date.toISOString().split('T')[0]; // Extract only the date part
    return formattedDate;
  }

  async getAvailableSlots(date: string) {
    try {
      const { eachSlotDuration, appointmentAmountPerSlot } = this.getConfig();

      // check the public holidays
      const { data: publicHoliday } = await this.queryBus.execute(
        new FindOnePublicHolidayQuery(
          { filter: { holiday_date: { eq: date } } },
          { nullable: true },
        ),
      );

      if (publicHoliday) {
        throw new Error('Selected date a public holiday');
      }

      // this day is what day of the week it is
      const formattedDate = this.convertDate(date);
      const dayIndex = dayjs(formattedDate).day();

      // check configuration for the start time and end time
      const { data: configuration } = await this.queryBus.execute(
        new FindOneConfigurationQuery(
          { filter: { operation_day: { eq: dayIndex } } },
          { nullable: true },
        ),
      );

      if (!configuration) {
        throw new Error('Configuration not found, means no operation');
      }

      // query the appointments for the date
      const { data: appointments } = await this.queryBus.execute(
        new FindManyAppointmentQuery(
          { filter: { date: { eq: date } } },
          { nullable: true },
        ),
      );

      // generate the available slots based on the configuration
      const availableSlots = this.generateAvailableSlots({
        selectedDate: date,
        startTime: configuration.operation_start_time,
        endTime: configuration.operation_end_time,
        eachSlotDuration,
        appointmentAmountPerSlot,
        existingAppointments: appointments,
        unavailableHours: configuration.unavailable_hours,
      });

      return availableSlots;
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  async createAppointment(input: AppointmentCreateInput) {
    try {
      const { appointmentAmountPerSlot } = this.getConfig();

      const { data: appointment } = await this.queryBus.execute(
        new FindManyAppointmentQuery({ filter: { date: { eq: input.date } } }),
      );

      // check if the appointment is full
      if (appointment.length >= appointmentAmountPerSlot) {
        throw new Error('Appointment is full');
      }

      return this.service.createOne(input);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
