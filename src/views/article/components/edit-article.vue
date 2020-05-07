<template>
  <div class="post-container">
    <div class="view-title">
      <div>
        <span v-if="isEdit" class="back" @click="$emit('handleBack', false)">
          <i class="el-icon-back"></i>
          返回&nbsp;|
        </span>
        {{ isEdit ? " 编辑文章" : " 添加文章" }}
      </div>
      <div>
        <el-button style="float: right;" type="info">草稿</el-button>
        <el-button style="float: right;margin-right: 10px" type="success">发布</el-button>
      </div>
    </div>
    <el-card class="box-card">
      <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
        <div class="post-main-container">
          <el-row>
            <el-col :span="24">
              <el-form-item style="margin-bottom: 40px;" prop="title">
                <MDinput v-model="postForm.title" :maxlength="100" name="name" required>Title</MDinput>
              </el-form-item>

              <div class="postInfo-container">
                <el-row></el-row>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="70px" label="Category">
                <el-select v-model="categoryValue" placeholder="请选择分类">
                  <el-option
                    v-for="item in categories"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item style="margin-bottom: 40px;" label-width="70px" label="Tag">
                <el-select
                  v-model="tagValue"
                  multiple
                  filterable
                  allow-create
                  default-first-option
                  placeholder="请选择标签"
                >
                  <el-option
                    v-for="item in tags"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item style="margin-bottom: 40px;" label-width="70px" label="Cover">
                <el-input placeholder="图片链接">
                  <el-button :rows="1" class="upload-btn" slot="append" icon="el-icon-upload"></el-button>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item style="margin-bottom: 40px;" label-width="70px" label="Excerpt">
              <el-input
                v-model="postForm.content_short"
                :rows="1"
                type="textarea"
                class="article-textarea"
                autosize
                placeholder="Please enter the content"
              />
            </el-form-item>
          </el-row>
          <el-form-item prop="content" style="margin-bottom: 30px;">
            <markdown-editor />
          </el-form-item>
        </div>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import MDinput from "@/components/MDinput";
import MarkdownEditor from "@/components/MarkdownEditor/pro";
import { validURL } from "@/utils/validate";
const defaultForm = {
  status: "draft",
  title: "", // 文章题目
  content: "", // 文章内容
  content_short: "", // 文章摘要
  source_uri: "", // 文章外链
  image_uri: "", // 文章图片
  display_time: undefined, // 前台展示时间
  id: undefined,
  platforms: ["a-platform"],
  comment_disabled: false
};
export default {
  components: {
    MarkdownEditor,
    MDinput
  },
  props: {
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (value === "") {
        this.$message({
          message: rule.field + "为必传项",
          type: "error"
        });
        callback(new Error(rule.field + "为必传项"));
      } else {
        callback();
      }
    };
    const validateSourceUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback();
        } else {
          this.$message({
            message: "外链url填写不正确",
            type: "error"
          });
          callback(new Error("外链url填写不正确"));
        }
      } else {
        callback();
      }
    };
    return {
      postForm: Object.assign({}, defaultForm),
      loading: false,
      userListOptions: [],
      categoryValue: "",
      categories: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
      tags: [
        {
          value: "HTML",
          label: "HTML"
        },
        {
          value: "CSS",
          label: "CSS"
        },
        {
          value: "JavaScript",
          label: "JavaScript"
        }
      ],
      tagValue: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: "blur" }]
      },
      tempRoute: {}
    };
  }
};
</script>
<style lang="scss" scoped>
@import "~@/styles/mixin.scss";
.post-container {
  position: relative;

  .post-main-container {
    padding: 40px 45px 20px 50px;

    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;

      .postInfo-container-item {
        float: left;
      }
    }
  }

  .word-counter {
    width: 40px;
    position: absolute;
    right: 10px;
    top: 0px;
  }
}

.article-textarea ::v-deep {
  textarea {
    padding-right: 40px;
    resize: none;
    border: none;
    border-radius: 0px;
    border-bottom: 1px solid #bfcbd9;
  }
}
.view-title {
  justify-content: space-between;
  .back {
    cursor: pointer;
    margin-right: 6px;
    > i {
      margin-right: 5px;
    }
    &:after {
      content: "";
      position: absolute;
      width: 1px;
      height: 16px;
      right: -20px;
      top: 50%;
      transform: translateY(-50%);
      background-color: #dcdfe6;
    }
  }
}
.box-card {
  margin: 20px 30px;
}
.upload-btn {
  &:hover,
  &:active,
  &:focus {
    background: #b3d8ff;
  }
}
</style>
