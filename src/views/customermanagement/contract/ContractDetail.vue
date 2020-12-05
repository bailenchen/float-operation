<template>
  <slide-view
    v-empty="!canShowDetail"
    :listener-ids="listenerIDs"
    :no-listener-ids="noListenerIDs"
    :no-listener-class="noListenerClass"
    :body-style="{padding: 0, height: '100%'}"
    xs-empty-icon="nopermission"
    xs-empty-text="暂无权限"
    @afterEnter="viewAfterEnter"
    @close="hideView">
    <div
      v-loading="loading"
      ref="crmDetailMain"
      class="detail-main">
      <flexbox
        v-if="canShowDetail && detailData"
        direction="column"
        align="stretch"
        class="d-container">
        <c-r-m-detail-head
          :detail="detailData"
          :head-details="headDetails"
          :id="id"
          :crm-type="crmType"
          :click-field="clickField"
          @handle="detailHeadHandle"
          @close="hideView">
          <template slot="name">
            <span v-if="detailData.checkStatus == 8" class="is-invalid">（已作废）</span>
          </template>
        </c-r-m-detail-head>

        <examine-info
          v-if="detailData.examineRecordId"
          :id="id"
          :record-id="detailData.examineRecordId"
          :owner-user-id="detailData.ownerUserId"
          class="examine-info"
          examine-type="crm_contract"
          @on-handle="examineHandle"/>

        <div class="d-container-bd">
          <el-tabs
            v-model="tabCurrentName"
            type="border-card"
            class="d-container-bd--left">
            <el-tab-pane
              v-for="(item, index) in tabNames"
              :key="index"
              :label="item.label"
              :name="item.name"
              lazy>
              <c-r-m-base-info
                v-if="item.name === 'CRMBaseInfo'"
                :detail="detailData"
                :id="id"
                :filed-list="baseDetailList">
                <!-- 课程信息 -->
                <div slot="first" style="padding-left: 15px;margin-bottom:20px;">
                  <div class="section-header" style="padding-left:0;margin-bottom:10px;">
                    <div class="section-mark" style="border-left-color: rgb(35, 98, 251);"/>
                    <div class="section-title">课程信息</div>
                  </div>
                  <combo
                    :action="comboAction"
                    :value="comboValue"
                    :subject-list="subList"
                    :accumulation="accumulation"
                    :is-disabled="isDisabled"
                    style="width: 100%;"/>
                </div>
                <!-- 累计赠送课程  业绩分配信息 -->
                <div v-for="(item, index) in list" slot="first" :key="index" style="padding-left: 15px;margin-bottom:20px;">
                  <div class="section-header" style="padding-left:0;">
                    <div class="section-mark" style="border-left-color: rgb(35, 98, 251);"/>
                    <div class="section-title">{{ item.name }}</div>
                  </div>
                  <el-table
                    :data="item.data"
                    stripe
                    style="width: 100%;border: 1px solid #E6E6E6;margin-top: 10px;">
                    <el-table-column
                      v-for="(items, index) in item.fieldlist"
                      :key="index"
                      :prop="items.prop"
                      :label="items.label"
                      :formatter="fieldFormatter"
                      show-overflow-tooltip/>
                  </el-table>
                  <div v-if="item.name == '累计赠送课程'" class="table-desc">
                    <div class="left-txt">累计赠送规则：购买辅导方式为1对3的，购买10节课，可赠送1节课</div>
                    <div class="right-txt">最终价格：{{ totalPrice }}元</div>
                  </div>
                </div>
              </c-r-m-base-info>
              <component
                v-else
                :is="item.name"
                :detail="detailData"
                :type-list="logTyps"
                :id="id"
                :handle="activityHandle"
                :crm-type="crmType"
                @on-handle="detailHeadHandle" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </flexbox>
    </div>

    <c-r-m-create-view
      v-if="isCreate"
      :action="{type: 'update', id: id, batchId: detailData.batchId, information}"
      :crm-type="crmType"
      @save-success="editSaveSuccess"
      @hiden-view="isCreate=false"/>
  </slide-view>
