<template>
  <div v-loading="loading" class="crm-create-container">
    <div class="crm-create-flex">

      <flexbox class="btn-group">
        <el-button type="success" @click="send('sentbtn')">发送</el-button>
        <el-button type="info" plain @click="saveDraft('savebtn')">存稿箱</el-button>
        <el-button type="info" plain @click="close">关闭</el-button>
      </flexbox>
      <div v-if="!showDeffient">
        <flexbox class="form-item" direction="row" align="flex-start">
          <div class="form-label line" @click="addReceive()">收件人</div>
          <!-- 收件人布局 begin-->
          <add-senter
            :com-type="receiveType"
            :sent-lists="receiverLists"
            @changeType="changeType"
            @change="changeReceiverList"
            @add-receive="addReceiveEmail"
            @del-receive="delReceiveEmail"/>
            <!-- end -->
        </flexbox>
        <flexbox
          v-if="showSent"
          class="form-item"
          style="margin-top: 15px;"
          direction="row"
          align="flex-start">
          <div class="form-label line" @click="sentTo()">抄送</div>
          <!-- 抄送人布局 begin-->
          <add-senter
            :com-type="sentType"
            :sent-lists="sentLists"
            @changeType="changeType"
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
          @changeType="changeType"
          @change="changeReceiverList"
          @add-receive="addReceiveEmail"
          @del-receive="delReceiveEmail"/>
          <!-- end -->
      </flexbox>
      <div class="form-label_two" style="margin-left: 60px">
        <span v-if="!showDeffient">
          <el-button v-if="!showSent" type="text" @click="showSent = true">添加抄送</el-button>
          <el-button v-else type="text" @click="deleteSent">删除抄送</el-button>
          <span class="segmentation">|</span>
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

      <flexbox style="margin-left: 60px" class="extra-file">
        <div class="add-file-wrap" @click="addFile">
          <el-upload
            ref="fileUpload"
            :action="crmFileSaveUrl"
            :headers="httpHeader"
            :data="{type: 'file', batchId: batchId}"
            :on-preview="handleFilePreview"
            :before-upload="beforeAvatarUpload"
            :before-remove="handleFileRemove"
            :on-success="fileUploadSuccess"
            :file-list="fileList"
            name="file"
            multiple
            accept="*.*">
            <i class="wk wk-attachment"/>
            <div class="add-file">添加附件</div>
          </el-upload>
          <!-- <flexbox v-if="(file,index) in fileList" :key="index">
            <div>{{ file.name }}</div>
            <span>{{ file.size }}</span>
            <el-button>删除</el-button>
          </flexbox> -->
        </div>

        <div class="add-img-wrap" @click="addFile">
          <flexbox @click.native="upLoadImg">
            <i class="wk wk-picture"/>
            <div class="add-file">添加图片</div>
          </flexbox>
          <div class="img-item-add">
            <input
              ref="imgUpLoad"
              type="file"
              class="img-item-iput"
              accept="image/*"
              @change="uploadFile">
          </div>
        </div>
      </flexbox>
      <flexbox align="baseline" style="padding-right: 20px;">
        <div class="form-label-three">正文</div>
        <tinymce ref="createTinymce" v-model="emailcontent" :height="richHeight" class="rich-txt" />
      </flexbox>
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
    <flexbox class="email_bottom" justify="flex-start">
      <div class="email_one">
        <span>发件人：</span>
        <span class="">{{ emailMsg.sendNick }} {{ emailMsg.emailAccount }}</span>
      </div>
      <span class="email_line" style="font-size: 14px;">|</span>
      <flexbox style="width: 200px; margin-left: 20px">
        <div>签名：</div>
        <el-dropdown trigger="click" @command="handleCommand">
          <span class="el-dropdown-link">
            {{ signText }}<i class="el-icon-arrow-down el-icon--right"/>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="使用">使用</el-dropdown-item>
            <el-dropdown-item command="不使用">不使用</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </flexbox>
    </flexbox>
  </div>
</template>

<script>
import {
  emailSendAPI,
  emailQueryAccountByIdAPI,
  emailRecordUploadAPI,
  saveDraftBoxAPI } from '@/api/email/email'
