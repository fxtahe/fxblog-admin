<template>
  <div>
    <el-form ref="currentUser" :rules="rules" :model="currentUser" v-loading="loading">
      <el-form-item label="Name" prop="name">
        <el-input v-model.trim="currentUser.name" />
      </el-form-item>
      <el-form-item label="Github" prop="github">
        <el-input v-model.trim="currentUser.github" />
      </el-form-item>
      <el-form-item label="Email" prop="email">
        <el-input v-model.trim="currentUser.email" />
      </el-form-item>
      <el-form-item label="Introduction">
        <el-input type="textarea" :rows="4" v-model.trim="currentUser.introduction" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit('currentUser')">Update</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { validGithubUrl, validEmail, validUsername } from "@/utils/validate";
import store from "@/store/index";
import author from "@/api/author";
export default {
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: "",
          email: "",
          github: "",
          introduction: ""
        };
      }
    }
  },
  data() {
    const checkName = (rule, value, callback) => {
      if (value === "" || typeof value === "undefined") {
        callback(new Error("用户名不能为空"));
      }
      if (!validUsername(value)) {
        callback(new Error("用户名不规范"));
      }
      callback();
    };
    const checkGithub = (rule, value, callback) => {
      if (!validGithubUrl(value)) {
        callback(new Error("用户名不规范"));
      }
      callback();
    };
    const checkEmail = (rule, value, callback) => {
      if (!validEmail(value)) {
        callback(new Error("邮箱格式错误"));
      }
      callback();
    };

    return {
      currentUser: this.user,
      loading: false,
      rules: {
        name: [{ validator: checkName }],
        github: [{ validator: checkGithub }],
        email: [{ validator: checkEmail }]
      }
    };
  },

  methods: {
    async submit(form) {
      console.log(this.currentUser);
      this.$refs[form].validate(async valid => {
        if (valid) {
          this.loading = true;
          try {
            await author.updateAuthor(this.currentUser);
            await store.dispatch("user/getInfo");
            this.loading = false;
            this.$message.success("修改用户信息成功");
          } catch (e) {
            console.log(e);
            this.loading = false;
            this.$message.error("修改用户信息失败");
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>
