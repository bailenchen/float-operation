<!--
 * @Author: your name
 * @Date: 2020-08-22 10:51:58
 * @LastEditTime: 2020-09-07 19:07:21
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dz-72crm-qiwen\src\views\customermanagement\components\selectionHandle\OnlineRecharge.vue
-->
<template>
  <el-dialog :visible="visible" title="线上资金收款" @close="handleCancel">
    <div class="main">
      <el-form ref="form" :rules="rules" :model="form" label-width="150px">
        <el-form-item label="资金收款金额（元）：" prop="money">
          <el-input v-model="form.money"/>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      :visible.sync="innerVisible"
      width="30%"
      title="线上资金收款"
      append-to-body>
      <div v-loading="loading" style="margin: 20px auto;width:150px;height:150px;">
        <div
          id="canvas"
          class="publish-info-content" />
      </div>
    </el-dialog>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button v-debounce="handleConfirm" type="primary" @click="scanePay('scane')">扫码付款</el-button>
      <el-button v-debounce="handleConfirm" type="primary" @click="scanePay('code')">付款码付款</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import { Loading } from 'element-ui'
import QRCode from 'qrcodejs2'
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
      innerVisible: false,
      loading: false,
      qrcode: null,
      form: {
        money: ''
      },
      rules: {
        money: [
          { required: true, message: '请输入收款金额', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    visible(val) {
      this.form.money = ''
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
    生成二维码
     */
    createCode(path) {
      this.$nextTick(() => {
        this.loading = false
        if (this.qrcode) {
          this.qrcode.clear()
          this.qrcode.makeCode(path)
        } else {
          this.qrcode = new QRCode(document.getElementById('canvas'), {
            text: path,
            width: 150,
            height: 150,
            colorDark: '#000000',
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.M
          })
        }
      })
    },

    /**
     * 确定二次弹窗生成二维码
     */
    scanePay(type) {
      if (!this.form.money) {
        return
      }
      this.loading = true
      this.innerVisible = true
      if (type == 'scane') {
        this.scaneHandle()
      }
      //  else if (type == 'code') {

      // }
    },

    /**
     * 扫码付款
     */
    scaneHandle() {
      // const params = {

      // }
      const scane = `${WKConfig.getLocationOrigin()}/api/CrmCapitalAccountWater/unionorder`
      this.createCode(scane)
    },

    /**
     *付款码付款
     */
    payCodeHandle() {

    },

    /**
     * 确定
     */
    handleConfirm() {
      // const loading = Loading.service({
      //   target: document.querySelector(`.el-dialog[aria-label="在线充值"]`)
      // })
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log(this.form, 'xxxxx')
        }
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
    width: 152px !important;
}

/deep/ .el-form-item__content {
    margin-left: 152px !important;
}
</style>
