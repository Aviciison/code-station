/*
 * @Author: zwz
 * @Date: 2024-04-28 14:29:23
 * @LastEditors: zwz
 * @LastEditTime: 2024-04-28 14:32:00
 * @Description: 请填写简介
 */

import { refreshToken } from '@/services/user/index';
import { message } from 'antd';
import axios, { AxiosResponse } from 'axios';
import { getToken } from './user-token';

const instance = axios.create({
  timeout: 10 * 1000,
  baseURL: '/api/chat',
});

export type ResType = {
  code: number;
  data: ResDataType;
  message?: string;
};

export type ResDataType = {
  [key: string]: any;
};

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = `Bearer ${getToken().accToken}`; // jwt 固定格式
    return config;
  },
  (error) => Promise.reject(error),
);

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data.data;
  },
  async (error) => {
    if (!error.response) {
      message.error('网络繁忙，请稍后再试');
    }
    let { data, config } = error.response;

    if (data.code === 401 && config.url.includes('/user/refresh')) {
      message.error('请重新登录');
      setTimeout(() => {
        // navigate('/login')
        window.location.href = '/login';
      }, 1000);
      return Promise.reject(error);
    }
    if (data.code === 401) {
      try {
        const refresh_token = localStorage.getItem('refresh_token');
        if (!refresh_token) {
          // 本地未获取reftoken 直接跳转到登录页面
          message.error('请重新登录');
          setTimeout(() => {
            window.location.href = '/login';
          }, 1000);
          return Promise.reject(error);
        }
        // 获取reftoken 重新请求刷新token
        await refreshToken();
        return instance(config);
      } catch (error) {
        // 获取reftoken的报错信息， 重新登录
        // 清除token
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        message.error('请重新登录');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
        return Promise.reject(error);
      }
    }
    message.error(error.response.data.message || '系统忙');
    return Promise.reject(error.response);
  },
);

export default instance;
