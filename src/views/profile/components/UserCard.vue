<template>
  <el-card style="margin-bottom: 20px;">
    <div slot="header" class="clearfix">
      <span>About me</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <div class="avatar-wrapper" @click="changeAvatar">
          <img :src="avatarUrl" class="user-avatar" />
        </div>
      </div>
      <div class="box-center">
        <div class="user-name text-center">{{ user.name }}</div>
        <div class="user-role text-center text-muted"></div>
      </div>
    </div>
    <!-- 修改头像弹窗 -->
    <el-dialog
      title="剪裁"
      append-to-body
      :visible.sync="cropVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      custom-class="croppa-dialog"
      center
    >
      <div class="cropper-content">
        <el-row>
          <el-col :span="12">
            <div class="croppa-wrapper">
              <vueCropper
                ref="cropper"
                :img="option.img"
                :outputSize="option.size"
                :outputType="option.outputType"
                :info="option.true"
                :full="option.full"
                :canMove="option.canMove"
                :canMoveBox="option.canMoveBox"
                :original="option.original"
                :autoCrop="option.autoCrop"
                :autoCropWidth="option.autoCropWidth"
                :autoCropHeight="option.autoCropHeight"
                :fixed="option.fixed"
                :fixedBox="option.fixedBox"
                :fixedNumber="option.fixedNumber"
                :centerBox="option.centerBox"
                :infoTrue="option.infoTrue"
                @realTime="realTime"
              ></vueCropper>
            </div>
          </el-col>
          <el-col :span="12">
            <div
              class="croppa-preview"
              :style="{'width': previews.w + 'px', 'height': previews.h + 'px',  'overflow': 'hidden','zoom':'0.75'}"
            >
              <div :style="previews.div" class>
                <img :src="previews.url" :style="previews.img" />
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-row style="margin-top: 20px;">
        <el-col :span="2">
          <a class="file-btn el-button--primary">
            <i class="el-icon-upload el-button--primary"></i>
            <input
              type="file"
              name
              id
              accept="image/png, image/jpeg, image/gif, image/jpg"
              @change="uploadImg($event, 1)"
            />
          </a>
        </el-col>
        <el-col :span="12" style="margin-left: 6%;">
          <input
            type="button"
            class="croppa-btn el-button--primary"
            value="+"
            title="放大"
            @click="changeScale(1)"
          />
          <input
            type="button"
            class="croppa-btn el-button--primary"
            value="-"
            title="缩小"
            @click="changeScale(-1)"
          />
          <input
            type="button"
            class="croppa-btn el-button--primary"
            value="↺"
            title="左旋转"
            @click="rotateLeft"
          />
          <input
            type="button"
            class="croppa-btn el-button--primary"
            value="↻"
            title="右旋转"
            @click="rotateRight"
          />
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cropVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleCrop" size="small">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import { VueCropper } from "vue-cropper";
import header from "@/assets/header.jpg";
import uploadFile from "@/api/upload";
import author from "@/api/author";
export default {
  components: {
    VueCropper
  },
  props: {
    user: {
      type: Object,
      default: () => {
        return {
          name: "",
          email: "",
          avatar: "",
          role: ""
        };
      }
    }
  },
  data() {
    return {
      cropVisible: false,
      value: 0,
      previews: {},
      fileName: "", //本机文件地址
      option: {
        img: this.user.avatar, // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 裁剪生成图片的质量
        outputType: "png", // 裁剪生成图片的格式
        canScale: false, // 图片是否允许滚轮缩放
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 450, // 默认生成截图框宽度
        autoCropHeight: 450, // 默认生成截图框高度
        fixedBox: false, // 固定截图框大小 不允许改变
        fixed: true, // 是否开启截图框宽高固定比例
        fixedNumber: [1, 1], // 截图框的宽高比例
        full: false, // 是否输出原图比例的截图
        canMoveBox: true, // 截图框能否拖动
        original: false, // 上传图片按照原始比例渲染
        centerBox: true, // 截图框是否被限制在图片里面
        infoTrue: true // true 为展示真实输出图片宽高 false 展示看到的截图框宽高
      }
    };
  },
  methods: {
    handleClose() {
      this.cropVisible = false;
    },
    async handleCrop() {
      this.$refs.cropper.getCropBlob(async img => {
        const { data } = await uploadFile.uploadImage(img);
        let param = { avatar: data.url };
        await author.updateAvatar(param);
        this.$store.dispatch("user/updateAvatar", data.url);
      });
      this.cropVisible = false;
    },
    changeAvatar() {
      this.cropVisible = true;
    },
    realTime(data) {
      this.previews = data;
    },
    //放大/缩小
    changeScale(num) {
      num = num || 1;
      this.$refs.cropper.changeScale(num);
    },
    //左旋转
    rotateLeft() {
      this.$refs.cropper.rotateLeft();
    },
    //右旋转
    rotateRight() {
      this.$refs.cropper.rotateRight();
    },
    //选择本地图片
    uploadImg(e, num) {
      var _this = this;
      //上传图片
      var file = e.target.files[0];
      _this.fileName = file.name;
      if (!/\.(gif|jpg|jpeg|png|bmp|GIF|JPG|PNG)$/.test(e.target.value)) {
        alert("图片类型必须是.gif,jpeg,jpg,png,bmp中的一种");
        return false;
      }
      var reader = new FileReader();
      reader.onload = e => {
        let data;
        if (typeof e.target.result === "object") {
          // 把Array Buffer转化为blob 如果是base64不需要
          data = window.URL.createObjectURL(new Blob([e.target.result]));
        } else {
          data = e.target.result;
        }
        if (num === 1) {
          _this.option.img = data;
        } else if (num === 2) {
          //_this.example2.img = data;
        }
      };
      // 转化为base64
      // reader.readAsDataURL(file)
      // 转化为blob
      reader.readAsArrayBuffer(file);
    }
  },
  computed: {
    avatarUrl() {
      return this.$store.state.user.avatar;
    }
  }
};
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.user-avatar {
  cursor: pointer;
  width: 90px;
  height: 90px;
  border-radius: 10px;
}
.croppa-wrapper {
  width: 250px;
  height: 250px;
  margin: 0 auto;
  border: 2px dashed;
}
.croppa-preview {
  position: absolute;
  top: 50%;
  margin: auto;
  transform: translate(50%, -50%);
  border-radius: 10px;
  box-shadow: 0 0 4px #ccc;
  overflow: hidden;
}
.croppa-btn {
  border: none;
  border-radius: 3px;
  height: 25px;
  width: 25px;
  font-size: 12px;
  margin: 3px 5px;
}
.file-btn {
  position: relative;
  display: inline-block;
  //background: #d0eeff;
  border: 1px solid #99d3f5;
  border-radius: 4px;
  padding: 4px 12px;
  overflow: hidden;
  color: #1e88c7;
  text-decoration: none;
  text-indent: 0;
  margin: 3px 5px;
  height: 25px;
  input {
    position: absolute;
    font-size: 100px;
    right: 0;
    top: 0;
    opacity: 0;
  }
  // &:hover {
  //   background: #aadffd;
  //   border-color: #78c3f3;
  //   color: #004974;
  //   text-decoration: none;
  // }
}
</style>
