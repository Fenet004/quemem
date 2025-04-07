import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  
  const config = new DocumentBuilder()
    .setTitle('QuememFormation API')
    .setDescription('API documentation for QuememFormation project')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document= SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
