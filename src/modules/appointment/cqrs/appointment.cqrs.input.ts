// ===========================
// Query
import { Query as TypeQuery } from '@nestjs-architects/typed-cqrs';
import { Query } from '@ptc-org/nestjs-query-core';
import { RecordResponseProps, RecordQueryOptions } from 'nestjs-typed-cqrs';
import { AppointmentEntity } from '../appointment.entity';

// ===========================
export class FindManyAppointmentQuery extends TypeQuery<
  RecordResponseProps<AppointmentEntity[]>
> {
  constructor(
    readonly query: Query<AppointmentEntity>,
    readonly options?: RecordQueryOptions,
  ) {
    super();
  }
}
