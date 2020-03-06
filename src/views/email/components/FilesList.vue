<template>
  <div class="flie_box">
    <div class="title">
      <div class="title_content"><i class="el-icon-paperclip"/>附件（{{ fileList.length }} 个）</div>
    </div>
    <flexbox v-for="(item, index) in fileList" :key="index" class="flie_item">
      <img :src="item.src" width="32px" alt="">
      <div class="item">
        <div class="item_name">
          {{ item.fileName }}
        </div>
        <!-- <el-button type="text" @click="handleFile(item, index)">预览</el-button> -->
        <el-button type="text" @click="handleDown(item)">下载</el-button>
      </div>

    </flexbox>
  </div>
</template>

<script>
// import { crmFileIndex, downloadFileAPI } from '@/api/common'
import { emailGetEmailFileByBatchIdAPI, emailGetDownFileAPI } from '@/api/email/email'
import { getFileIconWithSuffix, downloadFileWithBuffer } from '@/utils'
export default {
  name: 'FilesList',
  props: {
    batchId: {
      type: String,
      default: ''
    },
    recordId: {
      type: [String, Number],
      default: ''
    }
  }, // 接收父组件的方法
  data() {
    return {
      fileList: []
    }
  },
  watch: {
    batchId: {
      handler(val) {
        console.log(val)
        if (val) {
          this.getFileList()
        }
      },
      immediate: true
    }
  },
  created() {

  },
  mounted() {
  },
  methods: {
    /**
       * 附件列表
       */
    getFileList() {
      emailGetEmailFileByBatchIdAPI({ batchId: this.batchId }).then(res => {
        this.fileList = res.data
        this.fileList.forEach(item => {
          item.name = item.fileName
          item.src = this.getFileTypeIcon(item.fileName)
        })
        this.$emit('getFileCount', this.fileList)
      }).catch(() => {})
    },

    /**
     * 获取图标
     */
    getFileTypeIcon(url) {
      if (!url) return ''
      const temps = url ? url.split('.') : []
      let ext = ''
      if (temps.length > 0) {
        ext = temps[temps.length - 1]
      } else {
        ext = ''
      }

      return getFileIconWithSuffix(ext)
    },

    /**
     * 预览
     */
    handleFile(item, index) {
      this.$bus.emit('preview-image-bus', {
        index: index,
        data: this.fileList
      })
    },

    /**
     * 下载
     */
    handleDown(item) {
      emailGetDownFileAPI({ id: item.id, recordId: this.recordId }).then(res => {
        const blob = new Blob([res.data], {
          type: ''
        })
        downloadFileWithBuffer(blob, item.fileName)
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.flie_box {
    width: 100%;
    border: 2px solid F5F5F5;
    max-height: 200px;
    overflow-y: auto;
    margin-top: 20px;
    .title {
        width: 100%;
        padding: 5px 10px 15px 0px;
        color: #000;
        font-weight: bolder;
        background-color: #F5F5F5;
    }
     .title_content {
         height: 14px;
         font-size: 14px;
         text-indent: 0px;
        }
}
.flie_item {
    img {
        margin: 10px;
    }
    .item_name {
        font-size: 12px;
        color: #333;
        text-indent: 0px;
        line-height: 10px;
        padding-top: 10px;
        font-weight: bolder;
    }
}
/deep/.el-icon-paperclip {
    color: #2362FB;
    font-size: 16px;
    padding-left: 15px;
    padding-right: 5px;
}

</style>


