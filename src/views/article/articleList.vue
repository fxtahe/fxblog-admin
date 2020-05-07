<template>
  <div>
    <div class="contanier" v-if="!isEdit">
      <div class="view-title">文章列表</div>
      <el-card class="box-card">
        <el-form ref="form" :model="form" label-width="70px">
          <el-form-item label="Summary">
            <el-input
              :rows="1"
              class="article-textarea"
              autosize
              placeholder="Please enter the content"
            />
          </el-form-item>
          <el-row>
            <el-col :span="6">
              <el-form-item label="Category">
                <el-select v-model="form.categoies" placeholder="分类">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Tag">
                <el-select v-model="form.tags" placeholder="标签">
                  <el-option label="区域一" value="shanghai"></el-option>
                  <el-option label="区域二" value="beijing"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态">
                <el-radio-group v-model="form.status">
                  <el-radio :label="0">全部</el-radio>
                  <el-radio :label="1">发布</el-radio>
                  <el-radio :label="2">草稿</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>

            <el-button type="primary" size="medium">主要按钮</el-button>
            <el-button size="medium">默认按钮</el-button>
          </el-row>
        </el-form>
      </el-card>
      <el-card class="box-card" v-loading="tableLoading">
        <article-table
          :total="total"
          :articleData="articleData"
          :currentPage="currentPage"
          @handleInfoResult="onHandleInfoResult"
          @handleEdit="onHandleEdit"
          @handleCurrentPage="onHandleCurrentPage"
        ></article-table>
      </el-card>
    </div>
    <div v-if="isEdit">
      <edit-article :isEdit="true" @handleBack="onHandleBack"></edit-article>
    </div>
  </div>
</template>
<script>
import EditArticle from "./components/edit-article";
import ArticleTable from "./components/article-table";
const articleList = [
  {
    id: "1",
    title: "测试数据",
    created_date: "2020-04-30",
    cover:
      "https://camo.githubusercontent.com/21a6f222f2401e6f345e89460662867c3e8388e7/68747470733a2f2f7265736f757263652e736869726d792e6d652f626c6f672f73637265656e73686f742f323031392d30372d32302f736d696c652d626c6f672d61646d696e2d30312e706e67",
    like: 12,
    description:
      "这是一段描述信息，主要是干嘛的你猜，我猜你不会猜，那就是文展描述",
    content: "content",
    authors: [{ id: 1, name: "fxtahe" }],
    public: 1,
    status: 1,
    star: 2,
    tags: [{ id: 1, name: "test" }],
    category: { id: 1, name: "java" }
  },
  {
    id: "2",
    title: "测试数据2",
    created_date: "2020-04-30",
    cover: "",
    like: 12,
    description:
      "这是一段描述信息，主要是干嘛的你猜，我猜你不会猜，那就是文展描述",
    authors: [{ id: 1, name: "fxtahe" }],
    content: "content",
    public: 1,
    status: 1,
    star: 2,
    tags: [{ id: 1, name: "test" }],
    category: { id: 1, name: "java" }
  }
];
export default {
  name: "articleList",
  components: {
    ArticleTable,
    EditArticle
  },
  data() {
    return {
      categories: [],
      authors: [],
      tags: [],
      currentPage: 1,
      total: 0,
      tableLoading: false,
      articleData: articleList,
      isEdit: false,
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
    },
    onHandleInfoResult(flag) {},
    onHandleCurrentPage(page) {},
    onHandleBack(flag) {
      this.isEdit = false;
    },
    async onHandleEdit(data) {
      let edit = {
        id: data.id,
        title: data.title,
        description: data.description,
        authors: data.authors.map(v => v.id),
        createdDate: data.created_date,
        cover: data.cover,
        content: "",
        categoryId: data.category.id,
        tags: data.tags.map(v => v.id),
        public: data.public,
        status: data.status,
        star: data.star
      };
      try {
        const res = articleList[1];
        edit.content = res.content;
        this.form = edit;
        this.isEdit = true;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.box-card {
  margin: 20px 30px;
}
.container {
  position: relative;
  @include clearfix;
  margin-bottom: 10px;

  .postInfo-container-item {
    float: left;
  }
}
.article-textarea ::vue-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
</style>
