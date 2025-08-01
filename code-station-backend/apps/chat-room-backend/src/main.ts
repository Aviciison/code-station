import { NestFactory } from '@nestjs/core';
import { ChatRoomBackendModule } from './chat-room-backend.module';
import {
  CustomExceptionFilte,
  FormatResponseInterceptor,
  UnloginFilter,
} from '@app/common';
// import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(ChatRoomBackendModule);

  // app.connectMicroservice({
  //   transport: Transport.TCP,
  //   options: {
  //     port: 8888,
  //   },
  // });
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalFilters(new CustomExceptionFilte());
  app.useGlobalFilters(new UnloginFilter());
  app.enableCors();
  await app.listen(3000, () => {
    console.log('chatroom-服务已经启动');
  });
}
bootstrap();
