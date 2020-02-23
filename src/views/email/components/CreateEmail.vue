<template>
  <div v-loading="loading" class="crm-create-container">
    <div class="crm-create-flex">

      <flexbox class="btn-group">
        <el-button type="success" @click="send('sentbtn')">发送</el-button>
        <el-button type="info" plain @click="saveDraft('savebtn')">存稿箱</el-button>
      </flexbox>
      <div v-if="!showDeffient">
        <flexbox class="form-item" direction="row" align="flex-start">
          <div class="form-label line" @click="addReceive()">收件人</div>
          <!-- 收件人布局 begin-->
          <add-senter
            :com-type="receiveType"
            :sent-lists="receiverLists"
            @change="changeReceiverList"
            @add-receive="addReceiveEmail"
            @del-receive="delReceiveEmail"/>
            <!-- end -->
        </flexbox>
        <flexbox v-if="showSent" class="form-item" direction="row" align="flex-start">
          <div class="form-label line" @click="sentTo()">抄送</div>
          <!-- 抄送人布局 begin-->
          <add-senter
            :com-type="sentType"
            :sent-lists="sentLists"
            @change="changeSentList"
            @add-sent="addSentEmail"
            @del-sent="delSentEmail"/>

            <!-- end -->
        </flexbox>
      </div>

      <flexbox v-else class="form-item" direction="row" align="flex-start">
        <div class="form-label line" @click="addReceive()">分别发送</div>
        <!-- 分别发送布局 begin-->
        <add-senter
          :com-type="receiveType"
          :sent-lists="deffientList"
          @change="changeReceiverList"
          @add-receive="addReceiveEmail"
          @del-receive="delReceiveEmail"/>
          <!-- end -->
      </flexbox>
      <div>
        <span v-if="!showDeffient">
          <el-button v-if="!showSent" type="text" @click="showSent = true">添加抄送</el-button>
          <el-button v-else type="text" @click="deleteSent">删除抄送</el-button>
        </span>

        <span v-if="showDeffient" class="deffient_text">每个收件人将收到单独发给他/她的邮件。</span><el-button v-if="showDeffient" type="text" @click="showDeffient = false">取消分别发送</el-button>
        <el-button v-else type="text" @click="differenceSend">分别发送</el-button>
      </div>
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
        :radio="false"
        :action="relationAction"
        :selected-data="selectedData"
        @close="hideAddEmail"
        @changeCheckout="checkInfos"/>
    </el-popover>
  </div>
</template>

<script>
import {
  emailSendAPI,
  emailQueryAccountByIdAPI,
  saveDraftBoxAPI } from '@/api/email/email'
