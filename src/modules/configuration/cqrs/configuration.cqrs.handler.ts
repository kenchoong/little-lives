import { BadRequestException } from '@nestjs/common';
import { QueryHandler, IInferredQueryHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterQueryBuilder } from '@ptc-org/nestjs-query-typeorm/src/query';
import { Repository } from 'typeorm';
import { ConfigurationEntity } from '../configuration.entity';
import { ConfigurationService } from '../configuration.service';
import { FindOneConfigurationQuery } from './configuration.cqrs.input';

@QueryHandler(FindOneConfigurationQuery)
export class FindOneConfigurationQueryHandler
  implements IInferredQueryHandler<FindOneConfigurationQuery>
{
  readonly filterQueryBuilder: FilterQueryBuilder<ConfigurationEntity>;

  constructor(
    @InjectRepository(ConfigurationEntity)
    readonly repo: Repository<ConfigurationEntity>,
    readonly queryBus: QueryBus,
    readonly service: ConfigurationService,
  ) {
    this.filterQueryBuilder = new FilterQueryBuilder<ConfigurationEntity>(
      this.repo,
    );
  }

  async execute(
    command: FindOneConfigurationQuery,
  ): Promise<FindOneConfigurationQuery['resultType$f9fbca36']> {
    const { query, options } = command;
    const nullable = options?.nullable ?? false;
    const silence = options?.silence ?? false;
    const relation = options?.relation ?? true;

    try {
      const builder = this.filterQueryBuilder.select(query);
      const result = await builder.getOne();

      // check record
      if (!nullable && !result) {
        throw new Error('Configuration is not found!');
      }

      // result
      return { success: true, data: result };
    } catch (e) {
      if (!silence) throw new BadRequestException(e);
      return { success: false, message: e.message };
    }
  }
}
