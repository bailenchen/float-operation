<!--
 * @Author: your name
 * @Date: 2020-08-22 10:51:58
 * @LastEditTime: 2020-09-14 11:23:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dz-72crm-qiwen\src\views\customermanagement\components\selectionHandle\OnlineRecharge.vue
-->
<template>
  <el-dialog :visible="visible" title="新建争议" @close="handleCancel">
    <div class="main">
      <sections
        title="基本信息"
        class="b-cells"
        content-height="auto">
        <flexbox
          :gutter="0"
          align="stretch"
          wrap="wrap"
          style="padding: 10px 16px 0;">
          <div
            class="label">
            <i style="font-style:normal;color:red;">* </i> 争议内容
          </div>
          <el-input
            v-model="remarks"
            type="textarea"
            placeholder="请输入内容"
            maxlength="800"
            show-word-limit />

          <div class="file">
            <div v-if="!fileName" class="control-item" @click="upload">
              <span class="icon wk wk-file"/>附件上传
            </div>
            <div v-else class="control-item">
              {{ fileName }}
              <i class="el-icon-close delete-icon" @click="deleteFile"/>
            </div>
          </div>
        </flexbox>
      </sections>
      <sections
        title="审核信息"
        class="b-cells"
        content-height="auto">
        <flexbox
          :gutter="0"
          align="stretch"
          wrap="wrap"
          style="padding: 10px 16px 0;">
          <div class="label" style="margin-right:5px;">
            审核人
          </div>
          <xh-user-cell
            :value="examineUser"
            class="set-width"
            @value-change="fieldValueChange"/>
        </flexbox>
      </sections>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button v-debounce="handleConfirm" type="primary">保存</el-button>
    </div>
    <input
      ref="reportFile"
      type="file"
      style="display: none;"
      accept=".zip,.rar,.doc,.docx,.pdf,.jpg"
      @change="uploadFile">
  </el-dialog>
</template>

<script>
import { XhUserCell } from '@/components/CreateCom'
import Sections from '../../components/Sections'
import { crmFileSave } from '@/api/common'
import { crmCustomerDisputeSaveAPI } from '@/api/customermanagement/customer'
import { Loading } from 'element-ui'

export default {
  name: 'DisputeExamine',
  components: {
    XhUserCell,
    Sections
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    id: [String, Number],
    // 操作数据
    selectionList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      remarks: '',
      examineUser: [],
      fileName: '',
      examineBatchId: null
    }
  },
  watch: {
    visible(val) {
      this.content = ''
      this.examineUser = []
    }
  },
  methods: {
    /**
     * 取消选择
     */
    handleCancel() {
      this.$emit('update:visible', false)
    },

    // 字段的值更新
    fieldValueChange(data) {
      if (data.value.length) {
        this.examineUser = data.value
      } else {
        this.examineUser = []
      }
    },

    upload() {
      this.$refs.reportFile.click()
    },

    uploadFile(event) {
      var files = event.target.files
      const file = files[0]
      this.sendFileRequest(file)
      event.target.value = ''
    },

    // 发送请求
    sendFileRequest(file) {
      var params = { file: file }
      crmFileSave(params)
        .then(res => {
          this.fileName = res.name
          this.examineBatchId = res.batchId
        })
        .catch(() => {})
    },

    deleteFile() {
      this.fileName = ''
    },


    /**
     * 确定
     */
    handleConfirm() {
      if (!this.remarks) {
        this.$message.error('请输入争议内容')
        return
      }
      const params = {
        examineBatchId: this.examineBatchId,
        remarks: this.remarks,
        customerId: this.selectionList.length ? this.selectionList[0].customerId : null,
        checkUserId: this.examineUser.length ? this.examineUser[0].userId : null
      }
      const loading = Loading.service({
        target: document.querySelector(`.el-dialog[aria-label="新建争议"]`)
      })
      crmCustomerDisputeSaveAPI(params).then(res => {
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        loading.close()
        this.$emit('handle', {
          type: 'dispute'
        })
        this.handleCancel()
      }).catch(() => {
        loading.close()
      })
      // const loading = Loading.service({
      //   target: document.querySelector(`.el-dialog[aria-label="在线充值"]`)
      // })

    //   if (this.selectId) {
    //     const loading = Loading.service({
    //       target: document.querySelector(`.el-dialog[aria-label="放入公海"]`)
    //     })
    //     crmCustomerPutInPool({
    //       ids: this.selectionList.map(function(item, index, array) {
    //         return item.customerId
    //       }).join(','),
    //       poolId: this.selectId
    //     })
    //       .then(res => {
    //         this.$message({
    //           type: 'success',
    //           message: '操作成功'
    //         })
    //         loading.close()
    //         this.$emit('handle', { type: 'put_seas' })
    //         this.handleCancel()
    //       })
    //       .catch(() => {
    //         loading.close()
    //       })
    //   }
    }
  }
}
</script>
<style lang='scss' scoped>
.main {
    height: 400px;
    overflow: auto;
    padding-left: 20px;
    padding-right: 20px;
}
/deep/ .el-dialog {
    width: 600px;
}

/deep/ .el-textarea__inner {
  height: 150px;
}

/deep/ .el-dialog__header {
  padding-left: 30px;
}

/deep/ .el-dialog__body {
  padding: 30px 0;
}

/deep/ .el-dialog__footer {
  padding: 10px 25px 10px 10px !important
}

/deep/ .el-form-item__label {
    text-align: left;
    width: 130px !important;
}

/deep/ .el-form-item__content {
    margin-left: 130px !important;
}

.label {
  font-size: 13px;
  word-wrap: break-word;
  word-break: break-all;
  line-height: 30px;
}

.set-width {
  width: calc(100% - 45px);
}

.control-item {
  color: #666;
  font-size: 12px;
  margin-right: 20px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 15px;
}

.control-item .icon {
    font-size: 12px;
    margin-right: 5px;
}
</style>
