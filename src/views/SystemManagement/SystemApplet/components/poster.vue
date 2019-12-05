<template>
  <flexbox
    v-loading="loading"
    align="stretch"
    class="poster-box">
    <create-sections title="名片海报" class="poster-content">
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
        <p class="image-des">建议上传图片：600（宽）*650（高）</p>
      </div>
    </create-sections>
    <create-sections title="预览海报" class="poster-content">
      <div class="preview-image">
        <canvas id="myCanvas" width="600" height="764" style="width:300px; height:382px"/>
      </div>
      <div class="preview-handle">
        <el-button type="primary" @click="downloadPoster">海报下载</el-button>
      </div>
    </create-sections>
  </flexbox>
</template>

<script type="text/javascript">
import {
  wechatQueryAPI,
  officialImgSaveAPI,
  visitingCardQueryByUserIdAPI,
  officialImgQueryListByTypeAPI } from '@/api/systemManagement/poster'
import { mapGetters } from 'vuex'
import CreateSections from '@/components/CreateSections'

export default {
  components: {
    CreateSections
  },
  data() {
    return {
      loading: false,
      imageUrl: '', // 海报
      imageUrlImg: null, // 海报img data
      EWurl: '', // 二维码
      EWurlImg: null, // 二维码 img data
      info: {
        companyName: '',
        realname: ''
      }
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    imageUrl() {
      this.imageUrlImg = null
      var img = new Image() // 创建img元素
      img.onload = () => {
        this.imageUrlImg = img
        this.drawPoster()
      }
      img.setAttribute('crossOrigin', 'Anonymous')
      img.src = this.imageUrl // 设置图片源地址
    },
    EWurl() {
      var img = new Image() // 创建img元素
      img.onload = () => {
        this.EWurlImg = img
        this.drawPoster()
      }
      img.setAttribute('crossOrigin', 'Anonymous')
      img.src = this.EWurl // 设置图片源地址
    },
    info() {
      this.drawPoster()
    }
  },
  mounted() {
    this.getFileList()
    this.getCompanyInfo()
    this.getRD()
  },
  methods: {
    /**
     * 展示预览海报
     */
    drawPoster() {
      if (this.imageUrlImg && this.EWurlImg) {
        this.$nextTick(() => {
          var canvas = document.getElementById('myCanvas')
          var ctx = canvas.getContext('2d')
          ctx.clearRect(0, 0, 600, 764)
          // 设置画布背景色
          ctx.fillStyle = '#fff'
          ctx.fillRect(0, 0, 600, 764)

          // 绘制背景图片
          ctx.drawImage(this.imageUrlImg, 0, 0, 600, 650)

          // 绘制文本
          ctx.scale(1, 1)
          ctx.font = '32px sans-serif'
          ctx.textAlign = 'left'
          ctx.fillStyle = '#000'

          ctx.fillText(this.info.realname, 42, 700)

          ctx.font = '24px sans-serif'
          ctx.fillStyle = '#999'
          ctx.fillText(this.info.companyName, 42, 735)

          ctx.drawImage(this.EWurlImg, 405, 578, 150, 150)
        })
      }
    },


    /**
     * 查看图片列表
     */
    getFileList() {
      this.loading = true
      officialImgQueryListByTypeAPI({ type: 2 }).then(res => {
        this.imageUrl = res.data[0].filePath
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * 公司信息
     */
    getCompanyInfo() {
      visitingCardQueryByUserIdAPI({ userId: this.userInfo.userId }).then(res => {
        if (res.data) {
          this.info = res.data
        } else {
          this.info = {
            companyName: '未知',
            realname: '未知'
          }
        }
      }).catch(() => {})
    },

    /**
     * 获取二维码
     */
    getRD() {
      wechatQueryAPI({ type: 2 }).then(res => {
        this.EWurl = res.data.weixinImg
      }).catch(() => {
      })
    },

    /**
     * 上传成功的回调
     */
    handleAvatarSuccess(file) {
      console.log(file, '==file==')
    },

    /**
     * 上传到服务器
     */
    upLoad(file) {
      const params = {
        file: file.file,
        type: '2'
      }
      this.loading = true
      officialImgSaveAPI(params).then(res => {
        this.loading = false
        this.imageUrl = res.data.filePath
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * 海报下载
     */
    downloadPoster() {
      var link = document.createElement('a')
      link.download = '海报.png'
      link.href = document.getElementById('myCanvas').toDataURL('image/png')
      link.click()
    }
  }
}
</script>

<style lang="scss" scope>
.poster-box {
    .poster-content {
        margin-top: 0;
        flex: 1;
        color: #333;

        .poster-text {
            padding-left: 15px;
            font-size: 12px;
            margin: 20px 0;
        }
        .poster-image {
            padding-left: 15px;
            .poster-image-main {
                margin: 0 !important;
                width: 300px;
                height: 325px;
            }
            .image-title {
                margin-bottom: 15px;
                font-size: 14px;
            }
            .image-des {
                color: #999;
                font-size: 12px;
                text-align: left;
                margin-top: 5px;
            }
        }
    }
}

.preview-image {
  margin: 20px 0 0 15px;
  #myCanvas {
    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
    border-radius: 4px;
  }
}

.preview-handle {
  width: 310px;
  padding-left: 10px;
  padding-top: 10px;
  text-align: right;
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
    height: 325px;
    display: block;
}
</style>
