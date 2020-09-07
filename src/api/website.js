import { get, put } from "@/utils/request";
class Website {
  async getWebsite() {
    const res = await get("/website/get");
    return res;
  }

  async updateWebsite(website) {
    const res = await put("/website/admin/update", website);
    return res;
  }
}

export default new Website();
