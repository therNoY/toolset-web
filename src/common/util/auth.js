import Cookies from 'js-cookie'
import store from '../../store'

const userNameKey = 'AEUserName' // cookie中保存name的Key
const userPwdKey = 'AEPwd' // cookie 中保存pwd的key
const TokenKey = 'toolsetToken' // cookie 中保存token的key

export function getCookieToken() {
  return Cookies.get(TokenKey)
}

/**
 * 
 * @param {更新token同时更新 store} token 
 */
export function setToken(token) {
  console.log("更新缓存的token"+ token);
  store.commit("SET_TOKEN", token);
  return Cookies.set(TokenKey, token);
}
/**
 * 从Cookie中获取用户
 */
export function getUser() {
  if (typeof Cookies.get(userNameKey) != "undefined"
    && typeof Cookies.get(userPwdKey) != "undefined"
    && Cookies.get(userNameKey) != null
    && Cookies.get(userPwdKey) != null) {
    let user = {};
    user.user_name = Cookies.get(userNameKey);
    user.password = Cookies.get(userPwdKey);
    return user;
  }
  return null;
}

export function setUser(user) {
  Cookies.set(userNameKey, user.user_name);
  Cookies.set(userPwdKey, user.password);
  store.commit("SET_USER", user);
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
/**
 * 
 * @param {更新token同时更新 store} token 
*/
export function Logout() {
  console.log("清除Cookie");
  Cookies.remove(userNameKey);
  Cookies.remove(userPwdKey);
  Cookies.remove(TokenKey);
}
