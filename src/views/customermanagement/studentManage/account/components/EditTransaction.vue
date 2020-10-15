
<template>
  <create-view
    :loading="loading"
    :body-style="{ height: '100%'}">
    <flexbox
      direction="column"
      align="stretch"
      class="crm-create-container">
      <flexbox class="crm-create-header">
        <div style="flex:1;font-size:17px;color:#333;font-weight: bold;">{{ title[moneyType] }}</div>
        <i
          class="el-icon-close close"
          @click="hidenView" />
      </flexbox>
      <div class="crm-create-flex">
        <el-form ref="ruleForm" :model="form[moneyType]" :rules="rules[moneyType]" class="crm-create-box">
          <el-form-item
            v-for="(item, index) in formList[moneyType]"
            :class="{ 'crm-create-block-item': item.showblock, 'crm-create-item': !item.showblock }"
            :style="{'padding-left': getPaddingLeft(item, index), 'padding-right': getPaddingRight(item, index)}"
            :key="index"
            :label="item.label"
            :prop="item.prop">
            <el-select
              v-if="item.type == 'select'"
              v-model="form[moneyType][item.prop]"
              :disabled="item.disable"
              clearable
              style="width:100%;"
              placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>

            <el-select
              v-if="item.type == 'payment'"
              v-model="form[moneyType][item.prop]"
              :disabled="item.disable"
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
              :disabled="item.disable"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              style="width:100%;"
              placeholder="选择日期时间"/>

            <el-input
              v-if="item.type == 'text'"
              :disabled="item.disable"
              v-model="form[moneyType][item.prop]"
              @input="updateInputVal($event)"/>



            <div v-if="item.type == 'file'" class="img">
              <div v-show="!show">
                {{ fileName }}
                <el-button type="text" @click="downloadFile">下载</el-button>
                <el-button type="text" @click="delFile">删除</el-button>
              </div>
              <add-image-list
                v-show="show"
                :width="50"
                :max="maxFileCount"
                :data="imgFile"
                :show-all-delete="false"
                style="padding: 0;margin: 0;"
                @delete="deletePayImage"
                @upload="uploadPayFile" />


            </div>

            <!-- <xh-user-cell
              v-if="item.type == 'user'"
              :disabled="item.disable"
              :value="form[moneyType][item.prop]"
              @value-change="fieldValueChange"/> -->

            <el-input
              v-if="item.type == 'textarea'"
              :disabled="item.disable"
              v-model="form[moneyType][item.prop]"
              type="textarea"
              @input="updateInputVal($event)"/>

          </el-form-item>
        </el-form>
      </div>


      <div class="handle-bar">
        <el-button
          class="handle-button"
          @click.native="hidenView">取消</el-button>
        <el-button
          class="handle-button"
          type="primary"
          @click.native="saveField">保存</el-button>
      </div>
    </flexbox>
  </create-view>
</template>

<script>
// API
import { crmFileSave } from '@/api/common'
import { crmEditAccountWater } from '@/api/customermanagement/account'
import { downloadAdjunct } from '@/api/customermanagement/common'

import { XhUserCell, XhInput } from '@/components/CreateCom'
import AddImageList from '@/components/quickAdd/AddImageList'
import CreateView from '@/components/CreateView'

// 方法
import { downloadExcelWithResData } from '@/utils/index'

