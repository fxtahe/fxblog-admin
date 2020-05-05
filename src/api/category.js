import { request, get, post, put, del } from "@/utils/request";

class Category {
  // 新增分类
  async createCategory(category) {
    const res = await post("fxblog/category/add", category);
    return res;
  }

  // 编辑分类
  async updateCategory(category) {
    const res = await put("fxblog/category/update", category);
    return res;
  }

  // 获取所有分类
  async getCategories() {
    const res = await get("fxblog/category/categories");
    return res;
  }

  // 删除某个分类
  async deleteCategory(id) {
    const res = await del(`fxblog/category/delCategory?id=${id}`);
    return res;
  }
}
export default new Category();
export function getCategories(query) {
  return request({
    url: "/fxblog/category/list",
    method: "get",
    params: query
  });
}

export function getCategory(id) {
  return request({
    url: "/fxblog/category/detail",
    method: "get",
    params: { id }
  });
}
