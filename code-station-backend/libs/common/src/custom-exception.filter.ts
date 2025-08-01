/*
 * @Author: zwz
 * @Date: 2023-12-21 14:05:40
 * @LastEditors: zwz
 * @LastEditTime: 2023-12-21 15:04:44
 * @Description: 请填写简介
 */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class CustomExceptionFilte implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    response.statusCode = exception.getStatus();

    const res = exception.getResponse() as { message: string[] };

    response
      .json({
        code: exception.getStatus(),
        message: res?.message?.join
          ? res?.message?.join(',')
          : exception.message,
        data: res?.message?.join ? res?.message?.join(',') : exception.message,
      })
      .end();
  }
}
