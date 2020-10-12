<!--
 * @Author: your name
 * @Date: 2020-08-22 10:51:58
 * @LastEditTime: 2020-09-11 11:05:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dz-72crm-qiwen\src\views\customermanagement\components\selectionHandle\OnlineRecharge.vue
-->
<template>
  <el-dialog :visible="visible" :title="title[moneyType]" @close="handleCancel">
    <div class="main">
      <el-form ref="form" :rules="rules[moneyType]" :model="form[moneyType]" label-width="100px">
        <el-form-item
          v-for="(item,index) in formList[moneyType]"
          :key="index"
          :label="item.label"
          :prop="item.prop">

          <el-select
            v-if="item.type == 'select'"
            v-model="form[moneyType][item.prop]"
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
            v-model="form[moneyType][item.prop]"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            style="width:100%;"
            placeholder="选择日期时间"/>

          <el-input v-if="item.type == 'text'" v-model="form[moneyType][item.prop]" @input="inputUpdate()"/>

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

          <el-input v-if="item.type == 'textarea'" v-model="form[moneyType][item.prop]" type="textarea"/>
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
    moneyType: {
      type: String,
      default: ''
    }
  },
  data() {
    var validateMoney = (rule, value, callback) => {
      // if (value === '') {
      //   callback(new Error('请输入金额'))
      // } else {
      var a = /^[0-9]*(\.[0-9]{1,2})?$/
      if (!a.test(value)) {
        callback(new Error('请输入正确的金额'))
      } else {
        callback()
      }
      // }
    }
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
        offline: {},
        refound: {}
      },
      formList: {
        offline: [
          { label: '支付方式123：', prop: 'payWay', type: 'select' },
          { label: '用户账号：', prop: 'account', type: 'text' },
          { label: '充值金额（元）：', prop: 'money', type: 'text' },
          { label: '交易流水号：', prop: 'num', type: 'text' },
          { label: '交易凭证：', prop: 'file', type: 'file' },
          { label: '扣款时间：', prop: 'deduction', type: 'date' },
          { label: '交易时间：', prop: 'trade', type: 'date' },
          { label: '收款人：', prop: 'chamberlain', type: 'text' },
          { label: '备注：', prop: 'remarks', type: 'textarea' },
          { label: '审核人：', prop: 'examine', type: 'user' }
        ],
        refound: [
          { label: '支付方式：', prop: 'payWay', type: 'select' },
          { label: '用户账号：', prop: 'account', type: 'text' },
          { label: '退款金额（元）：', prop: 'money', type: 'text' },
          { label: '交易时间：', prop: 'trade', type: 'date' },
          { label: '退款人：', prop: 'chamberlain', type: 'text' },
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
            { required: true, message: '请输入金额', trigger: 'blur' },
            { validator: validateMoney, trigger: 'blur' }
          ],
          num: [
            { required: true, message: '请输入交易流水号', trigger: 'blur' }
          ],
          deduction: [
            { required: true, message: '请选择扣款时间', trigger: 'blur' }
          ],
          trade: [
            { required: true, message: '请选择交易时间', trigger: 'blur' }
          ],
          chamberlain: [
            { required: true, message: '请输入收款人', trigger: 'blur' }
          ],
          remarks: [
            { max: 5, message: '不能多于800个字符', trigger: 'blur' }
          ]
          // examine: [
          //   { required: true, message: '请选择审核人', trigger: 'blur' }
          // ]
        },
        refound: {
          payWay: [
            { required: true, message: '请选择支付方式', trigger: ['blur', 'change'] }
          ],
          account: [
            { required: true, message: '请输入用户账号', trigger: 'blur' }
          ],
          money: [
            { required: true, message: '请输入金额', trigger: 'blur' },
            { validator: validateMoney, trigger: 'blur' }
          ],
          trade: [
            { required: true, message: '请选择交易时间', trigger: 'blur' }
          ],
          chamberlain: [
            { required: true, message: '请输入收款人', trigger: 'blur' }
          ],
          remarks: [
            { max: 5, message: '不能多于800个字符', trigger: 'blur' }
          ]
          // examine: [
          //   { required: true, message: '请选择审核人', trigger: 'blur' }
          // ]
        }
      },
      draftUser: null
    }
  },
  watch: {
    visible(val) {
      this.form[this.moneyType] = {}

      var name = JSON.parse(localStorage.getItem('loginUserInfo')).realname
      console.log(name)
      this.form.offline.chamberlain = name
      this.form.refound.chamberlain = name

      if (!val) {
        this.$emit('reset-type')
      }
    }
  },
  methods: {
    // 处理element input组件嵌套过深bug
    inputUpdate() {
      this.$forceUpdate() // 强制重新渲染
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

            var data = {}
            for (const k in res) {
              if (!res.hasOwnProperty(k)) break
              if (k == 'code') continue
              data[k] = res[k]
            }
            console.log('拼接的数据', data)


            this.imgFile.push(data)
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
          // 图片类型已在AddImageList组件中校验过

          console.log('验证通过，拼接参数发送请求')
        }
      })
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
