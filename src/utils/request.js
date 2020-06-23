import axios from "axios";
import { Message } from "element-ui";
import store from "@/store";
import author from "@/api/author";
import { getRefreshToken, getAccessToken } from "./auth";
// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
});

// request interceptor
service.interceptors.request.use(
  (config) => {
    console.log(config);
    // do something before request is sent
    if (!config.url) {
      throw new Error({
        source: "axiosInterceptors",
        message: "request need url"
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

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  async (response) => {
    if (response.status === 200 && response.data.code === 200) {
      return response.data;
    }
    return new Promise(async (resolve, reject) => {
      // 将本次失败请求保存
      const { params, url, method, data } = response.config;
      console.log(response.config);
      store.dispatch("user/refreshOptions", response.config);
      const res = response.data;
      // 处理 API 异常
      let { code } = response.data;
      if (code !== 200) {
        if (code != 10001 || code != 10010 || code != 10002) {
        }
        console.log(code);
        // 如果是令牌无效或者是 refreshToken 相关异常
        if (code === 10010) {
          store.dispatch("user/logout");
        }

        // 令牌失效 或 令牌过期 需要重新刷新令牌
        if (code === 10001 || code === 10002) {
          const cache = {};
          if (cache.url !== url) {
            cache.url = url;
            await author.getRefreshToken();
            console.log(store.state.user.refreshOptions);
            const result = await service(store.state.user.refreshOptions);

            resolve(result);
            return;
          }
        }
      }
      Message({
        message: res.message || "Error",
        type: "error",
        duration: 5 * 1000
      });
      reject(response.data);
    });
  },
  (error) => {
    console.log("err" + error); // for debug
    Message({
      message: error.message,
      showClose: true,
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
