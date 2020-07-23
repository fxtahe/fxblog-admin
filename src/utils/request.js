import axios from "axios";
import { Message } from "element-ui";
import store from "@/store";

import { getRefreshToken, getAccessToken } from "./auth";
import { saveAccessToken } from "@/utils/auth";

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent
    if (!config.url) {
      Message({
        message: "缺失请求路径",
        type: "error",
        duration: 3 * 1000
      });
    }
    // 默认使用 get 请求
    if (!config.method) {
      config.method = "get";
    }
    config.method = config.method.toLowerCase();

    if (config.url === "/auth/refresh") {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        config.headers.Authorization = refreshToken;
      }
    } else {
      const accessToken = getAccessToken();
      if (accessToken) {
        config.headers.Authorization = accessToken;
      }
    }

    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

/**
 * token 刷新机制
 * 参考：https://segmentfault.com/a/1190000016946316
 */
// 是否正在刷新的标记
let isRefreshing = true;
// 重试队列，每一项将是一个待执行的函数形式
let subscribers = [];
function onAccessTokenFetched() {
  subscribers.forEach((callback) => {
    callback();
  });
  subscribers = [];
}

function addSubscriber(callback) {
  subscribers.push(callback);
}
function refreshTokenRequst() {
  service({
    url: "/auth/refresh",
    method: "get"
  })
    .then((response) => {
      const { data } = response;
      saveAccessToken(data.access_token);
      onAccessTokenFetched();
      isRefreshing = true;
    })
    .catch((e) => {
      Message({
        message: "登录信息过期，请重新登录",
        type: "error"
      });
      store.dispatch("user/logout");
    });
}
service.interceptors.response.use(
  (response) => {
    if (response.status === 200 && response.data.code === 200) {
      return response.data;
    }
    let { code } = response.data;
    if (code === 10001 || code === 10002) {
      if (isRefreshing) {
        refreshTokenRequst();
      }
      isRefreshing = false;
      return new Promise((resolve) => {
        addSubscriber(() => {
          resolve(service(response.config));
        });
      });
    }
    // 如果是令牌无效或者是 refreshToken 相关异常
    if (code === 10010) {
      store.dispatch("user/logout");
      return;
    }
    if (code !== 200) {
      Message({
        message: res.message || "Error",
        type: "error",
        duration: 5 * 1000
      });
    }
  },
  (error) => {
    //console.log("err" + error); // for debug
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

// 导出常用函数

export function post(url, data = {}, params = {}) {
  return service({
    method: "post",
    url,
    data,
    params
  });
}

export function get(url, params = {}) {
  return service({
    method: "get",
    url,
    params
  });
}

export function put(url, data = {}, params = {}) {
  return service({
    method: "put",
    url,
    params,
    data
  });
}

export function del(url, params = {}) {
  return service({
    method: "delete",
    url,
    params
  });
}

export default service;
