<template>
  <div
    v-loading="showLoading"
    class="create-log">
    <el-tabs
      v-model="activeTab"
      @tab-click="handleTabToggle">
      <el-tab-pane
        label="日报"
        name="day" />
      <el-tab-pane
        label="周报"
        name="week" />
      <el-tab-pane
        label="月报"
        name="month" />
    </el-tabs>

    <template v-if="!showMore">
      <div class="content-box">
        <flexbox
          justify="flex-start"
          class="box"
          @click.native="showMore = true">
          <span class="wk wk-write icon" />
          <span class="info">请输入日志内容</span>
        </flexbox>
      </div>
    </template>
    <template v-else>
      <el-form>
        <el-form-item
          v-for="(item, index) in textFormKeyList"
          :key="index"
          :label="item.label">
          <el-input
            v-model="form[item.key]"
            :autosize="{
              minRows: 2,
              maxRows: 10
            }"
            type="textarea"
            resize="none"
            placeholder="请输入内容" />
        </el-form-item>
        <span
          class="wk wk-close close-icon"
          @click="showMore = false" />
      </el-form>

      <add-image-list
        v-if="imgFiles.length > 0"
        :data="imgFiles"
        @delete="deleteImage"
        @delete-all="deleteAllFile(2)"
        @upload="uploadFile" />
      <add-file-list
        v-if="files.length > 0"
        :data="files"
        @delete="deleteFile"
        @delete-all="deleteAllFile(1)" />

      <add-relate-list
        v-for="(value, key, index) in showRelateData"
        :key="index"
        :data="value"
        :type="key"
        @delete="deleteRelate" />

      <div class="add-control">
        <div
          class="control-item"
          @click="barClick('img')">
          <span class="icon wk wk-picture" />
          <span>图片</span>
        </div>
        <div
          class="control-item"
          @click="barClick('file')">
          <span class="icon wk wk-file" />
          <span>附件</span>
        </div>
        <el-popover
          v-model="showRelatePopover"
          placement="bottom"
          width="800"
          popper-class="no-padding-popover"
          trigger="click">
          <crm-relative
            ref="crmrelative"
            :radio="false"
            :show-types="[
              'customer',
              'contacts',
              'business',
              'contract'
            ]"
            :selected-data="relateData"
            :show="showRelatePopover"
            @close="showRelatePopover= false"
            @changeCheckout="relateDataChange" />
          <div
            slot="reference"
            class="control-item"
            @click="barClick('relate')">
            <span class="icon wk wk-associated" />
            <span>关联业务</span>
          </div>
        </el-popover>

        <div class="control-item">
          <span class="cursor-default">发送给：</span>
          <span
            v-for="(item, index) in showSendUserList"
            :key="index"
            class="send-user">
            <el-tooltip
              placement="bottom"
              effect="light"
              popper-class="tooltip-change-border">
              <div slot="content">
                <span>{{ item.realname }}</span>
              </div>
              <div
                v-photo="item"
                v-lazy:background-image="$options.filters.filterUserLazyImg(item.img)"
                :key="item.img"
                class="div-photo item-img" />
            </el-tooltip>
          </span>
          <members-dep
            :close-dep="true"
            :content-block="false"
            :user-checked-data="sendUserList"
            @popoverSubmit="sendUserChange">
            <span slot="membersDep">
              <el-tooltip
                placement="bottom"
                effect="light"
                popper-class="tooltip-change-border">
                <div slot="content">
                  <span>{{ `等${sendUserList.length}人` }}</span>
                </div>
                <i
                  v-show="sendUserList.length > 5"
                  class="el-icon-more more-user-btn" />
              </el-tooltip>

              <i
                class="el-icon-plus add-user-btn" />
            </span>

          </members-dep>

        </div>

        <div class="others">
          <el-button
            size="small"
            type="primary"
            @click="handleCreate">
            发布
          </el-button>
        </div>
      </div>
    </template>

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
import {
  journalAdd
  // journalEdit
} from '@/api/oamanagement/journal'
import { fileSize, getFileTypeIcon, guid } from '@/utils/index'
import { crmFileSave, crmFileDelete, crmFileRemoveByBatchId } from '@/api/common'
import AddImageList from '@/components/quickAdd/AddImageList'
import AddFileList from '@/components/quickAdd/AddFileList'
import CrmRelative from '@/components/CreateCom/CrmRelative'
import AddRelateList from '@/components/quickAdd/AddRelateList'
import membersDep from '@/components/selectEmployee/membersDep'

