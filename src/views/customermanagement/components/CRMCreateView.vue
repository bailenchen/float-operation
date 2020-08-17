<template>
  <create-view
    :loading="loading"
    :body-style="{ height: '100%'}">
    <flexbox
      direction="column"
      align="stretch"
      class="crm-create-container">
      <flexbox class="crm-create-header">
        <div style="flex:1;font-size:17px;color:#333;font-weight: bold;">{{ title }}</div>
        <i
          class="el-icon-close close"
          @click="hidenView" />
      </flexbox>
      <div class="crm-create-flex">
        <create-sections title="基本信息">
          <flexbox
            direction="column"
            align="stretch">
            <div class="crm-create-body">
              <el-form
                ref="crmForm"
                :model="crmForm"
                label-position="top"
                class="crm-create-box">
                <el-form-item
                  v-for="(item, index) in crmForm.crmFields"
                  :key="item.key"
                  :prop="'crmFields.' + index + '.value'"
                  :class="{ 'crm-create-block-item': item.showblock, 'crm-create-item': !item.showblock }"
                  :rules="crmRules[item.key]"
                  :style="{'padding-left': getPaddingLeft(item, index), 'padding-right': getPaddingRight(item, index)}">
                  <div
                    slot="label"
                    style="display: inline-block;">
                    <div class="form-label">
                      {{ item.data.name }}
                      <span style="color:#999;">
                        {{ item.data.inputTips ? '（'+item.data.inputTips+'）':'' }}
                      </span>
                    </div>
                  </div>
                  <!-- 员工 和部门 为多选（radio=false）  relation 相关合同商机使用-->
                  <component
                    :is="item.data.formType | typeToComponentName"
                    :value="item.value"
                    :index="index"
                    :item="item"
                    :relation="item.relation"
                    :radio="['single_user', 'single_structure'].includes(item.data.formType) || item.radio"
                    :disabled="item.disabled"
                    :receivables-id="editId"
                    :info-params="getInfoParams(item)"
                    @value-change="fieldValueChange" />
                </el-form-item>
              </el-form>
            </div>
          </flexbox>
        </create-sections>
        <create-sections
          v-if="showExamine"
          title="审核信息">
          <div
            v-if="examineInfo.examineType===1 || examineInfo.examineType===2"
            slot="header"
            class="examine-type">{{ examineInfo.examineType===1 ? '固定审批流' : '授权审批人' }}</div>
          <create-examine-info
            ref="examineInfo"
            :types="'crm_' + crmType"
            :types-id="action.id"
            @value-change="examineValueChange" />
        </create-sections>
        <create-sections v-if="showImageHandle" title="图片信息">
          <detail-img
            :detail="imageData"
            @change="detailImgChange"
            @delete="deleteImg" />
        </create-sections>
      </div>

      <div class="handle-bar">
        <el-button
          class="handle-button"
          @click.native="hidenView">取消</el-button>
        <!--<el-button
          v-if="crmType=='customer' && action.type == 'save'"
          class="handle-button"
          type="primary"
          @click.native="debouncedSaveField(true)">保存并新建联系人</el-button>-->
        <el-button
          v-if="showDraft"
          class="handle-button"
          type="primary"
          plain
          @click.native="saveDraftField()">保存草稿</el-button>
        <el-button
          class="handle-button"
          type="primary"
          @click.native="debouncedSaveField(false)">{{ sureBtnTitle }}</el-button>
      </div>
    </flexbox>
  </create-view>
</template>
<script type="text/javascript">
import crmTypeModel from '@/views/customermanagement/model/crmTypeModel'
import CreateView from '@/components/CreateView'
import CreateSections from '@/components/CreateSections'
import CreateExamineInfo from '@/components/Examine/CreateExamineInfo'
import { filedGetField, filedValidates } from '@/api/customermanagement/common'
import { crmLeadsSave } from '@/api/customermanagement/clue'
import { crmCustomerSave } from '@/api/customermanagement/customer'
import { crmContactsSave } from '@/api/customermanagement/contacts'
import {
  crmBusinessSave,
  crmBusinessProduct // 商机下产品
} from '@/api/customermanagement/business'
import { crmContractSave } from '@/api/customermanagement/contract'
import { crmProductSave } from '@/api/customermanagement/product'
import { crmReceivablesSave } from '@/api/customermanagement/money'
import { crmReceivablesPlanSave } from '@/api/customermanagement/contract'
import { crmReturnVisitSaveAPI } from '@/api/customermanagement/visit'

import {
  regexIsCRMNumber,
  regexIsCRMMoneyNumber,
  // regexIsCRMMobile,
  chinaMobileRegex,
  regexIsCRMEmail,
  objDeepCopy
} from '@/utils'

import moment from 'moment'
import { isArray } from '@/utils/types'
import { debounce } from 'throttle-debounce'
import { mapGetters } from 'vuex'

import {
  XhInput,
  XhTextarea,
  XhSelect,
  XhMultipleSelect,
  XhDate,
  XhDateTime,
  XhUserCell,
  XhStructureCell,
  XhFiles,
  CrmRelativeCell,
  XhProuctCate,
  XhProduct,
  XhBusinessStatus,
  XhCustomerAddress,
  XhChannelCategory,
  XhReceivablesPlan // 回款计划期数
} from '@/components/CreateCom'
import DetailImg from '../product/components/DetailImg'

