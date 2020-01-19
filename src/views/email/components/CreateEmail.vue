<template>
  <div class="crm-create-container">
    <div class="crm-create-flex">

      <flexbox class="btn-group">
        <el-button type="success" @click="send('sentbtn')">发送</el-button>
        <el-button type="info" plain @click="saveDraft('savebtn')">存稿箱</el-button>
        <el-button type="info" plain>关闭</el-button>
      </flexbox>

      <flexbox class="form-item" direction="row" align="flex-start">
        <div class="form-label" @click="addReceive()">收件人 ＋</div>
        <!-- 收件人布局 begin-->
        <add-senter
          :com-type="receiveType"
          :sent-lists="receiverLists"
          @add-receive="addReceiveEmail"
          @del-receive="delReceiveEmail"/>
          <!-- end -->
      </flexbox>
      <flexbox class="form-item" direction="row" align="flex-start">
        <div class="form-label" @click="sentTo()">抄送 ＋</div>
        <!-- 抄送人布局 begin-->
        <add-senter
          :com-type="sentType"
          :sent-lists="sentLists"
          @add-sent="addSentEmail"
          @del-sent="delSentEmail"/>

          <!-- end -->
      </flexbox>
      <flexbox class="form-item" direction="row" align="flex-start" style="margin:0;">
        <div class="form-label">主题</div>
        <div class="form-add" style="width:100%;cursor:text">
          <el-input v-model="themeVal" class="theme-input" placeholder="请输入主题"/>
        </div>
      </flexbox>

      <flexbox class="extra-file">
        <div class="add-file-wrap" @click="addFile">
          <el-upload
            ref="fileUpload"
            :action="crmFileSaveUrl"
            :headers="httpHeader"
            :data="{type: 'file', batchId: batchId}"
            :on-preview="handleFilePreview"
            :before-remove="handleFileRemove"
            :on-success="fileUploadSuccess"
            :file-list="fileList"
            name="file"
            multiple
            accept="*.*">
            <i class="el-icon-link"/>
            <div class="add-file">添加附件</div>
          </el-upload>
        </div>
      </flexbox>

      <rich-txt :catch-data="catchData" :content="emailcontent" class="rich-txt"/>
    </div>
    <el-popover
      v-model="showPopover"
      class="sent-modal"
      placement="top"
      width="700"
      popper-class="no-padding-popover"
      trigger="click">
      <crm-relative
        v-if="showSelectView"
        ref="crmrelative"
        :crm-type="crmType"
        :accept-email="acceptEmail"
        :radio="radio"
        :action="relationAction"
        :selected-data="selectedData"
        @close="hideAddEmail"
        @changeCheckout="checkInfos"/>
    </el-popover>
  </div>
</template>

<script>
import { emailSendAPI, saveDraftBoxAPI } from '@/api/email/email'
import axios from 'axios'
import { crmFileDelete, crmFileSaveUrl } from '@/api/common'
import { guid } from '@/utils'

import CrmRelative from '../../../components/CreateCom/CrmRelative'
import RichTxt from './RichTxt'
import AddSenter from './AddSenter'

