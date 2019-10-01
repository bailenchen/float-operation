<template>
  <div :class="['mix-content', { 'unfold': !isUnfold }]">
    <i
      v-if="isUnfold"
      class="wk wk-close"
      @click="close" />
    <div
      v-if="isUnfold"
      class="mix-content-select">
      <el-select
        v-if="showContacts"
        v-model="contactsId"
        clearable
        placeholder="选择联系人">
        <el-option
          v-for="item in contacts"
          :key="item.contactsId"
          :label="item.name"
          :value="item.contactsId" />
      </el-select>
      <el-select
        v-model="followType"
        clearable
        placeholder="选择跟进方式">
        <el-option
          v-for="item in followTypes"
          :key="item.value"
          :label="item.label"
          :value="item.value" />
      </el-select>
      <el-date-picker
        v-model="nextTime"
        :editable="false"
        type="datetime"
        placeholder="选择下次联系时间"
        value-format="yyyy-MM-dd HH:mm:ss" />
    </div>
    <div :class="['i-cont', { 'unfold': !isUnfold }]">
      <i
        v-if="!isUnfold"
        class="wk wk-write" />
      <el-input
        ref="textarea"
        v-model="content"
        :autosize="autosize"
        type="textarea"
        clearable
        resize="none"
        placeholder="请输入内容"
        @focus="inputFocus" />
    </div>
    <section
      v-if="imgFiles.length > 0 && isUnfold"
      class="img-cont">
      <flexbox wrap="wrap">
        <div
          v-for="(item, index) in imgFiles"
          :key="index"
          :style="{ 'background-image': `url('${item.url}')` }"
          class="img-item"
          @mouseover="mouseImgOver(item, index)"
          @mouseleave="mouseImgLeave(item, index)">
          <div
            v-if="item.showDelete"
            class="img-delete"
            @click="deleteImgOrFile('image', item, index)">×</div>
        </div>
        <div class="img-item-add">
          <input
            type="file"
            class="img-item-iput"
            accept="image/*"
            multiple
            @change="uploadFile">
        </div>
      </flexbox>
      <div
        class="img-bar"
        @click="deleteAllImg">全部删除</div>
    </section>
    <section
      v-if="files.length > 0 && isUnfold"
      class="file-cont">
      <flexbox class="f-header">
        <img
          class="f-logo"
          src="@/assets/img/send_file.png">
        <div class="f-name">附件</div>
      </flexbox>
      <div class="f-body">
        <flexbox
          v-for="(item, index) in files"
          :key="index"
          class="f-item">
          <img
            :src="item.icon"
            class="f-img">
          <div class="f-name">{{ item.name+'('+item.size+')' }}</div>
          <div
            class="close-button"
            @click="deleteImgOrFile('file', item, index)">×</div>
        </flexbox>
      </div>
      <div
        class="img-bar"
        @click="files=[]">全部删除</div>
    </section>
    <section
      v-if="business.length > 0 && isUnfold"
      class="c-cont">
      <flexbox class="c-header">
        <img
          class="c-logo"
          src="@/assets/img/send_business.png">
        <div class="c-name">商机</div>
      </flexbox>
      <div class="c-body">
        <flexbox wrap="wrap">
          <flexbox
            v-for="(item, index) in business"
            :key="index"
            class="c-item">
            <div class="c-item-name">{{ item.businessName }}</div>
            <div
              class="c-item-close"
              @click="business.splice(index, 1)">×</div>
          </flexbox>
        </flexbox>
      </div>
    </section>
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
      <el-popover
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
          :action="{ type: 'condition', data: { moduleType: crmType, customerId: id } }"
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
      </el-popover>
      <el-button type="primary" class="send-btn" @click="sendClick">发布</el-button>
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
import { fileSize, getFileTypeIcon } from '@/utils/index'
import { crmFileSave, crmFileDelete } from '@/api/common'
import CrmRelative from '@/components/CreateCom/CrmRelative'

