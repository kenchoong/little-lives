import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { AppointmentEntity } from './appointment.entity';
import { CommandHandlers, QueryHandlers, EventHandlers } from './cqrs';

@Module({
  imports: [
    TypeOrmModule.forFeature([AppointmentEntity]), // Register AppointmentEntity here
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([AppointmentEntity])],
    }),
    CqrsModule,
  ],
  providers: [
    ...EventHandlers,
    ...CommandHandlers,
    ...QueryHandlers,
    AppointmentService,
  ],
  controllers: [AppointmentController],
})
export class AppointmentModule {}
