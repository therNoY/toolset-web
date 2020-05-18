import { removeToken, getToken, setToken, getCookieToken } from '../../common/util/auth'
import { login, register, getUserInfo } from '../../common/api'
const user = {
  state: {
    token: getCookieToken(),
    user: null,
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      console.log("设置token");
      state.token = token;
    },
    SET_USER: (state, user) => {
      console.log("设置User信息" + user);
      state.user = user;
    },
    LOGOUT: (state) => {
      console.log("清除state");
      state.user = {};
      state.token = null;
    },
  },

  actions: {
    login({ commit }, userInfo) {
      const { username, password } = userInfo;
      return new Promise((resolve, reject) => {
        login({ userName: username.trim(), password: password }).then(response => {
          if (response.resCode  == 0) {
            console.log("登录成功 保存token");
            commit('SET_USER', response.resVal.userInfo)
            setToken(response.resVal.token);
            resolve(response);
          } else {
            reject(response.resMes);
          }
          
        }).catch(error => {
          resolve(error);
          throw error;
        })
      })
    },
    register({ commit }, registerInfo) {
      return new Promise((resolve, reject) => {
        register(registerInfo).then(response => {
          if (response.resCode == 0) {
            console.log("登录成功 保存token");
            commit('SET_USER', response.resVal.userInfo)
            setToken(response.resVal.token);
            resolve();
          } else {
            reject(response.resMes);
          }

        }).catch(error => {
          reject(error);
        })
      })
    },
    // 登出
    logout({ commit, state }) {
      commit('SET_TOKEN', '');
      commit('SET_USER', []);
      removeToken();
    },
  }
}

export default user