export default {
  name: 'EditTransaction', // 编辑交易流水
  components: {
    XhInput,
    XhUserCell,
    AddImageList,
    CreateView
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
    },
    action: {
      type: Object,
      default() {
        return {}
      }
    },
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    // const validMoney = (rule, value, callback) => {
    //   if (!(this.form[this.moneyType]['examine'] && this.form[this.moneyType]['examine'].length)) {
    //     callback(new Error('请选择收款人'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      show: false,
      loading: false,
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
        online: {},
        offline: {
          price: ''
        },
        refound: {

        }
      },
      formList: {
        online: [
          { label: '支付方式：', prop: 'payment', type: 'text', disable: true },
          { label: '用户账号：', prop: 'userAccount', type: 'text', disable: false },
          { label: '资金收款金额（元）：', prop: 'price', type: 'text', disable: true },
          { label: '交易流水号：', prop: 'serialNumber', type: 'text', disable: false },
          { label: '扣款时间：', prop: 'deductionTime', type: 'date', disable: true },
          { label: '交易时间：', prop: 'transactionTime', type: 'date', disable: true },
          { label: '备注：', prop: 'remark', type: 'textarea', disable: false },
          { label: '收款人：', prop: 'character', type: 'text', disable: true },
          { label: '交易凭证：', prop: 'receipt', type: 'file', disable: false }
        ],
        offline: [
          { label: '支付方式：', prop: 'payment', type: 'text', disable: true },
          { label: '用户账号：', prop: 'userAccount', type: 'text', disable: false },
          { label: '资金收款金额（元）：', prop: 'price', type: 'text', disable: true },
          { label: '交易流水号：', prop: 'serialNumber', type: 'text', disable: false },
          { label: '扣款时间：', prop: 'deductionTime', type: 'date', disable: true },
          { label: '交易时间：', prop: 'transactionTime', type: 'date', disable: true },
          { label: '备注：', prop: 'remark', type: 'textarea', disable: false },
          { label: '收款人：', prop: 'character', type: 'text', disable: true },
          { label: '交易凭证：', prop: 'receipt', type: 'file', disable: false }
        ],
        refound: [
          { label: '支付方式：', prop: 'payment', type: 'select', disable: true },
          { label: '用户账号：', prop: 'userAccount', type: 'text', disable: false },
          { label: '资金收款金额（元）：', prop: 'price', type: 'text', disable: true },
          { label: '交易时间：', prop: 'transactionTime', type: 'date', disable: true },
          { label: '退款人：', prop: 'character', type: 'text', disable: true },
          { label: '备注：', prop: 'remark', type: 'textarea', disable: false }
        ]
      },
      rules: {
        offline: {
          payWay: [
            { required: true, message: '请选择支付方式', trigger: ['blur', 'change'] }
          ],
          money: [
            { required: true, message: '请输入充值金额', trigger: 'blur' }
          ],
          deduction: [
            { required: true, message: '请选择扣款时间', trigger: 'blur' }
          ],
          trade: [
            { required: true, message: '请选择交易时间', trigger: 'blur' }
          ]
          // examine: [
          //   { required: true, validator: validMoney, trigger: ['blur', 'change'] }
          // ]
        },
        refound: {
          payWay: [
            { required: true, message: '请选择支付方式', trigger: ['blur', 'change'] }
          ],
          money: [
            { required: true, message: '请输入资金收款金额', trigger: 'blur' }
          ]
        }
      },
      draftUser: null,
      fileName: '', // 已上传附件名
      fieldBatchId: '' // 已上传附件标识
    }
  },
  watch: {
    moneyType(val) {
      this.form[this.moneyType] = {}
      if (!val) {
        this.$emit('reset-type')
      }
    }
  },
  created() {
    console.log(this.moneyType)
    const form = this.form[this.moneyType]
    form.waterId = this.action.waterId // 流水ID
    form.userAccount = this.action.userAccount // 用户账号
    form.leadsNumber = this.action.leadsNumber // 学员编号
    form.payment = this.action.payment // 交易方式
    form.price = this.action.price // 价格
    form.remark = this.action.remark // 备注



    if (this.moneyType == 'offline') { // 线下
      form.serialNumber = this.action.serialNumber // serialNumber
      form.transactionType = this.action.transactionType
      form.deductionTime = this.action.deductionTime
      form.transactionTime = this.action.transactionTime

      form.character = this.action.characterName

      this.fileName = this.action.receipt
      this.fieldBatchId = this.action.waterBatchId
    } else if (this.moneyType == 'refound') {
      form.serialNumber = this.action.serialNumber // serialNumber
      form.transactionType = this.action.transactionType
      form.transactionTime = this.action.transactionTime
      form.character = this.action.characterName
    }
  },
  mounted() {
    document.body.appendChild(this.$el)
  },
  destroyed() {
    // remove DOM node after destroy
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },
  methods: {
    // 解决element输入框嵌套太深无法输入内容bug
    updateInputVal: function() {
      this.$forceUpdate()	// 刷新
    },
    downloadFile() {
      console.log('下载')
      downloadAdjunct({ 'batchId': this.fieldBatchId })
        .then(res => {
          console.log(res)
          downloadExcelWithResData(res)
        }, err => {
          console.log(err)
        })
    },
    delFile() {
      console.log('删除')
      this.show = true
    },

    hidenView() {
      this.$emit('hiden-view')
    },
    // 字段的值更新
    fieldValueChange(data) {
      if (data.value.length) {
        this.form[this.moneyType]['examine'] = data.value
        // this.draftUser = data.value[0]
        console.log(this.form, 'xxx')
      } else {
        // this.draftUser = null
        this.form[this.moneyType]['examine'] = []
      }
      this.$refs.ruleForm.validateField('examine')
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
            // this.imgFile.push(res.data)
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

    saveField() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.sumitData()
        }
      })
    },

    // 提交编辑数据
    sumitData() {
      // this.loading = true


      // var obj = {}
      // for (const k in this.form[this.moneyType]) {
      //   if (!this.form[this.moneyType].hasOwnProperty(k)) break
      //   obj[k] = this.form[this.moneyType][k]
      // }

      console.log(this.form[this.moneyType])

      var parms = {
        // entity: this.form[this.moneyType]

        entity: {
          waterId: this.form[this.moneyType].waterId,
          userAccount: this.form[this.moneyType].userAccount,
          serialNumber: this.form[this.moneyType].serialNumber,
          remark: this.form[this.moneyType].remark
        }
      }

      if (this.imgFile[0]) {
        parms.entity.waterBatchId = this.imgFile[0].batchId // 交易凭证附件唯一标识
        parms.entity.receipt = this.imgFile[0].name // 交易凭证附件名称
      }
      console.log(parms)
      console.log('保存')
      // return
      crmEditAccountWater(parms).then(res => {
        this.loading = false
        this.$message({
          type: 'success',
          message: '操作成功'
        })
        this.$emit('save-success')
        console.log(res, 'vvvvvv')
      }).catch(() => {
        this.loading = false
      })
    },


    // 获取左边padding
    getPaddingLeft(item, index) {
      return index % 2 == 0 ? '0' : '40px'
    },
    // 获取左边padding
    getPaddingRight(item, index) {
      return index % 2 == 0 ? '40px' : '0'
    }
  }
}
</script>
<style lang='scss' scoped>
.crm-create-container {
  position: relative;
  height: 100%;
}