export default {
  name: 'CreateEmail',
  components: {
    CrmRelative,
    RichTxt,
    AddSenter
  },
  data() {
    return {
      themeVal: '',
      sentType: 'sent',
      receiveType: 'receive',
      // 添加收件人组件部分
      crmType: 'customer',
      showPopover: false, // 展示popover
      showSelectView: false, // 内容
      radio: true, // 是否单选
      relationAction: { type: 'default' },
      receiverLists: [], // 收件人列表
      sentLists: [],
      acceptEmail: '',
      fileList: [],
      batchId: guid(),

      content: '',
      emailcontent: '123'
    }
  },
  computed: {
    crmFileSaveUrl() {
      return crmFileSaveUrl
    },
    httpHeader() {
      return {
        'Admin-Token': axios.defaults.headers['Admin-Token']
      }
    },
    selectedData() {
      const crmObj = { customer: [] }
      // crmObj[this.item.data.formType] = this.dataValue
      return crmObj
    }
  },
  created() {
    if (this.$route.query.reply) {
      console.log(this.$route.query, 'hhH')
      this.receiverLists.push({ 'website': this.$route.query.sendUser.split('<')[1].split('>')[0], 'show': true })
      this.sentLists.push({ 'website': this.$route.query.receivingUser.split('<')[1].split('>')[0], 'show': true })
      this.themeVal = this.$route.query.theme
      this.fileList = this.$route.query.fileList.length ? this.$route.query.fileList.map((item) => {
        item.name = item.fileName
        return item
      }) : []
      this.emailcontent = this.$route.query.content
      console.log(this.fileList, 'hhH')
    }
    if (this.$route.query.share) {
      this.themeVal = this.$route.query.theme
      this.fileList = this.$route.query.fileList.map((item) => {
        item.name = item.fileName
        return item
      })
      this.emailcontent = this.$route.query.content
    }
  },
  mounted() {
    console.log(this.$route.query, 'canshu')
  },
  methods: {
    /**
     * 手动添加收件人
     */
    addReceiveEmail(val) {
      console.log(val, 'shoujian')
      this.receiverLists.push({ 'website': val, 'show': true })
    },

    /**
     * 手动删除收件人
     */
    delReceiveEmail(index) {
      console.log(index, 'shoujian')
      this.receiverLists.splice(index, 1)
    },

    /**
     * 手动添加抄送人
     */
    addSentEmail(val) {
      console.log(val, 'chaosong')
      this.sentLists.push({ 'website': val, 'show': true })
      console.log(this.sentLists, 'add')
    },

    /**
     * 手动删除抄送人
     */
    delSentEmail(index) {
      this.sentLists.splice(index, 1)
    },

    // 查看图片
    handleFilePreview(file) {
      if (file.response || file.fileId) {
        let perviewFile
        if (file.response) {
          perviewFile = file.response
        } else {
          perviewFile = {
            url: file.filePath,
            name: file.name
          }
        }
        this.$bus.emit('preview-image-bus', {
          index: 0,
          data: [perviewFile]
        })
      }
    },

    fileUploadSuccess(response, file, fileList) {
      this.fileList = fileList
      console.log(this.fileList, '123456')
    },

    handleFileRemove(file, fileList) {
      console.log(file, fileList, 'ooooooooooooooooo')
      if (file.response || file.fileId) {
        let fileId
        if (file.response) {
          fileId = file.response.fileId
        } else {
          fileId = file.fileId
        }
        this.$confirm('您确定要删除该文件吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            crmFileDelete({
              id: fileId
            })
              .then(res => {
                this.$message.success('操作成功')
                var removeIndex = this.getFileIndex(
                  this.$refs.fileUpload.uploadFiles,
                  fileId
                )
                if (removeIndex != -1) {
                  this.$refs.fileUpload.uploadFiles.splice(removeIndex, 1)
                }
                removeIndex = this.getFileIndex(this.fileList, fileId)
                if (removeIndex != -1) {
                  this.fileList.splice(removeIndex, 1)
                }
              })
              .catch(() => {})
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
        return false
      } else {
        return true
      }
    },

    /**
     * 添加附件
     */
    addFile() {
      console.log('tinajiafujain')
    },

    /**
     * 发送
     */
    send(btnType) {
      this.sendSaveDraft(btnType)
    },

    /**
     * 存稿箱
     */
    saveDraft(btnType) {
      this.sendSaveDraft(btnType)
    },

    /**
     * 发送与存稿请求
     */
    sendSaveDraft(btnType) {
      let isSent = false
      const newlist = this.receiverLists.concat(this.sentLists)
      console.log(newlist, 'lllllllllllllllllll')
      newlist.map((item) => {
        if (!item.valid) {
          isSent = false
          return
        } else {
          isSent = true
        }
        return item
      })
      if (isSent) {
        this.batchIdList = []
        this.fileList.map((item) => {
          this.batchIdList.push(item.response.batchId)
          return item
        })
        const newReceiveList = []
        const newSentList = []
        this.receiverLists.map((item) => {
          newReceiveList.push(item.website)
        })
        this.sentLists.map((item) => {
          newSentList.push(item.website)
        })
        console.log(newReceiveList, newSentList, 'xxxxxxxxxxxx')
        var params = {
          id: '',
          receipt_emails: newReceiveList.join(','),
          cc_emails: newSentList.join(',') || '',
          fileBatchId: Array.from(new Set(this.batchIdList)).join(',') || '',
          theme: this.themeVal || '',
          content: this.content || ''
        }
        if (btnType == 'savebtn') {
          params.type = 'Drafts'
        }
        var requestAPI = {
          sentbtn: emailSendAPI,
          savebtn: saveDraftBoxAPI
        }[btnType]
        console.log(params, '参数')
        requestAPI(params).then((res) => {
          if (btnType == 'sentbtn') {
            this.$message.success('发送成功')
          } else if (btnType == 'savebtn') {
            this.$message.success('存稿成功')
          }
          console.log(res, '发送')
        }).catch(() => {
          this.$message.error('操作失败')
        })
        console.log('邮箱正确')
      } else {
        this.$message.error('邮箱格式错误')
        console.log('邮箱不正确')
      }
    },

    /**
     * 添加收件人
     */
    addReceive() {
      this.showPopover = true
      this.showSelectView = true
      this.acceptEmail = 'receive'
    },

    /**
     * 抄送给
     */
    sentTo() {
      this.showPopover = true
      this.showSelectView = true
      this.acceptEmail = 'sent'
    },

    /** 选中 */
    checkInfos(data) {
      console.log(data, 'data')
      if (data.type == 'sent') {
        this.sentLists = data.data.map((item) => {
          item.show = true
          return item
        })
      } else if (data.type == 'receive') {
        this.receiverLists = data.data.map((item) => {
          item.show = true
          return item
        })
      }
    },

    /**
     * 获取富文本代码段内容
     */
    catchData(val) {
      this.content = val
      console.log(val)
    },

    /**
     * 隐藏添加邮件弹窗
     */
    hideAddEmail() {
      this.showPopover = false
      this.showSelectView = false
    }
  }
}
</script>

