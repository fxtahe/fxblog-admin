import axios from "axios";
import Vue from "vue";
import { Message } from "element-ui";
const config = {
  headers: { "Content-Type": "multipart/form-data" }
};
const service = axios.create(config);
let loading;
service.interceptors.request.use(
  (config) => {
    loading = Vue.prototype.$loading({
      lock: true,
      text: "上传中...",
      target: document.querySelector(".app-main") // 设置加载动画区域
    });
    return config;
  },
  (error) => {
    loading.close();
    return Promise.reject(error);
  }
);
service.interceptors.response.use(
  (response) => {
    loading.close();
    const res = response.data;
    loading.close();
    return res;
  },
  (error) => {
    loading.close();
    console.log("err" + error); // for debug
    Message({
      message: error.message,
      showClose: true,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);
const uploadImgUrl = "https://api.imgbb.com/1/upload";
class UploadFile {
  uploadImage(imgFile) {
    let formData = new FormData();
    formData.append("key", "6b2ea619cc4355034fb9b684bcf96ac1");
    formData.append("image", imgFile);
    formData.append("format", "json");
    return service.post(uploadImgUrl, formData);
  }
}
export default new UploadFile();
