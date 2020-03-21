<template>
  <slide-view
    v-if="visible"
    @close="hideView">
    <!-- <div class="email-detail"> -->
    <div v-loading="loading" class="container">
      <detail-head
        :detail-data="rowItem"
        :email-type="emailType"
        :file-count="fileCount"
        :file-names="fileNames"
        :src="src"
        @on-del="delCurrentEmail"
        @move="handleMove"/>
      <div :style="{ height: emailFileHeight + 'px' }" class="article" >
        <tinymce :disabled="1" :toolbar="[]" v-model="rowItem.content" :init="{ plugins: 'autoresize' }" class="rich-txt" />
        <files-list ref="file" :batch-id="rowItem.batchId" :record-id="rowItem.id" @getFileCount="getFileCount"/>
      </div>
    </div>
    <!-- </div> -->
  </slide-view>
</template>

<script>
import { emailStateUpdateAPI, emailRecordShiftEmailAPI, emailRecordLogicDeleteAPI } from '@/api/email/email'
import Tinymce from '@/components/Tinymce'

import DetailHead from './components/DetailHead'
import SlideView from '@/components/SlideView'
import FilesList from './components/FilesList'
export default {
  // 客户管理 的 客户详情
  name: 'EmailDetail',
  components: {
    DetailHead,
    FilesList,
    Tinymce,
    SlideView
  },
  // mixins: [detail],
  props: {
    emailType: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    rowItem: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      emailFileHeight: document.documentElement.clientHeight - 260,
      richHeight: document.documentElement.clientHeight - 450,
      loading: false,
      fileCount: 0,
      fileNames: '',
      typeConfig: {
        receive: 'INBOX',
        star: 'FLAGGED',
        draft: 'Drafts',
        sent: 'Sent Messages',
        deleted: 'Deleted Messages',
        spam: '垃圾邮件'
      },
      src: ''
    }
  },
  computed: {
    fileIndex() {
      if (this.$refs.file) {
        return this.$refs.file.fileList.length
      }
    }
  },
  watch: {
    rowItem() {
      this.testAutoPlay()
    }
  },
  created() {},
  mounted() {
    // this.detailDatas = this.rowItem
    // this.emailTypes = this.emailType
  },
  methods: {
    /**
     * 音频报错处理
     */
    testAutoPlay() {
      // 返回一个promise以告诉调用者检测结果
      return new Promise(resolve => {
        const audio = document.createElement('audio')
        // require一个本地文件，会变成base64格式
        audio.src = ''
        document.body.appendChild(audio)
        let autoplay = true
        // play返回的是一个promise
        audio.play().then(() => {
          // 支持自动播放
          autoplay = true
        }).catch(() => {
          // 不支持自动播放
          autoplay = false
        }).finally(() => {
          audio.remove()
          // 告诉调用者结果
          resolve(autoplay)
        })
      })
    },

    /**
     * 关闭详情
     */
    hideView() {
      this.$emit('close')
    },

    /**
     * 删除当前邮件
     */
    delCurrentEmail() {
      this.$confirm('您确定要删除该邮件吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.updateEmailState()
      }).catch(() => {

      })
    },

    /**
     * 更改邮件状态
     */
    updateEmailState() {
      this.loading = true
      emailRecordLogicDeleteAPI({ emailIds: this.rowItem.id }).then(res => {
        this.$message.success('删除成功')
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
      this.$emit('update-list')
    },

    /**
     * 移动邮件
     */
    handleMove(val) {
      this.loading = true
      var params = {
        emailIds: this.rowItem.id,
        emailType: val == 0 ? 'INBOX' : 'Sent Messages'
      }
      emailRecordShiftEmailAPI(params).then((res) => {
        this.$message.success('移动成功')
        this.loading = false
        this.$emit('update-list')
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * 彻底删除
     */
    updateCurrentState(val) {
      var stateParams = {
        page: this.rowItem.page,
        limit: this.rowItem.limit,
        type: this.typeConfig[this.emailType],
        search: this.rowItem.search,
        index: this.rowItem.messageId,
        state: 'DELETED',
        flag: true
      }
      emailStateUpdateAPI(stateParams).then((res) => {
        this.loading = false
        this.$message({
          type: 'success',
          message: '移动成功'
        })
        this.$emit('update-list')
      }).catch(() => {
        this.loading = false
        this.$message.error('移动失败')
      })
    },

    /**
     * 获取文件个数
     */
    getFileCount(list) {
      this.fileCount = list.length
      this.src = list[0] ? list[0].src : ''

      if (list.length === 1) {
        this.fileNames = list[0].name
      } else {
        this.fileNames = list.map(item => {
          return item.name
        }).join(',')
        if (this.fileNames.length <= 5) {
          this.fileNames = this.fileNames
        } else {
          this.fileNames = this.fileNames.slice(0, 5) + '......'
        }
      }
    }

  }
}
</script>

<style lang="scss" scoped>
.slide-fade-leave-active {
  will-change: transform;
  transition: all 0.1s;
}
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}


.container {
  .detail-body {
    .font-title {
      color: #333;
      font-size: 16px;
      line-height: 30px;
      margin-right: 10px;
    }
    .detail-header {
      background-color: #F5F5F5;
      border-bottom: 1px solid #e4e4e4;
      border-top: 1px solid #e4e4e4;
      padding-left: 20px;
    }

    .main-info {
      color: #666666;
      font-size: 12px;
      line-height: 24px;
    }
  }
   .detail_content {
      width: 100%;
      min-height: 100px;
    }
  .article {
    width: 100%;
    padding: 0px 20px;
    overflow-y: auto;
    margin-top: 15px;
    background: #fff;
    text-align: justify;
    text-indent: 2em;
    color: #666666;
    font-size: 16px;
    line-height: 27px;
  }
}

.qmbox {
  overflow-y: auto;
}

/** 客户管理详情页面的 css 侧滑进入的详情 */
.d-view {
  position: fixed;
  min-width: 926px;
  width: 75%;
  top: 60px;
  bottom: 0px;
  right: 0px;
  background: #fff;
}
.isStart {
  color: #FAC23D;
}
/deep/ .el-icon-star-on {
  font-size: 20px;
}

/deep/ .tox-tinymce {
  border-color: white;
}
@import './styles/emaildetail.scss';
</style>
