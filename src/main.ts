import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    allowedHeaders: '*',
  });

  const config = app.get<ConfigService>(ConfigService);
  const port = config.get('appointment.port') || 3339;
  await app.listen(port, '0.0.0.0');

  Logger.log(
    `🚀 GGCG Appointment service is running on: http://localhost:${port}}`,
  );
}
bootstrap();
