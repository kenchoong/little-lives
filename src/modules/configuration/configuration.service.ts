import { DeepPartial, Repository } from 'typeorm';
import { QueryBus, CommandBus } from '@nestjs/cqrs';
import { Filter } from '@ptc-org/nestjs-query-core';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { FilterQueryBuilder } from '@ptc-org/nestjs-query-typeorm/src/query';
import { InjectQueryService, QueryService } from '@ptc-org/nestjs-query-core';
import { ConfigurationEntity } from './configuration.entity';

@Injectable()
export class ConfigurationService {
  private readonly filterQueryBuilder: FilterQueryBuilder<ConfigurationEntity>;
  constructor(
    @InjectRepository(ConfigurationEntity)
    private readonly ConfigurationRepository: Repository<ConfigurationEntity>,

    @InjectQueryService(ConfigurationEntity)
    private readonly service: QueryService<ConfigurationEntity>,
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {
    this.filterQueryBuilder = new FilterQueryBuilder<ConfigurationEntity>(
      this.ConfigurationRepository,
    );
  }
}