export default {
  name: 'CrmCreateView', // 所有新建效果的view
  components: {
    CreateView,
    CreateSections,
    CreateExamineInfo, // 审核信息
    XhInput,
    XhTextarea,
    XhSelect,
    XhMultipleSelect,
    XhDate,
    XhDateTime,
    XhUserCell,
    XhStructureCell,
    XhFiles,
    CrmRelativeCell,
    XhProuctCate,
    XhProduct,
    XhBusinessStatus,
    XhCustomerAddress,
    XhReceivablesPlan,
    DetailImg,
    XhChannelCategory
  },
  filters: {
    /** 根据type 找到组件 */
    typeToComponentName(formType) {
      if (
        formType == 'text' ||
        formType == 'number' ||
        formType == 'floatnumber' ||
        formType == 'mobile' ||
        formType == 'email'
      ) {
        return 'XhInput'
      } else if (formType == 'textarea') {
        return 'XhTextarea'
      } else if ([
        'select',
        'business_status',
        'grades',
        'follow_up_plan',
        'sign_up',
        'communication_mode'
      ].includes(formType)) {
        return 'XhSelect'
      } else if (formType == 'checkbox') {
        return 'XhMultipleSelect'
      } else if (formType == 'date') {
        return 'XhDate'
      } else if (formType == 'datetime') {
        return 'XhDateTime'
      } else if (formType == 'user' || formType == 'single_user') {
        return 'XhUserCell'
      } else if (formType == 'structure' || formType == 'single_structure') {
        return 'XhStructureCell'
      } else if (formType == 'file') {
        return 'XhFiles'
      } else if (
        formType == 'contacts' ||
        formType == 'customer' ||
        formType == 'student' ||
        formType == 'contract' ||
        formType == 'business'
      ) {
        return 'CrmRelativeCell'
      } else if (formType == 'category') {
        // 产品类别
        return 'XhProuctCate'
      } else if (formType == 'leads_source') {
        // 渠道类别
        return 'XhChannelCategory'
      } else if (formType == 'business_type') {
        // 商机类别
        return 'XhBusinessStatus'
      } else if (formType == 'product') {
        return 'XhProduct'
      } else if (formType == 'map_address') {
        return 'XhCustomerAddress'
      } else if (formType == 'receivables_plan') {
        return 'XhReceivablesPlan'
      }
    }
  },
  props: {
    // CRM类型
    crmType: {
      type: String,
      default: ''
    },
    /**
     * save:添加、update:编辑(action_id)、read:详情、index:列表
     * relative: 相关 添加(目前用于客户等相关添加) 如果有relativeData 直接合并入上传
     */
    action: {
      type: Object,
      default: () => {
        return {
          type: 'save',
          id: '',
          editDetail: null,
          data: {} // 编辑所需信息
        }
      }
    },
    phone: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 标题展示名称
      title: '',
      loading: false,
      saveAndCreate: false, // 保存并新建
      // 自定义字段验证规则
      crmRules: {},
      // 自定义字段信息表单
      crmForm: {
        crmFields: []
      },
      // 审批信息
      examineInfo: {},
      // 图片信息
      imageData: {
        mainFile: [],
        detailFile: []
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    /** 合同 回款 下展示审批人信息 */
    showExamine() {
      if (this.crmType === 'contract' || this.crmType === 'receivables') {
        if (this.examineInfo) {
          return this.examineInfo.status !== 0
        }
        return false
      }
      return false
    },
    // 草稿按钮
    showDraft() {
      if (this.crmType === 'contract' || this.crmType === 'receivables') {
        return true
      }
      return false
    },
    sureBtnTitle() {
      if (this.showExamine) {
        return '提交审核'
      }
      return '保存'
    },
    // 编辑ID
    editId() {
      return this.action.type == 'update' ? this.action.id : ''
    },
    // 图片操作
    showImageHandle() {
      return this.crmType === 'product'
    }
  },
  watch: {
    crmType: function(value) {
      this.title = this.getTitle()
      this.crmRules = {}
      this.crmForm = {
        crmFields: []
      }
      this.examineInfo = {}
      this.getField()
    },

    'action.editDetail': function(data) {
      if (data && this.showImageHandle) {
        this.imageData = {
          mainFile: data.mainFileList || [],
          detailFile: data.detailFileList || []
        }
      }
    }
  },
  created() {
    this.debouncedSaveField = debounce(300, this.saveField)
    // 获取title展示名称
    this.title = this.getTitle()
    this.getField()
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
    // 审批信息值更新
    examineValueChange(data) {
      this.examineInfo = data
    },
    /**
     * 修改图片
     */
    detailImgChange(type, data) {
      if (type === 'mainFile') {
        this.imageData.mainFileList = data
      } else if (type === 'detailFile') {
        this.imageData.detailFileList = data
      }
    },

    deleteImg(type, data) {
      if (type === 'mainFile') {
        this.action.editDetail.mainFileList = data
      } else if (type === 'detailFile') {
        this.action.editDetail.detailFileList = data
      }
    },

    getInfoParams(field) {
      if (this.crmType === 'customer' &&
        field.data.formType === 'single_structure') {
        return {
          hiddenLargePid: true
        }
      }
      return {}
    },

    // 字段的值更新
    fieldValueChange(data) {
      var item = this.crmForm.crmFields[data.index]
      item.value = data.value
      // 商机下处理商机状态
      if (this.crmType == 'business') {
        if (item.data.formType == 'business_type') {
          // 找到阶段数据
          for (
            let statusIndex = 0;
            statusIndex < this.crmForm.crmFields.length;
            statusIndex++
          ) {
            const statusElement = this.crmForm.crmFields[statusIndex]
            if (statusElement.data.formType == 'business_status') {
              if (item.value == '' || item.value == null || item.value == undefined) {
                statusElement.value = ''
              } else {
                for (let typeIndex = 0; typeIndex < data.data.length; typeIndex++) {
                  const typeElement = data.data[typeIndex]
                  if (typeElement.typeId == data.value) {
                    statusElement.data.setting = typeElement.statusList.map(
                      function(item, index) {
                        item['value'] = item.statusId
                        return item
                      }
                    )
                    if (data.type != 'init') {
                      // 编辑初始化时 不重置
                      statusElement.value = ''
                    }
                    this.$set(this.crmForm.crmFields, statusIndex, statusElement)
                    break
                  }
                }
              }
            }
          }
        } else if (item.data.formType == 'product') {
          for (
            let index = 0;
            index < this.crmForm.crmFields.length;
            index++
          ) {
            const element = this.crmForm.crmFields[index]
            if (element.key === 'money') {
              element['value'] = item.value.totalPrice || ''
            }
          }
        }
      } else if (this.crmType == 'contract') { // 合同更改
        if (item.data.formType == 'customer') {
          let contractForCount = 0
          for (let index = 0; index < this.crmForm.crmFields.length; index++) {
            const element = this.crmForm.crmFields[index]
            // 需要处理 需关联客户信息或客户下信息
            const handleFields = [
              'business_id',
              'contacts_id',
              'company_user_id'
            ]

            // 添加请求关联
            const addRelation = ['business_id', 'contacts_id']

            // 需要disabled
            const addDisabled = ['business_id', 'contacts_id']

            // 复制
            const getValueObj = {
              contacts_id: data => {
                if (!data.contactsId) {
                  return []
                }
                return [
                  {
                    name: data.contactsName || '',
                    contactsId: data.contactsId
                  }
                ]
              },
              company_user_id: data => {
                if (!data.ownerUserId) {
                  return []
                }
                return [
                  {
                    realname: data.ownerUserName || '',
                    userId: data.ownerUserId
                  }
                ]
              }
            }

            if (handleFields.includes(element.key)) {
              if (item.value.length > 0) {
                element.disabled = false

                // 增加关联信息
                const customerItem = item.value[0]
                if (addRelation.includes(element.key)) {
                  customerItem['moduleType'] = 'customer'
                  element['relation'] = customerItem
                }

                // 填充值
                if (getValueObj[element.key]) {
                  element.value = getValueObj[element.key](customerItem)
                }
              } else {
                // 禁用
                element.disabled = !!addDisabled.includes(element.key)

                if (addRelation.includes(element.key)) {
                  element['relation'] = {}
                }

                element.value = []
              }

              contractForCount++
              if (contractForCount == handleFields.length) {
                break
              }
            }
          }
        } else if (item.data.formType == 'business') {
          if (item.value.length > 0) {
            crmBusinessProduct({
              businessId: item.value[0].businessId,
              pageType: 0
            })
              .then(res => {
                for (
                  let index = 0;
                  index < this.crmForm.crmFields.length;
                  index++
                ) {
                  const element = this.crmForm.crmFields[index]
                  if (element.key === 'product') {
                    element['value'] = {
                      product: res.data.list,
                      totalPrice: res.data.money,
                      discountRate: res.data.discountRate
                    }
                  } else if (element.key === 'money') {
                    element['value'] = res.data.money
                  }
                }
              })
              .catch(() => {})
          }
        } else if (item.data.formType == 'product') {
          for (
            let index = 0;
            index < this.crmForm.crmFields.length;
            index++
          ) {
            const element = this.crmForm.crmFields[index]
            if (element.key === 'money') {
              element['value'] = item.value.totalPrice || ''
            }
          }
        }
      } else if (this.crmType == 'receivables') {
        // 新建回款 选择客户 要将id交于 合同
        if (item.data.formType == 'customer') {
          let planItem = null // 合同更改 重置回款计划
          for (let index = 0; index < this.crmForm.crmFields.length; index++) {
            const element = this.crmForm.crmFields[index]
            if (element.key === 'contract_id') {
              // 如果是合同 改变合同样式和传入客户ID
              if (item.value.length > 0) {
                element.disabled = false
                const customerItem = item.value[0]
                customerItem['moduleType'] = 'customer'
                customerItem['params'] = { checkStatus: 1 }
                element['relation'] = customerItem
              } else {
                element.disabled = true
                element['relation'] = {}
                element.value = []
              }
            } else if (element.key === 'plan_id') {
              planItem = element
            }
          }
          if (planItem) {
            planItem.disabled = true
            planItem['relation'] = {}
            planItem.value = ''
          }
        } else if (item.data.formType == 'contract') {
          for (let index = 0; index < this.crmForm.crmFields.length; index++) {
            const element = this.crmForm.crmFields[index]
            if (element.key === 'plan_id') {
              // 如果是回款 改变回款样式和传入客户ID
              if (item.value.length > 0) {
                element.disabled = false
                var contractItem = item.value[0]
                contractItem['moduleType'] = 'contract'
                element['relation'] = contractItem
              } else {
                element.disabled = true
                element['relation'] = {}
                element.value = ''
              }
              break
            }
          }
        } else if (item.data.formType == 'receivables_plan') {
          // 选择回款计划 填充 回款时间  和 回款金额 回款方式 return_time money
          for (let index = 0; index < this.crmForm.crmFields.length; index++) {
            const element = this.crmForm.crmFields[index]
            if (element.key === 'return_time') {
              element.value = data.data.returnDate
            } else if (element.key === 'money') {
              element.value = data.data.money
            } else if (element.key === 'return_type') {
              element.value = data.data.returnType
            }
          }
        }
      } else if (this.crmType === 'visit') {
        if (item.data.formType === 'student') {
          let findIndex = this.crmForm.crmFields.findIndex(o => o.key === 'leads_number')
          if (findIndex !== -1) {
            this.crmForm.crmFields[findIndex].value = item.value[0].leadsNumber || ''
          }
          findIndex = this.crmForm.crmFields.findIndex(o => o.key === 'mobile')
          if (findIndex !== -1) {
            this.crmForm.crmFields[findIndex].value = item.value[0].mobile || ''
          }
          findIndex = this.crmForm.crmFields.findIndex(o => o.key === 'owner_user_id')
          if (findIndex !== -1) {
            this.crmForm.crmFields[findIndex].value = [{
              userId: item.value[0].ownerUserId,
              realname: item.value[0].ownerUserName
            }]
          }
        }
      } else if (this.crmType === 'customer') {
        if (item.data.fieldName === 'introducer_type') {
          const findRes = this.crmForm.crmFields.find(o => o.data.fieldName === 'introducer_id')
          if (findRes) {
            if (item.value) {
              const str = item.value == 1 ? '（员工）' : '（学员）'
              findRes.data.name = '介绍人' + str
              findRes.data.formType = item.value == 1 ? 'single_user' : 'student'
              findRes.disabled = false
              findRes.radio = true
              findRes.value = []
            } else {
              findRes.data.name = '介绍人'
              findRes.data.formType = 'text'
              findRes.disabled = true
              findRes.value = ''
              delete findRes.radio
            }
          }
        }
      }

      // 无事件的处理 后期可换成input实现
      if (
        item.data.formType == 'user' ||
        item.data.formType == 'single_user' ||
        item.data.formType == 'structure' ||
        item.data.formType == 'file' ||
        item.data.formType == 'category' ||
        item.data.formType == 'leads_source' ||
        item.data.formType == 'customer' ||
        item.data.formType == 'business' ||
        item.data.formType == 'contract'
      ) {
        this.$refs.crmForm.validateField('crmFields.' + data.index + '.value')
      }
    },
    // 获取自定义字段
    getField() {
      this.loading = true
      // 获取自定义字段的更新时间
      var params = {
        label: crmTypeModel[this.crmType]
      }
      // // 进行编辑操作
      if (this.action.type == 'update') {
        params.id = this.action.id
      }

      filedGetField(params)
        .then(res => {
          res.data = res.data.filter(o => {
            return o.hasOwnProperty('authLevel') ? o.authLevel != 1 : true
          })
          if (this.phone !== '') {
            res.data.forEach(item => {
              if (item.field === 'mobile') {
                item.value = this.phone
              }
            })
          }
          if (this.crmType === 'customer') {
            this.formatLeadsField(res)
          }
          if (this.crmType === 'visit') {
            this.formatVisitField(res)
          }

          console.log('res.data: ', res.data)
          this.getcrmRulesAndModel(res.data)
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 预处理LEADS字段
     * @param res
     */
    formatLeadsField(res) {
      // 普通LEADS没有教育顾问，介绍人
      const arr = ['owner_user_id', 'introducer_type', 'introducer_id']
      let findIndex = -1
      if (this.action && this.action.type !== 'update') {
        arr.forEach(key => {
          findIndex = res.data.findIndex(o => o.fieldName === key)
          if (!this.action.introduce && findIndex !== -1) {
            res.data.splice(findIndex, 1)
          }
        })
      }
      // 转介绍LEADS没有渠道来源
      findIndex = res.data.findIndex(o => o.fieldName === 'channel_id')
      if (findIndex !== -1) {
        if (this.action.introduce ||
          res.data[findIndex].value === 0) {
          res.data.splice(findIndex, 1)
        }
      }
    },

    /**
     * 预处理回访字段
     * @param res
     */
    formatVisitField(res) {
      let findIndex = -1
      findIndex = res.data.findIndex(o => o.fieldName === 'customer_id')
      if (findIndex !== -1) {
        res.data[findIndex].formType = 'student'
      }
    },

    // 根据自定义字段获取自定义字段规则
    getcrmRulesAndModel(list) {
      let showStyleIndex = -1
      for (let index = 0; index < list.length; index++) {
        const item = list[index]
        showStyleIndex += 1

        /**
         * 规则数据
         */

        this.crmRules[item.fieldName] = this.getItemRulesArrayFromItem(item)

        const canEdit = this.getItemIsCanEdit(item) // 不能编辑 disabled true
        /**
         * 表单数据
         */
        if (
          // crm相关信息特殊处理
          item.formType == 'contacts' ||
          item.formType == 'customer' ||
          item.formType == 'student' ||
          item.formType == 'contract' ||
          item.formType == 'business' ||
          item.formType == 'receivables_plan'
        ) {
          var params = {}
          params['key'] = item.fieldName
          params['data'] = item
          // 获取 value relative 信息
          this.getParamsValueAndRelativeInfo(params, item, list)
          params['disabled'] = this.getItemDisabledFromItem(item)
          params['styleIndex'] = showStyleIndex
        } else if (['category', 'leads_source'].includes(item.formType)) {
          /** 产品分类 */
          var params = {}
          params['key'] = item.fieldName
          params['data'] = item
          if (this.action.type == 'update' && item.value) {
            let val = item.value || []
            if (!isArray(val)) {
              val = [val]
            }
            params['value'] = val.map(function(item, index, array) {
              return parseInt(item)
            })
          } else {
            params['value'] = []
          }
          params['disabled'] = !canEdit // 是否可交互
          params['styleIndex'] = showStyleIndex
        } else if (item.formType == 'product') {
          // 关联产品信息比较多 用字典接收
          var params = {}
          params['value'] = item.value
          params['key'] = item.fieldName
          params['data'] = item
          params['disabled'] = false // 是否可交互
          params['showblock'] = true // 展示整行效果
          if (index % 2 == 0) {
            showStyleIndex = -1
          }

          // 相关添加 并且商机存在 获取产品
          if (this.action.type == 'relative') {
            const businessData = this.action.data.business
            if (businessData) {
              crmBusinessProduct({
                businessId: businessData.businessId,
                pageType: 0
              })
                .then(res => {
                  params['value'] = {
                    product: res.data.list,
                    totalPrice: res.data.money,
                    discountRate: res.data.discountRate
                  }

                  // 金额赋值 金额必须在产品前面
                  for (
                    let moneyIndex = 0;
                    moneyIndex < this.crmForm.crmFields.length;
                    moneyIndex++
                  ) {
                    const moneyElement = this.crmForm.crmFields[moneyIndex]
                    if (moneyElement.key === 'money') {
                      moneyElement['value'] = res.data.money
                    }
                  }
                })
                .catch(() => {})
            }
          }
        } else if (item.formType == 'map_address') {
          // 关联产品信息比较多 用字典接收
          var params = {}

          if (this.action.type == 'update') {
            if (item.value.address) {
              item.value.address = item.value.address.split(',')
            }
            params['value'] = item.value // 编辑的值 在value字段
          } else {
            params['value'] = {} // 加入默认值 可能编辑的时候需要调整
          }
          params['key'] = item.fieldName
          params['data'] = item
          params['disabled'] = false // 是否可交互
          params['showblock'] = true // 展示整行效果
          if (index % 2 == 0) {
            showStyleIndex = -1
          }
        } else {
          var params = {}
          if (
            item.formType == 'user' ||
            item.formType == 'single_user' ||
            item.formType == 'structure' ||
            item.formType == 'single_structure' ||
            item.formType == 'file' ||
            item.formType == 'category' ||
            item.formType == 'leads_source' ||
            item.formType == 'customer' ||
            item.formType == 'business' ||
            item.formType == 'contract'
          ) {
            if (this.action.type == 'update') {
              params['value'] = item.value ? objDeepCopy(item.value) : []
              if (item.formType == 'user' ||
                item.formType == 'single_user' ||
                item.formType == 'structure' ||
                item.formType == 'single_structure') {
                if (params.value && !isArray(params.value)) {
                  params.value = [params.value]
                }
              }
              console.log('params: ', params)
            } else {
              params['value'] = item.defaultValue
                ? objDeepCopy(item.defaultValue)
                : []
            }
          } else {
            if (this.action.type == 'update') {
              params['value'] = item.value || '' // 编辑的值 在value∂ç字段
            } else {
              params['value'] = item.defaultValue || ''
            }
          }

          // 新建 合同 回款计划  回款的时间默认填充当天
          if (this.action.type == 'save' || this.action.type == 'relative') {
            if (
              item.fieldName == 'order_date' ||
              item.fieldName == 'start_time' ||
              item.fieldName == 'return_time' ||
              item.fieldName == 'return_date'
            ) {
              params['value'] = moment().format('YYYY-MM-DD')
            }
          }

          params['key'] = item.fieldName
          params['data'] = item
          params['disabled'] = !canEdit // 是否可交互
          params['styleIndex'] = showStyleIndex
        }
        if (item.hasOwnProperty('authLevel') && item.authLevel == 2) {
          params.disabled = true
        } else if (this.crmType === 'customer') {
          // 如果是LEADS
          if (this.action.type === 'update') {
            params.disabled = [
              'dept_id',
              'owner_user_id',
              'channel_id'
            ].includes(item.fieldName)
          } else {
            params.disabled = [
              // 'dept_id',
              'introducer_id'
            ].includes(item.fieldName)
          }
        } else if (this.crmType === 'visit') {
          params.disabled = [
            'leads_number',
            'mobile',
            'owner_user_id'
          ].includes(item.fieldName)
          if (item.fieldName === 'author') {
            params.value = [{ ...this.userInfo }]
          }
        }
        this.crmForm.crmFields.push(params)
      }
    },
    /**
     * 获取关联项的值 和 关联信息
     */
    getParamsValueAndRelativeInfo(params, item, list) {
      if (this.action.type == 'relative') {
        const relativeData = this.action.data[item.formType]
        if (item.formType == 'receivables_plan') {
          params['value'] = ''
        } else {
          params['value'] = relativeData ? [relativeData] : []
        }
      } else {
        if (item.formType == 'receivables_plan') {
          params['value'] = item.value || ''
        } else {
          params['value'] = item.value || []
        }
      }
      if (this.action.type == 'relative' || this.action.type == 'update') {
        // 回款计划 需要合同信息
        if (item.formType === 'receivables_plan') {
          const contractItem = this.getItemRelatveInfo(item, list, 'contract')
          if (contractItem) {
            contractItem['moduleType'] = 'contract'
            params['relation'] = contractItem
          }
          // 商机合同联系人 需要客户信息
        } else if (
          item.formType == 'business' ||
          item.formType == 'contract' ||
          item.formType == 'contacts'
        ) {
          const customerItem = this.getItemRelatveInfo(item, list, 'customer')
          if (
            (item.formType == 'business' || item.formType == 'contacts') &&
            customerItem
          ) {
            customerItem['moduleType'] = 'customer'
            params['relation'] = customerItem
          } else if (item.formType == 'contract' && customerItem) {
            customerItem['moduleType'] = 'customer'
            customerItem['params'] = { checkStatus: 1 }
            params['relation'] = customerItem
          }
        }
      }
    },
    /**
     * 获取相关联item
     */
    getItemRelatveInfo(item, list, fromType) {
      let crmItem = null
      if (this.action.type == 'relative') {
        crmItem = this.action.data[fromType]
      } else {
        const crmObj = list.find(listItem => {
          return listItem.formType === fromType
        })
        if (crmObj && crmObj.value && crmObj.value.length > 0) {
          crmItem = crmObj.value[0]
        }
      }
      return crmItem
    },
    /**
     * 获取关联项是否可操作
     */
    getItemDisabledFromItem(item) {
      // 相关添加
      if (this.action.type == 'relative') {
        const relativeDisInfos = {
          business: {
            customer: { customer: true },
            contacts: { customer: true }
          },
          contacts: {
            customer: { customer: true },
            business: { customer: true }
          },
          contract: {
            contacts: { customer: true },
            customer: { customer: true },
            business: { customer: true, business: true }
          },
          receivables_plan: {
            contract: { customer: true, contract: true },
            customer: { customer: true }
          },
          receivables: {
            contacts: { customer: true },
            customer: { customer: true },
            business: { customer: true },
            contract: { customer: true, contract: true }
          }
        }

        // 添加类型
        const crmTypeDisInfos = relativeDisInfos[this.crmType]
        if (crmTypeDisInfos) {
          // 在哪个类型下添加
          const relativeTypeDisInfos = crmTypeDisInfos[this.action.crmType]
          if (relativeTypeDisInfos) {
            // 包含的字段值
            return relativeTypeDisInfos[item.formType] || false
          }
        }
        return false
      } else if (this.action.type != 'update') {
        // 新建
        if (
          this.crmType === 'contract' &&
          (item.formType === 'business' || item.formType === 'contacts')
        ) {
          return true
          // 回款下 新建 合同 和 回款计划 默认不能操作
        } else if (this.crmType === 'receivables') {
          if (item.formType === 'contract') {
            return true
          } else if (item.formType === 'receivables_plan') {
            return true
          }
        } else if (this.crmType === 'visit') {
          if (item.formType === 'contract') {
            return true
          } else if (item.formType === 'contacts') {
            return true
          }
        }
      }

      if (!this.getItemIsCanEdit(item)) {
        return true
      }
      return false
    },
    /**
     * 不验证字段必填
     */
    ingnoreRequiredField(data) {
      if (this.crmType == 'contract' && data.fieldName == 'num') {
        return data.autoGeneNumber == 1
      } else if (this.crmType == 'receivables' && data.fieldName == 'number') {
        return data.autoGeneNumber == 1
      } else if (this.crmType == 'visit' && data.fieldName == 'visit_number') {
        return data.autoGeneNumber == 1
      }

      return false
    },
    /**
     * item 当行数据源
     */
    getItemRulesArrayFromItem(item) {
      var tempList = []
      if (!this.getItemIsCanEdit(item)) {
        return tempList
      }
      // 验证必填
      if (item.isNull == 1 && !this.ingnoreRequiredField(item)) {
        if (['leads_source', 'category'].includes(item.formType)) {
          tempList.push({
            required: true,
            message: item.name + '不能为空',
            trigger: []
          })
        } else {
          tempList.push({
            required: true,
            message: item.name + '不能为空',
            trigger: ['blur', 'change']
          })
        }
      }

      // 验证唯一
      if (item.isUnique == 1) {
        var validateUnique = (rule, value, callback) => {
          if ((isArray(value) && value.length == 0) || !value) {
            callback()
          } else {
            var validatesParams = {}
            validatesParams.fieldId = item.fieldId
            if (isArray(value)) {
              let postValue = ''
              if (value.length > 0) {
                if (
                  rule.item.formType == 'user' ||
                  rule.item.formType == 'single_user' ||
                  rule.item.formType == 'structure'
                ) {
                  postValue = value
                    .map(valueItem => {
                      return (rule.item.formType == 'user' || rule.item.formType == 'single_user')
                        ? valueItem.userId
                        : valueItem.id
                    })
                    .join(',')
                } else if (['categoryId', 'channel_id'].includes(rule.item.fieldName)) {
                  if (value && value.length) {
                    postValue = value[value.length - 1]
                  } else {
                    postValue = ''
                  }
                } else if (rule.item.formType == 'checkbox') {
                  postValue = value.join(',')
                }
              }
              validatesParams.value = postValue
            } else {
              validatesParams.value = value
            }
            if (this.action.type == 'update') {
              validatesParams.batchId = this.action.batchId
            }
            filedValidates(validatesParams)
              .then(res => {
                // status 1 通过 0
                if (res.status == 1) {
                  callback()
                } else {
                  callback(new Error(res.msg ? res.msg : '验证出错'))
                }
              })
              .catch(error => {
                callback(new Error(error.msg ? error.msg : '验证出错'))
              })
          }
        }
        tempList.push({
          validator: validateUnique,
          item: item,
          trigger:
            item.formType == 'checkbox' || item.formType == 'select'
              ? ['change']
              : ['blur']
        })
      }

      // 特殊字符
      if (item.formType == 'number') {
        var validateCRMNumber = (rule, value, callback) => {
          if (!value || value == '' || regexIsCRMNumber(value)) {
            callback()
          } else {
            callback(new Error('数字的整数部分须少于15位，小数部分须少于4位'))
          }
        }
        tempList.push({
          validator: validateCRMNumber,
          item: item,
          trigger: ['blur']
        })
      } else if (item.formType == 'floatnumber') {
        var validateCRMMoneyNumber = (rule, value, callback) => {
          if (!value || value == '' || regexIsCRMMoneyNumber(value)) {
            callback()
          } else {
            callback(new Error('货币的整数部分须少于15位，小数部分须少于2位'))
          }
        }
        tempList.push({
          validator: validateCRMMoneyNumber,
          item: item,
          trigger: ['blur']
        })
      } else if (item.formType == 'mobile') {
        var validateCRMMobile = (rule, value, callback) => {
          // if (!value || value == '' || regexIsCRMMobile(value)) {
          if (!value || value == '' || chinaMobileRegex.test(value)) {
            callback()
          } else {
            callback(new Error('手机格式有误'))
          }
        }
        tempList.push({
          validator: validateCRMMobile,
          item: item,
          trigger: ['blur']
        })
      } else if (item.formType == 'email') {
        var validateCRMEmail = (rule, value, callback) => {
          if (!value || value == '' || regexIsCRMEmail(value)) {
            callback()
          } else {
            callback(new Error('邮箱格式有误'))
          }
        }
        tempList.push({
          validator: validateCRMEmail,
          item: item,
          trigger: ['blur']
        })
      }

      // 合同的开始时间和结束时间
      if (this.crmType === 'contract') {
        if (item.fieldName === 'start_time' || item.fieldName === 'end_time') {
          var validateStartEndTime = (rule, value, callback) => {
            const fieldIndex = rule.field.split('.')[1]
            const field = this.crmForm.crmFields[fieldIndex].key
            const anotherTime =
              field === 'start_time' ? 'end_time' : 'start_time'
            const anotherItem = this.crmForm.crmFields.find(item => {
              return item.key == anotherTime
            })
            if (value && anotherItem && anotherItem.value) {
              let noPass = false
              if (anotherTime === 'start_time') {
                noPass = moment(value).isBefore(anotherItem.value)
              } else if (anotherTime === 'end_time') {
                noPass = moment(value).isAfter(anotherItem.value)
              }
              if (noPass) {
                callback(
                  new Error(
                    field === 'start_time'
                      ? '开始时间必须小于结束时间'
                      : '结束时间必须大于开始时间'
                  )
                )
              }
            }
            callback()
          }
          tempList.push({
            validator: validateStartEndTime,
            trigger: ['blur', 'change']
          })
        }
      }
      return tempList
    },

    /**
     * 获取字段是否可编辑
     */
    getItemIsCanEdit(item) {
      // authLevel 1 不能查看不能编辑 2可查看  3 可编辑可查看
      return (this.action.type === 'update' && item.authLevel == 3) || this.action.type !== 'update'
    },

    // 保存草稿
    saveDraftField() {
      this.debouncedSaveField(false, true)
    },
    // 保存数据
    saveField(saveAndCreate, isDraft = false) {
      this.loading = true
      this.saveAndCreate = saveAndCreate
      this.$refs.crmForm.validate(valid => {
        if (valid) {
          if (this.showExamine) {
            /** 验证审批数据 */
            if (isDraft) {
              // 不验证数据
              var params = this.getSubmiteParams(this.crmForm.crmFields)
              if (
                this.examineInfo.examineType === 2 &&
                this.examineInfo.hasOwnProperty('value') &&
                this.examineInfo.value.length
              ) {
                params['checkUserId'] = this.examineInfo.value[0].userId
              }
              params.entity.checkStatus = 5
              this.submiteParams(params)
            } else {
              this.$refs.examineInfo.validateField((result) => {
                if (result) {
                  var params = this.getSubmiteParams(this.crmForm.crmFields)
                  if (this.examineInfo.examineType === 2) {
                    params['checkUserId'] = this.examineInfo.value[0].userId
                  }
                  this.submiteParams(params)
                } else {
                  this.loading = false
                }
              })
            }
          } else {
            var params = this.getSubmiteParams(this.crmForm.crmFields)
            if (isDraft) {
              params.entity.checkStatus = 5
            }
            this.submiteParams(params)
          }
        } else {
          this.loading = false
          // 提示第一个error
          if (this.$refs.crmForm.fields) {
            for (
              let index = 0;
              index < this.$refs.crmForm.fields.length;
              index++
            ) {
              const ruleField = this.$refs.crmForm.fields[index]
              if (ruleField.validateState == 'error') {
                this.$message.error(ruleField.validateMessage)
                break
              }
            }
          }
          return false
        }
      })
    },
    /** 上传 */
    submiteParams(params) {
      var crmRequest = this.getSubmiteRequest()
      if (this.action.type == 'update') {
        const key = this.crmType == 'receivables_plan' ? 'plan' : this.crmType
        params.entity[key + 'Id'] = this.action.id
        params.entity.batchId = this.action.batchId
      }

      // 相关添加时候的多余提交信息
      if (
        this.action.relativeData &&
        Object.keys(this.action.relativeData).length
      ) {
        params = { ...params, ...this.action.relativeData }
      }
      // 转介绍LEADS渠道来源为0
      if (this.crmType === 'customer') {
        if (!params.entity.hasOwnProperty('channel_id')) {
          params.entity.channel_id = 0
        }
        if (this.action.introduce) {
          params.entity.channel_id = 0
        }
      }
      console.log('save: ', params)
      // this.loading = false
      crmRequest(params)
        .then(res => {
          this.loading = false
          if (this.crmType == 'customer') {
            if (!this.saveAndCreate) {
              this.$message.success(
                this.action.type == 'update' ? '编辑成功' : '添加成功'
              )
              this.hidenView()
            }
          } else {
            this.hidenView()
            this.$message.success(
              this.action.type == 'update' ? '编辑成功' : '添加成功'
            )
          }

          // 刷新待办
          if (
            this.crmType == 'customer' ||
            this.crmType == 'contract' ||
            this.crmType == 'receivables'
          ) {
            this.$store.dispatch('GetMessageNum')
          }

          // 回到保存成功
          this.$emit('save-success', {
            type: this.crmType,
            data: res.data || {},
            saveAndCreate: this.saveAndCreate
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    /** 获取上传url */
    getSubmiteRequest() {
      if (this.crmType == 'leads') {
        return crmLeadsSave
      } else if (this.crmType == 'customer') {
        return crmCustomerSave
      } else if (this.crmType == 'contacts') {
        return crmContactsSave
      } else if (this.crmType == 'business') {
        return crmBusinessSave
      } else if (this.crmType == 'product') {
        return crmProductSave
      } else if (this.crmType == 'contract') {
        return crmContractSave
      } else if (this.crmType == 'receivables') {
        return crmReceivablesSave
      } else if (this.crmType == 'receivables_plan') {
        return crmReceivablesPlanSave
      } else if (this.crmType == 'visit') {
        return crmReturnVisitSaveAPI
      }
    },
    /** 拼接上传传输 */
    getSubmiteParams(array) {
      var params = { entity: {}, field: [] }
      for (let index = 0; index < array.length; index++) {
        const element = array[index]
        if (element.data.formType == 'product') {
          this.getProductParams(params, element)
        } else if (element.data.formType == 'map_address') {
          this.getCustomerAddressParams(params.entity, element)
        } else if (element.data.fieldType == 1) {
          params.entity[element.key] = this.getRealParams(element) || ''
        } else {
          element.data.value = this.getRealParams(element)
          params.field.push(element.data)
        }
      }

      if (this.showImageHandle) {
        // 图片信息
        params.entity.mainFileIds = this.imageData.mainFile ? this.imageData.mainFile.map(item => {
          return item.fileId
        }).join(',') : ''
        params.entity.detailFileIds = this.imageData.detailFile ? this.imageData.detailFile.map(item => {
          return item.fileId
        }).join(',') : ''
      }
      return params
    },
    getProductParams(params, element) {
      if (element.value) {
        params['product'] = element.value.product ? element.value.product.map(item => {
          item.salesPrice = item.salesPrice == '' ? 0 : item.salesPrice
          item.num = item.num == '' ? 0 : item.num
          item.discount = item.discount == '' ? 0 : item.discount
          return item
        }) : []
        params.entity['totalPrice'] = element.value.totalPrice
          ? element.value.totalPrice
          : 0
        params.entity['discountRate'] = element.value.discountRate
          ? element.value.discountRate
          : 0
      } else {
        params['product'] = []
        params.entity['totalPrice'] = ''
        params.entity['discountRate'] = ''
      }
    },
    // 获取客户位置参数
    getCustomerAddressParams(params, element) {
      params['address'] = element.value.address
        ? element.value.address.join(',')
        : ''
      params['detailAddress'] = element.value.detailAddress
      params['location'] = element.value.location
      params['lng'] = element.value.lng
      params['lat'] = element.value.lat
    },
    // 关联客户 联系人等数据要特殊处理
    getRealParams(element) {
      if (
        element.key == 'customer_id' ||
        element.key == 'contacts_id' ||
        element.key == 'business_id' ||
        element.key == 'leads_id' ||
        element.key == 'contract_id'
      ) {
        if (element.value && element.value.length) {
          const key = element.key.replace('_id', 'Id')
          return element.value[0][key]
        } else {
          return ''
        }
      } else if (
        element.data.formType == 'user' ||
        element.data.formType == 'structure'
      ) {
        return element.value
          .map(function(item, index, array) {
            return (element.data.formType == 'user' ||
              element.data.formType == 'single_user') ? item.userId : (item.id || item.deptId)
          })
          .join(',')
      } else if (element.data.formType === 'single_user') {
        if (element.value && element.value.length > 0) {
          return element.value[0].userId
        }
      } else if (element.data.formType === 'single_structure') {
        if (element.value && element.value.length > 0) {
          return element.value[0].id || element.value[0].deptId
        }
      } else if (element.data.formType == 'file') {
        if (element.value && element.value.length > 0) {
          return element.value[0].batchId
        }
        return ''
      } else if (['leads_source', 'category'].includes(element.data.formType)) {
        if (element.value && element.value.length > 0) {
          return element.value[element.value.length - 1]
        }
        return ''
      } else if (element.data.formType == 'checkbox') {
        if (element.value && element.value.length > 0) {
          return element.value.join(',')
        }
        return ''
      } else if (element.data.formType === 'student') {
        if (element.value && element.value.length > 0) {
          return element.value.map(o => o.customerId).join(',')
        }
        return ''
      }

      return element.value
    },
    hidenView() {
      this.$emit('hiden-view')
    },
    // 根据类型获取标题展示名称
    getTitle() {
      if (this.crmType == 'leads') {
        return this.action.type == 'update' ? '编辑线索' : '新建线索'
      } else if (this.crmType == 'customer') {
        if (this.action.introduce && this.action.type !== 'update') {
          return '新建转介绍LEADS'
        }
        return this.action.type == 'update' ? '编辑LEADS' : '新建LEADS'
      } else if (this.crmType == 'contacts') {
        return this.action.type == 'update' ? '编辑联系人' : '新建联系人'
      } else if (this.crmType == 'business') {
        return this.action.type == 'update' ? '编辑商机' : '新建商机'
      } else if (this.crmType == 'product') {
        return this.action.type == 'update' ? '编辑产品' : '新建产品'
      } else if (this.crmType == 'contract') {
        return this.action.type == 'update' ? '编辑合同' : '新建合同'
      } else if (this.crmType == 'receivables') {
        return this.action.type == 'update' ? '编辑回款' : '新建回款'
      } else if (this.crmType == 'receivables_plan') {
        return this.action.type == 'update' ? '编辑回款计划' : '新建回款计划'
      } else if (this.crmType == 'visit') {
        return this.action.type == 'update' ? '编辑回访' : '新建回访'
      }
    },
    // 获取左边padding
    getPaddingLeft(item, index) {
      if (item.showblock && item.showblock == true) {
        return '0'
      }
      return item.styleIndex % 2 == 0 ? '0' : '40px'
    },
    // 获取左边padding
    getPaddingRight(item, index) {
      if (item.showblock && item.showblock == true) {
        return '0'
      }

      return item.styleIndex % 2 == 0 ? '40px' : '0'
    }
  }
}
</script>
<style lang="scss" scoped>
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
