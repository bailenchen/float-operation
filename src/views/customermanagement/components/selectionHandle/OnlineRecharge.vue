<!--
 * @Author: your name
 * @Date: 2020-08-22 10:51:58
 * @LastEditTime: 2020-08-22 11:47:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dz-72crm-qiwen\src\views\customermanagement\components\selectionHandle\OnlineRecharge.vue
-->
<template>
  <el-dialog :visible="visible" title="在线充值" @close="handleCancel">
    <div class="main">
      <el-form ref="form" :rules="rules" :model="form" label-width="100px">
        <el-form-item label="充值金额（元）：" prop="money">
          <el-input v-model="form.money"/>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button v-debounce="handleConfirm" type="primary">扫码付款</el-button>
      <el-button v-debounce="handleConfirm" type="primary">付款码付款</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { Loading } from 'element-ui'
export default {
  name: 'OnlineRecharge',
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
      form: {
        money: ''
      },
      rules: {
        money: [
          { required: true, message: '请输入充值金额', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    visible(val) {
    //   if (val && this.list.length === 0) {
    //     this.getList()
    //   }
    }
  },
  methods: {
    /**
     * 取消选择
     */
    handleCancel() {
      this.$emit('update:visible', false)
    },

    /**
     * 确定
     */
    handleConfirm() {
      const loading = Loading.service({
        target: document.querySelector(`.el-dialog[aria-label="在线充值"]`)
      })
      this.$refs.form.validate((valid) => {
        alert(valid)
      })
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
    height: 250px;
}
/deep/ .el-dialog {
    width: 600px;
}

/deep/ .el-form-item__label {
    width: 130px !important;
}

/deep/ .el-form-item__content {
    margin-left: 130px !important;
}
</style>