export default {
  name: 'CreateLog',
  components: {
    AddImageList,
    AddFileList,
    CrmRelative,
    AddRelateList,
    membersDep
  },
  data() {
    return {
      form: {},
      textFormKeyList: [],
      activeTab: 'day',
      showLoading: false,
      categoryIdMap: {
        day: 1, // 日报
        week: 2, // 周报
        month: 3 // 月报
      },
      // 用于在图片类型下不上传附件
      showRelativeType: '',
      imgFiles: [],
      files: [],
      // 批次ID
      batchId: guid(),
      showRelatePopover: false, // 关联业务信息框
      relateData: {},
      sendUserList: [], // 发送人
      showMore: false
    }
  },
  computed: {
    showRelateData() {
      const tempsData = {}
      Object.keys(this.relateData).forEach(key => {
        const list = this.relateData[key]
        if (list && list.length) {
          tempsData[key] = list
        }
      })
      return tempsData
    },

    showSendUserList() {
      if (this.sendUserList && this.sendUserList.length > 5) {
        return this.sendUserList.slice(0, 5)
      }
      return this.sendUserList
    }
  },
  created() {
    this.handleTabToggle()
  },
  methods: {
    /**
     * 日志类型 tab 切换
     */
    handleTabToggle() {
      const map = {
        day: ['今日', '明日'],
        week: ['本周', '下周'],
        month: ['本月', '下月']
      }
      const arr = map[this.activeTab]
      this.textFormKeyList = [
        { label: `${arr[0]}工作的内容：`, key: 'content' },
        { label: `${arr[1]}工作的内容：`, key: 'tomorrow' },
        { label: '遇到的问题：', key: 'question' }
      ]
    },

    /**
     * 保存日志
     */
    handleCreate() {
      console.log('save', this.form)
      if (!this.form.content && !this.form.tomorrow && !this.form.question) {
        this.$message.error('请填写日志内容')
        return
      }

      this.showLoading = true
      const relateData = {}
      for (const key in this.relateData) {
        relateData[`${key}Ids`] = this.relateData[key].map(item => {
          return item[`${key}Id`]
        }).join(',')
      }

      journalAdd({
        ...this.form,
        batchId: this.batchId,
        sendUserIds: this.sendUserList.map(item => {
          return item.userId
        }).join(','),
        ...relateData,
        categoryId: this.categoryIdMap[this.activeTab]
      })
        .then(() => {
          this.showLoading = false
          this.resetData()
          this.$emit('update')
          this.$message.success('添加成功')
        })
        .catch(() => {
          this.showLoading = false
        })
    },

    /**
     * 重置信息
     */
    resetData() {
      this.form = {}
      this.batchId = guid()
      this.imgFiles = []
      this.files = []
      this.sendUserList = []
      this.relateData = {}
    },

    /**
     * 图片和关联按钮事件
     */
    barClick(type) {
      this.showRelativeType = type
      if (type == 'relate') {
        this.showRelatePopover = true
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
      crmFileSave({ file: file, type: type, batchId: this.batchId })
        .then(res => {
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
        })
        .catch(() => {})
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
     * 关联业务选择
     */
    relateDataChange(val) {
      this.showRelatePopover = false
      this.relateData = val.data
    },

    /**
     * 删除相关
     */
    deleteRelate(data, index, type) {
      this.relateData[type].splice(index, 1)
    },

    /**
     * 发送人选择
     */
    sendUserChange(users) {
      this.sendUserList = users
    }
  }
}
</script>

<style scoped lang="scss">
/deep/ .el-tabs__header {
  margin: 0;
}
/deep/ .el-tabs__nav-wrap {
  padding: 0 18px;
}

/deep/ .el-tabs__nav-wrap::after {
  height: 1px;
}

.create-log {
  .content-box {
    padding: 15px 10px;
    .box {
      height: 35px;
      border-radius: 3px;
      border: 1px solid #e6e6e6;
      padding: 0 10px;
      cursor: pointer;
      .icon {
        font-size: 15px;
        color: #e6e6e6;
      }
      .info {
        color: #c0c4cc;
        margin-left: 5px;
      }
      &:hover {
        border-color: #c0c4cc;
        .icon {
          color: $xr-color-primary;
        }
      }
    }
  }

  .el-form {
    position: relative;
    padding: 0 18px;
    margin-top: 15px;
    /deep/ .el-form-item {
      font-size: 14px;
      margin-bottom: 10px;
      .el-form-item__label {
        font-size: 12px;
        line-height: 1.5;
        /*color: #666;*/
        font-weight: bold;
      }
    }
    .el-textarea {
      /deep/ .el-textarea__inner {
        border: 0 none;
        padding: 0 5px;
      }
    }

    .close-icon {
      position: absolute;
      top: 0;
      right: 20px;
      font-size: 18px;
      color: #d9d9d9;
      cursor: pointer;
      &:hover {
        color: $xr-color-primary;
      }
    }
  }

  .add-control {
    padding: 5px 18px 10px;
    min-height: 50px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    .control-item {
      color: #666;
      font-size: 12px;
      margin-right: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      .icon {
        font-size: 12px;
        margin-right: 5px;
      }
      .add-user-btn {
        border: 1px dotted #666;
        border-radius: 50%;
        padding: 5px;
        font-size: 12px;
        transform: scale(0.8);
        margin-left: 7px;
      }
      &:hover {
        color: $xr-color-primary;
        .add-user-btn {
          border-color: $xr-color-primary;
        }
      }
    }
    .others {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .el-button--small {
        padding: 7px 14px;
      }
    }
  }
}

.file-input {
  display: none;
}

// 参与人
.send-user {
  position: relative;
  display: inline-block;

  .item-img {
    width: 32px;
    height: 32px;
    border-radius: 16px;
  }
}

.send-user + .send-user {
  margin-left: 7px;
}

.more-user-btn {
  background-color: #F3F7FF;
  border-radius: 50%;
  padding: 5px;
  font-size: 12px;
  color: #666;
  margin-left: 7px;
  &:hover {
    background-color: $xr-color-primary;
    color: white;
  }
}

.cursor-default {
  cursor: default;
  color: #666;
}

</style>
