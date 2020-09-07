import { post } from "@/utils/request";

class LogApi {
  // 获取日志分页
  async getLogInfoPage(params) {
    const res = await post("/admin/log/page", params);
    return res;
  }
}

export default new LogApi();
