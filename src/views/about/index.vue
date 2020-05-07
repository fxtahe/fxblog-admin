<template>
  <div class="container">
    <div class="view-title">
      About
      <div v-if="!isEdit">
        <el-button style="float: right;" type="info" @click="edit()">编辑</el-button>
      </div>
      <div v-else>
        <el-button style="float: right;" type="info">草稿</el-button>
        <el-button style="float: right;margin-right: 10px" type="success">发布</el-button>
        <el-button style="float: right;" type="info">取消</el-button>
      </div>
    </div>
    <el-card class="box-card">
      <div v-if="isEdit">
        <markdown-editor />
      </div>
      <div v-else>
        <markdown-preview />
      </div>
    </el-card>
  </div>
</template>
<script>
import MarkdownEditor from "@/components/MarkdownEditor/pro";
import MarkdownPreview from "@/components/MarkdownEditor/preview";
export default {
  components: {
    MarkdownEditor,
    MarkdownPreview
  },
  data() {
    return {
      isEdit: false,
      about: ""
    };
  },
  methods: {
    edit() {
      this.isEdit = true;
    }
  }
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