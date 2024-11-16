import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { CoreConfigModule, ConfigEnvironmentType as ENV } from './config';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { ConfigurationModule } from './modules/configuration/configuration.module';
import { PublicHolidayModule } from './modules/public-holiday/public-holiday.module';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forRootAsync({
      imports: [CoreConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ENV>) => {
        const isEnvTest = configService.get('environment') === 'test';
        const config = configService.get<ENV['appointment']>('appointment');
        const database = !isEnvTest ? config.database : config.testing.database;

        return {
          type: 'postgres',
          host: database.host,
          port: database.port ?? 5432,
          username: database.username,
          password: database.password,
          database: database.database,
          ssl: database.ssl
            ? {
                rejectUnauthorized: false,
                ca: database.ssl,
              }
            : false,
          migrations: [`${__dirname}/migrations/*.js`],
          // migrationsRun: true,
          synchronize: true,
          namingStrategy: new SnakeNamingStrategy(),
          logging: database.logging,
          autoLoadEntities: true,
          keepConnectionAlive: true,
        };
      },
    }),
    AppointmentModule,
    PublicHolidayModule,
    ConfigurationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
