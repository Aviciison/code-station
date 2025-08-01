import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
// import { FormatResponseInterceptor } from './format-response.interceptor';
import { InvokeRecordInterceptor } from './invoke-record.interceptor';
import {
  CustomExceptionFilte,
  FormatResponseInterceptor,
  UnloginFilter,
} from '@app/common';
import { WINSTON_LOGGER_TOKEN } from './winston/winston.module';
import { Transport } from '@nestjs/microservices';
// import * as csurf from 'csurf';

async function bootstrap() {
  const logger: Logger = new Logger('main.ts');
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // transform 为true是自动将js对象转化为dto对象
    }),
  );
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());
  app.useGlobalFilters(new CustomExceptionFilte());
  app.useGlobalFilters(new UnloginFilter());
  app.enableCors();
  // app.use(csurf());
  app.useLogger(app.get(WINSTON_LOGGER_TOKEN)); // winston 日志打印
  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: 9999,
    },
  });
  app.startAllMicroservices();
  await app.listen(configService.get('nest_server_port'), () => {
    logger.log('服务器已经启动 ------------------');
  });
}
bootstrap();
