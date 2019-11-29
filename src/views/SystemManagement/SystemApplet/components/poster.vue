<template>
  <div v-loading="loading" class="poster-box">
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
      <div class="poster-image haibao">
        <el-image :src="imageUrl" class="poster-image-main"/>
        <el-image :src="EWurl" class="poster-ew"/>
        <p class="poster-image-text">{{ info.companyName }}</p>
        <p class="poster-image-text">{{ info.realname }}</p>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
'use strict'
import {
  wechatQueryAPI,
  officialImgSaveAPI,
  visitingCardQueryByUserIdAPI,
  officialImgQueryListByTypeAPI } from '@/api/SystemManagement/poster'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      imageUrl: '',
      info: {},
      loading: false,
      EWurl: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  mounted() {
    this.getFileList()
  },
  methods: {
    /** 查看图片列表 */
    getFileList() {
      this.loading = true
      officialImgQueryListByTypeAPI({ type: 2 }).then(res => {
        this.imageUrl = res.data[0].filePath
        this.loading = false
        this.getInfo()
      }).catch(() => {})
    },
    getInfo() {
      this.loading = true
      visitingCardQueryByUserIdAPI({ userId: this.userInfo.userId }).then(res => {
        if (res.data) {
          this.info = res.data
        } else {
          this.info = {
            companyName: '未知',
            realname: '未知'
          }
        }
        this.loading = false
        this.getRD()
      }).catch(() => {})
    },
    getRD() {
      wechatQueryAPI({ type: 2 }).then(res => {
        this.EWurl = res.data.weixinImg
        this.loading = false
      }).catch(() => {})
    },
    /** 上传成功的回调 */
    handleAvatarSuccess(file) {
      console.log(file, '==file==')
    },
    /** 上传到服务器 */
    upLoad(file) {
      const params = {
        file: file.file,
        type: '2'
      }
      this.loading = true
      officialImgSaveAPI(params).then(res => {
        this.loading = false
        this.imageUrl = res.data.filePath
        this.getInfo()
      }).catch(() => {})
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
        margin-bottom: 20px;
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
       .haibao {
              position: relative;
              height: 400px;
              border: 1px solid #e4e4e4;
           }
       .poster-image {
           .poster-image-main {
               margin: 0 !important;
               width:  300px;
               height: 325px;
           }
           .image-title {
               padding-left: 10px;
               margin: 20px 0 ;
               color: #333;
               font-size: 14px;
        }
        .poster-image-text {
            width: 300px;
            height: 20px;
            padding: 10px;
            font-size: 13px;
            color: #d9d9d9;
            text-align: left;
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
.poster-ew {
    width: 80px;
    background-color: #fff;
    position: absolute;
    left: 200px;
    bottom: 52px;
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
    width: 300px;
    height: 325px;
    line-height: 325px;
    text-align: center;
  }
  .avatar {
    width: 300px;
    height:  325px;
    display: block;
  }
</style>
