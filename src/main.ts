import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT ?? 3000;
  const domain = process.env.DOMAIN || 'localhost';

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
