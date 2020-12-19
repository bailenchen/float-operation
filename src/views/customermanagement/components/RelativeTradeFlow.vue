<template>
  <div
    v-empty="nopermission"
    class="rc-cont"
    xs-empty-icon="nopermission"
    xs-empty-text="暂无权限">
    <flexbox
      v-if="!isSeas"
      class="rc-head"
      direction="reverse">
      <el-select
        v-for="(item,index) in selectList"
        :key="index"
        v-model="form[item.prop]"
        clearable
        style="width:135px;margin-right:10px;"
        placeholder="请选择"
        @change="changeSearchHandle">
        <el-option
          v-for="ite in item.options"
          :key="ite.value"
          :label="ite.label"
          :value="ite.value"/>
      </el-select>
      <time-select
        :width="160"
        :default-type="1"
        @change="timeTypeChange"/>
    </flexbox>
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
        :formatter="fieldFormatter"
        :width="item.width"
        :label="item.label"
        show-overflow-tooltip/>
      <el-table-column
        label="操作"
        align="center"
        fixed="right"
        width="80">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.transactionType" disabled>编辑</el-button>
          <el-button v-if="scope.row.transactionType" @click="editHandle(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="p-contianer">
      <el-pagination
        :current-page="currentPage"
        :page-sizes="pageSizes"
        :page-size.sync="pageSize"
        :total="total"
        :pager-count="5"
        class="p-bar"
        background
        layout="prev, pager, next, sizes, total, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
    <c-r-m-full-screen-detail
      :visible.sync="showFullDetail"
      :id="contractId"
      :click-field="clickField"
      :crm-type="detailType"
      @handle="detailHandle"/>
    <!-- <c-r-m-create-view
      v-if="isCreate"
      :action="createActionInfo"
      crm-type="contract"
      @save-success="createSaveSuccess"
      @hiden-view="isCreate=false"/> -->

    <edit-transaction
      v-if="isCreate"
      :money-type="moneyType"
      :action="rowData"
      @save-success="createSaveSuccess"
      @hiden-view="isCreate=false"/>
  </div>
</template>

<script type="text/javascript">
import loading from '../mixins/loading'
import Lockr from 'lockr'
import CRMCreateView from './CRMCreateView'
import EditTransaction from '@/views/customermanagement/studentManage/account/components/EditTransaction'
import { crmAccountWater } from '@/api/customermanagement/account'
// import { crmBusinessQueryContract } from '@/api/customermanagement/business'
import CheckStatusMixin from '@/mixins/CheckStatusMixin'
// import { separator } from '@/filters/vue-numeral-filter/filters'
import TimeSelect from '@/views/customermanagement/studentManage/account/components/TimeSelect'

