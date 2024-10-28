import { NestFactory } from '@nestjs/core';

import { OrderModule } from './order/order.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderModule);

  app.enableCors({
    origin: 'http://localhost:3001',
  });
  await app.listen(8000);
}
bootstrap();