<style lang="scss" scoped>
.crm-create-container {
  position: relative;
  height: 100%;
  padding-right: 30px;
}

.crm-create-flex {
  height: 90%;
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
  .form-item {
    border-bottom: 1px solid #E6E6E6;
    line-height: 35px;
    margin-bottom: 15px;
    .form-label {
      width: 66px;
      margin-right: 10px;
      color: #333;
      cursor: pointer;
      font-size: 14px;
    }
    .form-add {
      color: #2362FB;
    }
  }
  .extra-file {
    margin-top: 28px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start
  }
  .btn-group {
    margin-bottom: 30px;
    margin-top: 18px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
  .rich-txt {
    margin-top: 20px;
  }
}

.crm-create-header {
  height: 40px;
  margin-bottom: 20px;
  padding: 0 10px;
  flex-shrink: 0;
  .close {
    display: block;
    font-size: 24px;
    color: #909399;
    margin-right: -10px;
    padding: 10px;
    cursor: pointer;
  }
  .close:hover {
    color: $xr-color-primary;
  }
}

.add-file {
  color: #2362FB;
  margin-left: 10px;
}

.crm-create-container {
  position: relative;
}

.sent-modal {
  position: absolute;
  top: 20%;
  left: 10%;
  z-index: 20000;
}

.file-item, .add-file-wrap {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.add-file-wrap /deep/ .el-upload {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }

  /deep/ .el-icon-document:before {
    content: "\E737";
  }

  /deep/ .el-upload-list__item-name {
    padding-left: 0;
  }

.file-item {
  margin-bottom: 15px;
  .extra-file-name {
    margin-right: 40px;
    margin-left: 10px;
    font-size: 14px;
    color: #333333;
  }
  .del-btn {
    font-size: 12px;
    color: #2362FB;
  }
}

.theme-input {
  width: 100%;
  /deep/ .el-input__inner {
    border: 0;
  }
}

.is-input {
  width: 5px;
  height: 20px;
  cursor: text;
  display: inline-block;
}

/deep/ .w-e-toolbar .w-e-menu {
  z-index: 2000 !important;
}

/deep/ .w-e-text-container {
  z-index: 2000 !important;
}
</style>
