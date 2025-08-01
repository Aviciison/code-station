/*
 * @Author: zwz
 * @Date: 2024-03-28 15:07:47
 * @LastEditors: zwz
 * @LastEditTime: 2024-04-03 14:36:10
 * @Description: 封装返回数据view object
 */

export class UserInfoVo {
  id: number;

  username: string;

  email: string;

  headPic: string;

  personalProfile?: string;

  // createTime: number;
}

interface UserInfo {
  id: number;

  username: string;

  email: string;

  headPic: string;

  personalProfile?: string;

  // createTime: number;
}
export class LoginUserVo {
  userInfo: UserInfo;

  accessToken: string;

  refreshToken: string;
}

interface webUserInfo {
  id: number;

  username: string;

  email: string;

  roles: string[];
}

export class webLoginUserVo {
  userInfo: webUserInfo;

  accessToken: string;

  refreshToken: string;
}

export class fewUserInfoVo {
  id: number;

  username: string;

  email: string;

  headPic: string;

  personalProfile: string;
}
