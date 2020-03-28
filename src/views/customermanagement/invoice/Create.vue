<template>
  <xr-create
    v-loading="loading"
    :title="title"
    @close="close"
    @save="saveClick">
    <create-sections title="基本信息">
      <el-form
        ref="crmForm"
        :model="baseFrom"
        :rules="rules"
        label-position="top">
        <el-form-item
          v-for="(item, index) in baseFields"
          :key="item.key"
          :prop="item.field">
          <span slot="label">
            {{ item.name }}
            <span style="color:#999;">
              {{ item.tips || '' }}
            </span>
          </span>
          <component
            :is="item.formType | typeToComponent"
            :value="baseFrom[item.field]"
            :index="index"
            :item="item"
            :relative-type="item.formType"
            :disabled="item.disabled"
            :clearable="false"
            @value-change="fieldValueChange"/>
        </el-form-item>
      </el-form>
    </create-sections>

    <create-sections title="发票信息">
      <el-form
        ref="otherFrom"
        :model="otherFrom"
        :rules="otherRules"
        label-position="top">
        <el-form-item
          v-for="(item, index) in otherFields"
          :key="item.key"
          :prop="item.field">
          <span slot="label">
            {{ item.name }}
            <span style="color:#999;">
              {{ item.tips || '' }}
            </span>
          </span>
          <component
            :is="item.formType | typeToComponent"
            :value="otherFrom[item.field]"
            :index="index"
            :item="item"
            :relative-type="item.formType"
            :disabled="item.disabled"
            :clearable="false"
            @value-change="otherFieldValueChange"/>
        </el-form-item>
      </el-form>
    </create-sections>

    <create-sections title="邮寄信息">
      <el-form
        ref="mailFrom"
        :model="mailFrom"
        :rules="mailRules"
        label-position="top">
        <el-form-item
          v-for="(item, index) in mailFields"
          :key="item.key"
          :prop="item.field">
          <span slot="label">
            {{ item.name }}
            <span style="color:#999;">
              {{ item.tips || '' }}
            </span>
          </span>
          <component
            :is="item.formType | typeToComponent"
            :value="mailFrom[item.field]"
            :index="index"
            :item="item"
            :relative-type="item.formType"
            :disabled="item.disabled"
            :clearable="false"
            @value-change="mailFieldValueChange"/>
        </el-form-item>
      </el-form>
    </create-sections>
  </xr-create>
</template>

<script>
import { crmInvoiceSaveAPI } from '@/api/customermanagement/invoice'

import XrCreate from '@/components/xr-create'
import CreateSections from '@/components/CreateSections'

import {
  XhInput,
  XhTextarea,
  XhSelect,
  XhDate,
  CrmRelativeCell
} from '@/components/CreateCom'

