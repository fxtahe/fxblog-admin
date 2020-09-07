<template>
  <div class="container">
    <div class="view-title">
      关于网站
      <div v-if="!isEdit">
        <el-button style="float: right;" type="info" @click="edit()">编辑</el-button>
      </div>
      <div v-else>
        <el-button style="float: right;margin-left: 10px" type="success" @click="save()">发布</el-button>
        <el-button style="float: right;" type="info" @click="cancle()">取消</el-button>
      </div>
    </div>
    <el-card class="box-card">
      <div v-if="isEdit">
        <markdown-editor v-model="about" />
      </div>
      <div v-else>
        <markdown-preview :initialValue="about" />
      </div>
    </el-card>
  </div>
</template>
<script>
import website from "@/api/website";
import MarkdownEditor from "@/components/MarkdownEditor/pro";
import MarkdownPreview from "@/components/MarkdownEditor/preview";
export default {
  components: {
    MarkdownEditor,
    MarkdownPreview,
  },
  data() {
    return {
      isEdit: false,
      about: "测试数据",
    };
  },
  methods: {
    edit() {
      this.isEdit = true;
    },
    cancle() {
      this.isEdit = false;
    },
    async save() {
      await website.updateWebsite({ about: this.about });
      this.isEdit = false;
    },
  },
  created() {
    website.getWebsite().then((res) => {
      this.about = res.data.about;
    });
  },
};
</script>
<style lang="scss" scoped>
.view-title {
  justify-content: space-between;
}
.box-card {
  margin: 20px 30px;
}
</style>