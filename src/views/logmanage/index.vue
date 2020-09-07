<template>
  <div class="container">
    <div class="view-title">日志管理</div>
    <el-card class="box-card">
      <el-form ref="form" :model="queryForm" label-width="70px">
        <el-row type="flex" justify="center">
          <el-col :span="4">
            <el-form-item label="日志级别">
              <el-select v-model="queryForm.logLevel" placeholder="日志级别">
                <el-option label="debug" value="debug"></el-option>
                <el-option label="info" value="info"></el-option>
                <el-option label="error" value="error"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="起止">
              <el-col :span="11">
                <el-date-picker
                  type="datetime"
                  placeholder="开始时间"
                  v-model="queryForm.startTime"
                  style="width: 100%;"
                ></el-date-picker>
              </el-col>
              <el-col class="line" :span="1" style="text-align: center;">-</el-col>
              <el-col :span="11">
                <el-date-picker
                  placeholder="结束时间"
                  type="datetime"
                  v-model="queryForm.endTime"
                  style="width: 100%;"
                ></el-date-picker>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" size="medium" @click="queryPage()">查询</el-button>
            <el-button size="medium" @click="clearQuery()">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <el-table
        :data="logs"
        v-loading="loading"
        style="width: 100%"
        :row-class-name="tableRowClassName"
      >
        <el-table-column prop="id" label="ID" width="320"></el-table-column>
        <el-table-column prop="logLevel" label="级别" width="60"></el-table-column>
        <el-table-column prop="userType" label="用户类型" width="80"></el-table-column>
        <el-table-column prop="userName" label="用户名称" width="80"></el-table-column>
        <el-table-column prop="operationModule" label="操作模块" width="80"></el-table-column>
        <el-table-column prop="operationType" label="操作类型" width="80"></el-table-column>
        <el-table-column prop="requestIp" label="请求IP" width="180"></el-table-column>
        <el-table-column prop="requestUri" label="请求URI" width="180"></el-table-column>
        <el-table-column prop="createDate" label="操作时间" width="180"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="small" @click="handleView(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @current-change="handleCurrentPage"
          layout="prev, pager, next, jumper"
          :total="total"
          :background="true"
          :page-size="size"
          :currentPage="currentPage"
        ></el-pagination>
      </div>
    </el-card>
    <el-dialog title="日志详情" append-to-body :visible.sync="dialogVisible">
      <div class="log-info">
        <div class="info-detail">
          <el-row>
            <label>ID</label>
            <div class="info-content">{{log.id}}</div>
          </el-row>

          <el-row>
            <el-col :span="8">
              <label>日志级别</label>
              <el-tag :type="logTag">{{log.logLevel}}</el-tag>
            </el-col>
            <el-col :span="8">
              <label>用户类型</label>
              <div class="info-content">{{log.userType}}</div>
            </el-col>
            <el-col :span="8">
              <label>用户名称</label>
              <div class="info-content">{{log.userName}}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <label>操作模块</label>
              <div class="info-content">{{log.operationModule}}</div>
            </el-col>
            <el-col :span="8">
              <label>操作类型</label>
              <div class="info-content">{{log.operationType}}</div>
            </el-col>
            <el-col :span="8">
              <label>操作描述</label>
              <div class="info-content">{{log.operationDesc}}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <label>请求URI</label>
              <div class="info-content">{{log.requestUri}}</div>
            </el-col>
            <el-col :span="8">
              <label>请求IP</label>
              <div class="info-content">{{log.requestIp}}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <label>请求方法</label>
              <div class="info-content">{{log.requestMethod}}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <label>请求入参</label>
              <el-input type="textarea" :rows="4" v-model="log.requestParameter"></el-input>
            </el-col>
          </el-row>
          <div v-if="log.logLevel!='error'">
            <el-row>
              <label>请求结果</label>
              <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="log.requestResult"></el-input>
            </el-row>
          </div>
          <div v-else>
            <el-row>
              <el-col>
                <label>异常名称</label>
                <el-input type="textarea" :rows="4" v-model="log.excName"></el-input>
              </el-col>
            </el-row>
            <el-row>
              <label>异常信息</label>
              <el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="log.excMessage"></el-input>
            </el-row>
          </div>
          <el-row>
            <label>操作时间</label>
            <div class="info-content">{{log.createDate}}</div>
          </el-row>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import logApi from "@/api/log";
const form = {
  id: null,
  logLevel: null,
  startTime: null,
  endTime: null,
};
export default {
  data() {
    return {
      currentPage: 1,
      size: 10,
      total: 0,
      loading: false,
      logs: [],
      queryForm: form,
      dialogVisible: false,
      log: {},
    };
  },
  methods: {
    handleView(row) {
      this.dialogVisible = true;
      this.log = row;
    },
    tableRowClassName({ row, rowIndex }) {
      if (row.logLevel === "debug") {
        return "info-row";
      } else if (row.logLevel === "error") {
        return "warning-row";
      } else if (row.logLevel === "info") {
        return "success-row";
      }
      return "";
    },
    clearQuery() {
      if (this.queryForm) {
        this.queryForm = {};
        this.query();
      }
    },
    queryPage() {
      this.query(this.currentPage);
    },
    handleCurrentPage(current) {
      this.query(current);
    },
    async query(current = 1) {
      this.loading = true;

      try {
        let param = {
          size: this.size,
          data: this.queryForm,
          current,
        };

        const { data } = await logApi.getLogInfoPage(param);
        console.log(data);
        if (data) {
          this.currentPage = data.current;
          this.total = data.total;
          this.logs = data.records;
        }
        this.loading = false;
      } catch (e) {
        this.loading = false;
        this.$message.error("查询失败");
      }
    },
  },
  computed: {
    logTag() {
      return this.log.logLevel == "error" ? "danger" : "success";
    },
  },
  created() {
    this.query();
  },
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
.success-row {
  background: #f0f9eb;
}
.warning-row {
  background: #fbdfdf;
}
.log-info {
  h2 {
    text-align: center;
    font-size: 18px;
    font-weight: 600;
  }
  .info-detail {
    margin-left: 20px;
  }
  label {
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
  }
  .info-content {
    line-height: 40px;
    position: relative;
    font-size: 16px;
  }
}
</style>