export default {
  // 订单创建
  name: 'Create',
  components: {
    XrCreate,
    CreateSections,
    XhInput,
    XhTextarea,
    XhSelect,
    XhDate,
    CrmRelativeCell
  },
  filters: {
    /** 根据type 找到组件 */
    typeToComponent(formType) {
      if (formType == 'text' || formType == 'floatnumber') {
        return 'XhInput'
      } else if (formType == 'select') {
        return 'XhSelect'
      } else if (formType == 'contract' || formType == 'customer') {
        return 'CrmRelativeCell'
      } else if (formType == 'date') {
        return 'XhDate'
      } else if (formType == 'textarea') {
        return 'XhTextarea'
      }
    }
  },
  props: {
    detail: Object
  },
  data() {
    return {
      loading: false,
      baseFields: [],
      rules: {
        contractId: [
          { required: true, message: '请选择合同编号', trigger: 'change' }
        ],
        invoiceMoney: [
          { required: true, message: '请输入开票金额', trigger: ['blur', 'change'] }
        ],
        invoiceType: [
          { required: true, message: '请选择开票类型', trigger: 'change' }
        ]
      },
      baseFrom: {},
      // 发票信息
      otherFields: [],
      otherRules: {},
      otherFrom: {},

      // 邮寄信息
      mailFields: [],
      mailRules: {},
      mailFrom: {}

    }
  },
  computed: {
    title() {
      return this.detail ? '编辑发票' : '新建发票'
    }
  },
  watch: {},
  created() {
    // 是编辑
    if (this.detail) {
      const baseFrom = {}
      // baseFrom.invoiceNumber = this.detail.invoiceNumber
      if (this.detail.contractId) {
        baseFrom.contractId = [{
          num: this.detail.contractNum,
          contractId: this.detail.contractId
        }]
      } else {
        baseFrom.contractId = [this.detail.contract]
      }
      baseFrom.customerName = this.detail.customerName
      baseFrom.invoiceMoney = this.detail.invoiceMoney
      baseFrom.invoiceTime = this.detail.invoiceTime
      baseFrom.invoiceType = this.detail.invoiceType
      baseFrom.remarks = this.detail.remarks
      this.baseFrom = baseFrom

      const otherFrom = {}
      otherFrom.invoiceTitle = this.detail.invoiceTitle
      otherFrom.taxpayerNumber = this.detail.taxpayerNumber
      otherFrom.openingBank = this.detail.openingBank
      otherFrom.accountNumber = this.detail.accountNumber
      otherFrom.invoiceSite = this.detail.invoiceSite
      otherFrom.phone = this.detail.phone
      this.otherFrom = otherFrom
    }

    this.getField()
  },
  mounted() {},

  beforeDestroy() {},
  methods: {

    getField() {
      this.baseFields = [
        {
          name: '发票申请编号',
          field: 'invoiceNumber',
          formType: 'text',
          setting: []
        },
        {
          name: '客户名称',
          field: 'customerId',
          formType: 'customer',
          setting: []
        },
        {
          name: '合同编号',
          field: 'contractId',
          formType: 'contract',
          setting: []
        },
        {
          name: '合同金额',
          field: 'customerName',
          formType: 'text',
          disabled: true,
          setting: []
        },
        {
          name: '开票金额（元）',
          field: 'invoiceMoney',
          formType: 'floatnumber',
          setting: []
        },
        {
          name: '开票日期',
          field: 'invoiceDate',
          formType: 'date',
          setting: []
        },
        {
          name: '开票类型',
          field: 'invoiceType',
          formType: 'select',
          setting: [{
            name: '增值税专用发票',
            value: 1
          }, {
            name: '增值税普通发票',
            value: 2
          }, {
            name: '国税通用机打发票',
            value: 3
          }, {
            name: '地税通用机打发票',
            value: 4
          }, {
            name: '收据',
            value: 5
          }]
        },
        {
          name: '备注',
          field: 'remark',
          formType: 'textarea',
          setting: []
        }]


      this.otherFields = [
        {
          name: '抬头类型',
          field: 'titleType',
          formType: 'select',
          setting: [{
            name: '单位',
            value: 1
          }, {
            name: '个人',
            value: 2
          }]
        }, {
          name: '开票抬头',
          field: 'invoiceTitle',
          formType: 'text',
          setting: []
        },
        {
          name: '纳税人识别号',
          field: 'taxNumber',
          formType: 'text',
          setting: []
        },
        {
          name: '开户行',
          field: 'depositBank',
          formType: 'text',
          setting: []
        }, {
          name: '开户账号',
          field: 'depositAccount',
          formType: 'text',
          setting: []
        }, {
          name: '开票地址',
          field: 'depositAddress',
          formType: 'text',
          setting: []
        }, {
          name: '电话',
          field: 'telephone',
          formType: 'text',
          setting: []
        }]

      this.mailFields = [{
        name: '联系人',
        field: 'contactsName',
        formType: 'text',
        setting: []
      },
      {
        name: '联系方式',
        field: 'contactsTelephone',
        formType: 'text',
        setting: []
      },
      {
        name: '邮寄地址',
        field: 'contactsAddress',
        formType: 'text',
        setting: []
      }]
    },

    fieldValueChange(data) {
      const item = this.baseFields[data.index]
      const dataValue = data.value
      this.$set(this.baseFrom, item.field, dataValue)

      if (item.formType == 'contract') {
        const contractValue = dataValue && dataValue.length ? dataValue[0] : null
        this.$set(this.baseFrom, 'customerName', contractValue ? contractValue.customerName : '')
        this.$set(this.baseFrom, 'invoiceMoney', contractValue ? contractValue.money : '')
        this.$refs.crmForm.validateField(item.field)
      }
      console.log('data---', data)
    },

    otherFieldValueChange(data) {
      const item = this.otherFields[data.index]
      const dataValue = data.value
      this.otherFrom[item.field] = dataValue
    },

    mailFieldValueChange(data) {
      const item = this.mailFields[data.index]
      const dataValue = data.value
      this.mailFrom[item.field] = dataValue
    },

    // 审批信息值更新
    examineValueChange(data) {
      this.examineInfo = data
    },

    close() {
      this.$emit('close')
    },

    saveClick() {
      this.$refs.crmForm.validate(valid => {
        if (valid) {
          const params = {}
          for (let index = 0; index < this.baseFields.length; index++) {
            const element = this.baseFields[index]
            if (!element.disabled) {
              if (element.formType == 'contract') {
                const contractValue = this.baseFrom.contractId && this.baseFrom.contractId.length ? this.baseFrom.contractId[0] : null
                params[element.field] = contractValue ? contractValue.contractId : ''
              } else {
                params[element.field] = this.baseFrom[element.field]
              }
            }
          }

          for (let index = 0; index < this.otherFields.length; index++) {
            const element = this.otherFields[index]
            if (!element.disabled) {
              params[element.field] = this.otherFrom[element.field]
            }
          }

          if (this.detail) {
            params.invoiceId = this.detail.invoiceId
            params.batchId = this.detail.batchId
          }

          this.loading = true
          crmInvoiceSaveAPI(params)
            .then(res => {
              this.loading = false
              this.close()
              // 回到保存成功
              this.$emit('save-success')
            })
            .catch(() => {
              this.loading = false
            })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-form {
  display: flex;
  flex-wrap: wrap;
  margin: 0 -23px;
  /deep/ .el-form-item.is-required .el-form-item__label:before {
    margin-right: 0;
  }
}

.el-form-item {
  flex: 0 0 50%;
  flex-shrink: 0;
  padding: 0 40px;
  padding-bottom: 10px;
  margin-bottom: 4px;
  /deep/ .el-form-item__label {
    color: #333333;
    padding: 5px 0;
    line-height: inherit;
  }

  /deep/ .el-form-item__error {
    padding-top: 2px;
  }
}

.xh-product {
  padding: 0 15px;
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
</style>
