<template>
  <div
    v-empty="nopermission"
    class="rc-cont"
    xs-empty-icon="nopermission"
    xs-empty-text="暂无权限">
    <el-table
      :data="list"
      :height="tableHeight"
      :cell-class-name="cellClassName"
      stripe
      style="width: 100%;border: 1px solid #E6E6E6;"
      @row-click="handleRowClick">
      <el-table-column
        v-for="(item, index) in fieldList"
        :key="index"
        :prop="item.prop"
        :width="item.width"
        :formatter="fieldFormatter"
        :label="item.label"
        show-overflow-tooltip/>
    </el-table>
    <c-r-m-full-screen-detail
      :visible.sync="showFullDetail"
      :id="contractId"
      crm-type="contract"
      @handle="detailHandle"/>
    <c-r-m-create-view
      v-if="isCreate"
      :action="createActionInfo"
      crm-type="contract"
      @save-success="createSaveSuccess"
      @hiden-view="isCreate=false"/>
  </div>
</template>

<script type="text/javascript">
import loading from '../mixins/loading'
import CRMCreateView from './CRMCreateView'
import { queryRechargeListAPI } from '@/api/customermanagement/contract'
// import { crmBusinessQueryContract } from '@/api/customermanagement/business'
import CheckStatusMixin from '@/mixins/CheckStatusMixin'
import { separator } from '@/filters/vue-numeral-filter/filters'

export default {
  name: 'ContractRecharge', // 合同充值
  components: {
    CRMFullScreenDetail: () => import('./CRMFullScreenDetail.vue'),
    CRMCreateView
  },
  mixins: [loading, CheckStatusMixin],
  props: {
    /** 模块ID */
    id: [String, Number],
    /** 没有值就是全部类型 有值就是当个类型 */
    crmType: {
      type: String,
      default: ''
    },
    /** 是公海 默认是客户 */
    isSeas: {
      type: Boolean,
      default: false
    },
    /** 联系人人下 新建商机 需要联系人里的客户信息  合同下需要客户和商机信息 */
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      nopermission: false,
      list: [],
      fieldList: [],
      tableHeight: '400px',
      showFullDetail: false,
      isCreate: false, // 控制新建
      contractId: '', // 查看全屏联系人详情的 ID
      // 创建的相关信息
      createActionInfo: { type: 'relative', crmType: this.crmType, data: {}}
    }
  },
  computed: {},
  watch: {
    id: function(val) {
      this.list = []
      this.getDetail()
    }
  },
  mounted() {
    this.getDetail()
  },
  activated: function() {},
  deactivated: function() {},
  methods: {
    getFieldList() {
      this.fieldList.push({
        prop: 'number',
        width: '110',
        label: '合同充值编号'
      })
      this.fieldList.push({
        prop: 'customerName',
        width: '80',
        label: '学员姓名'
      })
      this.fieldList.push({ prop: 'deptName', width: '150', label: '所属中心' })
      this.fieldList.push({
        prop: 'contractNum',
        width: '120',
        label: '合同编号'
      })

      this.fieldList.push({ prop: 'serialNumber', width: '100', label: '交易流水号' })
      this.fieldList.push({ prop: 'transactionTime ', width: '100', label: '资金收款时间' })
      this.fieldList.push({ prop: 'waterPrice', width: '100', label: '资金收款金额' })
      this.fieldList.push({ prop: 'createTime', width: '100', label: '合同充值时间' })
      this.fieldList.push({ prop: 'money', width: '100', label: '合同充值金额（元）' })
      this.fieldList.push({ prop: 'receipt', width: '100', label: '交易凭证' })
      this.fieldList.push({ prop: 'payment', width: '100', label: '合同充值方式' })
      this.fieldList.push({ prop: 'ownerUserName', width: '100', label: '教育顾问' })
      this.fieldList.push({ prop: 'checkStatus', width: '100', label: '审批状态' })
      this.fieldList.push({ prop: 'updateTime', width: '100', label: '更新时间' })
      this.fieldList.push({ prop: 'createTime', width: '100', label: '创建时间' })
    },

    getDetail() {
      this.loading = true
      const request = {
        contract: queryRechargeListAPI
      }[this.crmType]
      const params = {}
      params[this.crmType + 'Id'] = this.id
      request(params)
        .then(res => {
          if (this.fieldList.length == 0) {
            this.getFieldList()
          }
          this.nopermission = false
          this.loading = false
          this.list = res.data
        })
        .catch(data => {
          if (data.code == 102) {
            this.nopermission = true
          }
          this.loading = false
        })
    },

    /**
     * 格式化字段
     */
    fieldFormatter(row, column) {
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
      } else if (column.property == 'money') {
        return separator(row[column.property] || 0)
      } else if (column.property == 'payment') {
        return {
          '1': '现金交易',
          '2': '刷卡交易',
          '3': '支票交易',
          '4': '微信交易',
          '5': '支付宝交易',
          '6': '转账交易'
        }[row[column.property]]
      }
      return row[column.property]
    },

    /**
     * 当某一行被点击时会触发该事件
     */
    handleRowClick(row, column, event) {
      if (column.property == 'contractName') {
        this.contractId = row.contractId
        this.showFullDetail = true
      }
    },

    /**
     * 通过回调控制class
     */
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'contractName') {
        return 'can-visit--underline'
      } else {
        return ''
      }
    },

    /**
     * 新建
     */
    createClick() {
      // 客户 和 商机 下新建合同
      if (this.crmType == 'business') {
        this.createActionInfo.data['customer'] = this.detail
        this.createActionInfo.data['business'] = this.detail
      } else if (this.crmType == 'customer') {
        this.createActionInfo.data['customer'] = this.detail
      }
      this.isCreate = true
    },
    createSaveSuccess() {
      this.$bus.emit('crm-tab-num-update')
      this.getDetail()
    },

    /**
     * 详情操作
     */
    detailHandle(data) {
      if (data.type === 'delete') {
        this.$bus.emit('crm-tab-num-update')
        this.getDetail()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/relativecrm.scss';
</style>
