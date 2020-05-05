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
        <el-button class="search-btn" type="primary" size="medium" @click="search">搜索</el-button>
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
              <el-input v-model="row.name" class="edit-input" size="small" />
              <el-button
                class="cancel-btn"
                size="small"
                icon="el-icon-refresh"
                type="warning"
                @click="cancelEdit(row)"
              >取消</el-button>
            </template>
            <span v-else>{{ row.name }}</span>
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
            <el-button type="danger" size="mini" @click="deleteTag(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { getTags } from "@/api/tag";
const tags = [
  {
    id: 1,
    name: "seata"
  },
  {
    id: 2,
    name: "apollo"
  }
];
export default {
  name: "Tag",
  data() {
    return {
      loading: false,
      searchVal: "",
      tags: tags
    };
  },
  methods: {
    async getTags() {
      this.loading = true;

      //   const { data } = await getTags();
      //   const items = data.items;
      this.tags = tags.map(v => {
        this.$set(v, "edit", false); // https://vuejs.org/v2/guide/reactivity.html
        v.originalName = v.name; //  will be used when user click the cancel botton
        return v;
      });
      this.loading = false;
    },
    cancelEdit(row) {
      row.name = row.originalName;
      row.edit = false;
      this.$message({
        message: "The title has been restored to the original value",
        type: "warning"
      });
    },
    confirmEdit(row) {
      row.edit = false;
      row.originalName = row.name;
      this.$message({
        message: "The title has been edited",
        type: "success"
      });
    },
    clearSearch() {
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