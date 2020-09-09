<template>
  <div :class="['mix-content', { 'unfold': !isUnfold }]">
    <i
      v-if="isUnfold"
      class="wk wk-close"
      @click="close" />
    <div
      v-if="isUnfold"
      class="mix-content-select">
      <div
        v-for="(field, index) in fieldList"
        :key="index"
        :class="field.com"
        class="form-item">
        <component
          :is="field.com"
          :disabled="field.disabled"
          :index="index"
          :item="field"
          :placeholder="field.placeholder"
          :value="field.value"
          @value-change="handleFormChange($event, field.setting)" />
      </div>
      <common-words @select="commonWordsSelect" />
    </div>
    <div
      :class="['i-cont', { 'unfold': !isUnfold }]"
      @click.stop="isUnfold = true">
      <i
        v-if="!isUnfold"
        class="wk wk-write" />
      <!-- <span
        :class="{empty: !!!content, unfold: !isUnfold}"
        class="content-box" >
        {{ content || '' }}
      </span> -->
      <el-input
        ref="textarea"
        v-model="content"
        :autosize="autosize"
        :maxlength="300"
        type="textarea"
        clearable
        resize="none"
        placeholder="请输入内容"
        @focus="inputFocus" />
    </div>
    <add-image-list
      v-if="imgFiles.length > 0 && isUnfold"
      :data="imgFiles"
      @delete="deleteImage"
      @delete-all="deleteAllFile(2)"
      @upload="uploadFile" />
    <add-file-list
      v-if="files.length > 0 && isUnfold"
      :data="files"
      @delete="deleteFile"
      @delete-all="deleteAllFile(1)" />
    <add-relate-list
      v-if="business.length > 0 && isUnfold"
      :data="business"
      type="business"
      @delete="deleteRelate" />

    <div
      v-if="isUnfold"
      class="bar-cont">
      <el-button
        type="text"
        class="handle-button"
        icon="wk wk-picture"
        @click="barClick('img')">图片</el-button>
      <el-button
        type="text"
        class="handle-button"
        icon="wk wk-file"
        @click="barClick('file')">附件</el-button>
      <!--<el-popover
        v-if="showBusiness"
        v-model="showBusinessPopover"
        placement="bottom"
        width="700"
        popper-class="no-padding-popover"
        trigger="click">
        <crm-relative
          ref="crmrelative"
          :show="showBusinessPopover"
          :radio="false"
          :action="relativeAction"
          :selected-data="{ 'business': business }"
          crm-type="business"
          @close="showBusinessPopover=false"
          @changeCheckout="checkRelativeInfos" />
        <el-button
          slot="reference"
          type="text"
          icon="wk wk-associate"
          class="handle-button"
          style="margin-left: 10px;"
          @click="barClick('business')">关联商机</el-button>
      </el-popover>-->
      <el-button
        v-debounce="sendClick"
        type="primary"
        class="send-btn">发布</el-button>
    </div>

    <!-- 附件 -->
    <input
      ref="fileInput"
      accept="*.*"
      type="file"
      class="file-input"
      multiple
      @change="uploadFile">
    <input
      ref="imgInput"
      accept="image/*"
      type="file"
      class="file-input"
      multiple
      @change="uploadFile">
  </div>
</template>

<script>
import moment from 'moment'
import { crmFileDelete, crmFileRemoveByBatchId } from '@/api/common'
import {
// crmSettingRecordListAPI
} from '@/api/customermanagement/common'
import {
  QuerySignUpList
  // QueryFollowUpResults
} from '@/api/systemManagement/params'
import { QueryLeadsStatusFollowResult } from '@/api/systemManagement/params'

import XhSelect from '@/components/CreateCom/XhSelect'
import XhDateTime from '@/components/CreateCom/XhDateTime'

import CrmRelative from '@/components/CreateCom/CrmRelative'
import AddImageList from '@/components/quickAdd/AddImageList'
import AddFileList from '@/components/quickAdd/AddFileList'
import AddRelateList from '@/components/quickAdd/AddRelateList'
import CommonWords from '@/components/common-words'

import { objDeepCopy } from '@/utils'

import { fileSize, getFileTypeIcon, guid } from '@/utils/index'

