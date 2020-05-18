import router from './router'
import store from './store'

import { getUserByToken } from './common/api'
import { Message } from 'element-ui';
import { getCookieToken, removeToken } from './common/util/auth' // 验权

const blackList = [];
router.beforeEach(async (to, from, next) => {
  const hasGetUserInfo = store.getters.user;
  if (!hasGetUserInfo) {
    const hasToken = getCookieToken();
    if (hasToken) {
      console.log("cookie中有token");
      try {
        const resp = await getUserByToken({ token: hasToken });
        if (resp.resCode == 0) {
          console.log("用户首次登陆 根据token获取用户信息成功");
          store.commit("SET_USER", resp.resVal);
          next();
        } else {
          console.log("token 过期或者异常");
          Message.error(resp.resMes);
          removeToken();
          next();
        }
      } catch (error) {
        await store.dispatch('resetToken');
        Message.error(error || '网络异常');
        next()
      }
    } else {
      console.log("没有token");
      if (blackList.indexOf(to.path) == -1) {
        // 在黑名单中
        console.log("拦截操作");
        next();
      } else {
        next();
      }
    }
  } else {
    console.log("用户存在store 中直接放过");
    next();
  }

})

