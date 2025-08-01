/*
 * @Author: zwz
 * @Date: 2024-04-28 14:31:16
 * @LastEditors: zwz
 * @LastEditTime: 2024-04-28 14:31:17
 * @Description: 请填写简介
 */
export interface loginType {
  password: string;
  username: string;
}

export interface loginResponse {
  userInfo: {
    createTime: number;
    email: string;
    headPic?: string;
    id: number;
    username: string;
  };
  accessToken: string;
  refreshToken: string;
}

export interface registerType {
  password: string;
  username: string;
  email?: string;
}

export interface userInfoType {
  email: string;
  headPic?: string;
  id: number;
  username: string;
  personalProfile?: string;
}