export default {
  name: 'RelativeTradeFlow', // 交易流水
  components: {
    CRMFullScreenDetail: () => import('./CRMFullScreenDetail.vue'),
    CRMCreateView,
    EditTransaction,
    TimeSelect
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
      moneyType: '',
      list: [],
      fieldList: [],
      tableHeight: '400px',
      showFullDetail: false,
      isCreate: false, // 控制新建
      rowData: null,
      contractId: '', // 查看全屏联系人详情的 ID
      // 创建的相关信息
      createActionInfo: { type: 'relative', crmType: this.crmType, data: {}},

      form: {},
      selectList: [
        {
          options: [
            { label: '全部交易类型', value: '' },
            { label: '交易类型为充值', value: 1 },
            { label: '交易类型为提现', value: 2 }
          ],
          // prop: 'a'
          prop: 'transactionType'
        },
        {
          options: [
            { label: '全部交易方式', value: '' },
            { label: '现金交易方式', value: 1 },
            { label: '刷卡交易方式', value: 2 },
            { label: '支票交易方式', value: 3 },
            { label: '微信交易方式', value: 4 },
            { label: '支付宝交易方式', value: 5 },
            { label: '转账交易方式', value: 6 }
          ],
          // prop: 'b'
          prop: 'payment'
        }
        // {
        //   options: [
        //     { label: '全部', value: 1 },
        //     { label: '最近7天', value: 2 },
        //     { label: '最近30天', value: 3 },
        //     { label: '最近60天', value: 4 },
        //     { label: '自定义', value: 5 }
        //   ],
        //   prop: 'c'
        // }
      ],
      dataType: '', // 日期 为空表示全部
      isDataCustom: false,
      startTime: '',
      endTime: '',
      currentPage: 1, // 分页
      pageSize: Lockr.get('crmPageSizes') || 15,
      pageSizes: [15, 30, 60, 100],
      total: 0,

      detailType: '',

      clickField: ''
    }
  },
  computed: {},
  watch: {
    id: function(val) {
      this.list = []
      this.getDetail()
    }
  },
  created() {
    this.getFieldList()
  },
  mounted() {
    this.getDetail()
  },
  activated: function() {},
  deactivated: function() {},
  methods: {
    getFieldList() {
      this.fieldList.push({
        prop: 'leadsNumber',
        width: '130',
        label: '学员编号'
      })
      this.fieldList.push({ prop: 'serialNumber', width: '130', label: '交易流水号' })
      this.fieldList.push({
        prop: 'transactionType',
        width: '100',
        label: '交易类型'
      })
      this.fieldList.push({ prop: 'userAccount', width: '130', label: '用户账号' })
      this.fieldList.push({ prop: 'payment', width: '100', label: '支付方式' })
      this.fieldList.push({
        prop: 'price',
        width: '100',
        label: '金额（元）'
      })
      this.fieldList.push({
        prop: 'remainingAmount',
        width: '120',
        label: '剩余金额（元）'
      })

      this.fieldList.push({ prop: 'receipt', width: '100', label: '交易凭证' })
      this.fieldList.push({ prop: 'createTime', width: '100', label: '交易时间' })
      this.fieldList.push({ prop: 'updateTime', width: '100', label: '扣款/打款时间' })
      this.fieldList.push({ prop: 'status', width: '100', label: '审批状态' })
      this.fieldList.push({ prop: 'remark', width: '100', label: '备注' })
      this.fieldList.push({ prop: 'characterName', width: '100', label: '收款/退款人' })
    },

    editHandle(row) {
      console.log('编辑资金流水')
      console.log(row)


      if (row.transactionType == '资金退款') {
        this.moneyType = 'refound'
      } else if (row.transactionType == '线下资金收款') {
        this.moneyType = 'offline'
      } else if (row.transactionType == '线上资金收款') {
        this.moneyType = 'online'
      }
      console.log(this.moneyType)
      this.rowData = row
      // this.rowData.customerName = this.detail.customerName
      // this.rowData.customerName =
      this.isCreate = true
    },

    getDetail(search) {
      this.loading = true
      const params = {
        search: this.id,
        page: this.currentPage,
        limit: this.pageSize,
        type: 22
      }
      search ? params.search = search : null
      // const request = {
      //   customer: crmCustomerQueryContract,
      //   business: crmBusinessQueryContract
      // }[this.crmType]
      // const params = { pageType: 0 }
      // params[this.crmType + 'Id'] = this.id
      crmAccountWater(params)
        .then(res => {
          if (this.fieldList.length == 0) {
            this.getFieldList()
          }
          this.total = res.data.totalRow
          this.nopermission = false
          this.loading = false
          this.list = res.data.list
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
      if (column.property === 'status') {
        return {
          0: '待审核',
          1: '通过',
          2: '拒绝',
          3: '删除',
          4: '撤回'
        }[row[column.property]]
      } else if (column.property === 'transactionType') {
        // console.log('格式胡这里哦', column.property)
        // console.log(row[column.property])
        // return {
        //   1: '线下',
        //   2: '线上'
        // }[row[column.property]]
      } else if (column.property === 'payment') {
        // return {
        //   1: '线下资金收款',
        //   2: '资金退款'
        // }[row[column.property]]
        // console.log('支付方式', column.property)
        // console.log(row[column.property])
      } else if (column.property === 'price') {
        if (row.bigDealType === 2) {
          console.log(row, 'xxxxx')
          return `-${row[column.property]}`
        } else if (row.bigDealType === 1) {
          return `+${row[column.property]}`
        }
      }
      return row[column.property] || '--'
    },

    /**
     * 当某一行被点击时会触发该事件
     */
    handleRowClick(row, column, event) {
      if (column.property == 'leadsNumber') {
        this.detailType = 'student'
        this.clickField = column.property
        this.contractId = this.detail.customerId
        this.showFullDetail = true
      } else if (column.property == 'serialNumber') {
        this.detailType = 'moneyType'
        this.clickField = column.property
        this.contractId = row.waterId
        this.showFullDetail = true
      }
    },

    /**
     * 通过回调控制class
     */
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'leadsNumber' || column.property == 'serialNumber') {
        if (row.bigDealType === 2) {
          return 'under-line red-font'
        } else if (row.bigDealType === 1) {
          return 'under-line blue-font'
        }
      }
      if (row.bigDealType === 2) {
        return 'red-font'
      } else if (row.bigDealType === 1) {
        return 'blue-font'
      }
    },

    createSaveSuccess() {
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
    },

    // 更改当前页数
    handleCurrentChange(val) {
      this.currentPage = val
      this.getDetail()
    },

    // 更改每页展示数量
    handleSizeChange(val) {
      Lockr.set('crmPageSizes', val)
      this.pageSize = val
      this.getDetail()
    },

    // 改变交易流水查询条件
    changeSearchHandle() {
      console.log('改变交易流水查询条件')
      const params = {
        search: this.id,
        page: this.currentPage,
        limit: this.pageSize,
        type: 22
      }
      if (this.isDataCustom) {
        params.startTime = this.startTime
        params.endTime = this.endTime
      } else {
        params.dataType = this.dataType
      }
      // console.log(this.form)
      for (const k in this.form) {
        if (!this.form.hasOwnProperty(k)) break
        console.log(k, this.form[k])
        params[k] = this.form[k]
      }

      console.log(params)

      crmAccountWater(params).then(res => {
        this.list = res.data.list
      }).catch()
      // this.getDetail(val)
    },

    // 选择时间
    timeTypeChange(val) {
      console.log('选择时间')
      console.log(val)
      if (val.type === 'default') {
        this.isDataCustom = false
        this.dataType = val.value
      } else {
        this.isDataCustom = true
        // val.value
        this.startTime = val.startTime
        this.endTime = val.endTime
      }

      this.changeSearchHandle()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/relativecrm.scss';
</style>
