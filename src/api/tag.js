import request from "@/utils/request";

export function getTags(query) {
  return request({
    url: "/fxblog/tag/list",
    method: "get",
    params: query
  });
}

export function getTag(id) {
  return request({
    url: "/fxblog/tag/detail",
    method: "get",
    params: { id }
  });
}
