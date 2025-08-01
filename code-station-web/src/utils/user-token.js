/*
 * @Author: zwz
 * @Date: 2024-04-30 10:27:38
 * @LastEditors: zwz
 * @LastEditTime: 2024-04-30 10:27:39
 * @Description: 请填写简介
 */
const accToken = 'access_token'
const refToken = 'refresh_token'

export const setToken = (token, refsToken) => {
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