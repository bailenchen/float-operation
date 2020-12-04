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

          <xh-user-cell
            v-if="item.type == 'character'"
            :value="characterUser ? [characterUser] : []"
            @value-change="characterChange"/>

          <el-input v-if="item.type == 'textarea'" v-model="form[moneyType][item.prop]" type="textarea"/>
        </el-form-item>

        <create-sections
          v-if="showExamine"
          title="审核信息">
          <div
            v-if="examineInfo.examineType===1 || examineInfo.examineType===2"
            slot="header"
            class="examine-type">{{ examineInfo.examineType===1 ? '固定审批流' : '授权审批人' }}</div>
          <create-examine-info
            ref="examineInfo"
            :types-id="id"
            types="crm_capitalAccount"
            @value-change="examineValueChange" />
        </create-sections>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="handleCancel">取 消</el-button>
      <el-button v-debounce="handleConfirm" type="primary">提交审核</el-button>
    </div>
  </el-dialog>
</template>

<script>
// API
import { crmFileSave } from '@/api/common'
import { crmEditAccountWater } from '@/api/customermanagement/account'

// 组件
import CreateSections from '@/components/CreateSections'
import CreateExamineInfo from '@/components/Examine/CreateExamineInfo'
import { XhUserCell } from '@/components/CreateCom'
import AddImageList from '@/components/quickAdd/AddImageList'
import Sections from '../../components/Sections'

