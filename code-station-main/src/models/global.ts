/*
 * @Author: zwz
 * @Date: 2024-04-28 09:21:18
 * @LastEditors: zwz
 * @LastEditTime: 2024-04-29 15:42:36
 * @Description: 请填写简介
 */
// 全局共享数据示例
export type UserStateType = {
  username: string;
  headPic?: string;
  email: string;
  id: number | null;
  personalProfile?: string;
};

const INIT_STATE: UserStateType = {
  username: '',
  headPic: '',
  email: '',
  id: null,
  personalProfile: '',
};

import { useEffect, useState } from 'react';

export default function Page() {
  const [userInfo, setUserInfo] = useState<UserStateType>(INIT_STATE);
  useEffect(() => {
    if (localStorage.getItem('userInfo')) {
      setUserInfo({
        username: JSON.parse(localStorage.getItem('userInfo') as string)
          .username,
        headPic: JSON.parse(localStorage.getItem('userInfo') as string).headPic,
        email: JSON.parse(localStorage.getItem('userInfo') as string).email,
        id: JSON.parse(localStorage.getItem('userInfo') as string).id,
        personalProfile: JSON.parse(localStorage.getItem('userInfo') as string)
          .personalProfile,
      });
    }
  }, []);

  const login = (userInfo: UserStateType) => {
    setUserInfo(userInfo);
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  };

  const logout = () => {
    setUserInfo(INIT_STATE);
    localStorage.removeItem('userInfo');
  };

  return { userInfo, login, logout };
}
