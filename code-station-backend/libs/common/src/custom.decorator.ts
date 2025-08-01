/*
 * @Author: zwz
 * @Date: 2024-03-28 15:59:59
 * @LastEditors: zwz
 * @LastEditTime: 2024-03-28 16:57:32
 * @Description: 请填写简介
 */
import { SetMetadata } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const RequireLogin = () => SetMetadata('require-login', true);

export const UserInfo = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    if (!request.user) {
      return null;
    }
    return data ? request.user[data] : request.user;
  },
);
