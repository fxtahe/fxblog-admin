<template>
  <div class="contanier">
    <div class="view-title">文章列表</div>
    <el-card class="box-card" :inline="true">
      <el-form ref="form" :inline="true" :model="form" label-width="80px">
        <el-form-item label="Title">
          <el-input placeholder="标题" v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="Category">
          <el-select v-model="form.categoies" placeholder="分类">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Tag">
          <el-select v-model="form.tags" placeholder="标签">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="时间范围">
          <el-date-picker
            v-model="form.date"
            type="datetimerange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>-->
        <el-form-item label="状态">
          <el-radio-group v-model="form.status">
            <el-radio :label="0">全部</el-radio>
            <el-radio :label="1">发布</el-radio>
            <el-radio :label="2">草稿</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div v-for="o in 4" :key="o" class="text item">{{'列表内容 ' + o }}</div>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "articleList",
  data() {
    return {
      form: {
        name: "",
        tags: "",
        date: [],
        type: [],
        status: 0,
        desc: ""
      }
    };
  },
  methods: {
    onSubmit() {
      console.log("submit!");
    }
  }
};
</script>
<style lang="scss" scoped>
.box-card {
  margin: 20px 30px;
}
</style>