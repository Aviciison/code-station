/*
 * @Author: zwz
 * @Date: 2024-04-30 10:14:01
 * @LastEditors: zwz
 * @LastEditTime: 2024-04-30 14:37:53
 * @Description: 请填写简介
 */
import axios from "axios";
import { getToken } from './user-token'
import {refreshToken} from '@/api/user'

const httpInstance = axios.create({
  baseURL: '',
  timeout: 5000
})

httpInstance.interceptors.request.use((config) => {
  config.headers['Authorization'] = `Bearer ${getToken().accToken}` // jwt 固定格式
  return config
}, (error) => {
  return Promise.reject(error)
})

httpInstance.interceptors.response.use((response) => {
  return response.data.data
}, async (error) => {
  if (!error.response) {
    ElMessage.error('网络繁忙，请稍后再试')
  }
  let { data, config } = error.response;
  if (data.code === 401 && config.url.includes('/user/refresh')) {
    ElMessage.error('请重新登录')
    setTimeout(() => {
      // navigate('/login')
      window.location.href = '/login';
    }, 1000);
    return Promise.reject(error);
  }
  if (data.code === 401) {
    try {
      const refresh_token = localStorage.getItem('refresh_token')
      if (!refresh_token) {
        // 本地未获取reftoken 直接跳转到登录页面
        ElMessage.error('请重新登录')
        setTimeout(() => {
          // navigate('/login')
          window.location.href = '/login';
        }, 1000);
        return Promise.reject(error);
      }
      // 获取reftoken 重新请求刷新token
      refreshToken().then(res => {
        if (res.status === 200 || res.status === 201) {
          return instance(config);
        }
      }).catch((err) => {
        console.log(err, ' err');
      })
      const res = await refreshToken()

      console.log(res);
      if (res.status === 200 || res.status === 201) {
        return instance(config);
      }
    } catch (error) {
      // 获取reftoken的报错信息， 重新登录
      // 清除token
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      ElMessage.error('请重新登录')
      setTimeout(() => {
        // navigate('/login')
        window.location.href = '/login';
      }, 1000);
      return Promise.reject(error);
    }
  }
  ElMessage.error(error.response.data.message || '系统忙')
  return Promise.reject(error.response);
})


export default httpInstance