</template>

<script>
import { crmContractRead } from '@/api/customermanagement/contract'
import { filedGetInformation } from '@/api/customermanagement/common'
import { QueryAdminSubject } from '@/api/systemManagement/params'
import crmTypeModel from '@/views/customermanagement/model/crmTypeModel'

import SlideView from '@/components/SlideView'
import CRMDetailHead from '../components/CRMDetailHead'
import Activity from '../components/activity' // 活动
import CRMBaseInfo from '../components/CRMBaseInfo' // 商机基本信息
import RelativeHandle from '../components/RelativeHandle' // 相关操作
import RelativeTeam from '../components/RelativeTeam' // 团队成员
import RelativeProduct from '../components/RelativeProduct' // 团队成员
import RelativeReturnMoney from '../components/RelativeReturnMoney' // 相关回款
import RelativeFiles from '../components/RelativeFiles' // 相关附件
import RelativeVisit from '../components/RelativeVisit' // 回访
import ExamineInfo from '@/components/Examine/ExamineInfo'
import ContractRecharge from '../components/ContractRecharge' // 合同充值
import ReturnRechargeMoney from '../components/ReturnRechargeMoney' // 合同充值返还

import Combo from '@/views/customermanagement/contract/components/Combo'
import CRMCreateView from '../components/CRMCreateView' // 新建页面
import detail from '../mixins/detail'
import { separator } from '@/filters/vue-numeral-filter/filters'

