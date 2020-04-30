import request from "@/utils/request";

export function login(data) {
  return request({
    url: "/fxblog/user/login",
    method: "post",
    data
  });
}

export function getInfo(token) {
  return request({
    url: "/fxblog/user/info",
    method: "get",
    params: { token }
  });
}

export function logout() {
  return request({
    url: "/fxblog/user/logout",
    method: "post"
  });
}