export default {
  /** 跟进记录 下的 添加 有添加框的都需要*/
  name: 'LogAdd',
  components: {
    CrmRelative
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
      contactsId: '',
      followType: '',
      // 下次联系时间
      nextTime: '',
      /** 展示关联弹窗 */
      showRelativeType: '',
      batchId: '' // 批次ID
    }
  },
  computed: {
    autosize() {
      if (this.isUnfold) {
        return { minRows: 3, maxRows: 6 }
      }
      return { minRows: 1, maxRows: 1 }
    }
  },
  watch: {
    followTypes() {
      this.getDefalutFollowType()
    }
  },
  mounted() {
    this.getDefalutFollowType()
  },

  beforeDestroy() {
  },
  methods: {
    /**
     * 跟进类型初始值
     */
    getDefalutFollowType() {
      if (this.followTypes && this.followTypes.lenght > 0) {
        this.followType = this.followTypes[0]
      } else {
        this.followType = ''
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
      this.contactsId = ''
      // 展示关联弹窗
      this.showRelativeType = ''
      this.batchId = ''
      this.followType = ''
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
        var firstFile = files[0]
        this.sendFileRequest(firstFile, type, () => {
          for (let index = 1; index < files.length; index++) {
            const file = files[index]
            this.sendFileRequest(file, type)
          }
          event.target.value = ''
        })
      }
    },

    /**
     * 文件上传
     */
    sendFileRequest(file, type, result) {
      var params = { file: file, type: type }
      if (this.batchId) {
        params.batchId = this.batchId
      }
      crmFileSave(params)
        .then(res => {
          if (this.batchId == '') {
            this.batchId = res.batchId
          }
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
     * 删除全部图片
     */
    deleteAllImg() {
      this.imgFiles = []
    },
    deleteImgOrFile(type, item, index) {
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
    },

    /**
     *  鼠标移入和移除 图片区域
     */
    mouseImgOver(item, index) {
      item.showDelete = true
      this.$set(this.imgFiles, index, item)
    },
    mouseImgLeave(item, index) {
      item.showDelete = false
      this.$set(this.imgFiles, index, item)
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
      this.$emit('send', {
        id: this.id,
        content: this.content,
        files: this.files,
        images: this.imgFiles,
        business: this.business,
        contactsId: this.contactsId,
        batchId: this.batchId,
        followType: this.followType,
        nextTime: this.nextTime
      })
    },

    /**
     * 关闭
     */
    close() {
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
    .el-select {
      width: 150px;
      margin-right: 8px;
    }

    .el-date-editor {
      width: 200px;
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

/** 图片  */
.img-cont {
  padding: 0 10px;
  margin-bottom: 15px;
  .img-item {
    width: 98px;
    height: 98px;
    border: 1px solid #ccc;
    display: inline-block;
    margin: 0 4px 4px 0;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    position: relative;
    .img-delete {
      position: absolute;
      cursor: pointer;
      top: 0;
      right: 0;
      width: 20px;
      height: 20px;
      line-height: 20px;
      text-align: center;
      font-size: 17px;
      background-color: #666;
      color: white;
    }
  }
  .img-item-add {
    width: 98px;
    height: 98px;
    line-height: 98px;
    font-size: 60px;
    color: #ccc;
    text-align: center;
    margin: 0 4px 4px 0;
    cursor: pointer;
    display: inline-block;
    border-width: 1px;
    border-style: dashed;
    border-color: #ddd;
    position: relative;
    font-weight: 100;
    .img-item-iput {
      position: absolute;
      top: 0;
      right: 0;
      height: 98px;
      width: 98px;
      opacity: 0;
      cursor: pointer;
    }
  }
  .img-item-add:before {
    width: 2px;
    height: 39.5px;
    content: ' ';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #2888e4;
  }
  .img-item-add:after {
    width: 39.5px;
    height: 2px;
    content: ' ';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #2888e4;
  }
  .img-bar {
    color: #5a8ae2;
    font-size: 12px;
    padding: 5px 0;
    cursor: pointer;
  }
}
/** 附件  */
.file-cont {
  padding: 0 10px;
  margin: 0 10px 15px;
  border: 1px dashed #dfdfdf;
  .f-header {
    padding: 8px 0 15px;
    .f-logo {
      position: block;
      width: 15px;
      height: 15px;
      margin-right: 8px;
    }
    .f-name {
      color: #777;
      font-size: 12px;
    }
  }

  .f-body {
    .f-item {
      padding: 3px 0;
      height: 25px;
      .f-img {
        position: block;
        width: 15px;
        height: 15px;
        margin-right: 8px;
      }
      .f-name {
        color: #666;
        font-size: 12px;
      }
    }
  }

  .img-bar {
    color: #5a8ae2;
    font-size: 12px;
    padding: 5px 0;
    cursor: pointer;
  }
}
/** CRM  */
.c-cont {
  padding: 0 10px;
  margin: 0 10px 15px;
  border: 1px dashed #dfdfdf;
  .c-header {
    padding: 8px 0 15px;
    .c-logo {
      position: block;
      width: 15px;
      height: 15px;
      margin-right: 8px;
    }
    .c-name {
      color: #777;
      font-size: 12px;
    }
  }

  .c-body {
    margin-bottom: 10px;
    .c-item {
      height: 24px;
      border-radius: 12px;
      padding: 0 8px;
      margin: 0 5px 5px 0;
      background-color: #3487e2;
      color: white;
      width: auto;
      cursor: pointer;
      .c-item-name {
        font-size: 12px;
      }
      .c-item-close {
        padding-left: 5px;
        font-size: 17px;
      }
    }
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
/** 关闭按钮  */
.close-button {
  width: 30px;
  line-height: 16px;
  cursor: pointer;
  color: #ccc;
  height: 16px;
  font-size: 17px;
  text-align: center;
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
</style>
