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
        <span v-if="action.attr=='change'" class="attr-title" >原始合同</span>
        <create-sections v-if="action.attr=='change'" title="基本信息">
          <flexbox
            direction="column"
            align="stretch">
            <div class="crm-create-body">
              <el-form
                ref="oldForm"
                :model="oldForm"
                label-position="top"
                class="crm-create-box">
                <el-form-item
                  v-for="(item, index) in oldForm.crmFields"
                  :key="item.key"
                  :prop="'crmFields.' + index + '.value'"
                  :class="{ 'crm-create-block-item': item.showblock, 'crm-create-item': !item.showblock }"
                  :style="{'padding-left': getPaddingLeft(item, index), 'padding-right': getPaddingRight(item, index)}">
                  <div
                    slot="label"
                    style="display: inline-block;">
                    <div class="form-label">
                      {{ item.data.name }}
                      <span style="color:#999;">
                        <!-- <span style="color:#f00;"> -->
                        {{ item.data.inputTips ? '（'+item.data.inputTips+'）':'' }}
                      </span>
                    </div>
                  </div>
                  <!-- 员工 和部门 为多选（radio=false）  relation 相关合同商机使用-->
                  <component
                    :is="item.data.formType | typeToComponentName"
                    :value="item.value"
                    :old-value="item.oldValue"
                    :index="index"
                    :item="item"
                    :leads-number="leadsNumber"
                    :relation="item.relation"
                    :radio="['single_user', 'single_structure'].includes(item.data.formType) || item.radio"
                    :disabled="item.disabled"
                    :is-delete="false"
                    :receivables-id="editId"
                    :info-params="getInfoParams(item)"
                    :use-delete="item.useDelete"
                    :action="oldActionCombo"
                    @value-change="fieldValueChange" />
                </el-form-item>
              </el-form>
            </div>
          </flexbox>
        </create-sections>

        <span v-if="action.attr=='change'" class="attr-title" >变更后合同</span>
        <create-sections title="基本信息">
          <flexbox
            direction="column"
            align="stretch">
            <div class="crm-create-body">
              <el-form
                ref="crmForm"
                :model="crmForm"
                :class="{ 'bottom': crmType == 'productSetMeal' || crmType == 'receivables' }"
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
                        <!-- <span style="color:#f00;"> -->
                        {{ item.data.inputTips ? '（'+item.data.inputTips+'）':'' }}
                      </span>
                    </div>
                  </div>
                  <!-- 员工 和部门 为多选（radio=false）  relation 相关合同商机使用-->
                  <component
                    :is="item.data.formType | typeToComponentName"
                    :value="item.value"
                    :old-value="item.oldValue"
                    :index="index"
                    :item="item"
                    :show-types="item.showTypes"
                    :leads-number="leadsNumber"
                    :relation="item.relation"
                    :radio="['single_user', 'single_structure'].includes(item.data.formType) || item.radio"
                    :disabled="item.disabled"
                    :receivables-id="editId"
                    :info-params="getInfoParams(item)"
                    :use-delete="item.useDelete"
                    :action="typeToAction"
                    :relative-type="item.relativeType"
                    @value-change="fieldValueChange" />

                </el-form-item>
              </el-form>

              <!-- 套餐与科目 -->
              <xh-meal-subject
                v-if="crmType == 'productSetMeal' || crmType == 'receivables'"
                ref="mealsubject"
                :action="action.type"
                :is-flow="isFlow"
                :detail-list="formsList"
                :crm-type="crmType"
              />

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
            :other-types="otherTypes"
            :money="contractMoney"
            :discount="contractDiscount"
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
import { crmAccountSave } from '@/api/customermanagement/account'
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
import { crmProductSetMealSave } from '@/api/customermanagement/meal'

