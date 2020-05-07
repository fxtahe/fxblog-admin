<template>
  <div class="container">
    <div class="view-title">个人中心</div>
    <div v-if="user" class="info-container">
      <el-row :gutter="20">
        <el-col :span="6" :xs="24">
          <user-card :user="user" />
        </el-col>
        <el-col :span="18" :xs="24">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="个人信息" name="account">
                <account :user="user" />
              </el-tab-pane>
              <el-tab-pane label="修改密码" name="password">
                <el-form>
                  <el-form-item label="旧密码">
                    <el-input />
                  </el-form-item>
                  <el-form-item label="新密码">
                    <el-input />
                  </el-form-item>
                  <el-form-item label="确认密码">
                    <el-input />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submit">Update</el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import Account from "./components/Account";
import UserCard from "./components/UserCard";
export default {
  components: {
    UserCard,
    Account
  },
  data() {
    return {
      user: {},
      activeTab: "account"
    };
  }
};
</script>
<style lang="scss" scoped>
.info-container {
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
}
</style>