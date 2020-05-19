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
                <el-select v-model="postForm.category" value-key="id" placeholder="请选择分类">
                  <el-option
                    v-for="item in categories"
                    :key="item.id"
                    :label="item.categoryName"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="16">
              <el-form-item style="margin-bottom: 40px;" label-width="70px" label="Tag">
                <el-tag
                  :key="tag.id"
                  v-for="tag in postForm.tags"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)"
                >{{tag.tagName}}</el-tag>
                <el-select
                  v-model="postForm.tags"
                  value-key="id"
                  filterable
                  allow-create
                  multiple
                  ref="saveTagSelect"
                  v-if="tagVisible"
                  @change="handleInputConfirm"
                  @focus="handleBlur"
                  v-show="postForm.tags.length<3"
                >
                  <el-option
                    v-for="item in tags"
                    :key="item.id"
                    :label="item.tagName"
                    :value="item"
                  ></el-option>
                </el-select>
                <!-- <el-input
                  class="input-new-tag"
                  v-if="tagVisible "
                  v-model="tagValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                  v-show="tags.length<5"
                ></el-input>-->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput"
                  v-show="postForm.tags.length<3"
                >+ New Tag</el-button>
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
                v-model="postForm.excerpt"
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
import article from "@/api/article";
import category from "@/api/category";
import tag from "@/api/tag";
import { validURL } from "@/utils/validate";
const defaultForm = {
  id: undefined,
  title: "", // 文章题目
  content: "", // 文章内容
  excerpt: "", // 文章摘要
  authorId: "", //作者
  markdown: "", //markdown
  feature: "", //推荐
  cover: "", //封面
  state: "", //状态
  tags: [{ id: 1, tagName: "seata" }]
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
    },
    infoCategories: {
      type: Array,
      default: () => []
    },

    infoTags: {
      type: Array,
      default: () => []
    },
    form: {
      type: Object,
      default: () => {}
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
      tagVisible: false,
      tagValue: "",
      categoryValue: "",
      categories: [],
      tags: [],
      rules: {
        image_uri: [{ validator: validateRequire }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateRequire }],
        source_uri: [{ validator: validateSourceUri, trigger: "blur" }]
      }
    };
  },
  methods: {
    async getTags() {
      const { data } = await tag.getTags();
      this.tags = data;
    },
    async getCategoies() {
      const { data } = await category.getCategories();
      this.categories = data;
    },
    fitlerAll(arr) {
      let result = [].concat(arr);
      result.shift();
      return result;
    },
    handleClose(tag) {
      this.postForm.tags.splice(this.postForm.tags.indexOf(tag), 1);
    },
    handleBlur(val) {
      this.$refs.saveTagSelect.$refs.input.blur = () => {
        console.log(0);
        this.tagVisible = false;
      };
    },
    showInput() {
      this.tagVisible = true;
    },

    handleInputConfirm(val) {
      // let inputValue = this.tagValue;
      // if (inputValue) {
      //   this.tags.push(inputValue);
      // }
      //this.postForm.tags.push(val);
      this.tagVisible = false;
      console.log(this.postForm.tags);
      // this.tagValue = "";
    }
  },

  created() {
    if (this.isEdit) {
      this.categories = this.infoCategories;
      this.tags = this.infoTags;
      this.postForm = JSON.parse(JSON.stringify(this.form));
    } else {
      this.getTags();
      this.getCategoies();
    }
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
.el-select__tags {
  span {
    display: none;
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
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>
