/*
 * @Author: zwz
 * @Date: 2024-7-3 14:05:40
 * @LastEditors: zwz
 * @LastEditTime: 2024-7-3 14:05:40
 * @Description: 每个ip地址限制访问次数，自定义报错信息
 */

import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
// import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  errorMessage = '请求频繁，请稍后再试';
}
