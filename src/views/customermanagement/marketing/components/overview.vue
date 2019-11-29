<template>
  <div class="b-cont">
    <sections
      class="b-cells"
      title="推广信息"
      m-color="#46CDCF"
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
      m-color="#46CDCF"
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
  </div>
</template>

<script>
import { crmMarketingOverviewAPI } from '@/api/customermanagement/marketing'
import loading from '../../mixins/loading'
import Sections from '../../components/Sections'
import { downloadFile } from '@/utils'
import Clipboard from 'clipboard'
import QRCode from 'qrcodejs2'

export default {
  /** 推广管理 的 概览*/
  name: 'Overview',
  components: {
    Sections
  },
  mixins: [loading],
  props: {
    /** 模块ID */
    id: [String, Number],
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
  computed: {},
  watch: {
    id: function(val) {
      this.getDetail()
    }
  },
  mounted() {
    this.getDetail()
  },
  activated: function() {},
  deactivated: function() {},
  methods: {
    // 获取基础信息
    getDetail() {
      this.loading = true
      crmMarketingOverviewAPI({
        id: this.id
      })
        .then(res => {
          this.name = res.data.name
          this.submitCount = res.data.subCount
          this.browseCount = res.data.browse
          this.path = res.data.path
          this.loading = false

          if (this.qrcode) {
            this.qrcode.clear()
            this.qrcode.makeCode(this.path)
          } else {
            this.qrcode = new QRCode(document.getElementById('canvas'), {
              text: this.path,
              width: 100,
              height: 100,
              colorDark: '#000000',
              colorLight: '#ffffff',
              correctLevel: QRCode.CorrectLevel.H
            })
          }
        })
        .catch(() => {
          this.loading = false
        })
    },

    handleClick(type) {
      if (type == 'download') {
        var img = document
          .getElementById('canvas')
          .getElementsByTagName('img')[0]
        downloadFile({ name: this.name + '.png', path: img.src })
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
    }
  }
}
</script>

<style lang="scss" scoped>
.b-cont {
  position: relative;
  padding: 0 50px 20px 20px;
}

// 推广信息
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
  padding: 15px 20px;
  position: relative;
  margin: 0 20px;
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
}
</style>
