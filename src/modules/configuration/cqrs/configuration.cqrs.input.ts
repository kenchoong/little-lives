// ===========================
// Query
import { Query as TypeQuery } from '@nestjs-architects/typed-cqrs';
import { Query } from '@ptc-org/nestjs-query-core';
import { RecordResponseProps, RecordQueryOptions } from 'nestjs-typed-cqrs';
import { ConfigurationEntity } from '../configuration.entity';

// ===========================
export class FindOneConfigurationQuery extends TypeQuery<
  RecordResponseProps<ConfigurationEntity>
> {
  constructor(
    readonly query: Query<ConfigurationEntity>,
    readonly options?: RecordQueryOptions,
  ) {
    super();
  }
}
