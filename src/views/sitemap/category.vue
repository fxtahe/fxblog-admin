<template>
  <div class="container">
    <div class="view-title">
      分类管理
      <div class="search-wrapper">
        <el-button class="add-btn" size="medium" @click="addCategory()">+ 添加分类</el-button>
        <el-input
          size="medium"
          placeholder="搜索..."
          prefix-icon="el-icon-search"
          clearable
          v-model="searchVal"
          maxlength="10"
          @clear="clearSearch"
        ></el-input>
        <el-button class="search-btn" type="primary" size="medium" @click="search">搜索</el-button>
      </div>
    </div>
    <el-card class="box-card">
      <el-table :data="categories" style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" label-width="50px" class="demo-table-expand">
              <el-form-item label="描述">
                <span>{{ props.row.description }}</span>
              </el-form-item>
              <el-form-item label="封面">
                <img class="cover" :src="props.row.cover" />
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column label="操作" fixed="right" width="175">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="editCategory(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" @click="deleteCategory(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog append-to-body :visible.sync="dialogVisible" :before-close="handleClose">
      <edit-category
        v-if="dialogVisible"
        ref="info"
        :editType="editType"
        :info="form"
        :id="id"
        @handleInfoResult="onHandleInfoResult"
      ></edit-category>
    </el-dialog>
  </div>
</template>
<script>
import EditCategory from "./component/edit-category";
import category from "@/api/category";
const categories = [
  {
    id: 1,
    name: "java",
    description: "这是一段感人肺腑的经历",
    cover:
      "https://resource.shirmy.me/blog/screenshot/2019-07-20/smile-blog-admin-01.png"
  },
  {
    id: 2,
    name: "python",
    description: "这是一段喜极而泣的经历",
    cover:
      "https://resource.shirmy.me/blog/screenshot/2019-07-20/smile-blog-admin-01.png"
  }
];
export default {
  components: {
    EditCategory
  },
  data() {
    return {
      searchVal: "",
      id: 0,
      editType: "",
      dialogVisible: false,
      categories: [],
      form: {
        name: "",
        cover: "",
        description: ""
      }
    };
  },
  methods: {
    search() {
      if (!this.searchVal) {
        this.$message.warning("搜索内容不能为空");
        return;
      }
      this.getCategories();
    },

    clearSearch() {
      this.getCategories();
    },

    // 刷新/获取分类
    async getCategories() {
      try {
        this.loading = true;
        this.categories = await category.getCategories();
        this.loading = false;
      } catch (e) {
        this.loading = false;
        // eslint-disable-next-line no-console
        console.log(e);
      }
    },

    addCategory() {
      this.editType = "add";
      this.dialogVisible = true;
    },

    editCategory(val) {
      this.editType = "edit";
      this.id = val.id;
      this.form.name = val.name;
      this.form.cover = val.cover;
      this.form.description = val.description;
      this.dialogVisible = true;
    },

    deleteCategory(id) {
      this.$confirm("此操作将永久删除分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            this.loading = true;
            const res = await category.deleteCategory(id);
            if (res.errorCode === 0) {
              this.loading = false;
              await this.getCategories();
              this.$message.success(`${res.msg}`);
            } else {
              this.loading = false;
              this.$message.error(`${res.msg}`);
            }
          } catch (e) {
            this.loading = false;
            // eslint-disable-next-line no-console
            console.log(e);
          }
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },

    onHandleInfoResult(flag) {
      this.dialogVisible = false;
      if (flag === true) {
        this.getCategories();
      }
    },

    handleClose() {
      this.dialogVisible = false;
    }
  },
  created() {
    this.getCategories();
  }
};
</script>
<style lang="scss" scoped>
.box-card {
  margin: 20px 30px;
}
.view-title {
  justify-content: space-between;
}
.search-wrapper {
  display: flex;
  justify-content: flex-start;
  .add-btn {
    margin-right: 20px;
  }
  .search-btn {
    margin-left: 10px;
    border-radius: 3px;
  }
}
.cover {
  max-width: 150px;
  max-height: 150px;
}
</style>