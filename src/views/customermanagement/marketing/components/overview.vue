<template>
  <div class="b-cont">
    <sections
      class="b-cells"
      title="活动信息"
      content-height="auto">
      <flexbox class="info-card-container">
        <flexbox
          align="center"
          class="info-card">
          <img src="@/assets/img/browse_count.png" >
          <div>
            <div class="title">提交总数</div>
            <div class="detail">{{ submitCount }}</div>
          </div>
        </flexbox>
        <flexbox
          align="center"
          class="info-card">
          <img src="@/assets/img/submit_count.png" >
          <div>
            <div class="title">浏览量</div>
            <div class="detail">{{ browseCount }}</div>
          </div>
        </flexbox>
      </flexbox>
    </sections>
    <sections
      class="b-cells"
      title="发布信息"
      content-height="auto">
      <div class="publish-container">
        <div class="publish-info">
          <div class="publish-info-title">分享二维码后可直接填写信息并提交</div>
          <div
            id="canvas"
            class="publish-info-content"/>
          <div class="publish-info-button">
            <el-button @click="handleClick('download')">下载二维码</el-button>
          </div>
        </div>
        <div class="web-info publish-info">
          <div class="publish-info-title">访问地址</div>
          <div class="publish-info-content">
            <a
              :href="path"
              target="_blank">{{ path }}</a>
          </div>
          <div class="publish-info-button">
            <el-button
              :data-clipboard-text="path"
              class="copyBtn"
              @click="handleClick('copy')">复制地址</el-button>
          </div>
        </div>
      </div>

    </sections>
    <sections
      class="b-cells"
      title="活动图片"
      content-height="auto">
      <div class="image">
        <div v-if="mainFileList.length > 0" class="image-info">
          <div class="image-info__label">活动主图</div>
          <div class="image-info__list">
            <img
              v-src="item.filePath"
              v-for="(item, index) in mainFileList"
              :key="index"
              class="main-img"
              @click="previewImage(mainFileList, index)">
          </div>
        </div>
        <div v-if="detailFileList.length > 0" class="image-info">
          <div class="image-info__label">详情图片</div>
          <div class="image-info__list">
            <img
              v-src="item.filePath"
              v-for="(item, index) in detailFileList"
              :key="index"
              class="detial-img"
              @click="previewImage(detailFileList, index)">
          </div>
        </div>
        <div v-if="detailFileList.length == 0 && mainFileList.length == 0" class="no-img">暂无图片</div>
      </div>

    </sections>
  </div>
</template>

<script>
import loading from '../../mixins/loading'
import Sections from '../../components/Sections'
import Clipboard from 'clipboard'
import QRCode from 'qrcodejs2'

