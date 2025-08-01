import { DynamicModule, Global, Module } from '@nestjs/common';
import { LoggerOptions, createLogger } from 'winston';
import { MyLogger } from './MyLogger';

export const WINSTON_LOGGER_TOKEN = 'WINSTON_LOGGER';

@Global()
@Module({})
export class WinstonModule {
  public static forRoot(options: LoggerOptions): DynamicModule {
    return {
      module: WinstonModule,
      providers: [
        {
          provide: WINSTON_LOGGER_TOKEN, // 指定一个标识符（通常是一个字符串或一个类）来表示要注入的依赖项。
          useValue: new MyLogger(options), // 用useValue 创建对象 logger 对象作为 provider
        },
      ],
      exports: [WINSTON_LOGGER_TOKEN],
    };
  }
}