import { emailGetEmailFileByBatchIdAPI } from '@/api/email/email'
import axios from 'axios'
import { crmFileDelete, crmFileSaveUrl } from '@/api/common'
import { guid } from '@/utils'
import { regexIsCRMEmail } from '@/utils'
import CrmRelative from '../../../components/CreateCom/CrmRelative'
import Tinymce from '@/components/Tinymce'
import AddSenter from './AddSenter'
import { mapGetters } from 'vuex'
export default {
  name: 'CreateEmail',
  components: {
    CrmRelative,
    Tinymce,
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
      id: '',
      sentType: 'sent',
      receiveType: 'receive',
      // 添加收件人组件部分
      crmType: 'customer',
      richHeight: document.documentElement.clientHeight - 450,
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
      imgList: [],
      batchId: guid(),
      content: '',
      emailcontent: '',
      signText: '不使用',
      sendEmailMsg: {}, // 发件人信息
      addSign: false,
      type: 'receive',
      signaTime: null // 签名标示
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'emailMsg']),
    crmFileSaveUrl() {
      return crmFileSaveUrl
    },
    emailRecordUploadAPI() {
      return emailRecordUploadAPI
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
        if (this.type === 'receive') {
          this.receiverLists = val
        } else if (this.type === 'sent') {
          this.sentLists = val
        }
        this.eliminateArray()
      },
      deep: true
    }
  },
  created() {
    let emailObj = localStorage.getItem('crm-emailContent') || null
    if (emailObj) {
      emailObj = JSON.parse(emailObj)

      if (this.$route.query.draft) {
        this.changeType('receive')
        const list = emailObj.receiptEmails.split(',')
        const nameList = emailObj.receiptName.split(',')
        list.forEach((email, index) => {
          this.addReceiveEmail(email, this.receiverLists, nameList[index])
        })

        this.themeVal = emailObj.theme
        this.id = emailObj.id
        this.getFileList(emailObj.batchId)
        this.emailcontent = emailObj.content
      } else {
        if (this.$route.query.reply) {
          this.changeType('receive')
          this.addReceiveEmail(emailObj.senderEmail, [], emailObj.handleSender)
        } else if (this.$route.query.share) {
          this.themeVal = emailObj.theme
          this.id = emailObj.id
          this.getFileList(emailObj.batchId)
          this.emailcontent = emailObj.content
        }
      }
      // this.sentLists.push({ 'email': emailObj.receiptEmails, 'show': true })
      // this.fileList = emailObj.fileList && emailObj.fileList.length ? emailObj.fileList.map((item) => {
      //   item.name = item.fileName
      //   return item
      // }) : []
    }
  },
  mounted() {
    this.getSendEmailMsg()
  },
  methods: {

    /**
     * 关闭
     */
    close() {
      this.$router.push({ path: '/email/index/receive' })
    },

    /**
     * 查询发件邮箱基本信息
     */
    getSendEmailMsg() {
      emailQueryAccountByIdAPI({ id: this.userInfo.emailId }).then(res => {
        this.sendEmailMsg = res.data
      }).catch(() => {})
    },

    /**
       * 查询附件列表
       */
    getFileList(batchId) {
      console.log(batchId, '====')
      emailGetEmailFileByBatchIdAPI({ batchId: batchId }).then(res => {
        res.data.forEach(item => {
          item.name = item.fileName + '（' + Math.floor(item.fileSize / 1024) + 'K）'
          console.log(item.name)
        })
        this.fileList = res.data
        this.$emit('getFileCount', this.fileList)
      }).catch(() => {})
    },

    /**
     * 手动添加收件人
     */
    addReceiveEmail(val, list, name) {
      this.receiverLists = list
      this.receiverLists.push({ 'email': val, customerName: name, valid: true, 'show': true })
      this.eliminateArray()
    },

    /**
     * 手动删除收件人
     */
    delReceiveEmail(index, item) {
      this.receiverLists.forEach((ele, index) => {
        if (ele.customerName === item.customerName) {
          this.receiverLists.splice(index, 1)
        }
      })
      this.type = 'receive'
      this.$emit('changeType', this.type)
      this.$emit('delete', {
        item: item,
        type: 'receive'
      })
      this.eliminateArray()
    },

    /**
     * 手动添加抄送人
     */
    addSentEmail(val, list) {
      this.sentLists = list
      this.sentLists.push({ 'email': val, valid: true, 'show': true })
    },

    /**
     * 手动删除抄送人
     */
    delSentEmail(index, item) {
      this.sentLists.splice(index, 1)
      this.type = 'sent'
      this.$emit('changeType', this.type)
      this.$emit('delete', {
        item: item,
        type: 'sent'
      })
      this.eliminateArray()
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
    /**
     * 限制附件大小不超过30M
     */
    beforeAvatarUpload(file) {
      const isLt30M = file.size / 1024 / 1024 < 30
      if (!isLt30M) {
        this.$confirm('您上传的文件过大，请上传小于30M的文件', '提示', {
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          return false
        }).catch(() => {
          return false
        })
      }
      return isLt30M
    },
    fileUploadSuccess(response, file, fileList) {
      this.fileList = fileList
      this.fileList.forEach(file => {
        file.name = file.name + '（' + Math.floor(file.size / 1024) + 'K）'
      })
    },

    /**
     * 图片上传
     */
    upLoadImg() {
      this.$refs.imgUpLoad.click()
    },

    /**
     * 选择图片的回调
     */
    uploadFile(e) {
      const files = e.target.files
      const params = {
        file: files[0]
      }
      emailRecordUploadAPI(params).then(res => {
        this.$refs.createTinymce.imageSuccessCBK([res])
      }).catch(() => {})
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
        this.$message.error('请填写收件人后再发送')
        return
      }
      const countList = []
      newlist.forEach((item, index) => {
        // 只要邮箱有一个是错的，就永远返回false
        if (isSent && regexIsCRMEmail(item.email)) {
          isSent = true
        } else {
          countList.push(index + 1)
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
          return { email: item.email, name: item.customerName || '' }
        })
        newSentList = this.sentLists.map((item) => {
          return { email: item.email, name: item.customerName || '' }
        })
        var params = {
          id: this.id,
          receipt_emails: newReceiveList,
          cc_emails: newSentList,
          batchId: Array.from(new Set(this.batchIdList)).join(',') || '',
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
          this.loading = false
          this.receiverLists = []
          this.deffientList = []
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
      } else {
        this.$message.error(`第${countList.join(',')}个的邮箱格式错误`)
      }
    },

    /**
     * 添加收件人
     */
    addReceive() {
      // 暂时注释掉此功能
      // this.showPopover = true
      // this.showSelectView = true
      // this.acceptEmail = 'receive'
    },

    /**
     * 抄送给
     */
    sentTo() {
      // this.showPopover = true
      // this.showSelectView = true
      // this.acceptEmail = 'sent'
    },

    /** 选中 */
    checkInfos(data) {
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
      this.eliminateArray()
    },
    changeSentList(list) {
      this.sentLists = list
      this.eliminateArray()
    },
    /**
     * 更换类型
     */
    changeType(type) {
      this.type = type
      this.$emit('changeType', type)
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
      console.log(list, 'list')
      for (let i = 0; i < list.length; i++) {
        const item = list[i]

        copyList.forEach((ele, index) => {
          if (ele.customerName == item.customerName) {
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
    },

    /**
     * 签名使用不使用
     */
    handleCommand(command) {
      // this.signText = command
      // if (command === '使用') {
      //   this.emailcontent = this.emailcontent + '<br>' + this.emailMsg.signature || ''
      // } else {
      //   console.log(this.emailcontent, '===')
      //   const index = this.emailcontent.lastIndexOf('<br>')
      //   this.emailcontent = this.emailcontent.substring(0, index)
      // }
      this.signText = command
      const editor = this.$refs.createTinymce.editor
      if (command === '使用') {
        if (!this.signaTime) {
          editor.dom.add(editor.getBody(), 'div', null, `<br>`)
          this.signaTime = new Date().getTime()
        }
        const content = `
      <div>
          <hr align="left" style="margin: 0 0 10px 0;border: 0;border-bottom:1px solid #E4E5E6;height:0;line-height:0;font-size:0;padding: 20px 0 0 0;width: 50px;">
          <div style="font-size:14px;font-family:Verdana;color:#000;">
            ${this.emailMsg.signature || ''}
          </div>
        </div>
        `
        if (!this.addSign) {
          this.addSign = true
          editor.dom.add(editor.getBody(), 'div', { nreadytime: this.signaTime }, content)
        }
      } else {
        this.addSign = false
        editor.dom.remove(editor.dom.select(`div[nreadytime="${this.signaTime}"]`))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.crm-create-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.crm-create-flex {
  padding-right: 8px;
  height: 90%;
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
  .form-label_two {
      margin-bottom: 10px;
    }
  .form-label-three {
    display: inline-block;
    padding-right: 10px;
    text-align: right;
    width: 60px;
  }
  .form-item {
    line-height: 35px;
    padding-right: 20px;
    .form-label {
      width: 68px;
      padding-right: 10px;
      color: #333;
      cursor: pointer;
      text-align: right;
      font-size: 13px;
    }
    // .line:hover {
    //   color: #2362FB;
    //   text-decoration: underline;
    // }
    .form-add {
      color: #2362FB;
    }
  }
  .extra-file {
    margin-top: 15px;
    position: relative;
  }
  .btn-group {
    margin-bottom: 30px;
    margin-top: 18px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
/deep/.extra-file {
  align-items: flex-start;
}
  /deep/.tox-tinymce {
    flex: 1;
    margin-top: 20px;
    margin-right: 5px;
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
  color: #333;
  font-size: 13px;
  margin-left: 5px;
}
.add-file:hover {
  color: #2362FB;
}
.el-icon-link {
  color: #2362FB;
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

.add-img-wrap {
  position: absolute;
  cursor: pointer;
  left: 90px;
  top: -1px;
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

.img-item-add {
  position: absolute;
  opacity: 0;
}

.theme-input {
  width: 100%;
  /deep/.el-input__inner {
    height: 38px;
    border:1px solid #e4e4e4 !important;
  }
}

.segmentation {
  color: #999;
  display: inline-block;
  position: relative;
  top: -1px;
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
.email_bottom {
  height: 50px;
  font-size: 12px;
  color: #857277;
  padding-left: 60px;
  padding-top: 10px;
  .email_one {
    white-space: nowrap;
    padding-right: 20px;
  }
  .email_line {
    position: relative;
    top: -2px;
  }
}
/deep/ .w-e-toolbar .w-e-menu {
  z-index: 2000 !important;
}

/deep/ .w-e-text-container {
  z-index: 2000 !important;
}

/deep/.el-dropdown-link {
  font-size: 12px;
  cursor: pointer;
}

/deep/.wk-attachment{
  color: #2362FB;
  font-size: 14px;
}
/deep/.wk-picture {
  color: #24A4FE;
}
/deep/.el-icon-document {
  color: #333;
  font-weight: 600;
}
</style>
