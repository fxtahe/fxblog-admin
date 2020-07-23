<template>
  <div>
    <div class="contanier" v-if="!isEdit">
      <div class="view-title">文章列表</div>
      <el-card class="box-card">
        <el-form ref="form" :model="queryForm" label-width="70px">
          <el-row type="flex" justify="center">
            <el-col :span="18">
              <el-form-item label="Summary">
                <el-input class="article-textarea" v-model="queryForm.title" placeholder="请输入标题" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" justify="center">
            <el-col :span="6">
              <el-form-item label="Category">
                <el-select v-model="queryForm.category" value-key="id" placeholder="分类">
                  <el-option
                    v-for="item in categories"
                    :key="item.id"
                    :label="item.categoryName"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="Tag">
                <el-select
                  v-model="queryForm.tags"
                  value-key="id"
                  autosize
                  filterable
                  multiple
                  clearable
                  :multiple-limit="multipleLimit"
                  placeholder="标签"
                >
                  <el-option
                    v-for="item in tags"
                    :key="item.id"
                    :label="item.tagName"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="状态">
                <el-radio-group v-model="queryForm.state">
                  <el-radio label>全部</el-radio>
                  <el-radio :label="2">发布</el-radio>
                  <el-radio :label="1">草稿</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex" class="row-bg" justify="center">
            <el-col :span="4">
              <el-button type="primary" size="medium" @click="queryPage()">查询</el-button>
              <el-button size="medium" @click="clearQuery()">重置</el-button>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
      <el-card class="box-card" v-loading="tableLoading">
        <article-table
          :total="total"
          :articles="articles"
          :currentPage.sync="currentPage"
          @handleInfoResult="onHandleInfoResult"
          @handleEdit="onHandleEdit"
          @handleCurrentPage="onHandleCurrentPage"
        ></article-table>
      </el-card>
    </div>
    <div v-if="isEdit">
      <edit-article
        :isEdit="isEdit"
        :infoCategories="categories"
        :infoTags="tags"
        :form="editForm"
        @handleBack="onHandleBack"
      ></edit-article>
    </div>
  </div>
</template>
<script>
import EditArticle from "./components/edit-article";
import ArticleTable from "./components/article-table";
import article from "@/api/article";
import category from "@/api/category";
import tag from "@/api/tag";
const form = {
  state: ""
};
export default {
  name: "articleList",
  components: {
    ArticleTable,
    EditArticle
  },
  data() {
    return {
      multipleLimit: 2,
      categories: [],
      tags: [],
      currentPage: 1,
      size: 10,
      total: 0,
      tableLoading: false,
      articles: [],
      isEdit: false,
      queryForm: form,
      editForm: {}
    };
  },
  methods: {
    async getTags() {
      const { data } = await tag.getTags();
      this.tags = data;
    },
    async getCategoies() {
      const { data } = await category.getCategories();
      console.log(data);
      this.categories = data;
    },
    queryPage() {
      this.query(this.currentPage);
    },
    async query(current = 1) {
      this.tableLoading = true;

      try {
        let param = {
          size: this.size,
          data: this.queryForm,
          current
        };

        const { data } = await article.getArticlePage(param);
        if (data) {
          this.currentPage = data.current;
          this.total = data.total;
          this.articles = data.data;
        }
        this.tableLoading = false;
      } catch (e) {
        this.tableLoading = false;
        this.$message.error("查询失败");
      }
    },
    clearQuery() {
      if (this.queryForm) {
        this.queryForm = {};
        this.query();
      }
    },
    onHandleInfoResult(flag) {
      if (flag) {
        this.query();
      }
    },
    onHandleCurrentPage(current) {
      this.query(current);
    },
    onHandleBack(flag) {
      this.isEdit = false;
      if (flag) {
        this.getTags();
        this.query();
      }
    },
    async onHandleEdit(data) {
      let edit = {
        id: data.id,
        title: data.title,
        excerpt: data.excerpt,
        author: data.author,
        createdDate: data.createDate,
        updateDate: data.updateDate,
        cover: data.cover,
        content: data.content,
        category: data.category,
        tags: data.tags,
        state: data.state,
        feature: data.feature
      };
      try {
        this.editForm = edit;
        this.isEdit = true;
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(e);
      }
    }
  },
  created() {
    this.getTags();
    this.getCategoies();
    this.query();
  }
};
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.box-card {
  margin: 20px 30px;
}
.el-row {
  margin-bottom: 8px;
  &:first-child {
    margin-top: 10px;
  }
  &:last-child {
    margin-bottom: 0;
  }
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