import { queryUserListAPI } from '@/api/common'

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
  XhTerm,
  XhMealSubject,
  XhDate,
  XhDateTime,
  XhUserCell,
  XhStructureCell,
  XhFiles,
  CrmRelativeCell,
  XhProuctCate,
  XhProduct,
  XhDetail,
  XhDictionary,
  XhBusinessStatus,
  XhCustomerAddress,
  XhChannelCategory,
  XhReceivablesPlan // 回款计划期数
} from '@/components/CreateCom'
import DetailImg from '../product/components/DetailImg'
import Present from '@/views/customermanagement/contract/components/Present'
import RefundCombo from '@/views/customermanagement/components/RefundCombo'

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
    XhTerm,
    XhMealSubject,
    XhDate,
    XhDateTime,
    XhUserCell,
    XhStructureCell,
    XhFiles,
    CrmRelativeCell,
    XhProuctCate,
    XhProduct,
    XhDetail,
    XhBusinessStatus,
    XhCustomerAddress,
    XhReceivablesPlan,
    DetailImg,
    XhChannelCategory,
    Present,
    RefundCombo,
    XhDictionary
  },
  filters: {
    /** 根据type 找到组件 */
    typeToComponentName(formType) {
      if (formType == 'termTime') {
        return 'XhTerm'
      }
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
        'coaching_methods',
        'class_type',
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
      } else if (formType == 'present') {
        return 'Present'
      } else if (formType == 'detail') {
        return 'XhDetail'
      } else if (formType == 'provinces') { // 需要请求数据字典
        return 'XhDictionary'
      } else if (formType == 'refundCombo') {
        console.log('RefundCombo组件')
        return 'RefundCombo'
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
    },
    // 资金账户ID
    capitalId: {
      type: Number
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
      oldForm: {
        crmFields: []
      },
      // oldFields: [],
      // 审批信息
      examineInfo: {},
      // 图片信息
      imageData: {
        mainFile: [],
        detailFile: []
      },

      formsList: [{}],
      leadsNumber: false,
      userList: null, // 系统用户列表
      actionCombo: {
        searchJson: {
          coachType: '',
          gradeId: ''
        },
        customerId: '',
        attr: 'save' // save 新建，update 更新
      },
      oldActionCombo: {
        searchJson: {
          coachType: '',
          gradeId: ''
        },
        customerId: '',
        type: 'old-change'
      },
      actionPresent: {
        countCourseSum: 0, // 主合同总课次
        buyCount: 0, // 主合同总购买课次
        type: 'save' // 新建
      },
      actionRefundCombo: { contracId: '' },
      otherTypes: '', // 用于审批流区分合同、额外赠送合同、合同变更
      contractMoney: 0, // 合同金额
      contractDiscount: 100, // 合同折扣
      isFlow: false
      // surplusPrice: 0 // 合同变更中原合同剩余金额
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
    typeToAction() {
      if (this.crmType == 'contract') {
        if (this.action.present || this.action.contractType == 2) {
          return this.actionPresent
        }
        return this.actionCombo
      } else if (this.crmType == 'refundMoney') {
        return this.actionRefundCombo
      }
    },
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
      return false
    }
  },
  watch: {
    crmType: function(value) {
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
    console.log(this.action, 'action------')
    this.debouncedSaveField = debounce(300, this.saveField)
    // 获取title展示名称
    this.title = this.getTitle()
    this.getField()
    if (this.action.type == 'update') {
      if (this.crmType == 'productSetMeal') {
        this.isFlow = this.action.editDetail.courseType == '引流课'
        this.formsList = this.action.editDetail.setting
      }
    }
    if (this.crmType == 'capitalAccount') {
      this.leadsNumber = true
    }
    if (this.action.present || this.action.contractType == 2) {
      this.otherTypes = 'present'
    }
    if (this.action.attr && this.action.attr == 'change') {
      this.otherTypes = 'change'
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
      console.log('字段更新', data, this.crmType, this.action.type)
      // 合同变更获取原合同剩余金额
      if (this.crmType == 'contract' && this.action.attr) {
        if (data.value.issurplus) {
          // this.actionCombo.surplusPrice = data.value.surplusPrice
          return
        }
      }
      var item = this.crmForm.crmFields[data.index]
      item.value = data.value
      console.log('item.value', item, item.value)

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
        console.log('hettong')
        if (item.data.formType == 'customer') {
          console.log('修改学员', item)
          console.log(data, 'bhjjjj*----')

          if (!this.action.present || !this.action.contractType == 2) {
            const valueData = data.value || {}
            let customerData = []
            for (let index = 0; index < item.showTypes.length; index++) {
              const key = item.showTypes[index]
              const dataList = valueData[key] || []
              if (dataList && dataList.length) {
                customerData = dataList
                console.log(customerData, 'bjjjjj123')
              }
            }
            item.value = customerData
          }
          // const valueData = data.value || {}
          // let customerData = []
          // for (let index = 0; index < item.showTypes.length; index++) {
          //   const key = item.showTypes[index]
          //   const dataList = valueData[key] || []
          //   if (dataList && dataList.length) {
          //     customerData = dataList
          //     console.log(customerData, 'bjjjjj123')
          //   }
          // }
          // item.value = customerData

          console.log('数组长度', Object.prototype.toString.call(item.value), item.value)

          this.actionCombo.customerId = item.value.length ? item.value[0].customerId : ''

          let contractForCount = 0
          for (let index = 0; index < this.crmForm.crmFields.length; index++) {
            const element = this.crmForm.crmFields[index]
            console.log('学员的值', item.value)
            if (element.key == 'contractId') {
              if (item.value.length) {
                element.value = []
                element.disabled = false
                element.relation = {
                  type: 'presentContract',
                  searchJson: {
                  // customerId: item.value[0].customerId,
                    customerId: item.value[0].customerId,
                    checkStatus: 1,
                    contractType: 1
                  }
                }
              } else {
                element.disabled = true
                element.relation = {}
                element.value = []

                this.actionPresent.countCourseSum = 0
                this.actionPresent.buyCount = 0

                // for (let index = 0; index < this.crmForm.crmFields.length; index++) {
                //   console.log('清空辅导方式')
                //   if (element.key == 'coach_type') {
                //     element.value = ''
                //   }
                // }
                // if (element.key == 'coach_type') {
                //   element.value = ''
                // }
              }
            }
            // 需要处理 需关联客户信息或客户下信息
            const handleFields = [
              'business_id',
              'contacts_id',
              'company_user_id',

              'source', // 来源
              'headmasterUserName', // 班主任
              'dept_id', // 所属中心
              'leadsNumber' // 学员编号
            ]

            // 添加请求关联
            const addRelation = ['business_id', 'contacts_id']

            // 需要disabled
            const addDisabled = [
              'business_id',
              'contacts_id',
              'source',
              'headmasterUserName',
              'dept_id',
              'totalclassTime',
              'leadsNumber'
              // 'contractId'
              // 'contractsAttr'
            ]

            if (this.action.present || this.action.contractType == 2) {
              handleFields.push('grade_id')
              addDisabled.push('grade_id')
            }

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
              },
              source: data => {
                return data.channelIdName ? data.channelIdName : ''
              },
              headmasterUserName: data => {
                // return ''
                return data.headmasterUserName ? data.headmasterUserName : ''
              },
              dept_id: data => {
                return data.deptIdName ? data.deptIdName : ''
              },
              leadsNumber: data => {
                return data.leadsNumber ? data.leadsNumber : ''
              },
              grade_id: data => {
                return data.gradeId ? data.gradeId : ''
              }
            }

            // console.log('元素', handleFields, element)

            if (handleFields.includes(element.key)) {
              if (item.value && item.value.length > 0) {
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
                element.disabled = !!addDisabled.includes(element.key)
              } else {
                // 禁用
                element.disabled = !!addDisabled.includes(element.key)

                if (addRelation.includes(element.key)) {
                  element['relation'] = {}
                }

                element.value = ''
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
        // } else if (item.data.fieldName == 'productSetMeal') {
          // 先使用后端返回的product作为字段，以后改为productSetMeal
          // for (
          //   let index = 0;
          //   index < this.crmForm.crmFields.length;
          //   index++
          // ) {
          //   const element = this.crmForm.crmFields[index]
          //   if (element.key === 'money') {
          //     element['value'] = item.value.totalPrice || ''
          //   }
          // }

          item.value = {
            data: data.value.product,
            totalPrice: data.value.totalPrice,
            buyCount: data.value.buyCount,
            presenterCount: data.value.presenterCount,
            refundMonry: data.value.refundMonry,
            ruleDetails: data.value.ruleDetails
          }

          this.contractMoney = data.value.totalPrice


          console.log('改变套餐字段1', item.value)
          this.crmForm.crmFields.forEach(item => {
            if (item.key == 'totalclassTime') {
              item.value = data.value.totalclassTime
            }
            if (item.key == 'contractsAttr') {
              item.value = data.value.isNew
            }
          })
        } else if (item.data.fieldName == 'coach_type') {
          console.log('辅导方式的值', item.value)
          this.actionCombo.searchJson.coachType = item.value
        } else if (item.data.fieldName == 'grade_id') {
          console.log('选择年级1', item.value)
          this.actionCombo.searchJson.gradeId = item.value
        } else if (item.data.fieldName == 'contractId') {
          var countCourseSum = 0
          var buyCount = 0
          item.value.forEach(item => {
            countCourseSum += item.countCourseSum
            buyCount += item.buyCount
            console.log('总课次与购买课次', item.countCourseSum, item.buyCount)
          })

          this.actionPresent.countCourseSum = countCourseSum
          this.actionPresent.buyCount = buyCount

          console.log('zAAAAAAAA--', item.value)

          for (let index = 0; index < this.crmForm.crmFields.length; index++) {
            const element = this.crmForm.crmFields[index]

            if (element.key == 'totalclassTime') {
              element.value = ''
            }
            // 需要处理 需关联客户信息或客户下信息
            const handleFields = [
              'coach_type',
              'totalclassTime'
            ]
            const addDisabled = [
              'coach_type',
              'totalclassTime'
            ]

            // 复制
            const getValueObj = {
              coach_type: data => {
                console.log('data1111', data)
                if (data && data.coachType) {
                  return data.coachType
                }
                return ''
              }
              // totalclassTime: data => {
              //   console.log('a1111', data)
              //   return ''
              // }
            }


            if (handleFields.includes(element.key)) {
              // 填充值
              if (getValueObj[element.key]) {
                element.value = getValueObj[element.key](item.value[0])
                console.log('saa111', getValueObj[element.key](item.value[0]))
                console.log(element)
              }
              element.disabled = !!addDisabled.includes(element.key)
            }
          }
        } else if (item.data.fieldName == 'present') {
          for (let index = 0; index < this.crmForm.crmFields.length; index++) {
            const element = this.crmForm.crmFields[index]
            if (element.key == 'totalclassTime') {
              element.value = data.value.lessons
            }
          }
          this.contractDiscount = item.value.product[0] ? item.value.product[0].discount : 100
        }
        console.log('object')
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
      } else if (this.crmType === 'capitalAccount') {
        console.log('新建资金账户， 选择学员')
        if (item.data.formType === 'customer') {
          let findIndex = this.crmForm.crmFields.findIndex(o => o.key === 'leads_number')
          if (findIndex !== -1) {
            this.crmForm.crmFields[findIndex].value = item.value[0].leadsNumber || ''
          }
          findIndex = this.crmForm.crmFields.findIndex(o => o.key === 'mobile')
          if (findIndex !== -1) {
            this.crmForm.crmFields[findIndex].value = item.value[0].mobile || ''
          }
          findIndex = this.crmForm.crmFields.findIndex(o => o.key === 'dept_id')
          if (findIndex !== -1) {
            this.crmForm.crmFields[findIndex].value = [{
              id: item.value[0].deptId,
              name: item.value[0].deptIdName
            }]
          }
          findIndex = this.crmForm.crmFields.findIndex(o => o.key === 'owner_user_id')
          if (findIndex !== -1) {
            this.crmForm.crmFields[findIndex].value = [{
              userId: item.value[0].ownerUserId,
              realname: item.value[0].ownerUserName
            }]
          }
        }
      } else if (this.crmType == 'productSetMeal') {
        if (item.data.formType == 'class_type') {
          // 课程类型为引流课时显示购买课程价格字段，否则不显示
          let isHasPrice = false
          let fieldIndex = null
          let canDel = false
          for (let index = 0; index < this.crmForm.crmFields.length; index++) {
            const element = this.crmForm.crmFields[index]
            if (element.key == 'course_type' && element.value == '引流课') {
              this.isFlow = true
              isHasPrice = true
            } else if (element.key == 'price') {
              this.isFlow = false
              canDel = true
              fieldIndex = element.styleIndex
            }
          }
          if (isHasPrice) {
            this.crmForm.crmFields.push(
              {
                data: {
                  authLevel: 3,
                  defaultValue: '100.00',
                  fieldId: 1229864,
                  fieldName: 'price',
                  fieldType: 1,
                  formType: 'number',
                  inputTips: '',
                  isNull: 0,
                  isUnique: 0,
                  label: 21,
                  name: '购买价格（元）',
                  options: null,
                  setting: Array(0),
                  type: 5,
                  value: ''
                },
                disabled: false,
                key: 'price',
                styleIndex: this.crmForm.crmFields.length,
                value: '100.00'
              }
            )
          } else if (canDel) {
            this.crmForm.crmFields.splice(fieldIndex, 1)
          }
        }
      } else if (this.crmType == 'refundMoney') {
        if (item.data.formType === 'student') {
          // 教育顾问 所属中心赋值，合同编号放开
          // 需要处理 需关联客户信息或客户下信息
          const handleFields = [
            'dept_id',
            'owner_user_id'
          ]
          // 赋值
          const getValueObj = {
            dept_id: data => {
              return data.deptIdName ? data.deptIdName : ''
            },
            owner_user_id: data => {
              return data.ownerUserName ? data.ownerUserName : ''
            }
          }

          // 添加请求关联
          const addRelation = ['contract_id']
          const getRelationObj = {
            contract_id: (data, element) => {
              console.log('添加关联信息')
              element.relation = {
                moduleType: 'refundMoney',
                searchJson: { customerId: data.customerId, checkStatus: 1, contractType: 5 }
              }
            }
          }

          const customerItem = item.value[0]
          for (let index = 0; index < this.crmForm.crmFields.length; index++) {
            const element = this.crmForm.crmFields[index]
            if (handleFields.includes(element.key)) {
              // 填充值
              if (getValueObj[element.key]) {
                element.value = getValueObj[element.key](customerItem)
              }
            }

            // 取消禁用，增加属性
            if (addRelation.includes(element.key)) {
              element.disabled = false
              if (getRelationObj[element.key]) {
                getRelationObj[element.key](customerItem, element)
              }
            }
          }
        }
        console.log('字段111', item)
        if (item.data.formType === 'contract') {
          this.actionRefundCombo.contracId = item.value[0].contractId
        }
        if (item.data.formType === 'refundCombo') {
          this.crmForm.crmFields.forEach(_item => {
            if (_item.key == 'money') {
              _item.value = item.value
            }
          })
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

    // 合同变更，生成oldForm
    getOldForm(list) {
      if (this.crmType == 'contract' && this.action.attr == 'change') {
        this.actionCombo.type = 'change'
        var _list = objDeepCopy(list)
        // console.log('_list', _list)

        var contractInfo = this.action.oldInformation ? this.action.oldInformation : this.action.information
        // 计算剩余金额
        var expenditure = 0 // 已花费金额
        // this.action.information.
        contractInfo.contract.productList.forEach(item => {
          expenditure += item.price * item.finishCourse
        })
        // console.log('expenditure', expenditure)
        // this.actionCombo.surplusPrice = this.action.information.contract.money - expenditure
        this.actionCombo.surplusPrice = contractInfo.contract.money - expenditure



        // var params = { types: 6, id: contractInfo.contract.relevanceContractId[0].contractId }

        // if (this.action.type == 'update') {
        //   contractInfo = this.action.information.contract
        //   params.id = contractInfo.relevanceContractId[0].contractId
        // } else {
        //   contractInfo = this.action.detail
        //   params.id = contractInfo.contractId
        // }


        // filedGetInformation(params).then(res => {
        // debugger
        // this.loading = false
        let showStyleIndex = -1
        for (let index = 0; index < _list.length; index++) {
          // debugger
          const item = _list[index]
          if (item.fieldName == 'is_early_retirement') {
            continue
          }
          showStyleIndex += 1
          var params = {}
          params['value'] = item.value
          params['key'] = item.fieldName
          params['data'] = item
          params['disabled'] = true // 是否可交互
          // params['showblock'] = true // 展示整行效果
          params['styleIndex'] = showStyleIndex
          if (item.fieldName == 'contractsAttr') {
            // params['value'] = this.action.detail.isNew
            params['value'] = contractInfo.contract.isNew
          }
          if (item.fieldName == 'totalclassTime') {
            // params['value'] = this.action.detail.countCourseSum
            params['value'] = contractInfo.contract.countCourseSum
          }
          if (item.fieldName == 'leadsNumber') {
            // params['value'] = res.data.customer.leadsNumber
            params['value'] = contractInfo.customer.leadsNumber
          }
          if (item.fieldName == 'dept_id') {
            // params['value'] = res.data.customer.deptIdName
            params['value'] = contractInfo.customer.deptIdName
          }
          if (item.fieldName == 'headmasterUserName') {
            // params['value'] = res.data.customer.headmasterUserName
            params['value'] = contractInfo.customer.headmasterUserName
          }
          if (item.fieldName == 'source') {
            // params['value'] = res.data.customer.channelIdName
            params['value'] = contractInfo.customer.channelIdName
          }
          if (item.fieldName == 'customer_id') {
            params['value'] = [{
              // customerId: res.data.customer.customerId,
              // customerName: res.data.customer.customerName
              customerId: contractInfo.customer.customerId,
              customerName: contractInfo.customer.customerName

              // customerType: res.data.customer.customerType
            }]
          }

          if (item.fieldName == 'coach_type') {
            params['value'] = contractInfo.contract.coachType
          }
          if (item.fieldName == 'channel') {
            params['value'] = contractInfo.contract.channel
          }
          if (item.fieldName == 'grade_id') {
            params['value'] = contractInfo.contract.gradeId
          }
          if (item.fieldName == 'order_date') {
            params['value'] = contractInfo.contract.orderDate
          }
          if (item.fieldName == 'file_batch_id') {
            contractInfo.recordList.forEach(item => {
              if (item.fieldName == 'file_batch_id') {
                params['value'] = item.value
              }
            })
          }

          if (item.fieldName == 'signing_user_id') {
            params['value'] = [{
              userId: contractInfo.customer.createUserId,
              // realname: this.action.detail.createUserName
              realname: contractInfo.createUserName
            }]
          }

          if (item.fieldName == 'remark') {
            params['value'] = contractInfo.contract.remark
          }

          if (item.fieldName == 'product') {
            item['oldValue'] = {
              products: {
                mealProducts: contractInfo.contract.mealProducts,
                productList: contractInfo.contract.productList,
                giftProducts: contractInfo.contract.giftProducts
              },
              totalPrice: contractInfo.contract.money
            }
            params['oldValue'] = {
              products: {
                mealProducts: contractInfo.contract.mealProducts,
                productList: contractInfo.contract.productList,
                giftProducts: contractInfo.contract.giftProducts
              },
              totalPrice: contractInfo.contract.money
            }
          }
          this.oldForm.crmFields.push(params)
        }
        // }).catch(() => {})
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
      if (this.action.type == 'update' && this.action.contractType == 3) {
        params.id = this.action.id
      } else if (this.action.type == 'update') {
        params.id = this.action.id
      }

      // console.log('参数111', params)

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

          // console.log('类型与数据', this.crmType)
          // console.log('res.data: ', res.data)

          // 合同添加字段
          if (this.crmType == 'contract') {
            res.data.unshift({
              name: '来源',
              value: '',
              fieldName: 'source',
              formType: 'text'
            })
            res.data.unshift({
              name: '班主任',
              value: '',
              fieldName: 'headmasterUserName',
              formType: 'text'
            })
            res.data.unshift({
              name: '所属中心',
              value: '',
              fieldName: 'dept_id',
              formType: 'text'
            })
            res.data.unshift({
              name: '学员编号',
              value: '',
              fieldName: 'leadsNumber',
              formType: 'text'
            })
            res.data.unshift({
              name: '总课次',
              value: '',
              fieldName: 'totalclassTime',
              formType: 'text'
            })
            var obj = {
              name: '合同属性',
              value: 1,
              fieldName: 'contractsAttr',
              isNull: 1,
              setting: [
                {
                  name: '续签',
                  value: 0
                },
                {
                  name: '新签',
                  value: 1
                },
                {
                  name: '引流',
                  value: 2
                }],
              formType: 'select'
            }
            if (this.action.present || this.action.contractType == 2) {
              obj.setting = [
                {
                  name: '续签',
                  value: 0
                },
                {
                  name: '新签',
                  value: 1
                }
              ]
            }
            res.data.unshift(obj)

            if (this.action.attr) {
              res.data.unshift({
                name: '是否为内退',
                value: 0,
                fieldName: 'is_early_retirement',
                formType: 'select',
                show: false,
                setting: [
                  {
                    name: '否',
                    value: 0
                  },
                  {
                    name: '是',
                    value: 1
                  }
                ]
              })
            }


            if (this.action.present || this.action.contractType == 2) {
              res.data.unshift({
                name: '关联合同',
                value: '',
                fieldName: 'contractId',
                formType: 'contract',
                isNull: 1,
                authLevel: 3,
                radio: false
              })
              res.data.push({
                name: '赠送课程',
                value: '',
                fieldName: 'present',
                formType: 'present'
              })
              res.data = res.data.filter(item => {
                return item.fieldName != 'product'
              })
            }
          }

          if (this.crmType == 'refundMoney') {
            res.data.unshift({
              name: '所属中心',
              value: '',
              fieldName: 'dept_id',
              formType: 'text'
            })
            res.data.unshift({
              name: '教育顾问',
              value: '',
              fieldName: 'owner_user_id',
              formType: 'text'
            })
          }

          var list = res.data

          // 调整字段顺序
          for (let i = 0; i < list.length; i++) {
            const element = list[i]
            if (element.fieldName == 'customer_id') {
              list.splice(i, 1)
              list.unshift(element)
            }
          }

          this.getOldForm(list)

          // console.log('字段列表', list)
          // debugger

          // const list = res.data
          if (this.crmType == 'customer') {
            for (let index = 0; index < list.length; index++) {
              const element = list[index]
              if (element.fieldName == 'introducer_id') {
                list.splice(index, 1)
              }
            }
          }

          this.getcrmRulesAndModel(list)

          // if (this.crmType == 'customer' && this.action.userInfo) {
          if (this.action.userInfo) {
            console.log('当前登录用户', this.action.userInfo)
            queryUserListAPI().then(res => {
              console.log(res)
              this.userList = res.data
              this.crmForm.crmFields.forEach(item => {
              // console.log('---', item)

                var isFill = [
                  'leads_registrant_id',
                  'signing_user_id'
                ].includes(item.key)
                if (isFill) {
                  item.value = [this.action.userInfo]
                }

                // if (item.key == 'leads_registrant_id') {
                //   item.value = [this.action.userInfo]
                // }
              })
              // console.log('aaaaaaaaaaaaaaaa', this.userList)
              // console.log('BBBBBBBBBBBB', this.crmForm)
            }).catch(() => {})
          }

          if (!this.action.attr) {
            this.loading = false
          }

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
      console.log('leads字段', res)
      // 普通LEADS没有教育顾问，介绍人
      const arr = ['owner_user_id', 'introducer_type', 'introducer_name', 'introducer_id']
      let findIndex = -1
      if (this.action && this.action.type !== 'update') {
        arr.forEach(key => {
          findIndex = res.data.findIndex(o => o.fieldName === key)
          if (!this.action.introduce && findIndex !== -1) {
            res.data.splice(findIndex, 1)
          }
        })
      }
      findIndex = res.data.findIndex(o => o.fieldName === 'introducer_name')
      if (!this.action.introduce && findIndex !== -1) {
        res.data.splice(findIndex, 1)
      }
      // 普通LEADS删除leads登记人
      findIndex = res.data.findIndex(o => o.fieldName === 'leads_registrant_id')
      if (!this.action.introduce && findIndex !== -1) {
        res.data.splice(findIndex, 1)
      }

      // res.data.forEach(item => {
      //   console.log('---', item)
      //   if (item.fieldName == 'leads_registrant_id') {
      //     console.log('1597--', item)
      //     item.value = [this.action.userInfo]
      //   }
      // })

      console.log('预处理leads', this.action.userInfo, res.data)

      // 转介绍LEADS没有渠道来源
      findIndex = res.data.findIndex(o => o.fieldName === 'channel_id')
      if (findIndex !== -1) {
        if (this.action.introduce ||
          res.data[findIndex].value === 0) {
          res.data.splice(findIndex, 1)
        }
      }

      // this.crmForm.crmFields.forEach(item => {
      //     if (item.key == 'leads_registrant_id') {
      //       item.value = [this.action.userInfo]
      //     }
      //   })
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
      if (this.crmType == 'productSetMeal') {
        list.push({
          authLevel: 3,
          defaultValue: [],
          fieldName: 'termTime',
          fieldType: 1,
          formType: 'termTime',
          inputTips: '',
          isNull: 0,
          isUnique: 0,
          label: 21,
          name: '购买周期',
          options: '',
          setting: Array(0),
          type: 1,
          value: []
        })
      }

      if (this.crmType == 'refundMoney') {
        list.push({
          authLevel: 3,
          defaultValue: '',
          fieldName: 'refundCombo',
          fieldType: 1,
          formType: 'refundCombo',
          inputTips: null,
          isNull: 0,
          isUnique: 0,
          label: 29,
          name: '已购课程',
          options: null,
          setting: [],
          type: 15,
          value: ''
        })
      }

      // 课程类型为引流课时显示购买课程价格字段，否则不显示 标识字段
      let hasPrice = false

      let showStyleIndex = -1
      for (let index = 0; index < list.length; index++) {
        const item = list[index]
        showStyleIndex += 1
        if (this.crmType == 'productSetMeal') {
          if (item.fieldName == 'status') {
            item.setting = [
              { value: 1, name: '上架' },
              { value: 0, name: '下架' }
            ]
          } else if (item.fieldName == 'course_type' && item.value == '引流课') {
            hasPrice = true
          }
          if (this.action.type == 'update' && item.fieldName == 'termTime') {
            if (this.action.editDetail.startPurchaseCycle && this.action.editDetail.endPurchaseCycle) {
              item.value = [this.action.editDetail.startPurchaseCycle, this.action.editDetail.endPurchaseCycle]
            } else {
              item.value = []
            }
          }
        }

        /**
         * 规则数据
         */
        this.crmRules[item.fieldName] = this.getItemRulesArrayFromItem(item)
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

          // if (this.crmType == 'contract' && item.fieldName == 'customer_id') {
          if (this.crmType == 'contract') {
            if (item.fieldName == 'customer_id') {
              if (!this.action.present || !this.action.contractType == 2) {
                params.crmType = 'contract'
                params.showTypes = ['customer', 'student']
              } else {
                console.log('增加额外赠送合同')
                params.crmType = 'presentContract'
              }
            }
            // 额外赠送合同，关联合同字段多选
            // if (this.action.present && item.fieldName == 'contractId') {
            if ((this.action.present || this.action.contractType == 2) && item.fieldName == 'contractId') {
              params.radio = false
            }
          }


          // 获取 value relative 信息
          this.getParamsValueAndRelativeInfo(params, item, list)
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
          params['styleIndex'] = showStyleIndex
        } else if (item.formType == 'present') {
          var params = {}
          params['value'] = item.value
          params['key'] = item.fieldName
          params['data'] = item
          params['disabled'] = false // 是否可交互
          params['showblock'] = true // 展示整行效果
          if (index % 2 == 0) {
            showStyleIndex = -1
          }
        } else if (item.formType == 'product') {
          // 关联产品信息比较多 用字典接收
          var params = {}
          console.log('产品字段', item)
          params['value'] = item.value
          params['key'] = item.fieldName
          params['data'] = item
          params['disabled'] = false // 是否可交互
          params['showblock'] = true // 展示整行效果
          if (index % 2 == 0) {
            showStyleIndex = -1
          }

          // 合同中清空后端设置的产品默认值
          if (this.crmType == 'contract' && this.action.type == 'save') {
            params['value'] = {}
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
        } else if (item.formType == 'termTime') {
          var params = {}
          params['value'] = item.value
          params['key'] = item.fieldName
          params['data'] = item
          params['disabled'] = false // 是否可交互
          params['showblock'] = false // 展示整行效果
          // if (index % 2 == 0) {
          //   showStyleIndex = -1
          // }
          params['styleIndex'] = showStyleIndex

          // 相关添加 并且商机存在 获取产品
          // if (this.action.type == 'relative') {
          //   const businessData = this.action.data.business
          //   if (businessData) {
          //     crmBusinessProduct({
          //       businessId: businessData.businessId,
          //       pageType: 0
          //     })
          //       .then(res => {
          //         params['value'] = {
          //           product: res.data.list,
          //           totalPrice: res.data.money,
          //           discountRate: res.data.discountRate
          //         }

          //         // 金额赋值 金额必须在产品前面
          //         for (
          //           let moneyIndex = 0;
          //           moneyIndex < this.crmForm.crmFields.length;
          //           moneyIndex++
          //         ) {
          //           const moneyElement = this.crmForm.crmFields[moneyIndex]
          //           if (moneyElement.key === 'money') {
          //             moneyElement['value'] = res.data.money
          //           }
          //         }
          //       })
          //       .catch(() => {})
          //   }
          // }
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
          params['styleIndex'] = showStyleIndex
        }
        // 新建合同合同属性默认为新签
        if (this.action.type == 'save' || this.action.type == 'contract') {
          if (item.fieldName == 'contractsAttr') {
            params['value'] = 1
          }
        }

        params.disabled = !this.getItemIsCanEdit(item) // 不能编辑 disabled true
        if (item.hasOwnProperty('authLevel') && item.authLevel == 2) {
          if (this.action.type === 'update') {
            params.disabled = true
          }
        } else if (this.crmType === 'customer') {
          // 如果是LEADS
          if (this.action.type === 'update') {
            params.disabled = [
              'owner_user_id'
            ].includes(item.fieldName)
          } else {
            params.disabled = [
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
        } else if (this.crmType == 'contract') {
          var arr = [
            'source',
            'headmasterUserName',
            'dept_id',
            'totalclassTime',
            'leadsNumber',
            'contractId'
          ]
          // 普通合同禁用contractsAttr
          // console.log(!this.action.present, this.action.contractType != 2)
          // if (!this.action.present) {
          if (this.action.contractType != 2) {
            arr.push('contractsAttr')
          }

          // 额外合同
          if (this.action.contractType == 2) {
            arr.push('coach_type')
            arr.push('grade_id')
          }

          params.disabled = arr.includes(item.fieldName)
        } else if (this.crmType == 'refundMoney') {
          if (item.fieldName == 'refund_time') {
            params['value'] = moment().format('YYYY-MM-DD')
          }
          if (item.fieldName == 'refund_type') {
            params['setting'] = [
              { name: '常规充值返还', value: 1 },
              { name: '特殊充值返还', value: 2 }
            ]
          }




          var arr = [
            'owner_user_id',
            'dept_id',
            'money',
            'contract_id'
          ]
          params.disabled = arr.includes(item.fieldName)

          if (item.fieldName == 'refundCombo') {
            params['showblock'] = true // 展示整行效果
            if (index % 2 == 0) {
              showStyleIndex = -1
            }
          }
        }
        this.crmForm.crmFields.push(params)
      }
      for (let index = 0; index < this.crmForm.crmFields.length; index++) {
        const element = this.crmForm.crmFields[index]
        if (element.key == 'status') {
          if (this.action.type != 'update') {
            element.value = 1
            element.data.value = 1
          } else {
            element.value = this.action.editDetail.status
            element.data.value = this.action.editDetail.status
          }
        }
        if (this.crmType == 'capitalAccount') {
          console.log('是资金账号，设置字段是否可编辑')
          if (element.key == 'leads_number' || element.key == 'mobile' || element.key == 'dept_id' || element.key == 'owner_user_id' || (element.key == 'customer_id' && this.action.type == 'update')) {
            element.disabled = true
          }
          if (element.key == 'dept_id' || element.key == 'owner_user_id') {
            element.useDelete = false
            console.log('设置不能删除')
          }
        }
        if (this.action.type == 'update' && this.crmType == 'customer' && element.key == 'channel_id') {
          element.disabled = true
        }

        // 合同编辑
        if (this.action.type == 'update' && this.crmType == 'contract') {
          this.actionCombo.attr = 'update'
          if (element.key == 'contractsAttr') {
            element.value = this.action.information.contract.isNew
          }
          if (element.key == 'totalclassTime') {
            element.value = this.action.information.contract.countCourseSum
          }
          if (element.key == 'leadsNumber') {
            element.value = this.action.information.customer.leadsNumber
          }
          if (element.key == 'dept_id') {
            element.value = this.action.information.customer.deptIdName
          }
          if (element.key == 'headmasterUserName') {
            element.value = this.action.information.customer.headmasterUserIdName
          }
          if (element.key == 'source') {
            element.value = this.action.information.customer.channelIdName
          }
          if (element.key == 'coach_type') {
            this.actionCombo.searchJson.coachType = this.action.information.contract.coachType
          }
          if (element.key == 'grade_id') {
            this.actionCombo.searchJson.gradeId = this.action.information.contract.gradeId
          }
          if (element.key == 'file_batch_id') {
            this.action.information.recordList.forEach(item => {
              if (item.fieldName == 'file_batch_id') {
                element.value = item.value
              }
            })
          }

          if (element.key == 'customer_id') {
            element.value = [{
              customerId: this.action.information.customer.customerId,
              customerName: this.action.information.customer.customerName,
              customerType: this.action.information.customer.customerType
            }]
            this.actionCombo.customerId = this.action.information.customer.customerId
          }
          if (element.key == 'product') {
            // element.value = {
            //   isEdit: true,
            //   meal: this.action.information.contract.mealProducts,
            //   products: {
            //     mealProducts: this.action.information.contract.mealProducts,
            //     productList: this.action.information.contract.productList,
            //     giftProducts: this.action.information.contract.giftProducts
            //   },
            //   totalPrice: this.action.information.contract.money
            // }
            element.oldValue = {
              isEdit: true,
              meal: this.action.information.contract.mealProducts,
              products: {
                mealProducts: this.action.information.contract.mealProducts,
                productList: this.action.information.contract.productList,
                giftProducts: this.action.information.contract.giftProducts
              },
              totalPrice: this.action.information.contract.money
            }
          }
        }
        // 额外合同编辑
        if (this.crmType == 'contract' && this.action.type == 'update' && this.action.contractType == 2) {
          console.log('额外合同编辑')
          if (element.key == 'contractId') {
            element.value = this.action.information.contract.relevanceContractId

            var countCourseSum = 0
            var buyCount = 0
            element.value.forEach(item => {
              countCourseSum += item.countCourseSum
              buyCount += item.buyCount
            })

            this.actionPresent = {
              countCourseSum, // 主合同总课次
              buyCount, // 主合同总购买课次
              type: 'update' // 新建
            }
          }
          if (element.key == 'present') {
            element.oldValue = this.action.information.contract.productList
            // console.log('赠送组件的值', element)
            this.contractDiscount = element.oldValue[0].discountRate
          }
        }

        // 合同变更-编辑
        if (this.action.attr && this.action.attr == 'change' && this.action.type == 'update') {
          if (element.key == 'customer_id') {
            element.value = [
              {
                customerId: this.action.information.customer.customerId,
                customerName: this.action.information.customer.customerName
                // customerType: this.action.detail.customerType
              }
            ]
            element.disabled = true
            this.actionCombo.customerId = this.action.information.customer.customerId
          }
          if (element.key == 'is_early_retirement') {
            element.value = this.action.information.contract.isEarlyRetirement
          }
          if (element.key == 'totalclassTime') {
            element.value = this.action.information.contract.countCourseSum
          }

          if (element.key == 'leadsNumber') {
            element.value = this.action.information.customer.leadsNumber
          }
          if (element.key == 'dept_id') {
            element.value = this.action.information.customer.deptIdName
          }
          if (element.key == 'headmasterUserName') {
            element.value = this.action.information.customer.headmasterUserIdName
          }
          if (element.key == 'source') {
            element.value = this.action.information.customer.channelIdName
          }

          if (element.key == 'product') {
            element.oldValue = {
              isEdit: true,
              meal: this.action.information.contract.mealProducts,
              products: {
                mealProducts: this.action.information.contract.mealProducts,
                productList: this.action.information.contract.productList,
                giftProducts: this.action.information.contract.giftProducts
              },
              totalPrice: this.action.information.contract.money
            }
          }
        }

        // 合同变更
        if (this.action.attr && this.action.attr == 'change' && this.action.type == 'save') {
          if (element.key == 'customer_id') {
            element.value = [
              {
                customerId: this.action.detail.customerId,
                customerName: this.action.detail.customerName
                // customerType: this.action.detail.customerType
              }
            ]
            element.disabled = true
            this.actionCombo.customerId = this.action.detail.customerId
          }
          if (element.key == 'leadsNumber') {
            element.value = this.action.detail.leadsNumber
          }
          if (element.key == 'dept_id') {
            element.value = this.action.detail.deptIdName
          }
          if (element.key == 'headmasterUserName') {
            element.value = this.action.detail.headmasterUserIdName
          }
          if (element.key == 'source') {
            element.value = this.action.detail.channelIdName
          }

          if (element.key == 'product') {
            // console.log('合同biang11')
            // element.oldValue = {
            //   isEdit: true,
            //   meal: this.action.information.contract.mealProducts,
            //   products: {
            //     mealProducts: this.action.information.contract.mealProducts,
            //     productList: this.action.information.contract.productList,
            //     giftProducts: this.action.information.contract.giftProducts
            //   },
            //   totalPrice: this.action.information.contract.money
            // }
            // console.log('element--', element)
          }
        }

        // 从学员创建合同
        // console.log('从leads创建合同', this.action)
        if (this.action && this.action.crmType == 'customer') {
          if (element.key == 'customer_id') {
            element.disabled = true
            this.actionCombo.customerId = element.value[0].customerId
          }
          if (element.key == 'contractsAttr') {
            element.value = 1
          }
          if (element.key == 'totalclassTime') {
            element.value = this.action.data.customer.countCourseSum
          }
          if (element.key == 'leadsNumber') {
            element.value = this.action.data.customer.leadsNumber
          }
          if (this.crmType == 'capitalAccount' && this.action.type == 'relative') {
            if (element.key == 'dept_id') {
              element.value = [{
                id: this.action.data.customer.deptId,
                name: this.action.data.customer.deptIdName
              }]
            } else if (element.key == 'leads_number') {
              element.value = this.action.data.customer.leadsNumber
            } else if (element.key == 'mobile') {
              element.value = this.action.data.customer.mobile
            } else if (element.key == 'owner_user_id') {
              element.value = [{
                realname: this.action.data.customer.ownerUserName,
                userId: this.action.data.customer.ownerUserId
              }]
            }
          } else {
            if (element.key == 'dept_id') {
              element.value = this.action.data.customer.deptIdName
            }
          }
          if (element.key == 'headmasterUserName') {
            element.value = this.action.data.customer.headmasterUserIdName
          }
          if (element.key == 'source') {
            element.value = this.action.data.customer.channelIdName
          }
        }
      }

      // hasPrice为true显示购买价格字段
      if (hasPrice && this.crmType == 'productSetMeal') {
        this.crmForm.crmFields.push(
          {
            data: {
              authLevel: 3,
              defaultValue: '100.00',
              fieldId: 1229864,
              fieldName: 'price',
              fieldType: 1,
              formType: 'number',
              inputTips: '',
              isNull: 0,
              isUnique: 0,
              label: 21,
              name: '购买价格（元）',
              options: null,
              setting: Array(0),
              type: 5,
              value: ''
            },
            disabled: false,
            key: 'price',
            styleIndex: this.crmForm.crmFields.length,
            value: this.action.editDetail.price
          }
        )
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
          // console.log('获取相关item', item)
          // if (item.formType == 'customer' && this.crmType == 'contract') {
          //   params['value'] = {}
          // }
          // if (item.formType == 'contract') {
          //   if (this.action.type == 'save' && item.fieldName == 'product') {
          //     params['value'] = ''
          //   }
          // }
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
        console.log('item.formType', item.formType)
        if (['leads_source', 'category', 'student'].includes(item.formType)) {
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
      if (this.action && this.action.type !== 'update') return true
      return item.authLevel == 3
      // return (this.action.type === 'update' && item.authLevel == 3) || this.action.type !== 'update'
    },

    // 课程套餐中处理购买价格保留两位小数
    validPrice() {
      for (let index = 0; index < this.crmForm.crmFields.length; index++) {
        const element = this.crmForm.crmFields[index]
        if (element.key == 'warning_line' && element.value != '') {
          const reg = /^([0-9]{1,2}|100)$/
          if (!reg.test(element.value)) {
            return { key: 'warning' }
          }
        } else if (element.key == 'price' && element.value != '') {
          const reg = /^(([0-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
          const val = reg.test(element.value)
          if (!val) {
            return { key: 'price' }
          }
        }
      }
      return { key: 'pass' }
    },

    // 保存草稿
    saveDraftField() {
      this.debouncedSaveField(false, true)
    },
    handle(msg) {
      this.$message.error(msg)
    },
    // 保存数据
    saveField(saveAndCreate, isDraft = false) {
      this.saveAndCreate = saveAndCreate
      console.log('保存')
      this.$refs.crmForm.validate((valid, obj) => {
        let msresult = null
        if (this.crmType == 'receivables' || this.crmType == 'productSetMeal') {
          msresult = this.$refs.mealsubject.validAllSubjects()
          if (!msresult) {
            return
          }
        }
        if (valid) {
          if (this.crmType == 'productSetMeal') {
            const { key } = this.validPrice()
            if (['warning', 'price'].includes(key)) {
              return this.$message.error({
                'warning': '折扣比例需在0-100整数范围内',
                'price': '购买价格最多可保留两位小数'
              }[key])
            }
          }
          this.loading = true
          if (this.showExamine) {
            /** 验证审批数据 */
            if (isDraft) {
              // 不验证数据
              var params = this.getSubmiteParams(this.crmForm.crmFields)
              if (params === false) {
                this.loading = false
                return
              }
              if (
                this.examineInfo.examineType === 2 &&
                this.examineInfo.hasOwnProperty('value') &&
                this.examineInfo.value.length
              ) {
                params['checkUserId'] = this.examineInfo.value[0].userId
              }
              console.log('params参数', params)


              params.entity.checkStatus = 5
              this.submiteParams(params)
            } else {
              this.$refs.examineInfo.validateField((result) => {
                if (result) {
                  var params = this.getSubmiteParams(this.crmForm.crmFields)
                  console.log('params可能是false1', params)
                  if (params === false) {
                    this.loading = false
                    return
                  }
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
            console.log('AAA111111', params)
            if (isDraft) {
              params.entity.checkStatus = 5
            }
            // 增加套餐参数提交
            if (this.crmType == 'productSetMeal') {
              params['list'] = this.$refs.mealsubject.getFormList()
              if (params.entity.termTime && params.entity.termTime.length) {
                params.entity['start_purchase_cycle'] = params.entity.termTime[0]
                params.entity['end_purchase_cycle'] = params.entity.termTime[1]
                delete params.entity.termTime
              }
            }
            console.log('aaa-11-', params)
            this.submiteParams(params)
          }
        } else {
          this.loading = false
          // console.log('validObj', obj)
          // console.log(Object.keys(obj))
          // 只有一个报错，并且是mobile
          if (Object.keys(obj).length === 1) {
            var index = Object.keys(obj)[0].split('.')[1]
            if (this.crmForm.crmFields[index].key === 'mobile') {
              if (this.crmType == 'productSetMeal') {
                if (!msresult) {
                  return
                }
              }
              this.loading = true
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
                      console.log('params可能是false', params)
                      if (params === false) {
                        this.loading = false
                        return
                      }
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
                // 增加套餐参数提交
                if (this.crmType == 'productSetMeal') {
                  params['list'] = this.$refs.mealsubject.getFormList()
                  if (params.entity.termTime && params.entity.termTime.length) {
                    params.entity['start_purchase_cycle'] = params.entity.termTime[0]
                    params.entity['end_purchase_cycle'] = params.entity.termTime[1]
                    delete params.entity.termTime
                  }
                }
                console.log(params)
                this.submiteParams(params)
              }

              return
            }
          }
          // 提示第一个error
          if (this.$refs.crmForm.fields) {
            for (
              let index = 0;
              index < this.$refs.crmForm.fields.length;
              index++
            ) {
              const ruleField = this.$refs.crmForm.fields[index]
              if (ruleField.validateState == 'error') {
                console.log('ruleField', ruleField)
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
      var a = { ...params }
      console.log('submiteParams', a)
      var crmRequest = this.getSubmiteRequest()
      // console.log('crmRequest的请求', crmRequest)
      console.log(this.action)
      console.log(this.crmType)
      // return
      if (this.action.type == 'update') {
        const key = this.crmType == 'receivables_plan' ? 'plan' : this.crmType
        if (this.crmType == 'productSetMeal') {
          params.entity['productId'] = this.action.id
        } else if (this.crmType == 'capitalAccount') {
          console.log('添加capital_id')
          console.log(this.action.id)
          params.entity.capital_id = this.action.id
        } else if (this.crmType == 'customer') {
          params.entity.email = 2
          params.entity.customerId = this.action.id
        } else {
          params.entity[key + 'Id'] = this.action.id
        }

        for (var i = 0; i < this.crmForm.crmFields.length; i++) {
          var element = this.crmForm.crmFields[i]
          if (element.key == 'introducer_type') {
            params.entity.introducer_type = element.value
          }
        }
        params.entity.batchId = this.action.batchId
        // 针对保存
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

      if (this.crmType == 'customer' && this.action.type == 'save') {
        params.entity.email = 1
      }

      if (this.crmType == 'contract') {
        console.log('属性', this.action)
        if (this.action.attr && this.action.attr == 'change' && this.action.type == 'save') {
          params.entity.relevanceContractId = this.action.detail.contractId
        }
        if (this.action.attr && this.action.attr == 'change' && this.action.type == 'update') {
          params.entity.relevanceContractId = this.action.information.contract.contractId
        }
        console.log('字段1', params.field)
        // 获取相关字段
        for (let i = 0; i < params.field.length; i++) {
          const element = params.field[i]
          if (element.fieldName == 'contractsAttr') {
            params.entity.isNew = element.value
          } else if (element.fieldName == 'totalclassTime') {
            params.entity.countCourseSum = element.value
          } else if (element.fieldName == 'contractId') {
            params.entity.contract_type = 2
            var arr = []
            element.value.forEach(item => {
              console.log('shuju', item)
              arr.push(item.contractId)
            })
            params.entity.relevance_contract_id = arr.join(',')
          } else if (element.fieldName == 'is_early_retirement') {
            params.entity.isEarlyRetirement = element.value
          }
        }
        // 删除只用于展示的字段
        for (let i = 0; i < params.field.length; i++) {
          const element = params.field[i]
          var res = [
            'contractsAttr',
            'totalclassTime',
            'leadsNumber',
            'dept_id',
            'headmasterUserName',
            'source',
            'contractId',
            'present',
            'is_early_retirement'
          ].includes(element.fieldName)
          if (res) {
            params.field.splice(i--, 1)
          }
        }

        // for (const k in params.entity) {
        //   toHump(params.entity, k)
        // }
      }

      // function toHump(obj, k) {
      //   var reg = /\_(\w)/g
      //   if (reg.test(k)) {
      //     var a = k.replace(/\_(\w)/g, function(all, letter) {
      //       return letter.toUpperCase()
      //     })
      //     obj[a] = obj[k]
      //     delete obj[k]
      //   }
      // }

      console.log('请求参数: ', params)
      // this.loading = false
      // return
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
      } else if (this.crmType == 'capitalAccount') {
        return crmAccountSave
      } else if (this.crmType == 'contacts') {
        return crmContactsSave
      } else if (this.crmType == 'business') {
        return crmBusinessSave
      } else if (this.crmType == 'product') {
        return crmProductSave
      } else if (this.crmType == 'productSetMeal') {
        return crmProductSetMealSave
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
      // console.log('c传递的数组', array)
      var params = { entity: {}, field: [] }
      for (let index = 0; index < array.length; index++) {
        const element = array[index]
        if (element.data.formType == 'product') {
          var res = this.getProductParams(params, element)
          console.log('产品校验是否通过', res)
          if (res === false) {
            return false
          }
        } else if (element.data.formType == 'map_address') {
          this.getCustomerAddressParams(params.entity, element)
        } else if (element.data.fieldType == 1) {
          if (element.key == 'status') {
            params.entity[element.key] = this.getRealParams(element)
          } else {
            // console.log('相关')
            params.entity[element.key] = this.getRealParams(element) || ''
          }
        } else if (element.data.key == 'introducer_type') {
          // console.log(111)
        } else if (element.key == 'present') {
          // console.log('额外')
          this.getPresentParams(params, element)
          console.log('额外赠送校验是否通过', res)
          if (res === false) {
            return false
          }
        } else {
          element.data.value = this.getRealParams(element)
          console.log('data', element.data)
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
      console.log('entity', params)
      return params
    },
    getPresentParams(params, element) {
      // console.log('拼接产品参数', params, element)
      if (element.value) {
        var arr = []
        // console.log('值', element.value)
        for (let i = 0; i < element.value.product.length; i++) {
          const item = element.value.product[i]
          arr.push({
            'type': 2, // 表示额外赠送
            'productId': item.subject, // 科目Id
            'courseSum': item.grooveLesson, // 购买课次(type为赠送的话，为累计赠送课次）
            'discountRate': item.discount,
            'price': 0, // 产品单价
            'subtotal': 0,
            'salesPrice': 0
          })
        }
        params['product'] = arr
      } else {
        // params['product'] = []
        this.$message.error('请添加课程')
        return false
      }
    },
    getProductParams(params, element) {
      console.log('拼接产品参数', params, element)
      if (element.value.buyCount) {
        var arr = []
        // params['product'] = element.value.data
        console.log('值', element.value)

        // 没有购买
        if (element.value.buyCount == 0) {
          this.$message.error('购买课次不能为0')
          return false
        }

        var mealType = element.value.data[0].mealType
        var res = element.value.data.every(item => {
          return item.mealType == mealType
        })
        if (!res) {
          this.$message.error('套餐课程类型必须相同')
          return false
        }

        for (let i = 0; i < element.value.data.length; i++) {
          const item = element.value.data[i]
          if (!item.subject) {
            this.$message.error('请选择科目')
            return false
          }
          if (item.type == 2) {
            arr.push({
              'type': 2, // 表示累计赠送
              'mealProductId': item.mealProductId, // 礼包Id
              'giftProductId': item.giftProductId, // 套餐Id
              'productId': item.subject, // 科目Id
              'courseSum': item.presentLesson, // 购买课次(type为赠送的话，为累计赠送课次）
              // 'subtotal': item.price, // 原价
              // 'salesPrice': item.salePrice, // 折后价格
              'price': item.univalence // 均价
            })
          } else {
            arr.push({
              'productId': item.subject, // 科目Id
              'mealProductId': item.combo_number, // 礼包Id
              'giftProductId': item.detailsId, // 套餐Id
              'courseSum': item.purchaseLesson, // 购买课次(type为赠送的话，为累计赠送课次）
              'presenterCourseSum': item.grooveLesson, // 赠送课次
              'subtotal': item.price, // 原价
              'salesPrice': item.salePrice, // 折后价格
              'price': item.univalence // 均价
            })
          }
        }
        params['product'] = arr
        params.entity['money'] = element.value.totalPrice
          ? element.value.totalPrice
          : 0
        params.entity.buyCount = element.value.buyCount
        params.entity.presenterCount = element.value.presenterCount
        params.entity.ruleDetails = element.value.ruleDetails
        if (element.value.refundMonry) {
          params.entity.refundMonry = element.value.refundMonry
        }
      } else {
        this.$message.error('请添加套餐')
        return false
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
      // console.log('相关拼接', element)
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
        return this.action.type == 'update' ? '编辑课程单品' : '新建课程单品'
      } else if (this.crmType == 'productSetMeal') {
        return this.action.type == 'update' ? '编辑课程套餐' : '新建课程套餐'
      } else if (this.crmType == 'contract') {
        // if (this.action.present && this.action.type !== 'update') {
        if ((this.action.present || this.action.contractType == 2) && this.action.type !== 'update') {
          return '新建额外赠送合同'
        }
        if ((this.action.present || this.action.contractType == 2) && this.action.type == 'update') {
          return '编辑额外赠送合同'
        }
        if (this.action.attr == 'change' && this.action.type !== 'update') {
          return '变更合同'
        }
        if (this.action.attr == 'change' && this.action.type == 'update') {
          return '编辑变更合同'
        }
        return this.action.type == 'update' ? '编辑合同' : '新建合同'
      } else if (this.crmType == 'receivables') {
        return this.action.type == 'update' ? '编辑回款' : '新建回款'
      } else if (this.crmType == 'receivables_plan') {
        return this.action.type == 'update' ? '编辑回款计划' : '新建回款计划'
      } else if (this.crmType == 'visit') {
        return this.action.type == 'update' ? '编辑回访' : '新建回访'
      } else if (this.crmType == 'capitalAccount') {
        return this.action.type == 'update' ? '编辑资金账户' : '新建资金账户'
      } else if (this.crmType == 'refundMoney') {
        return this.action.type == 'update' ? '编辑合同充值返还' : '新建合同充值返还'
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

.bottom {
  padding: 0 10px !important;
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

.attr-title {
  padding-left: 10px;
  font-weight: bold;
}

</style>
