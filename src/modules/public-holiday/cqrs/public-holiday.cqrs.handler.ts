import { BadRequestException } from '@nestjs/common';
import { QueryHandler, IInferredQueryHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterQueryBuilder } from '@ptc-org/nestjs-query-typeorm/src/query';
import { Repository } from 'typeorm';
import { PublicHolidayEntity } from '../public-holiday.entity';
import { PublicHolidayService } from '../public-holiday.service';
import { FindOnePublicHolidayQuery } from './public-holiday.cqrs.input';

@QueryHandler(FindOnePublicHolidayQuery)
export class FindOnePublicHolidayQueryHandler
  implements IInferredQueryHandler<FindOnePublicHolidayQuery>
{
  readonly filterQueryBuilder: FilterQueryBuilder<PublicHolidayEntity>;

  constructor(
    @InjectRepository(PublicHolidayEntity)
    readonly repo: Repository<PublicHolidayEntity>,
    readonly queryBus: QueryBus,
    readonly service: PublicHolidayService,
  ) {
    this.filterQueryBuilder = new FilterQueryBuilder<PublicHolidayEntity>(
      this.repo,
    );
  }

  async execute(
    command: FindOnePublicHolidayQuery,
  ): Promise<FindOnePublicHolidayQuery['resultType$f9fbca36']> {
    const { query, options } = command;
    const nullable = options?.nullable ?? false;
    const silence = options?.silence ?? false;
    const relation = options?.relation ?? true;

    try {
      const builder = this.filterQueryBuilder.select(query);
      const result = await builder.getOne();

      // check record
      if (!nullable && !result) {
        throw new Error('PublicHoliday is not found!');
      }

      // result
      return { success: true, data: result };
    } catch (e) {
      if (!silence) throw new BadRequestException(e);
      return { success: false, message: e.message };
    }
  }
}
