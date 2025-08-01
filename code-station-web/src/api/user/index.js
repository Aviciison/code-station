/*
 * @Author: zwz
 * @Date: 2024-04-30 14:20:36
 * @LastEditors: zwz
 * @LastEditTime: 2024-04-30 14:34:43
 * @Description: 请填写简介
 */
import httpInstance from '@/utils/http'

// 登录接口
export const loginService = async (data) => {
  return await httpInstance.post('/api/user/webLogin', {
    ...data
  })
}

// 刷新token
export const refreshToken = async () => {
  const res = await httpInstance.get('/api/user/webRefresh', {
    params: {
      refreshToken: localStorage.getItem('refresh_token')
    }
  })
  setToken(res.data.data.access_token, res.data.data.refresh_token)
  return res;
}

// 注册接口
export const register = async (data) => {
  return await httpInstance.post('/api/user/webRegister', {
    ...data
  })
}