.crm-create-flex {
  position: relative;
  overflow-x: hidden;
  overflow-y: auto;
  flex: 1;
}

.crm-create-header {
  height: 40px;
  margin-bottom: 20px;
  padding: 0 10px;
  flex-shrink: 0;
  .close {
    display: block;
    font-size: 24px;
    color: #909399;
    margin-right: -10px;
    padding: 10px;
    cursor: pointer;
  }
  .close:hover {
    color: $xr-color-primary;
  }
}

.crm-create-body {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
}
/** 将其改变为flex布局 */
.crm-create-box {
  display: flex;
  flex-wrap: wrap;
  padding: 0 10px 15px;
}

.crm-create-item {
  flex: 0 0 50%;
  flex-shrink: 0;
  // overflow: hidden;
  padding-bottom: 10px;
}

// 占用一整行
.crm-create-block-item {
  flex: 0 0 100%;
  flex-shrink: 0;
  padding-bottom: 10px;
}

.el-form-item /deep/ .el-form-item__label {
  line-height: normal;
  margin: 5px 0;
  font-size: 13px;
  color: #333333;
  position: relative;
  padding-left: 8px;
  padding-bottom: 0;
}

.el-form /deep/ .el-form-item {
  margin-bottom: 0px;
}

.el-form /deep/ .el-form-item.is-required .el-form-item__label:before {
  content: '*';
  color: #f56c6c;
  margin-right: 4px;
  position: absolute;
  left: 0;
  top: 5px;
}

.form-label {
  margin: 5px 0;
  font-size: 13px;
  word-wrap: break-word;
  word-break: break-all;
}

  .lone-form {
    position: relative;
  }

.handle-bar {
  position: relative;
  .handle-button {
    float: right;
    margin-top: 5px;
    margin-right: 20px;
  }
}

.el-button + .el-button {
  margin-left: 0;
}

.img {
  clear: both;
}
</style>