export default {
  name: 'OfflineWithDraw',
  components: {
    XhUserCell,
    CreateSections,
    CreateExamineInfo,
    AddImageList,
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

    var validatcharacter = (rule, value, callback) => {
      console.log('characterUser', this.characterUser)
      if (!this.characterUser) {
        callback(new Error('请选择员工'))
      } else {
        callback()
      }
    }

    return {
      examineUser: [],
      maxFileCount: 1,
      imgFile: [],
      options: [
        { label: '现金交易', value: 1 },
        { label: '刷卡交易', value: 2 },
        { label: '支票交易', value: 3 },
        { label: '微信交易', value: 4 },
        { label: '支付宝交易', value: 5 },
        { label: '转账交易', value: 6 }
      ],
      title: {
        offline: '线下资金收款',
        refound: '资金退款'
      },
      form: {
        offline: {
          // transactionType: 3
          deductionTime: ''
        },
        refound: {
          // transactionType: 2
        }
      },
      formList: {
        offline: [
          { label: '支付方式：', prop: 'payment', type: 'select' },
          { label: '用户账号：', prop: 'userAccount', type: 'text' },
          { label: '充值金额（元）：', prop: 'price', type: 'text' },
          { label: '交易流水号：', prop: 'serialNumber', type: 'text' },
          { label: '交易凭证：', prop: 'receipt', type: 'file' },
          { label: '扣款时间：', prop: 'deductionTime', type: 'date' },
          { label: '交易时间：', prop: 'transactionTime', type: 'date' },
          { label: '收款人：', prop: 'characterId', type: 'character' },
          { label: '备注：', prop: 'remark', type: 'textarea' }
          // { label: '审核人：', prop: 'checkUserId', type: 'user' }
        ],
        refound: [
          { label: '支付方式：', prop: 'payment', type: 'select' },
          { label: '用户账号：', prop: 'userAccount', type: 'text' },
          { label: '退款金额（元）：', prop: 'price', type: 'text' },
          { label: '交易时间：', prop: 'transactionTime', type: 'date' },
          { label: '退款人：', prop: 'characterId', type: 'character' },
          { label: '备注：', prop: 'remark', type: 'textarea' }
          // { label: '审核人：', prop: 'examine', type: 'user' }
        ]
      },
      rules: {
        offline: {
          payment: [
            { required: true, message: '请选择支付方式', trigger: ['blur', 'change'] }
          ],
          price: [
            { required: true, message: '请输入金额', trigger: 'blur' },
            { validator: validateMoney, trigger: 'blur' }
          ],
          deductionTime: [
            { required: true, message: '请选择扣款时间', trigger: 'blur' }
          ],
          transactionTime: [
            { required: true, message: '请选择交易时间', trigger: 'blur' }
          ],
          characterId: [
            { required: true, message: '请输入收款人', trigger: 'blur' },
            { validator: validatcharacter, trigger: 'blur' }
          ],
          remark: [
            { max: 800, message: '不能多于800个字符', trigger: 'blur' }
          ]
          // examine: [
          //   { required: true, message: '请选择审核人', trigger: 'blur' }
          // ]
        },

        refound: {
          payment: [
            { required: true, message: '请选择支付方式', trigger: ['blur', 'change'] }
          ],
          price: [
            { required: true, message: '请输入金额', trigger: 'blur' },
            { validator: validateMoney, trigger: 'blur' }
          ],
          transactionTime: [
            { required: true, message: '请选择交易时间', trigger: 'blur' }
          ],
          characterId: [
            { required: true, message: '请输入收款人', trigger: 'blur' },
            { validator: validatcharacter, trigger: 'blur' }
          ],
          remark: [
            { max: 800, message: '不能多于800个字符', trigger: 'blur' }
          ]
          // examine: [
          //   { required: true, message: '请选择审核人', trigger: 'blur' }
          // ]
        }
      },
      draftUser: null, // 审核人
      characterUser: null, // 收/退款人
      examineInfo: {}
    }
  },
  watch: {
    visible(val) {
      const form = {}
      form[this.moneyType] = {}
      // var name = JSON.parse(localStorage.getItem('loginUserInfo')).realname

      // form.offline.characterId = name
      // form.refound.characterId = name
      // var a = JSON.parse(localStorage.getItem('loginUserInfo'))
      this.characterUser = JSON.parse(localStorage.getItem('loginUserInfo'))
      // console.log('每次关闭因此', this.characterUser)


      if (this.moneyType == 'offline') {
        form[this.moneyType].transactionType = 3
      } else if (this.moneyType == 'refound') {
        form[this.moneyType].transactionType = 2
      }


      // form.offline.deductionTime = this.timeFormat()
      form.offline.deductionTime = '2020-10-15 17:21:00'
      // form.offline.transactionTime = new Date()

      // form.refound.transactionTime = this.timeFormat()
      this.form = form


      if (!val) {
        this.$emit('reset-type')
      }
    }
  },
  created() {
    this.characterUser = this.userInfo
  },
  methods: {
    // 处理element input组件嵌套过深bug
    inputUpdate() {
      this.$forceUpdate() // 强制重新渲染
    },
    timeFormat() {
      // console.log('时间格式化')
      function _timeFormat(options) {
        const time = options.time ? options.time : new Date()
        const template = options.template
          ? options.template
          : '{0}年{1}月{2}日 {3}时{4}分{5}秒'
        const arr = [
          time.getFullYear(),
          zero(time.getMonth() + 1),
          zero(time.getDate()),
          zero(time.getHours()),
          zero(time.getMinutes()),
          zero(time.getSeconds())
        ]
        return template.replace(/\{(\d)\}/g, (text, capture) => {
          return arr[capture] || '00'
        })
        function zero(num) {
          return num < 10 ? '0' + num : num
        }
      }

      return _timeFormat({
        template: '{0}-{1}-{2} {3}:{4}:{5}'
      })
    },
    /**
     * 取消选择
     */
    handleCancel() {
      this.$emit('update:visible', false)
    },

    // 审批信息值更新
    examineValueChange(data) {
      this.examineInfo = data
    },

    // 字段的值更新
    fieldValueChange(data) {
      if (data.value.length) {
        this.draftUser = data.value[0]
      } else {
        this.draftUser = null
      }
    },

    // 字段的值更新
    characterChange(data) {
      if (data.value.length) {
        this.characterUser = data.value[0]
      } else {
        this.characterUser = null
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
          // var parms = {}
          var parms = {
            entity: this.form[this.moneyType]
          }


          parms.entity.characterId = this.characterUser.userId // 收退款人ID
          parms.entity.createUserName = this.characterUser.realname // 线下收款/退款 创建人名称
          parms.entity.leadsNumber = this.selectionList[0].leadsNumber // 学员编号
          parms.entity.accountNumber = this.selectionList[0].accountNumber // 账户编号
          parms.entity.capitalId = this.selectionList[0].capitalId // 资金账号ID

          if (this.examineInfo.examineType == 2) {
            parms.checkUserId = this.examineInfo.createUserId
          }

          if (this.imgFile[0]) {
            parms.entity.waterBatchId = this.imgFile[0].batchId // 交易凭证附件唯一标识
            parms.entity.receipt = this.imgFile[0].name // 交易凭证附件名称
          }

          console.log(this.form[this.moneyType])
          console.log(parms)
          // return
          crmEditAccountWater(parms).then(res => {
            if (res.code === 0) {
              this.$message({
                message: '添加成功',
                type: 'success'
              })
            }
          }).catch(() => {})
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


// 审核信息 里的审核类型
.examine-type {
  font-size: 12px;
  color: white;
  background-color: #fd715a;
  padding: 0 8px;
  margin-left: 5px;
  height: 16px;
  line-height: 16px;
  border-radius: 8px;
  transform: scale(0.8, 0.8);
}

// .label1 {
//   text-align: center;
//   display: flex;
//   .fixed-examine-item {
//     padding: 10px 20px;
//     .detail{
//       color: #777777;
//       font-size: 12px;
//       padding: 2px 0;
//       -webkit-transform: scale(0.8, 0.8);
//       transform: scale(0.8, 0.8);
//     }
//     .step {
//       color: #333333;
//       font-size: 12px;
//     }
//   }
// }
</style>
