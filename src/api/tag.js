import { get, post, put, del } from "@/utils/request";

class Tag {
  // 新增标签
  async createTag(tag) {
    const res = await post("/tag/save", tag);
    return res;
  }

  // 编辑标签
  async updateTag(tag) {
    const res = await put("/tag/update", tag);
    return res;
  }

  // 获取所有标签
  async getTags() {
    const res = await get("/tag/list");
    return res;
  }

  //查询标签
  async searchTags(val) {
    const res = await get(`/tag/search/${val}`);
    return res;
  }

  //分页获取标签
  async getTagPage(current, size) {
    const res = await get(`/tag/page/${current}/${size}`);
    return res;
  }

  // 删除某个标签
  async deleteTag(id) {
    const res = await del(`/tag/delete/${id}`);
    return res;
  }
}

export default new Tag();
