<template>
  <div class="article-table">
    <el-table :data="articles" v-loading="loading">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form inline label-position="left" label-width="80px" class="demo-table-expand">
            <el-form-item label="作者" v-if="props.row.author">
              <span>{{ props.row.author.authorName }}</span>
            </el-form-item>
            <el-form-item label="分类" v-if="props.row.category">
              <span>{{ props.row.category.categoryName }}</span>
            </el-form-item>
            <el-form-item label="浏览次数">
              <span>{{ props.row.views }}</span>
            </el-form-item>
            <el-form-item label="标签" v-if="props.row.tags.length > 0">
              <el-tag class="tag-item" v-for="tag in props.row.tags" :key="tag.id">{{tag.tagName}}</el-tag>
            </el-form-item>
            <el-form-item label="喜欢">
              <span>{{ props.row.like }}</span>
            </el-form-item>
            <el-form-item v-if="props.row.cover" label="封面">
              <img class="cover" :src="props.row.cover" />
            </el-form-item>
            <el-form-item label="描述">
              <span>{{ props.row.excerpt }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="title" label="标题"></el-table-column>
      <el-table-column prop="createDate" label="发布时间" sortable width="170"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="row => stateMap[row.state]"></el-table-column>
      <el-table-column prop="star" label="推荐">
        <template slot-scope="scope">
          <i
            v-if="scope.row.state === 2"
            :class="['star el-icon-star-off', scope.row.feature ? 'star-on' : '']"
            @click="setFeature(scope.row)"
          ></i>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" width="250">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="editArticle(scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteArticle(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination">
      <el-pagination
        @current-change="handleCurrentChange"
        layout="prev, pager, next, jumper"
        :total="total"
        :background="true"
        :page-size="pageSize"
        :currentPage="currentPage"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import article from "@/api/article";
const stateMap = {
  1: "草稿",
  2: "发布",
  3: "已删除",
};
export default {
  components: {},

  props: {
    articles: {
      type: Array,
      default: () => {},
    },

    currentPage: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      currentId: null,
      loading: false,
      stateMap: stateMap,
      dialogVisible: false,
      pageSize: 10,
    };
  },

  methods: {
    handleCurrentChange(page) {
      this.$emit("handleCurrentPage", page);
    },

    handleClose() {
      this.dialogVisible = false;
    },

    editArticle(val) {
      this.$emit("handleEdit", val);
    },

    // 推荐文章
    async setFeature(val) {
      let message = "";
      val.feature
        ? ((val.feature = false), (message = "取消"))
        : ((val.feature = true), (message = "设置"));
      try {
        this.loading = true;
        await article.updateArticleFeature(val);
        this.$message.success(message + "推荐成功");
        this.loading = false;
      } catch (e) {
        this.$message.error(message + "推荐失败");
        this.loading = false;
      }
    },

    showComments(val) {
      this.currentId = val.id;
      this.dialogVisible = true;
    },

    deleteArticle(val) {
      this.$confirm("此操作将永久删除文章, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            this.loading = true;
            await article.deleteArticle(val.id);
            this.$emit("handleInfoResult", true);
            this.loading = false;

            this.$message.success("删除成功");
          } catch (e) {
            this.loading = false;
            this.$message.error("删除失败");
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.tag-item {
  margin-right: 4px;
}
.author-item {
  margin-right: 4px;

  &:not(:last-child)::after {
    content: ",";
  }
}

.demo-table-expand {
  font-size: 0;

  label {
    width: 90px;
  }

  .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }
}

.cover {
  max-width: 150px;
  max-height: 150px;
}

.star {
  font-size: 20px;
  cursor: pointer;
}

.star-on {
  color: #4093ff;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  margin: 20px;
}
</style>
