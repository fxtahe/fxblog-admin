import { login, getInfo } from "@/api/user";
import { saveTokens, removeToken } from "@/utils/auth";
import { resetRouter } from "@/router";
import { Message } from "element-ui";
const getDefaultState = () => {
  return {
    accessToken: "",
    refreshToken: "",
    name: "",
    avatar: "",
    github: "",
    email: "",
    introduction: "",
    roles: [],
    refreshOptions: {}
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, accessToken, refreshToken) => {
    state.accessToken = accessToken;
    state.refreshToken = refreshToken;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_GITHUB: (state, github) => {
    state.github = github;
  },
  SET_EMAIL: (state, email) => {
    state.email = email;
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction;
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles;
  },
  SET_REFRESH_OPTION: (state, option) => {
    state.refreshOptions = option;
  }
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then((response) => {
          const { data } = response;
          commit("SET_TOKEN", data.access_token, data.refresh_token);
          saveTokens(data.access_token, data.refresh_token);
          resolve();
        })
        .catch((error) => {
          Message({
            message: "用户名或密码错误，请确认后重新登录",
            type: "error"
          });
          reject(error);
        });
    });
  },
  updateAvatar({ commit }, avatar) {
    return new Promise((resolve, reject) => {
      commit("SET_AVATAR", avatar);
      resolve();
    });
  },
  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then((response) => {
          const { data } = response;
          if (!data) {
            reject("Verification failed, please Login again.");
          }

          const {
            roles,
            authorName,
            email,
            github,
            avatar,
            introduction
          } = data;
          commit("SET_ROLES", roles);
          commit("SET_NAME", authorName);
          commit("SET_AVATAR", avatar);
          commit("SET_EMAIL", email);
          commit("SET_GITHUB", github);
          commit("SET_INTRODUCTION", introduction);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      removeToken();
      resetRouter();
      commit("RESET_STATE");
      resolve();
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken();
      commit("RESET_STATE");
      resolve();
    });
  },

  refreshOptions({ commit }, option) {
    return new Promise((resolve) => {
      commit("SET_REFRESH_OPTION", option);
      resolve();
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