export default {
  /** 跟进记录 下的 添加 有添加框的都需要*/
  name: 'LogAdd',
  components: {
    CrmRelative,
    AddImageList,
    AddFileList,
    AddRelateList,
    CommonWords,

    XhSelect,
    XhDateTime
  },
  props: {
    // 展示相关商机关联
    showBusiness: {
      type: Boolean,
      default: false
    },
    // 展示相关商机关联
    showContacts: {
      type: Boolean,
      default: false
    },
    contacts: Array,
    // 首要联系人ID
    contactsId: [String, Number],
    // 跟进类型
    followTypes: Array,
    // 模块ID
    id: [String, Number],
    // 没有值就是全部类型 有值就是当个类型
    crmType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isUnfold: false, // 默认闭合
      /** 输入法 */
      content: '',
      /** 图片信息 */
      imgFiles: [],
      /** 图片信息 */
      files: [],
      /** 关联商机信息 */
      showBusinessPopover: false,
      business: [],
      /** 关联联系人信息 */
      selectContactsId: '',
      followType: '',
      /** 展示关联弹窗 */
      showRelativeType: '',
      batchId: guid(), // 批次ID
      fieldList: [
        { fieldName: 'lastTime', placeholder: '*跟进时间', com: 'XhDateTime', value: '', disabled: true },
        { fieldName: 'category', placeholder: '*LEADS状态', com: 'XhSelect', setting: [], value: '' },
        { fieldName: 'followUpResults', placeholder: '*跟进结果', com: 'XhSelect', setting: [], value: '' },
        { fieldName: 'dealStatus', placeholder: '签约可能性', com: 'XhSelect', setting: [], value: '' },
        { fieldName: 'nextTime', placeholder: '下次跟进时间', com: 'XhDateTime', value: '' }
      ],
      defField: null,
      form: {}
    }
  },
  computed: {
    autosize() {
      if (this.isUnfold) {
        return { minRows: 3, maxRows: 6 }
      }
      return { minRows: 1, maxRows: 1 }
    },
    relativeAction() {
      return {
        type: 'condition',
        data: {
          moduleType: this.crmType,
          customerId: this.id
        }
      }
    }
  },
  watch: {
    followTypes() {
      this.resetInfo()
    },

    contactsId() {
      this.selectContactsId = this.contactsId || ''
    }
  },
  created() {
    this.selectContactsId = this.contactsId || ''
    this.resetInfo()
    this.getOptions()
  },

  beforeDestroy() {},
  methods: {
    /**
     * 跟进类型初始值
     */
    getDefalutFollowType() {
      this.fieldList.forEach(item => {
        if (item.setting && item.setting.length > 0) {
          item.value = item.setting[0].value
        } else {
          if (item.fieldName == 'lastTime') {
            item.value = moment().format('YYYY-MM-DD HH:mm:ss')
          } else {
            item.value = ''
          }
        }
      })
    },

    // 获取leads联动
    getLeadsStatus() {
      QueryLeadsStatusFollowResult({ type: 'mmmm' }).then(res => {
        this.fieldList[1].setting = res.data.map(o => {
          const list = o.children.map(item => {
            return { name: item.name, value: item.name }
          })
          return { name: o.name, value: o.id, list: list }
        })
        if (res.data.length > 0) {
          this.fieldList[1].value = ''
        }
        console.log(this.fieldList, '11111')
        this.$set(this.fieldList, 1, this.fieldList[1])
      }).catch(() => {})
    },

    getOptions() {
      this.getLeadsStatus()
      // // LEADS状态
      // crmSettingRecordListAPI().then(res => {
      //   this.fieldList[1].setting = res.data.map(o => {
      //     return { name: o, value: o }
      //   })
      //   if (res.data.length > 0) {
      //     this.fieldList[1].value = this.fieldList[1].setting[0].value
      //   }
      //   this.$set(this.fieldList, 1, this.fieldList[1])
      // }).catch(() => {})
      // // 跟进结果
      // QueryFollowUpResults().then(res => {
      //   this.fieldList[2].setting = res.data.map(o => {
      //     return { name: o.results, value: o.results }
      //   })
      //   if (res.data.length > 0) {
      //     this.fieldList[2].value = this.fieldList[2].setting[0].value
      //   }
      //   this.$set(this.fieldList, 2, this.fieldList[2])
      // }).catch(() => {})
      // 签约可能性
      QuerySignUpList().then(res => {
        this.fieldList[3].setting = res.data.map(o => {
          return { name: o.signUpName, value: o.signUpName }
        })
        if (res.data.length > 0) {
          this.fieldList[3].value = this.fieldList[3].setting[0].value
        }
        this.$set(this.fieldList, 3, this.fieldList[3])
      }).catch(() => {})
    },

    handleFormChange(data, subitem) {
      console.log(data, subitem, 'vvvvv')
      this.fieldList[data.index].value = data.value
      if (data.index == 1) {
        this.concatList = subitem
        this.$set(this.fieldList[2], 'setting', [])
        this.$set(this.fieldList[2], 'value', '')
        console.log(this.fieldList, 'ssss')
        for (let index = 0; index < subitem.length; index++) {
          const element = subitem[index]
          if (data.value == element.value) {
            this.$set(this.fieldList[2], 'setting', element.list)
            return
          }
        }
      } else {
        console.log(this.fieldList, 'xxxxxxxx')
        if (this.fieldList[data.index].fieldName === 'followUpResults') {
          const item = {
            fieldName: 'promisedVisitTime',
            placeholder: '*承诺到访时间',
            com: 'XhDateTime',
            value: ''
          }
          const findIndex = this.fieldList.findIndex(o => o.fieldName === 'promisedVisitTime')
          if (data.value === '承诺到访' && data.index == 2) {
            if (findIndex === -1) {
              this.defField = objDeepCopy(this.fieldList)
              console.log(this.fieldList, 'mmmm')
              this.fieldList.length = 4
              console.log(this.fieldList, 'jjjj', this.defField)
              // this.fieldList.splice(-1, 0, item)
              this.fieldList.push(item)
              console.log(this.fieldList, 'xxx')
            }
          } else {
            if (findIndex !== -1) {
              this.fieldList = this.defField
              this.$set(this.fieldList[data.index], 'value', data.value)
              console.log(this.fieldList, 'nnnnn', this.defField)
            // this.fieldList.splice(-2, 1)
            }
          }
        }
      }
    },

    /**
     * 重置数据
     */
    resetInfo() {
      this.isUnfold = false
      // 输入法
      this.content = ''
      // 图片信息
      this.imgFiles = []
      // 图片信息
      this.files = []
      // 关联商机信息
      this.business = []
      // 关联联系人信息
      this.selectContactsId = this.contactsId || ''
      // 展示关联弹窗
      this.showRelativeType = ''
      this.batchId = guid()
      this.getDefalutFollowType()
    },

    /**
     * 常用语选择
     */
    commonWordsSelect(data) {
      if (this.content) {
        this.$confirm('您选中的常用语将覆盖当前填写内容?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'is-particulars'
        })
          .then(() => {
            this.content = data
          })
          .catch(() => {
            this.$message.info('已取消操作')
          })
      } else {
        this.content = data
      }
    },

    /**
     * 快捷添加按钮
     */
    checkRelativeInfos(data) {
      if (this.showRelativeType == 'business') {
        this.business = data.data
      }
    },
    barClick(type) {
      this.showRelativeType = type
      if (type == 'business') {
        this.showBusinessPopover = true
      } else if (type == 'file') {
        this.$refs.fileInput.click()
      } else if (type == 'img') {
        this.$refs.imgInput.click()
      }
    },

    /**
     * 图片选择出发
     */
    uploadFile(event) {
      var files = event.target.files
      if (files.length) {
        for (let index = 0; index < files.length; index++) {
          const file = files[index]
          if (
            file.type.indexOf('image') == -1 &&
            this.showRelativeType == 'img'
          ) {
            this.$message.error('请上传正确的文件类型')
            return
          }
        }

        var type = event.target.accept == 'image/*' ? 'img' : 'file'
        for (let index = 0; index < files.length; index++) {
          const file = files[index]
          this.uploadFileRequest(file, type)
        }
        event.target.value = ''
      }
    },

    /**
     * 文件上传
     */
    uploadFileRequest(file, type, result) {
      this.$wkUploadFile.upload({
        file: file,
        params: {
          type: type,
          batchId: this.batchId
        }
      }).then(({ res }) => {
        res.size = fileSize(file.size)
        if (type == 'img') {
          this.imgFiles.push(res)
        } else {
          res['icon'] = getFileTypeIcon(file)
          this.files.push(res)
        }
        if (result) {
          result()
        }
      }).catch(() => {})
    },

    /**
     * 图片附件删除
     */
    deleteImage(item, index) {
      this.deleteImgOrFile('image', item, index)
    },

    deleteFile(item, index) {
      this.deleteImgOrFile('file', item, index)
    },

    deleteImgOrFile(type, item, index) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          crmFileDelete({
            id: item.fileId
          })
            .then(res => {
              if (type == 'image') {
                this.imgFiles.splice(index, 1)
              } else {
                this.files.splice(index, 1)
              }
              this.$message.success('操作成功')
            })
            .catch(() => {})
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          })
        })
    },

    /**
     * 删除全部 type 1 是附件 2 是图片
     */
    deleteAllFile(type) {
      if (this.batchId) {
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            crmFileRemoveByBatchId({
              batchId: this.batchId,
              type
            })
              .then(res => {
                if (type == 2) {
                  this.imgFiles = []
                } else {
                  this.files = []
                }
                this.$message.success('操作成功')
              })
              .catch(() => {})
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
      }
    },

    /**
     * 删除相关
     */
    deleteRelate(data, index) {
      this.business.splice(index, 1)
    },

    inputFocus() {
      this.isUnfold = true
      this.$nextTick(() => {
        this.$refs.textarea.focus()
        this.$emit('focus')
      })
    },

    /**
     * 发布
     */
    sendClick() {
      const form = {}
      this.fieldList.forEach(o => {
        form[o.fieldName] = o.value
        if (o.fieldName == 'category') {
          for (let index = 0; index < o.setting.length; index++) {
            const element = o.setting[index]
            if (o.value == element.value) {
              o.value = element.name
              return
            }
          }
        }
      })
      this.$emit('send', {
        id: this.id,
        content: this.content,
        files: this.files,
        images: this.imgFiles,
        business: this.business,
        contactsId: this.selectContactsId,
        batchId: this.batchId,
        followType: form.category,
        ...form
      })
    },

    /**
     * 关闭
     */
    close() {
      this.content = ''
      this.isUnfold = false
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
.mix-content {
  position: relative;
  border: 1px solid $xr-border-line-color;
  border-radius: 3px;
  background-color: white;
  padding: 8px 8px 0;

  &-select {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-bottom: -5px;
    /*.el-select {
      width: 110px;
      margin-right: 8px;
    }

    .el-date-editor {
      width: 200px;
      margin-right: 8px;
    }*/
    .form-item {
      width: 110px;
      margin-bottom: 5px;
      &:not(:last-child) {
        margin-right: 8px;
      }
      &.XhDateTime {
        width: 200px;
      }
    }
  }

  .i-cont {
    padding: 8px 0px;
    .wk-write {
      color: $xr-border-line-color;
      font-size: 15px;
    }
  }
}

.mix-content.unfold {
  padding: 0;
  .i-cont {
    padding: 8px 10px;
  }
}

.mix-content.unfold:hover {
  cursor: pointer;
  border-color: #c0c4cc;
  .i-cont {
    cursor: pointer;
    .wk-write {
      color: $xr-color-primary;
    }

    /deep/ .el-textarea__inner {
      cursor: pointer;
    }
  }
}

.wk-close {
  border: 0;
  color: #d9d9d9;
  font-size: 22px;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  padding: 4px;
  transform: scale(0.8);
}

.wk-close:hover {
  color: #2362fb;
}

.i-cont /deep/ .el-textarea__inner {
  border: none;
  padding: 0;
}

.i-cont.unfold {
  /deep/ .el-textarea {
    width: calc(100% - 50px);
  }
  /deep/ .el-textarea__inner {
    overflow: hidden;
  }
}

/** 底部bar  */
.bar-cont {
  .handle-button {
    color: #666;
    font-size: 12px;

    /deep/ i {
      font-size: 12px;
      margin-right: 5px;
    }
  }

  .handle-button:hover {
    color: $xr-color-primary;
  }
}

.file-input {
  display: none;
}

.send-btn {
  float: right;
  font-size: 12px;
  padding: 5px 9px;
  margin-top: -5px;
}

.content-box {
  height: 50px;
  display: inline-block;
  &.empty {
    color: #ccc;
  }
  &.unfold {
    height: unset;
  }
}
</style>
