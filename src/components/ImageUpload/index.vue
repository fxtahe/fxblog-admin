<template>
  <div>
    <el-input placeholder="placeholder" ref="linkInput" v-model="url" @change="handleChange">
      <el-button
        class="upload-btn"
        type="primay"
        slot="append"
        icon="el-icon-upload"
        @click="handleUpload"
      ></el-button>
    </el-input>
    <input type="file" ref="imgInput" @change="uploadImg" style="display:none" />
  </div>
</template>
<script>
import uploadFile from "@/api/upload";
export default {
  props: {
    value: {
      type: String,
      default: ""
    },
    placeholder: {
      type: String,
      default: "填写链接"
    }
  },
  data() {
    return {
      url: this.value
    };
  },
  methods: {
    handleChange() {
      console.log("img link change", this.url);
      this.$emit("update:value", this.url);
    },
    handleUpload() {
      this.$nextTick(_ => {
        this.$refs.imgInput.dispatchEvent(new MouseEvent("click"));
      });
    },
    async uploadImg(event) {
      try {
        let file = event.target.files[0];
        const { data } = await uploadFile.uploadImage(file);
        console.log("data" + data);
        this.url = data.url;
        this.$emit("update:value", this.url);
        event.target.files = [];
      } catch (e) {}
    }
  }
};
</script>