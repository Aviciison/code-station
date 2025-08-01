/*
 * @Author: zwz
 * @Date: 2024-04-01 21:07:29
 * @LastEditors: zwz
 * @LastEditTime: 2024-04-30 14:33:40
 * @Description: 请填写简介
 */
import instance from '@/utils/request';
import { setToken } from '../../utils/user-token';
import {
  loginResponse,
  loginType,
  registerType,
  userInfoType,
} from './userType';

// 登录接口
export const loginService = async (data: loginType): Promise<loginResponse> => {
  return await instance.post('user/login', {
    ...data,
  });
};

// 刷新token
export const refreshToken = async () => {
  const res: { access_token: string; refresh_token: string } =
    await instance.get('user/refresh', {
      params: {
        refreshToken: localStorage.getItem('refresh_token'),
      },
    });
  setToken(res.access_token, res.refresh_token);
  return res;
};

// 注册接口
export const register = async (data: registerType) => {
  return await instance.post('user/register', {
    ...data,
  });
};

// 获取用户信息接口
export const getUserInfo = async (data: {
  id: number;
}): Promise<userInfoType> => {
  return await instance.post('user/userInfo', data);
};

// 更新用户信息接口
export const updateUserInfo = async (
  data: userInfoType,
): Promise<userInfoType> => {
  return await instance.post('user/updateUserInfo', data);
};
