import { KEYUTIL, KJUR, RSAKey } from 'jsrsasign';
const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4MRNTY45HlLh65Hq19xu
+s1xFOu1srTNPGUdc6PJJOg4Qww/dZbYAk+VOSGnLTFdVG1bIu/xLGbHMUZ2wPqC
2pycZApHQZpPo716a10a6prIJY3XwkaKJ7RJFYgH3phxHmfLwcGyxQHpV3CkQIIc
POzTGsWsGRYcgM4HcCituMJhe3m7JX5nenf+8Sd7mAv17UzqgGIr7kcwYcd8jbI6
Z78QiOh3c9wb9Wgxptrhwqwt8nbo2fgkmxMuKojQrqjZvfo31Wh0kHADMSAKIFHe
drbgeLsAvyfCfZf6yZ8cX2d8/LhJg6sV2ALTo5D0f971UgH577WMfhyJd2MyyWpV
HQIDAQAB
-----END PUBLIC KEY-----`;

/**
 * 前端加密 jsrsasing 版本使用 10.9
 * @param password
 */
export const encryptKey = (password: string) => {
  const keyObj = KEYUTIL.getKey(publicKey);
  const encryptPwd = KJUR.crypto.Cipher.encrypt(
    password,
    keyObj as RSAKey,
    'RSA',
  );
  return encryptPwd;
};
