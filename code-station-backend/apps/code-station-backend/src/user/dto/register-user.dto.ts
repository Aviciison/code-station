/*
 * @Author: zwz
 * @Date: 2024-03-28 10:55:56
 * @LastEditors: zwz
 * @LastEditTime: 2024-03-28 14:00:49
 * @Description: 请填写简介
 */

import { IsNotEmpty } from 'class-validator';

export class RegisterUserDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;

  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  email: string;
}

export class webRegisterUserDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;

  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  email: string;
}
