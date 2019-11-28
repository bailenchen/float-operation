<template>
  <div v-loading="loading" class="poster-box">
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
          <div slot="tip" class="el-upload__tip">图片建议上传：750*1108</div>
        </el-upload>
      </div>
    </div>
    <div class="poster-content">
      <h4 class="poster-title">预览官网</h4>
      <div class="poster-image phone">
        <el-image :src="require('@/assets/img/weixin_ding2.png')"/>
        <div class="poster-image-box">
          <div class="poster-box-scroll">
            <el-image v-for="item in fileList" :key="item.url" :src="item.url" class="poster-image-main"/>
          </div>
        </div>
        <el-image :src="require('@/assets/img/weixin_di1.png')"/>
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
'use strict'
import { officialImgSaveAPI,
  officialImgDeleteAPI,
  officialImgQueryListByTypeAPI } from '@/api/SystemManagement/poster'
export default {
  data() {
    return {
      imageUrl: '',
      fileList: [],
      loading: false
    }
  },
  mounted() {
    this.getFileList()
  },
  methods: {
    /** 查看图片列表 */
    getFileList() {
      this.loading = true
      officialImgQueryListByTypeAPI({ type: 1 }).then(res => {
        res.data.forEach(item => {
          this.fileList.push(
            { name: item.name, url: item.filePath, officialImgId: item.officialImgId }
          )
          this.loading = false
        })
      }).catch(() => {})
    },
    /** 上传到服务器 */
    upLoad(file) {
      const params = {
        file: file.file,
        type: '1'
      }
      this.loading = true
      officialImgSaveAPI(params).then(res => {
        this.loading = false
        this.fileList.push(
          { name: res.data.name, url: res.data.filePath, officialImgId: res.data.officialImgId }
        )
      }).catch(() => {})
    },
    /** 删除图片 */
    handleRemove(file, fileList) {
      let imgId = ''
      this.loading = true
      this.fileList.forEach(item => {
        if (item.url === file.url) {
          imgId = item.officialImgId
        }
      })
      this.fileList = this.fileList.filter(item => {
        return item.url !== file.url
      })
      officialImgDeleteAPI({
        officialImgId: imgId
      }).then(res => {
        this.$message.success('删除成功')
        this.loading = false
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
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
       .phone {
         border-bottom: 8px solid #333;
         border-top: 5px solid #333;
         border-left: 3px solid #333;
         border-right: 3px solid #333;
         border-radius: 6px;
         margin-top:  10px;
         width: 262.5px;
         height: 492.5px;
         .poster-image-box {
           overflow-x: hidden;
           .poster-box-scroll {
              overflow-y: auto;
               overflow-x: hidden;
               width: 264px;
               height: 400px;
           }
         }
       }
       .poster-image {
           .poster-image-main {
               display: block;
               margin: 0 !important;
               width: 262px !important;
               height: 400px !important;
           }
           .image-title {
               padding-left: 10px;
               margin: 20px 0 ;
               color: #333;
               font-size: 14px;
        }
        .poster-image-text {
            width: 242px;
            height: 50px;
            text-align: center;
        }
        .image-text {
            width: 262px;
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
    width: 187.5px;
    height: 263px;
    line-height: 263px;
    text-align: center;
  }
  .avatar {
    width: 187.5px;
    height: 263px;
    display: block;
  }
</style>
