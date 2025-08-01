/*
 * @Author: zwz
 * @Date: 2024-03-28 14:48:59
 * @LastEditors: zwz
 * @LastEditTime: 2024-03-28 14:50:02
 * @Description: 请填写简介
 */
import { IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;
}

export class wenLoginUserDto {
  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;

  @IsNotEmpty({
    message: '密码不能为空',
  })
  password: string;
}

export class getUserInfoDto {
  @IsNotEmpty({
    message: 'id不能为空',
  })
  id: number;
}

export class updateUserInfoDto {
  @IsNotEmpty({
    message: '用户id不能为空',
  })
  id: number;

  @IsNotEmpty({
    message: '用户名不能为空',
  })
  username: string;

  @IsNotEmpty({
    message: '邮箱不能为空',
  })
  email: string;

  @IsNotEmpty({
    message: '头像不能为空',
  })
  headPic: string;

  personalProfile?: string;
}
