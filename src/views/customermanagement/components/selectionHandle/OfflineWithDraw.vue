<!--
 * @Author: your name
 * @Date: 2020-08-22 10:51:58
 * @LastEditTime: 2020-09-03 15:47:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dz-72crm-qiwen\src\views\customermanagement\components\selectionHandle\OnlineRecharge.vue
-->
<template>
  <el-dialog :visible="visible" :title="title[MoneyType]" @close="handleCancel">
    <div class="main">
      <el-form ref="form" :rules="rules[MoneyType]" :model="form[MoneyType]" label-width="100px">
        <el-form-item
          v-for="(item,index) in formList[MoneyType]"
          :key="index"
          :label="item.label"
          :prop="item.prop">

          <el-select
            v-if="item.type == 'select'"
            v-model="form[MoneyType][item.prop]"
            clearable
            style="width:100%;"
            placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>

          <el-date-picker
            v-if="item.type == 'date'"
            v-model="form[MoneyType][item.prop]"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            style="width:100%;"
            placeholder="选择日期时间"/>

          <el-input v-if="item.type == 'text'" v-model="form[MoneyType][item.prop]"/>

          <add-image-list
            v-if="item.type == 'file'"
            :width="50"
            :max="maxFileCount"
            :data="imgFile"
            :show-all-delete="false"
            style="padding: 0;margin: 0;"
            @delete="deletePayImage"
            @upload="uploadPayFile" />

          <xh-user-cell
            v-if="item.type == 'user'"
            :value="draftUser ? [draftUser] : []"
            @value-change="fieldValueChange"/>

          <el-input v-if="item.type == 'textarea'" v-model="form[MoneyType][item.prop]" type="textarea"/>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button v-debounce="handleConfirm" type="primary">提交审核</el-button>
    </div>
  </el-dialog>
</template>

<script>
// import { Loading } from 'element-ui'
import { XhUserCell } from '@/components/CreateCom'
import AddImageList from '@/components/quickAdd/AddImageList'
import { crmFileSave } from '@/api/common'
export default {
  name: 'OfflineWithDraw',
  components: {
    XhUserCell,
    AddImageList
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
    },
    MoneyType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      maxFileCount: 1,
      imgFile: [],
      options: [
        { label: '支付宝', value: 1 },
        { label: '微信', value: 2 }
      ],
      title: {
        offline: '线下资金收款',
        refound: '资金退款'
      },
      form: {
        offline: {

        },
        refound: {

        }
      },
      formList: {
        offline: [
          { label: '支付方式：', prop: 'payWay', type: 'select' },
          { label: '用户账号：', prop: 'account', type: 'text' },
          { label: '充值金额（元）：', prop: 'money', type: 'text' },
          { label: '交易流水号：', prop: 'num', type: 'text' },
          { label: '交易凭证：', prop: 'file', type: 'file' },
          { label: '扣款时间：', prop: 'deduction', type: 'date' },
          { label: '交易时间：', prop: 'trade', type: 'date' },
          { label: '备注：', prop: 'remarks', type: 'textarea' },
          { label: '审核人：', prop: 'examine', type: 'user' }
        ],
        refound: [
          { label: '支付方式：', prop: 'payWay', type: 'select' },
          { label: '用户账号：', prop: 'account', type: 'text' },
          { label: '现金金额（元）：', prop: 'money', type: 'text' },
          { label: '交易时间：', prop: 'trade', type: 'date' },
          { label: '备注：', prop: 'remarks', type: 'textarea' },
          { label: '审核人：', prop: 'examine', type: 'user' }
        ]
      },
      rules: {
        offline: {
          payWay: [
            { required: true, message: '请选择支付方式', trigger: ['blur', 'change'] }
          ],
          account: [
            { required: true, message: '请输入用户账号', trigger: 'blur' }
          ],
          money: [
            { required: true, message: '请输入充值金额', trigger: 'blur' }
          ],
          num: [
            { required: true, message: '请输入交易流水号', trigger: 'blur' }
          ],
          file: [
            { required: true, message: '请上传交易凭证', trigger: 'blur' }
          ]
        },
        refound: {
          payWay: [
            { required: true, message: '请选择支付方式', trigger: ['blur', 'change'] }
          ],
          account: [
            { required: true, message: '请输入用户账号', trigger: 'blur' }
          ],
          money: [
            { required: true, message: '请输入现金金额', trigger: 'blur' }
          ]
        }
      },
      draftUser: null
    }
  },
  watch: {
    visible(val) {
      this.form[this.MoneyType] = {}
      if (!val) {
        this.$emit('reset-type')
      }
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
        this.draftUser = data.value[0]
      } else {
        this.draftUser = null
      }
    },

    /**
     * 附件操作
     */
    deletePayImage(item, index) {
      this.imgFile.splice(index, 1)
    },

    uploadPayFile() {
      var files = event.target.files
      console.log(files, 'xxxxx')
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
        for (let index = 0; index < files.length; index++) {
          const file = files[index]
          crmFileSave({ file: file }).then(res => {
            console.log(res, 'file')
            this.imgFile.push(res.data)
            // this.$set(this.form, 'applyCertificate', path)
          }).catch(() => {
            this.loading = false
          })
        }
        event.target.value = ''
      }
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
          console.log(this.form[this.MoneyType], 'xxxxx')
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
    height: 500px;
    overflow: auto;
    padding-left: 20px;
    padding-right: 20px;
}
/deep/ .el-dialog {
    width: 600px;
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
</style>