export default {
  // 客户管理 的 合同详情
  name: 'ContractDetail',
  components: {
    SlideView,
    CRMDetailHead,
    Activity,
    CRMBaseInfo,
    RelativeHandle,
    RelativeTeam,
    RelativeProduct,
    RelativeReturnMoney,
    RelativeFiles,
    RelativeVisit,
    ExamineInfo,
    CRMCreateView,
    ContractRecharge,
    ReturnRechargeMoney,
    Combo
  },
  mixins: [detail],
  props: {
    // 详情信息id
    id: [String, Number],
    // 监听的dom 进行隐藏详情
    listenerIDs: {
      type: Array,
      default: () => {
        return ['crm-main-container']
      }
    },
    // 不监听
    noListenerIDs: {
      type: Array,
      default: () => {
        return []
      }
    },
    noListenerClass: {
      type: Array,
      default: () => {
        return ['el-table__body']
      }
    },
    clickField: {
      type: String,
      default: ''
    },
    baseList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      // 展示加载loading
      loading: false,
      crmType: 'contract',
      headDetails: [
        { title: '合同编号', value: '' },
        { title: '学员名称', value: '' },
        { title: '合同金额（元）', value: '' },
        { title: '签约时间', value: '' },
        { title: '合同充值金额（元）', value: '' },
        { title: '签约人', value: '' }
      ],
      tabCurrentName: 'CRMBaseInfo',
      // 编辑操作
      isCreate: false,
      // 活动操作
      activityHandle: [
        {
          type: 'log',
          label: '写跟进'
        }, {
          type: 'task',
          label: '创建任务'
        }, {
          type: 'receivables',
          label: '创建回款'
        }
      ],
      baseDetailList: [], // 基本信息列表

      // 课程信息
      isDisabled: true,
      comboAction: null,
      comboValue: null,
      subList: [],
      accumulation: {
        data: [],
        lesson: 0
      },

      list: [
        {
          name: '累计赠送课程',
          data: [],
          fieldlist: [
            { prop: 'subjectName', label: '科目' },
            { prop: 'courseSum', label: '累计赠送课次' },
            { prop: 'alreadyCourse', label: '已排课课次' },
            { prop: 'finishCourse', label: '已完成课次' },
            { prop: 'price', label: '单节课价格' }
          ]
        },
        {
          name: '业绩分配信息',
          data: [],
          fieldlist: [
            { prop: 'createUserName', label: '业绩享受人' },
            { prop: 'performanceRatio', label: '业绩比例（%）' },
            { prop: 'newStudentRatio', label: '新签学员比例（%）' },
            { prop: 'memberUserName', label: '添加人' },
            { prop: 'checkStatus', label: '审批状态' },
            { prop: 'createTime', label: '添加时间' }
          ]
        }
      ],
      subjectList: {}, // 科目列表
      totalPrice: 0,
      information: null // 合同详情
    }
  },
  computed: {
    tabNames() {
      var tempsTabs = []
      if (this.crm.contract && this.crm.contract.read) {
        tempsTabs.push({ label: '详细资料', name: 'CRMBaseInfo' })
      }

      tempsTabs.push({ label: '合同充值', name: 'ContractRecharge' })

      // tempsTabs.push({ label: '合同充值返还', name: 'ReturnRechargeMoney' })

      // if (this.crm.product && this.crm.product.index) {
      //   tempsTabs.push({ label: this.getTabName('产品', this.tabsNumber.productCount), name: 'RelativeProduct' })
      // }
      // if (this.crm.receivables && this.crm.receivables.index) {
      //   tempsTabs.push({ label: this.getTabName('回款', this.tabsNumber.receivablesCount), name: 'RelativeReturnMoney' })
      // }
      // if (this.crm.visit && this.crm.visit.index) {
      //   tempsTabs.push({ label: this.getTabName('回访', this.tabsNumber.returnVisitCount), name: 'RelativeVisit' })
      // }
      // tempsTabs.push({ label: this.getTabName('团队成员', this.tabsNumber.memberCount), name: 'RelativeTeam' })
      tempsTabs.push({ label: this.getTabName('附件', this.tabsNumber.fileCount), name: 'RelativeFiles' })
      tempsTabs.push({ label: '操作记录', name: 'RelativeHandle' })
      return tempsTabs
    },

    /**
     * 根据记录筛选
     */
    logTyps() {
      return [{
        icon: 'all',
        color: '#2362FB',
        command: '',
        label: '全部活动'
      }, {
        icon: 'contract',
        color: '#FD5B4A',
        command: 6,
        label: '合同'
      }, {
        icon: 'o-task',
        color: '#D376FF',
        command: 11,
        label: '任务'
      }, {
        icon: 'receivables',
        color: '#FFB940',
        command: 7,
        label: '回款'
      }, {
        icon: 'log',
        color: '#5864FF',
        command: 8,
        label: '日志'
      }, {
        icon: 'approve',
        color: '#9376FF',
        command: 9,
        label: '审批'
      }]
    }
  },
  mounted() {
    if (this.crm.contract && this.crm.contract.read) {
      this.tabCurrentName = 'CRMBaseInfo'
    }
  },
  methods: {
    /**
     * 详情
     */
    getDetial() {
      console.log('获取详情')
      this.loading = true
      crmContractRead({
        contractId: this.id
      })
        .then(res => {
          this.loading = false
          // 创建回款计划的时候使用
          this.detailData = res.data
          this.getSubject()
          this.getBaseInfo(res.data)

          this.headDetails[0].value = res.data.num
          this.headDetails[1].value = res.data.customerName
          this.headDetails[2].value = separator(res.data.money || 0)
          this.headDetails[3].value = res.data.orderDate
          this.headDetails[4].value = separator(res.data.receivablesMoney || 0)
          this.headDetails[5].value = res.data.ownerUserName
        })
        .catch(() => {
          this.loading = false
          this.hideView()
        })
    },

    getSubject() {
      // 获取科目
      QueryAdminSubject().then(res => {
        this.subList = res.data
        const list = res.data
        list.forEach(item => {
          this.subjectList[item.id] = item.subjectName
        })
      }).catch(() => {})
    },

    // 处理基本信息展示字段
    handleFieldVal(name, val) {
      if (['checkStatus', 'contractType', 'isEarlyRetirement', 'isNew', 'contractStatus'].includes(name)) {
        return {
          'contractType': { 1: '购买', 2: '赠送' },
          'isEarlyRetirement': { 0: '否', 1: '是' },
          'isNew': { 0: '续签', 1: '新签', 2: '引流' },
          'checkStatus': {
            0: '待审核',
            1: '通过',
            2: '拒绝',
            3: '审核中',
            4: '撤回',
            5: '未提交',
            6: '创建',
            7: '已删除',
            8: '作废'
          },
          'contractStatus': {
            1: '申请中',
            2: '放弃',
            3: '合同完成',
            4: '合同变更中',
            5: '执行中',
            6: '执行中',
            7: '合同充值返还',
            8: '确认放弃'
          }
        }[name][val]
      } else {
        return val
      }
    },

    // 获取基本信息
    getBaseInfo(data) {
      this.baseDetailList = [
        { name: '基本信息', list: [] }
      ]
      for (let index = 0; index < this.baseList.length; index++) {
        const element = this.baseList[index]
        this.baseDetailList[0].list.push({
          name: element.name,
          formType: 'text',
          value: this.handleFieldVal(element.fieldName, data[element.fieldName])
        })
      }

      const params = {
        types: crmTypeModel[this.crmType],
        id: this.id
      }
      filedGetInformation(params).then(res => {
        this.information = res.data
        const productList = res.data.contract.productList

        // 大套餐
        const mealKeyVal = {}
        res.data.contract.mealProducts.forEach(item => {
          mealKeyVal[item.productId] = item.name
        })
        // 小套餐
        const giftKeyVal = {}
        res.data.contract.giftProducts.forEach(item => {
          giftKeyVal[item.detailsId] = item.detailsName
        })

        const mealList = []
        const giftList = []
        productList.forEach(item => {
          if (item.type == 1) {
            var obj = {
              productType: mealKeyVal[item.mealProductId],
              productName: giftKeyVal[item.giftProductId],
              subject: item.productId,
              comboNormLesson: 0, // 计算出来
              normLesson: 0, // 计算出来
              purchaseLesson: item.courseSum, // 购买课次
              grooveLesson: 0, // 常规赠送课次
              planeLesson: item.alreadyCourse, // 已排课课次
              completeLesson: item.finishCourse, // 已完成课次
              price: item.salesPrice, // 大套餐价格
              univalence: item.price, // 单价
              combo_number: item.mealProductId
            }
            mealList.push(obj)
          } else if (item.type == 2) {
            giftList.push(item)
          }
        })

        this.comboValue = {
          productList: mealList
        }

        this.list[0].data = giftList.map(item => {
          item.subjectName = this.subjectList[item.productId]
          this.totalPrice += parseFloat(item.price)
          return item
        })
        this.list[1].data = res.data.contract.allotList
      }).catch(() => {})
    },

    /** 格式化字段 */
    fieldFormatter(row, column, cellValue) {
      // 如果需要格式化
      if (column.property === 'checkStatus') {
        return {
          0: '待审核',
          1: '通过',
          2: '拒绝',
          3: '审核中',
          4: '撤回',
          5: '未提交',
          6: '创建',
          7: '已删除',
          8: '作废'
        }[row.checkStatus]
      }
      return row[column.property]
    },

    /**
     * 关闭
     */
    hideView() {
      this.$emit('hide-view')
    },

    /**
     * 编辑成功
     */
    editSaveSuccess() {
      this.$bus.$emit('crm-detail-update', this.crmType)
      this.$emit('handle', { type: 'save-success' })
      this.detailData = null
      this.getDetial()
    },

    /**
     * 审核操作
     */
    examineHandle(data) {
      // 1 审核通过 2 审核拒绝 4 已撤回
      if (data.type == 1) {
        this.getDetial()
      }
      this.$emit('handle', { type: 'examine' })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/crmdetail.scss';
.is-invalid {
  color: #ccc;
}

.table-desc {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}
</style>
