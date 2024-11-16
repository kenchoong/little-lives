import { DeepPartial, Repository } from 'typeorm';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { Filter } from '@ptc-org/nestjs-query-core';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { FilterQueryBuilder } from '@ptc-org/nestjs-query-typeorm/src/query';
import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { PublicHolidayEntity } from './public-holiday.entity';

@Injectable()
export class PublicHolidayService {
  private readonly filterQueryBuilder: FilterQueryBuilder<PublicHolidayEntity>;
  constructor(
    @InjectRepository(PublicHolidayEntity)
    private readonly PublicHolidayRepository: Repository<PublicHolidayEntity>,

    @InjectQueryService(PublicHolidayEntity)
    private readonly service: QueryService<PublicHolidayEntity>,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {
    this.filterQueryBuilder = new FilterQueryBuilder<PublicHolidayEntity>(
      this.PublicHolidayRepository,
    );
  }
}
