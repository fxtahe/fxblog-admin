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
                <el-form ref="form" :rules="rules" :model="form" v-loading="loading">
                  <el-form-item label="新密码" prop="password">
                    <el-input v-model="form.password" />
                  </el-form-item>
                  <el-form-item label="确认密码" prop="checkPassword">
                    <el-input v-model="form.checkPassword" />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submit('form')">Update</el-button>
                    <el-button @click="resetForm('form')">Reset</el-button>
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
import { mapGetters } from "vuex";
import Account from "./components/Account";
import UserCard from "./components/UserCard";
import author from "@/api/author";
import store from "@/store/index";
export default {
  components: {
    UserCard,
    Account
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "" || typeof value === "undefined") {
        callback(new Error("请输入密码"));
      } else if (value.length < 6) {
        callback(new Error("密码长度不少于6位"));
      } else {
        if (this.form.checkPassword !== "") {
          this.$refs.form.validateField("checkPass");
        }
        callback();
      }
    };
    const validateCheckPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.form.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      rules: {
        password: [{ validator: validatePass }],
        checkPassword: [{ validator: validateCheckPass }]
      },
      form: {
        password: "",
        checkPassword: ""
      },
      user: {
        name: this.$store.state.user.name,
        github: this.$store.state.user.github,
        email: this.$store.state.user.email,
        avatar: this.$store.state.user.avatar,
        introduction: this.$store.state.user.introduction
      },
      activeTab: "account"
    };
  },
  methods: {
    async submit(form) {
      this.$refs[form].validate(async valid => {
        if (valid) {
          try {
            this.loading = true;
            console.log(this.form.pass);
            await author.changePassword(this.form);
            this.loading = false;
            store.dispatch("user/logout");
            this.$message.success("修改密码成功,请重新登录");
          } catch (e) {
            console.log(e);
            this.loading = false;
            this.$message.error("修改密码失败");
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(form) {
      this.$refs[form].resetFields();
    }
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
