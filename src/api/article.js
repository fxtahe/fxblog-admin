import { request, get, post, put, del } from "@/utils/request";
class Article {
  // 创建文章
  async createArticle(article) {
    const res = await post("v1/article", article);
    return res;
  }

  // 获取所有文章
  async getArticles(params) {
    const res = await get("v1/article/articles", params);
    return res;
  }

  // 删除某篇文章
  async deleteArticle(id) {
    const res = await del(`v1/article?id=${id}`);
    return res;
  }

  // 设为公开 或 私密
  async updateArticlePublic(id, params) {
    const res = await put(`v1/article/public?id=${id}`, params);
    return res;
  }

  // 设为精选
  async updateArticleStar(id, params) {
    const res = await put(`v1/article/star?id=${id}`, params);
    return res;
  }

  // 获取该文章的所有评论
  async getComments(id) {
    const res = await get(`v1/article/get/comment?articleId=${id}`);
    return res;
  }

  // 删除某条评论
  async deleteComment(id) {
    const res = await del(`v1/article/del/comment?id=${id}`);
    return res;
  }

  // 获取某篇文章的内容
  async getContent(id) {
    const res = await get(`v1/article/content?id=${id}`);
    return res;
  }

  // 更新某篇文章
  async updateArticle(article) {
    const res = await put("v1/article", article);
    return res;
  }
}
export default new Article();
export function getArticles(query) {
  return request({
    url: "/fxblog/article/list",
    method: "get",
    params: query
  });
}

export function getArticle(id) {
  return request({
    url: "/fxblog/article/detail",
    method: "get",
    params: { id }
  });
}

export function fetchPv(pv) {
  return request({
    url: "/fxblog/article/pv",
    method: "get",
    params: { pv }
  });
}

export function createArticle(data) {
  return request({
    url: "/fxblog/article/create",
    method: "post",
    data
  });
}

export function updateArticle(data) {
  return request({
    url: "/fxblog/article/update",
    method: "post",
    data
  });
}
