import { BadRequestException } from '@nestjs/common';
import { QueryHandler, IInferredQueryHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { FilterQueryBuilder } from '@ptc-org/nestjs-query-typeorm/src/query';
import { AppointmentEntity } from 'src/modules/Appointment/Appointment.entity';
import { AppointmentService } from 'src/modules/Appointment/Appointment.service';
import { Repository } from 'typeorm';
import { FindManyAppointmentQuery } from './appointment.cqrs.input';

@QueryHandler(FindManyAppointmentQuery)
export class FindManyAppointmentQueryHandler
  implements IInferredQueryHandler<FindManyAppointmentQuery>
{
  readonly filterQueryBuilder: FilterQueryBuilder<AppointmentEntity>;

  constructor(
    @InjectRepository(AppointmentEntity)
    readonly repo: Repository<AppointmentEntity>,
    readonly queryBus: QueryBus,
  ) {
    this.filterQueryBuilder = new FilterQueryBuilder<AppointmentEntity>(
      this.repo,
    );
  }

  async execute(
    command: FindManyAppointmentQuery,
  ): Promise<FindManyAppointmentQuery['resultType$f9fbca36']> {
    const { query, options } = command;
    const nullable = options?.nullable ?? false;
    const silence = options?.silence ?? false;
    const relation = options?.relation ?? true;

    try {
      const builder = this.filterQueryBuilder.select(query);
      const result = await builder.getMany();

      // check record
      if (!nullable && !result) {
        throw new Error('Appointment is not found!');
      }

      // result
      return { success: true, data: result };
    } catch (e) {
      if (!silence) throw new BadRequestException(e);
      return { success: false, message: e.message };
    }
  }
}
