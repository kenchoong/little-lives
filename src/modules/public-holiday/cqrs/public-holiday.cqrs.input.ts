// ===========================
// Query
import { Query as TypeQuery } from '@nestjs-architects/typed-cqrs';
import { Query } from '@ptc-org/nestjs-query-core';
import { PublicHolidayEntity } from '../public-holiday.entity';
import { RecordResponseProps, RecordQueryOptions } from 'nestjs-typed-cqrs';

// ===========================
export class FindOnePublicHolidayQuery extends TypeQuery<
  RecordResponseProps<PublicHolidayEntity>
> {
  constructor(
    readonly query: Query<PublicHolidayEntity>,
    readonly options?: RecordQueryOptions,
  ) {
    super();
  }
}
