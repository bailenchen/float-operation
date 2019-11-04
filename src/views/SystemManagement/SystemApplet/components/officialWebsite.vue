<template>
  <div class="poster-box">
    <div class="poster-content">
      <h4 class="poster-title">官网设置</h4>
      <p class="poster-text">可在这里统一更新编辑官网，支持多张上传</p>
      <div class="poster-image">
        <p class="image-title">官网详情图</p>
        <el-upload
          :on-remove="handleRemove"
          :file-list="fileList"
          :http-request="upLoad"
          class="upload-demo"
          action=""
          list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">图片建议上传：750*1334</div>
        </el-upload>
      </div>
    </div>
    <div class="poster-content">
      <h4 class="poster-title">预览官网</h4>
      <div class="poster-image">
        <el-image class="poster-image-main"/>
        <p class="poster-image-text">暂无数据</p>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
'use strict'
import { crmFileSave } from '@/api/common'
export default {
  data() {
    return {
      imageUrl: '',
      fileList: []
    }
  },
  methods: {
    /** 上传成功的回调 */
    handleAvatarSuccess(file) {
      console.log(file, '==file==')
    },
    /** 上传到服务器 */
    upLoad(file) {
      crmFileSave({ file: file.file }).then(res => {
        this.imageUrl = res.url
        this.fileList.push(
          { name: res.name, url: res.url }
        )
      })
    },
    /** 删除图片 */
    handleRemove() {}
  }
}
</script>

<style lang="scss" scope>
.poster-box {
    display: flex;
    .poster-content {
      margin-left: 20px;
      margin-right: 277px;
       .poster-title {
        color: #333;
        font-size: 15px;
        height: 24px;
        line-height: 24px;
        border-left: 2px solid #2362FB;
        font-weight: 600;
        padding-left: 10px;
       }
       .poster-text {
           padding-left: 10px;
           color: #333;
           font-size: 13px;
           margin: 20px 0 ;
       }
       .poster-image {
           .poster-image-main {
               margin: 20px 0;
               width: 194px;
               height: 243px;
           }
           .image-title {
               padding-left: 10px;
            margin: 20px 0 ;
            color: #333;
               font-size: 14px;
        }
        .poster-image-text {
            width: 194px;
            height: 50px;
            text-align: center;
        }
        .image-text {
            width: 202px;
            height: 18px;
            color: rgba(153, 153, 153, 1);
            font-size: 12px;
            text-align: left;
            margin-top: 5px;
        }
       }
   }
}
 .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 194px;
    height: 243px;
    line-height: 243px;
    text-align: center;
  }
  .avatar {
    width: 194px;
    height: 243px;
    display: block;
  }
</style>
