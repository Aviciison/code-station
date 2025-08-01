import { getToken } from './utils/user-token';

export default () => {
  let canSeeLogin = getToken();
  console.log(!canSeeLogin.accToken, 'canSeeLogin');

  return {
    canSeeLogin: !!canSeeLogin.accToken,
  };
};
