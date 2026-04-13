import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT ?? 3000;
  const domain = process.env.DOMAIN || 'localhost';

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Street Racing API')
    .setDescription('Backend API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document);

  const publicPath = join(process.cwd(), 'public');

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  app.useStaticAssets(publicPath, {
    prefix: '/',
  });

  await app.listen(port);
  console.log(`Server running on http://${domain}:${port}`);
}
bootstrap();
