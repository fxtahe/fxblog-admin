import { get, post, put, del } from "@/utils/request";

class Author {
  // 获取某个作者的信息
  async getAuthorInfo(id) {
    return await get(`/author/admin/get/${id}`);
  }

  // 获取所有作者
  async getAuthors() {
    return await get("/author/admin/get/list");
  }

  // 更新作者信息
  async updateAuthor(author) {
    let res = await put("/author/update/info", author);
    return res;
  }

  async updateAvatar(avatar) {
    let res = await put("/author/update/avatar", avatar);
    return res;
  }
  // 修改密码
  async changePassword(password) {
    let res = await put("/author/update/password", password);
    return res;
  }

  // 删除作者
  async deleteAuthor(id) {
    let res = await del(`/author/admin/delete/${id}`);
    return res;
  }
}

export default new Author();
