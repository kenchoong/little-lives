import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import { PublicHolidayService } from './public-holiday.service';

dayjs.extend(utc);

@ApiTags('public-holiday')
@Controller('public-holiday')
export class PublicHolidayController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly service: PublicHolidayService,
  ) {}
}
