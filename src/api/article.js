import { request, get, post, put, del } from "@/utils/request";
class Article {
  // 创建文章
  async createArticle(article) {
    const res = await post("/author/article/save", article);
    return res;
  }

  // 获取文章分页
  async getArticlePage(params) {
    const res = await post("/author/article/page", params);
    return res;
  }

  // 删除某篇文章
  async deleteArticle(id) {
    const res = await del(`/author/article/delete/${id}`);
    return res;
  }

  // 设为推荐
  async updateArticleFeature(article) {
    const res = await put("/author/article/feature", article);
    return res;
  }

  // 获取某篇文章的内容
  async getArticle(id) {
    const res = await get(`/author/article/get/${id}`);
    return res;
  }

  // 更新某篇文章
  async updateArticle(article) {
    const res = await put("/author/article/update", article);
    return res;
  }
}
export default new Article();