export default {
  /** 活动管理 的 概览*/
  name: 'Overview',
  components: {
    Sections
  },
  mixins: [loading],
  props: {
    /** 详情 */
    detail: Object,
    /** 没有值就是全部类型 有值就是当个类型 */
    crmType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 提交数 浏览量
      name: '',
      submitCount: 0,
      browseCount: 0,
      // 路径
      path: '',
      // 二维码
      qrcode: null
    }
  },
  computed: {
    mainFileList() {
      if (this.detail && this.detail.mainFileList) {
        return this.detail.mainFileList
      }

      return []
    },

    detailFileList() {
      if (this.detail && this.detail.detailFileList && this.detail.detailFileList.length > 0) {
        return this.detail.detailFileList
      }

      return []
    }
  },
  watch: {
    detail: function() {
      this.getDetail()
    }
  },
  mounted() {
    if (this.detail) {
      this.getDetail()
    }
  },
  activated: function() {},
  deactivated: function() {},
  methods: {
    // 获取基础信息
    getDetail() {
      this.name = this.detail.marketingName
      this.submitCount = this.detail.submitNum
      this.browseCount = this.detail.browse
      this.path = `${WKConfig.getLocationOrigin()}/marketing/?marketingId=${this.detail.enMarketingId}&currentUserId=${this.detail.currentUserId}`
      this.loading = false

      if (this.qrcode) {
        this.qrcode.clear()
        this.qrcode.makeCode(this.path)
      } else {
        this.qrcode = new QRCode(document.getElementById('canvas'), {
          text: this.path,
          width: 500,
          height: 500,
          colorDark: '#000000',
          colorLight: '#ffffff',
          correctLevel: QRCode.CorrectLevel.M
        })
      }
    },

    handleClick(type) {
      if (type == 'download') {
        // 获取base64的图片节点
        var img = document.getElementById('canvas').getElementsByTagName('img')[0]
        // 构建画布
        var canvas = document.createElement('canvas')
        canvas.width = 500
        canvas.height = 500
        canvas.getContext('2d').drawImage(img, 0, 0)
        // 构造url
        const url = canvas.toDataURL('image/png')
        // 构造a标签并模拟点击
        var downloadLink = document.createElement('a')
        downloadLink.setAttribute('href', url)
        downloadLink.setAttribute('download', '二维码.png')
        document.body.appendChild(downloadLink)
        downloadLink.click() // 点击下载
        document.body.removeChild(downloadLink)
      } else if (type == 'copy') {
        const clipboard = new Clipboard('.copyBtn')

        clipboard.on('success', e => {
          this.$message.success('复制成功')
          e.clearSelection()
        })

        clipboard.on('error', e => {
          this.$message.success('复制失败')
        })
      }
    },

    /**
     * 预览图片
     */
    previewImage(list, index) {
      this.$bus.emit('preview-image-bus', {
        index: index,
        data: list.map(item => {
          item.url = item.filePath
          return item
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.b-cont {
  position: relative;
  padding: 15px;
  height: 100%;
  overflow-y: auto;
}

// 活动信息
.info-card-container {
  padding: 0 20px;
  margin: 10px 0;
}

.info-card + .info-card {
  margin-left: 15px;
}

.info-card {
  border: 1px solid #f3f3f5;
  padding: 15px 20px;
  width: 250px;
  border-radius: 3px;
  img {
    margin-right: 20px;
    width: 40px;
  }

  .title {
    color: #999999;
    font-size: 12px;
    margin-bottom: 5px;
  }

  .detail {
    color: #333;
    font-size: 14px;
  }
}

// 发布信息
.publish-container {
  background-color: #f6f9fc;
  padding: 15px 30px;
  position: relative;
  margin: 0 20px;
  margin-top: 10px;

  .publish-info {
    display: inline-block;
    margin-right: 60px;
    .publish-info-title {
      color: #333;
      font-size: 12px;
      margin-bottom: 10px;
    }

    .publish-info-content {
      height: 100px;
      margin-bottom: 15px;
      color: $xr-color-primary;
      white-space: pre-wrap;
      word-wrap: break-word;
      max-width: 300px;
    }
  }

  .web-info::before {
    content: '';
    position: absolute;
    left: 0;
    width: 1px;
    background-color: #e2e5e7;
    top: 0;
    height: 100%;
  }

  .web-info {
    position: relative;
    padding-left: 30px;
  }
}
#canvas {
  width: 100px;
  height: 100px;

  /deep/ img {
    width: 100px;
  }
}

.image {
  color: #333;
  &-info {
    margin: 10px 25px 0;

    &__label {
      font-size: 13px;
    }

    &__list {
      overflow-x: auto;

      img {
        margin-top: 15px;
        border-radius: $xr-border-radius-base;
        cursor: pointer;
      }

      img + img {
        margin-left: 20px;
      }

      .main-img {
        width: 195px;
        height: 110px;
      }

      .detial-img {
        width: 195px;
        height: 157px;
      }
    }
  }

  .no-img {
    color: #666;
    margin: 50px 0;
    text-align: center;
  }
}
</style>
