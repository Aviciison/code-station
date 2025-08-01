/*
 * @Author: zwz
 * @Date: 2024-04-01 16:25:45
 * @LastEditors: zwz
 * @LastEditTime: 2024-04-28 14:30:06
 * @Description: 设置token
 */

const accToken = 'access_token'
const refToken = 'refresh_token'




export const setToken = (token: string, refsToken: string) => {
  localStorage.setItem(accToken, token)
  localStorage.setItem(refToken, refsToken)
}

export const getToken = () => {
  return {
    accToken: localStorage.getItem(accToken) || '',
    refToken: localStorage.getItem(refToken) || '',
  }
}

export const removeToken = () => {
  localStorage.removeItem(accToken)
  localStorage.removeItem(refToken)
}
