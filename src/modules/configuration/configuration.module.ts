import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import {
  NestjsQueryGraphQLModule,
  PagingStrategies,
} from '@ptc-org/nestjs-query-graphql';
import { NestjsQueryTypeOrmModule } from '@ptc-org/nestjs-query-typeorm';
import { ConfigurationController } from './configuration.controller';
import { ConfigurationEntity } from './configuration.entity';
import { ConfigurationService } from './configuration.service';
import { CommandHandlers, EventHandlers, QueryHandlers } from './cqrs';

@Module({
  imports: [
    TypeOrmModule.forFeature([ConfigurationEntity]),
    NestjsQueryGraphQLModule.forFeature({
      imports: [NestjsQueryTypeOrmModule.forFeature([ConfigurationEntity])],
    }),
    CqrsModule,
  ],
  providers: [
    ...EventHandlers,
    ...CommandHandlers,
    ...QueryHandlers,
    ConfigurationService,
  ],
  controllers: [ConfigurationController],
  exports: [ConfigurationService],
})
export class ConfigurationModule {}
