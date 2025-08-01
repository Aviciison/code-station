import {defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
  // 定义用户的信息
  const userInfo = ref(JSON.parse(localStorage.getItem('userInfo')) ? JSON.parse(localStorage.getItem('userInfo')) : {})
  // 存储用户信息
  const setUserInfo = (info) => {
    console.log(info);
     userInfo.value = info
     localStorage.setItem('userInfo', JSON.stringify(info))
  }

  return {
    userInfo,
    setUserInfo
  }
})