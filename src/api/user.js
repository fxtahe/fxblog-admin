import request from "@/utils/request";

export function login(data) {
  return request({
    url: "/login",
    method: "post",
    data,
    transformRequest: [
      function (data) {
        // Do whatever you want to transform the data
        let ret = "";
        for (let it in data) {
          ret +=
            encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
        }
        return ret;
      }
    ],
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}

export function getInfo() {
  return request({
    url: "/author/get/info",
    method: "get"
  });
}

export function logout() {
  return request({
    url: "/logout",
    method: "post"
  });
}
export function refreshToken() {
  return request({
    url: "/auth/refresh",
    method: "get"
  });
}
