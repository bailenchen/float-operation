<!--
 * @Author: your name
 * @Date: 2020-08-22 10:51:58
 * @LastEditTime: 2020-09-10 11:10:31
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
      append-to-body
      @close="innerHandleCancel">

      <div style="margin: 20px auto;width:150px;height:150px;">
        <div v-loading="loading" v-if="!isSucc" style="width：100%;height:100%;">
          <div
            id="canvas"
            class="publish-info-content" />
        </div>
        <div v-if="isSucc" class="succ-wrap">
          <i class="el-icon-success" />
          <div style="margin-top:10px;">支付成功</div>
        </div>
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
import { crmAccountScanePay, crmAccountCodePay, crmAccountQueryPayStatus } from '@/api/customermanagement/account'
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
    const validMoney = (rule, value, callback) => {
      const reg = /^((0{1}\.\d{1,2})|([1-9]\d*\.{1}\d{1,2})|([1-9]+\d*))$/
      console.log()
      if (!this.form.money) {
        callback('资金收款金额不能为空')
      } else if (!reg.test(this.form.money)) {
        callback('金额数不能为0和负数或小数点后保留两位')
      } else if (this.form.money == 0.00) {
        callback('金额数不能为0和负数或小数点后保留两位')
      } else {
        callback()
      }
    }
    return {
      innerVisible: false,
      loading: false,
      qrcode: null,
      form: {
        money: ''
      },
      rules: {
        money: [
          { required: true, validator: validMoney, trigger: 'blur' }
        ]
      },
      start: 0,
      timer: null,
      isSucc: false
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
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  methods: {
    /**
     * 取消选择
     */
    handleCancel() {
      this.$emit('update:visible', false)
    },

    innerHandleCancel() {
      clearInterval(this.timer)
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
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.innerVisible = true
          if (type == 'scane') {
            this.scaneHandle()
          } else if (type == 'code') {
            // 付款码
            this.payCodeHandle()
          }
        }
      })
    },

    // 随机四位数
    rand(min, max) {
      return Math.floor(Math.random() * (max - min)) + min
    },

    /**
     * 扫码付款
     */
    scaneHandle() {
      const req = `${Date.now()}${this.rand(1000, 9999)}`
      const params = {
        traxamt: this.form.money,
        capitalId: this.selectionList[0].capitalId,
        reqsn: req
      }

      crmAccountScanePay(params).then(res => {
        this.createCode(res.data)
        this.loading = false
        clearInterval(this.timer)
        this.timer = setInterval(() => {
          this.start++
          this.queryPayStatus(req)
        }, 1500)
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * 轮询发起查询支付状态
     */
    queryPayStatus(req) {
      crmAccountQueryPayStatus({ reqsn: req }).then(res => {
        if (res.data == 1) {
          clearInterval(this.timer)
          this.isSucc = true
        }
      }).catch((err) => {
        clearInterval(this.timer)
        console.log(err)
      })
      // if (index == 6) {
      //   clearInterval(this.timer)
      //   console.log('支付结果')
      // } else {
      //   console.log('正在查询支付')
      // }
    },

    /**
     *付款码付款
     */
    payCodeHandle() {
      const req = `${Date.now()}${this.rand(1000, 9999)}`
      const params = {
        traxamt: this.form.money,
        capitalId: this.selectionList[0].capitalId,
        reqsn: req
      }

      crmAccountCodePay(params).then(res => {
        this.createCode(res.orderNumber)
        this.loading = false
        clearInterval(this.timer)
        this.timer = setInterval(() => {
          this.start++
          this.queryPayStatus(req)
        }, 1500)
      }).catch(() => {
        this.loading = false
      })
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

.el-icon-success {
    font-size: 50px;
    background-color: #fff;
    border-radius: 50%;
    color: #2362fb;
}

.succ-wrap {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-top: 15px;
}
</style>
