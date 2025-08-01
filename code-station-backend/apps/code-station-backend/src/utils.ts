/*
 * @Author: zwz
 * @Date: 2024-03-28 14:03:41
 * @LastEditors: zwz
 * @LastEditTime: 2024-03-28 14:06:00
 * @Description: 工具
 */
import { BadRequestException, ParseIntPipe } from '@nestjs/common';
import * as crypto from 'crypto';
import { customAlphabet } from 'nanoid';
import * as multer from 'multer';
import * as fs from 'fs';
import * as path from 'path';
import { KEYUTIL, KJUR, RSAKey } from 'jsrsasign';
import { webUserPermission } from './permission/entities/permission.entity';

export function md5(str) {
  const hash = crypto.createHash('md5');
  hash.update(str);
  return hash.digest('hex');
}

export function generateParseIntPipe(name) {
  return new ParseIntPipe({
    exceptionFactory() {
      throw new BadRequestException(name + ' 应该传数字');
    },
  });
}

/**
 * 生成19位随机数
 * @returns 19位随机数
 */
export const generateNumericId = () => {
  const nanoid = customAlphabet('0123456789', 19);
  return nanoid();
};

/**
 * 上传文件名的生成
 */
export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      fs.mkdirSync(path.join(process.cwd(), 'uploads'));
    } catch (e) {}

    cb(null, path.join(process.cwd(), 'uploads'));
  },

  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() +
      '-' +
      Math.round(Math.random() * 1e9) +
      '-' +
      file.originalname;
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEogIBAAKCAQEA4MRNTY45HlLh65Hq19xu+s1xFOu1srTNPGUdc6PJJOg4Qww/
dZbYAk+VOSGnLTFdVG1bIu/xLGbHMUZ2wPqC2pycZApHQZpPo716a10a6prIJY3X
wkaKJ7RJFYgH3phxHmfLwcGyxQHpV3CkQIIcPOzTGsWsGRYcgM4HcCituMJhe3m7
JX5nenf+8Sd7mAv17UzqgGIr7kcwYcd8jbI6Z78QiOh3c9wb9Wgxptrhwqwt8nbo
2fgkmxMuKojQrqjZvfo31Wh0kHADMSAKIFHedrbgeLsAvyfCfZf6yZ8cX2d8/LhJ
g6sV2ALTo5D0f971UgH577WMfhyJd2MyyWpVHQIDAQABAoIBAGd5J2dFSrlRiazz
k2wFkFfInT721kJrZrJfkGPsqkxh1YjUSiCdrVq+/WD8Q6ST/bXA1Dxsvpfkxt3B
5SipCvWONJb/fldOrUwhjgqAJcSMNgjH2GSZKb/miOCvK4RHpIfNW+mafOyiGSSG
eC80VsCbfAHur3ArFDsd3iG9sGAFy2w7+lwXvyTv+zrcXDb34zy+TDHNpKiXzcGt
RnlPN6XdxdFu9Yj9ubkgElgJb0Rv1ZvRQfTQe7KofZqQr69al1O2dI0nbbi1z5YA
hJZ1HQZYiaqxbaHYkNS/1Js0fpJPEd3+gcJLh7wJaXh6/kz5uG0+JhqqCKMAPnMb
iHCIWZcCgYEA+PsLspfQkbBJ5iTkW/uztpZUH8Gr6iy023qR5mv39tTPvnWZjMww
DT8C3Ktvw1fKvp1H31GwHAeKeQDvHUWiNLRJ4XTfbjN3bipW+TBG6lNH45KQAMwD
vUvOh4xPFrS3IbjeXgCRZTbYFKCMnekXOw9UXUK7JpwKNiVBHNCNT1MCgYEA5xp/
wPbGU0uzMEpOyAh6Y8cmIOF1uC0ziHV3Vhb0QXxlE00DXY+NC/xcjeumlp92Q2mb
yMk+b84RIzSWDel/JPlHzHJLdTympbw66P1vUNE/CdZA2sy0qhmT2MFLGkhydMVP
RFK8rQovmXy/tmhIF1V9MFS2/4omXzjzEcaS688CgYAh5y1kmD+SVwr5B7UAwXlr
N3UlDd42+Pd3m20aj0EonznamXDbN0Kjyxy8p6uEUgQNiKUsx5bPekdkyrfEqKK5
woL87EkwXFm66pEFRYmihsyXNHHfaehoclYhJv3t/ZWiReYhrrodqiYqSOJc7kx3
glLekCOj0kOhs9j174AOeQKBgBiaYJlpbCm3+Gaeso5nIKh4rh14AzFNVpwjbUX0
AaLrHFOWslIGk0yAXFYbjUuhxFRe7N/OVOBQPtDRq1vlzMxh4XvpexELGO6yAE+H
k482B5EDhzoD6wPk3zGHOnic19qImuy6Ji4B1Jlxh3Ni3LHnPwGjMyw3R+iBRpdQ
3ZlPAoGANC4pp+TlhD2tidQSFwThTbNCBCPrt4pnbWai0GQlybw5CBMWHEyLmcPb
jN4xRy5kONatlp/pXhlCPWgSCUUc/LzNeuq4HD12PFPhvfkpqToRn2Q+UVOmnyM9
c0uQGEPGTE/H46xlfmZbYETcxGKB5CMXgHeXjIkvY3jKLn+aBEQ=
-----END RSA PRIVATE KEY-----
`;

/**
 * 后端解密 jsrsasing 版本使用 10.9
 * @param password
 */
export const encryptKey = (password: string) => {
  const keyObj = KEYUTIL.getKey(privateKey);

  const encryptPwd = KJUR.crypto.Cipher.decrypt(
    password,
    keyObj as RSAKey,
    'RSA',
  );
  return encryptPwd;
};

/**
 * 菜单遍历，转化为树结构
 */
export const getMenuTree = (menuList) => {
  const rootList = [];
  const idMap = {};
  menuList.forEach((item) => {
    idMap[item.id] = { ...item, children: [] };
  });
  for (let i = 0; i < menuList.length; i++) {
    const obj = menuList[i];
    if (obj.parent_id === null) {
      rootList.push(idMap[obj.id]);
    } else {
      idMap[obj.parent_id].children.push(idMap[obj.id]);
    }
  }
  // 递归去除空的children
  function removeEmptyChildren(node) {
    if (node.children.length === 0) {
      delete node.children;
    } else {
      node.children.forEach((child) => removeEmptyChildren(child));
    }
  }
  rootList.forEach((node) => removeEmptyChildren(node));
  return rootList;
};

/**
 * 生成roles
 */
export const getRoles = (roleNameCodeList, id) => {
  console.log(roleNameCodeList, id);
  const roles: string[] = [];
  roleNameCodeList.forEach((item) => {
    if (item.permissionId === id) {
      roles.push(item.roleCode);
    }
  });
  // 如果没有权限返回null
  return roles;
};
