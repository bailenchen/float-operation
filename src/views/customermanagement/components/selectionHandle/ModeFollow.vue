<!--
 * @Author: your name
 * @Date: 2020-08-22 10:51:58
 * @LastEditTime: 2020-09-14 11:23:51
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dz-72crm-qiwen\src\views\customermanagement\components\selectionHandle\OnlineRecharge.vue
-->
<template>
  <el-dialog :visible="visible" title="修改跟进" @close="handleCancel">
    <div class="main">
      <div class="main-item">
        <div class="follow-label">跟进状态：</div>
        <div class="form">
          <el-select v-model="followUpResults" placeholder="请选择">
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </div>
      </div>
      <div class="main-item">
        <div class="follow-label">跟进内容：</div>
        <div class="form">
          <el-input
            :rows="2"
            v-model="followUpText"
            type="textarea"
            maxlength="300"
            show-word-limit
            placeholder="请输入内容"/>
        </div>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button v-debounce="handleConfirm" type="primary">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { crmInsideUserModeFollow, crmInsideUserModeFollowList } from '@/api/customermanagement/address'
import { Loading } from 'element-ui'

export default {
  name: 'ModeFollow',
  components: {

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
      followUpResults: '', // 跟进状态
      followUpText: '', // 跟进内容
      statusList: []
    }
  },
  watch: {
    visible(val) {
      this.followUpResults = ''
      this.followUpText = ''
      if (this.selectionList.length) {
        this.followUpResults = this.selectionList[0].followUpResults
        this.followUpText = this.selectionList[0].followUpText
      }
    }
  },
  created() {
    this.getSelectList()
  },
  methods: {
    /**
     * 获取下拉
     */
    getSelectList() {
      crmInsideUserModeFollowList().then(res => {
        this.statusList = []
        const list = res.data && res.data.length ? res.data : []
        if (list.length) {
          for (let index = 0; index < list.length; index++) {
            const element = list[index]
            this.statusList.push({ name: element, value: element })
          }
        }
        console.log(res, '99999')
      }).catch(() => {

      })
    },
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

    /**
     * 确定
     */
    handleConfirm() {
      if (!this.followUpResults) {
        this.$message.error('请选择跟进状态')
        return
      } else if (!this.followUpText) {
        this.$message.error('请输入跟进内容')
        return
      }
      const params = {
        insideId: this.selectionList[0].insideId,
        followUpResults: this.followUpResults,
        followUpText: this.followUpText
      }
      const loading = Loading.service({
        target: document.querySelector(`.el-dialog[aria-label="修改跟进"]`)
      })
      crmInsideUserModeFollow(params).then(res => {
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
    }
  }
}
</script>
<style lang='scss' scoped>
.main {
    height: 300px;
    overflow: auto;
    padding-left: 20px;
    padding-right: 20px;
}
/deep/ .el-dialog {
    width: 500px;
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

.main-item {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin-bottom: 20px;
}

.main-item .follow-label {
    width: 100px;
    line-height: 34px;
}

.main-item .form {
    width: 100%;
}
</style>
