<template>
  <div class="poster-box">
    <div class="poster-content">
      <h4 class="poster-title">名片海报</h4>
      <p class="poster-text">员工分享个人名片，商户可统一设置个人名片海报</p>
      <div class="poster-image">
        <p class="image-title">海报背景</p>
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :http-request="upLoad"
          action=""
          accept="image/*"
          class="avatar-uploader">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
        <p class="image-text">建议上传图片：600（宽）*650（高）</p>
      </div>
    </div>
    <div class="poster-content">
      <h4 class="poster-title">预览海报</h4>
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
import { officialImgSaveAPI } from '@/api/SystemManagement/poster'
export default {
  data() {
    return {
      imageUrl: ''
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
        const params = {
          path: res.url,
          type: '1'
        }
        officialImgSaveAPI(params).then(res => {})
      })
    }
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
