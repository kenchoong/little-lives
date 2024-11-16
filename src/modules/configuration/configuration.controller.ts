import { Controller } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiTags } from '@nestjs/swagger';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

@ApiTags('Configuration')
@Controller('configuration')
export class ConfigurationController {
  constructor(private readonly commandBus: CommandBus) {}
}
