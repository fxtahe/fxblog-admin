<template>
  <div class="container">
    <div class="view-title">
      标签管理
      <div class="search-wrapper">
        <el-input
          size="medium"
          placeholder="搜索..."
          prefix-icon="el-icon-search"
          clearable
          v-model="searchVal"
          maxlength="10"
          @clear="clearSearch"
        ></el-input>
        <el-button class="search-btn" type="primary" size="medium" @click="search(searchVal)">搜索</el-button>
      </div>
    </div>
    <el-card class="box-card">
      <el-table v-loading="loading" :data="tags" fit highlight-current-row>
        <el-table-column align="center" label="ID" width="80">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column min-width="300px" label="名称">
          <template slot-scope="{row}">
            <template v-if="row.edit">
              <el-input v-model="row.tagName" class="edit-input" size="small" />
              <el-button
                class="cancel-btn"
                size="small"
                icon="el-icon-refresh"
                type="warning"
                @click="cancelEdit(row)"
              >取消</el-button>
            </template>
            <span v-else>{{ row.tagName }}</span>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作" width="170">
          <template slot-scope="{row}">
            <el-button
              v-if="row.edit"
              type="success"
              size="small"
              icon="el-icon-circle-check-outline"
              @click="confirmEdit(row)"
            >确认</el-button>
            <el-button v-else type="primary" size="small" @click="row.edit=!row.edit">编辑</el-button>
            <el-button type="danger" size="mini" @click="deleteTag(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import tag from "@/api/tag";

export default {
  name: "Tag",
  data() {
    return {
      loading: false,
      searchVal: "",
      tags: []
    };
  },
  methods: {
    async getTags() {
      try {
        this.loading = true;

        const { data } = await tag.getTags();

        this.tags = data.map(v => {
          this.$set(v, "edit", false); // https://vuejs.org/v2/guide/reactivity.html
          v.originalName = v.tagName; //  will be used when user click the cancel botton
          return v;
        });
        this.loading = false;
      } catch (e) {
        this.$message.error("获取标签失败");
        this.loading = false;
      }
    },
    cancelEdit(row) {
      row.tagName = row.originalName;
      row.edit = false;
    },
    async confirmEdit(row) {
      row.edit = false;
      row.originalName = row.tagName;
      try {
        await tag.updateTag(row);
        this.$message({
          message: "修改成功",
          type: "success"
        });
      } catch (e) {
        this.$message({
          message: "修改失败",
          type: "success"
        });
      }
    },
    deleteTag(val) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          try {
            this.loading = true;
            let res = await tag.deleteTag(val.id);
            this.loading = false;
            await this.getTags();
            this.$message({
              type: "success",
              message: "删除成功"
            });
          } catch (e) {
            this.$message.error("删除失败");
            this.loading = false;
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    async search(val) {
      if (val != null && val.trim() != "" && typeof val != "undefined") {
        try {
          this.loading = true;

          const { data } = await tag.searchTags(val);

          this.tags = data.map(v => {
            this.$set(v, "edit", false); // https://vuejs.org/v2/guide/reactivity.html
            v.originalName = v.tagName; //  will be used when user click the cancel botton
            return v;
          });
          this.loading = false;
        } catch (e) {
          this.$message.error("获取标签失败");
          this.loading = false;
          console.log(e);
        }
      } else {
        this.getTags;
      }
    },
    clearSearch() {
      this.searchVal = "";
      this.getTags();
    }
  },
  created() {
    this.getTags();
  }
};
</script>
<style lang="scss" scoped>
.box-card {
  margin: 20px 30px;
}
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.view-title {
  justify-content: space-between;
}
.search-wrapper {
  display: flex;
  justify-content: flex-start;

  .search-btn {
    margin-left: 10px;
    border-radius: 3px;
  }
}
</style>