import axios from 'axios'
import { crmFileDelete, crmFileSaveUrl } from '@/api/common'
import { guid } from '@/utils'
import { regexIsCRMEmail } from '@/utils'
import CrmRelative from '../../../components/CreateCom/CrmRelative'
import RichTxt from './RichTxt'
import AddSenter from './AddSenter'
import { mapGetters } from 'vuex'
export default {
  name: 'CreateEmail',
  components: {
    CrmRelative,
    RichTxt,
    AddSenter
  },
  props: {
    handleList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      loading: false,
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
      sentLists: [], // 抄送人列表
      deffientList: [], // 分别发送人列表
      showSent: false, // 是否展示抄送人
      showDeffient: false, // 展示分别发送
      acceptEmail: '',
      fileList: [],
      batchId: guid(),
      content: '',
      emailcontent: '',
      sendEmailMsg: {} // 发件人信息
    }
  },
  computed: {
    ...mapGetters(['userInfo']),
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
  watch: {
    handleList: {
      handler(val) {
        console.log(val)
        this.receiverLists = val
      },
      deep: true
    }
  },
  created() {
    if (this.$route.query.reply) {
      this.receiverLists.push({ 'email': this.$route.query.senderEmail, 'show': true })
      this.sentLists.push({ 'email': this.$route.query.receiptEmails, 'show': true })
      this.themeVal = this.$route.query.theme
      this.fileList = this.$route.query.fileList && this.$route.query.fileList.length ? this.$route.query.fileList.map((item) => {
        item.name = item.fileName
        return item
      }) : []
      this.emailcontent = this.$route.query.content
    }
    if (this.$route.query.share) {
      this.themeVal = this.$route.query.theme
      this.fileList = this.$route.query.fileList && this.$route.query.fileList.length ? this.$route.query.fileList.map((item) => {
        item.name = item.fileName
        return item
      }) : []
      this.emailcontent = this.$route.query.content
    }
  },
  mounted() {
    this.getSendEmailMsg()
  },
  methods: {
    /**
     * 查询发件邮箱基本信息
     */
    getSendEmailMsg() {
      emailQueryAccountByIdAPI({ id: this.userInfo.emailId }).then(res => {
        this.sendEmailMsg = res.data
      }).catch(() => {})
    },
    /**
     * 手动添加收件人
     */
    addReceiveEmail(val, list) {
      this.receiverLists = list
      this.receiverLists.push({ 'email': val, valid: true, 'show': true })
      this.eliminateArray()
    },

    /**
     * 手动删除收件人
     */
    delReceiveEmail(index) {
      this.receiverLists.splice(index, 1)
      this.eliminateArray()
    },

    /**
     * 手动添加抄送人
     */
    addSentEmail(val, list) {
      this.sentLists = list
      this.sentLists.push({ 'email': val, valid: true, 'show': true })
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
      if (file.response || file.fileId) {
        let fileId
        if (file.response) {
          fileId = file.response.fileId
        } else {
          fileId = file.fileId
        }
        return this.$confirm('您确定要删除该文件吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            crmFileDelete({
              id: fileId
            })
              .then(res => {
                var removeIndex = this.getFileIndex(
                  this.$refs.fileUpload.uploadFiles,
                  fileId
                )
                if (removeIndex != -1) {
                  this.$refs.fileUpload.uploadFiles.splice(removeIndex, 1)
                }
                removeIndex = this.getFileIndex(this.fileList, fileId)
                console.log(removeIndex, 'remove')
                this.$message.success('操作成功')

                if (removeIndex != -1) {
                  this.fileList.splice(removeIndex, 1)
                }
              })
              .catch(() => {
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
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
      let isSent = true
      var type = 1
      let newlist = []
      if (this.showDeffient) {
        newlist = this.deffientList
        type = 2
      } else if (this.showSent) {
        newlist = this.receiverLists.concat(this.sentLists)
      } else {
        newlist = this.receiverLists
      }
      //  统一进行邮箱判断
      if (newlist.length === 0) {
        this.$message.error('收件人不能为空')
        return
      }
      newlist.forEach((item, index) => {
        // 只要邮箱有一个是错的，就永远返回false
        if (isSent && regexIsCRMEmail(item.email)) {
          isSent = true
        } else {
          this.$$message.error(`第${index}的邮箱错误`)
          isSent = false
        }
      })
      if (isSent) {
        this.batchIdList = this.fileList.map((item) => {
          return item.response.batchId
        })
        let newReceiveList = []
        let newSentList = []
        newReceiveList = this.receiverLists.map((item) => {
          return item.email
        })
        newSentList = this.sentLists.map((item) => {
          return item.email
        })
        var params = {
          id: '',
          receipt_emails: newReceiveList.join(','),
          cc_emails: newSentList.join(',') || '',
          fileBatchId: Array.from(new Set(this.batchIdList)).join(',') || '',
          theme: this.themeVal || '',
          content: this.emailcontent || '',
          type: type
        }
        if (btnType == 'savebtn') {
          params.type = 'Drafts'
        }
        var requestAPI = {
          sentbtn: emailSendAPI,
          savebtn: saveDraftBoxAPI
        }[btnType]
        this.loading = true
        requestAPI(params).then((res) => {
          this.loading = true
          this.receiverLists = []
          this.delReceiveEmail = []
          this.sentLists = []
          if (btnType == 'sentbtn') {
            this.$message.success('发送成功')
            this.$router.push({ path: '/email/index/receive' })
          } else if (btnType == 'savebtn') {
            this.$message.success('存稿成功')
            this.$router.push({ path: '/email/index/receive' })
          }
        }).catch(() => {
          this.loading = false
        })
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
      this.emailcontent = val
    },

    /**
     * 隐藏添加邮件弹窗
     */
    hideAddEmail() {
      this.showPopover = false
      this.showSelectView = false
    },

    /**
     * 增加邮箱的回调
     */
    changeReceiverList(list) {
      this.receiverLists = list
      console.log(list)
    },
    changeSentList(list) {
      this.sentLists = list
      this.eliminateArray()
    },

    /**
     * 删除抄送
     */
    deleteSent() {
      this.sentLists = []
      this.eliminateArray()
      this.showSent = false
    },

    /**
     * 分别发送
     */
    differenceSend() {
      this.eliminateArray()
      this.showDeffient = true
    },

    /**
     * 数组去重
     */
    eliminateArray() {
      const list = [...this.sentLists, ...this.receiverLists]
      const copyList = []
      for (let i = 0; i < list.length; i++) {
        const item = list[i]

        copyList.forEach((ele, index) => {
          if (ele.customerId == item.customerId) {
            copyList.splice(index, 1)
          }
        })
        copyList.push(item)
      }
      this.deffientList = copyList
    },

    getFileIndex(files, fileId) {
      var removeIndex = -1
      for (let index = 0; index < files.length; index++) {
        const item = files[index]
        let itemFileId
        if (item.response) {
          itemFileId = item.response.fileId
        } else {
          itemFileId = item.fileId
        }
        if (itemFileId == fileId) {
          removeIndex = index
          break
        }
      }
      return removeIndex
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
    .line {
      color: #2362FB;
    }
    .line:hover {
      text-decoration: underline;
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
.deffient_text {
  font-size: 13px;
  color: #857277;
}
/deep/ .w-e-toolbar .w-e-menu {
  z-index: 2000 !important;
}

/deep/ .w-e-text-container {
  z-index: 2000 !important;
}
</style>
