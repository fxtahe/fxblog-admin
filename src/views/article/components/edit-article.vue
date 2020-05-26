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
        <el-button style="float: right;" type="info" @click="submit('postForm','draft')">草稿</el-button>
        <el-button
          style="float: right;margin-right: 10px"
          type="success"
          @click="submit('postForm','post')"
        >发布</el-button>
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
            <el-col :span="10">
              <el-form-item
                style="margin-bottom: 40px;"
                label-width="70px"
                label="Tag"
                v-if="reload"
              >
                <el-tag
                  :key="tag.tagName"
                  v-for="tag in postForm.tags"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)"
                >{{tag.tagName}}</el-tag>
                <el-autocomplete
                  class="inline-input input-new-tag"
                  v-if="tagVisible"
                  ref="saveInputTag"
                  v-model="tagValue"
                  value-key="tagName"
                  size="small"
                  :fetch-suggestions="querySearch"
                  @select="handleSelect"
                ></el-autocomplete>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput"
                  v-show="postForm.tags.length<3"
                >+ New Tag</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item style="margin-bottom: 40px;" label-width="70px" label="Feature">
                <el-switch
                  v-model="postForm.feature"
                  active-color="#13ce66"
                  inactive-color="#ff4949"
                ></el-switch>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="18">
              <el-form-item
                style="margin-bottom: 40px;"
                label-width="70px"
                label="Cover"
                prop="cover"
              >
                <image-upload v-if="reload" :value.sync="postForm.cover"></image-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item
              style="margin-bottom: 40px;"
              label-width="70px"
              label="Excerpt"
              prop="excerpt"
            >
              <el-input
                v-model="postForm.excerpt"
                :rows="1"
                type="textarea"
                class="article-textarea"
                autosize
                placeholder="请输入摘要"
              />
            </el-form-item>
          </el-row>
          <el-form-item prop="content" style="margin-bottom: 30px;">
            <markdown-editor
              v-if="reload"
              ref="markdown"
              v-model="postForm.content"
              :height="1000"
            />
          </el-form-item>
        </div>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import MDinput from "@/components/MDinput";
import MarkdownEditor from "@/components/MarkdownEditor/pro";
import ImageUpload from "@/components/ImageUpload";
import article from "@/api/article";
import category from "@/api/category";
import tag from "@/api/tag";
import { validURL } from "@/utils/validate";
const defaultForm = {
  id: undefined,
  title: "", // 文章题目
  content: "show time", // 文章内容
  excerpt: "", // 文章摘要
  authorId: "", //作者
  content: "",
  feature: false, //推荐
  cover: "", //封面
  state: "", //状态
  tags: [],
  category: {}
};
const states = {
  draft: 1,
  post: 2
};
export default {
  components: {
    MarkdownEditor,
    MDinput,
    ImageUpload
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
        callback(new Error(rule.field + "为必填项"));
      } else {
        callback();
      }
    };
    const validateContentRequire = (rule, value, callback) => {
      if (value === "") {
        this.$message({
          message: "内容不能为空",
          type: "error"
        });
        callback(new Error(rule.field + "为必填项"));
      } else {
        callback();
      }
    };
    const validateCoverUri = (rule, value, callback) => {
      if (value) {
        if (validURL(value)) {
          callback();
        } else {
          callback(new Error("图片链接不正确"));
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
      reload: "true",
      value: "",
      categories: [],
      tags: [],
      rules: {
        cover: [{ validator: validateCoverUri, trigger: "blur" }],
        title: [{ validator: validateRequire }],
        content: [{ validator: validateContentRequire }],
        excerpt: [{ validator: validateRequire }]
      }
    };
  },
  methods: {
    querySearch(queryString, cb) {
      var tags = this.tags;
      var results = queryString
        ? tags.filter(this.createFilter(queryString))
        : tags;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(queryString) {
      return tag => {
        return (
          tag.tagName.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
    handleSelect(item) {
      if (this.postForm.tags.indexOf(item) === -1) {
        this.postForm.tags.push(item);
      }

      this.tagValue = "";
      this.tagVisible = false;
    },
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
    showInput() {
      this.tagVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveInputTag.handleChange = val => {
          console.log(this.tagValue);
          if (val) {
            let flag = true;
            //判断标签是否已添加
            this.postForm.tags.forEach((i, index) => {
              if (val === i.tagName) {
                flag = false;
              }
            });
            let item = { id: undefined, tagName: val };
            //判断标签是否存在
            this.tags.forEach((i, index) => {
              if (val === i.tagName) {
                item = i;
              }
            });
            if (flag) {
              this.postForm.tags.push(item);
            }
          }
          this.tagVisible = false;
          this.tagValue = "";
        };
      });
    },

    submit(formName, stateName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          try {
            console.log(this.postForm);
            this.postForm.state = states[stateName];
            if (this.isEdit) {
              if (this.isEquel(this.postForm, this.form)) {
                this.$emit("handleBack", false);
                return;
              }

              console.log(this.postForm);
              try {
                await article.updateArticle(this.postForm);
                this.$message.success("修改成功");
                this.$emit("handleBack", true);
              } catch (e) {
                this.$message.error("修改失败");
              }
            } else {
              try {
                await article.createArticle(this.postForm);
                this.$message.success("新建成功");
                this.resetForm();
              } catch (e) {
                this.$message.success("新建失败");
              }
              console.log(this.postForm);
            }
          } catch (e) {
            console.log(e);
            this.$message.error("操作失败");
          }
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.postForm.tags.splice(0, this.postForm.tags.length);
      //this.$refs.upload.$refs.linkInput.value = "";
      this.postForm = JSON.parse(JSON.stringify(defaultForm));
      this.reload = false;

      this.$nextTick(() => {
        this.reload = true;
      });
    },
    // 判断是否有更改字段
    isEquel(source, target) {
      let isEquel = true;
      for (let key in source) {
        if (Array.isArray(source[key])) {
          if (source[key].join("") !== target[key].join("")) {
            isEquel = false;
          }
        } else {
          if (source[key] !== target[key]) {
            isEquel = false;
          }
        }
      }
      return isEquel;
    }
  },
  mounted() {},
  created() {
    if (this.isEdit) {
      this.categories = this.infoCategories;
      this.tags = this.infoTags;
      this.postForm = JSON.parse(JSON.stringify(this.form));
    } else {
      this.postForm.tags.splice(0, this.postForm.tags.length);
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
  :last-child {
    margin-right: 10px;
  }
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
