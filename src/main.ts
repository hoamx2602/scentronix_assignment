import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const configService = app.get(ConfigService);
  const maxBody = configService.get<string>('MAX_BODY_PARSER');

  app.use(bodyParser.json({ limit: maxBody }));
  app.use(bodyParser.urlencoded({ limit: maxBody, extended: true }));

  const environment = configService.get<string>('NODE_ENV');
  if (['dev', 'staging'].includes(environment)) {
    const config = new DocumentBuilder()
      .setTitle('System Monitoring')
      .setDescription('API description')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(configService.get<number>('PORT'));
}
bootstrap();
