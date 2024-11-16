import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { PublicHolidayEntity } from './public-holiday.entity';
import { CommandHandlers, EventHandlers, QueryHandlers } from './cqrs';
import { PublicHolidayController } from './public-holiday.controller';
import { PublicHolidayService } from './public-holiday.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([PublicHolidayEntity]), // Register PublicHolidayEntity here
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([PublicHolidayEntity])],
    }),
    CqrsModule,
  ],
  providers: [
    ...EventHandlers,
    ...CommandHandlers,
    ...QueryHandlers,
    PublicHolidayService,
  ],
  controllers: [PublicHolidayController],
  exports: [PublicHolidayService],
})
export class PublicHolidayModule {}
