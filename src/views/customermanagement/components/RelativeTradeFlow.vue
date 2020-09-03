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
      <!-- <el-button
        class="xr-btn--orange rc-head-item"
        icon="el-icon-plus"
        type="primary"
        @click="createClick">新建合同</el-button> -->

      <el-select
        v-for="(item,index) in selectList"
        :key="index"
        v-model="form[item.prop]"
        clearable
        style="width:135px;margin-right:10px;"
        placeholder="请选择">
        <el-option
          v-for="ite in item.options"
          :key="ite.value"
          :label="ite.label"
          :value="ite.value"/>
      </el-select>
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
        :label="item.label"
        show-overflow-tooltip/>
      <el-table-column
        label="操作"
        align="center"
        fixed="right"
        width="60">
        <template slot-scope="scope">
          <el-button>编辑</el-button>
        </template>
      </el-table-column>
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
// import { crmCustomerQueryContract } from '@/api/customermanagement/customer'
// import { crmBusinessQueryContract } from '@/api/customermanagement/business'
import CheckStatusMixin from '@/mixins/CheckStatusMixin'
import { separator } from '@/filters/vue-numeral-filter/filters'

export default {
  name: 'RelativeTradeFlow', // 交易流水
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
      createActionInfo: { type: 'relative', crmType: this.crmType, data: {}},

      form: {},
      selectList: [
        {
          options: [
            { label: '全部交易类型', value: 1 },
            { label: '交易类型为充值', value: 2 },
            { label: '交易类型为提现', value: 3 }
          ],
          prop: 'a'
        },
        {
          options: [
            { label: '全部交易方式', value: 1 },
            { label: '现金交易方式', value: 2 },
            { label: '刷卡交易方式', value: 3 },
            { label: '支票交易方式', value: 4 },
            { label: '微信交易方式', value: 5 },
            { label: '支付宝交易方式', value: 6 },
            { label: '转账交易方式', value: 7 }
          ],
          prop: 'b'
        },
        {
          options: [
            { label: '全部', value: 1 },
            { label: '最近7天', value: 2 },
            { label: '最近30天', value: 3 },
            { label: '最近60天', value: 4 },
            { label: '自定义', value: 5 }
          ],
          prop: 'c'
        }
      ]
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
        prop: 'contractName',
        width: '200',
        label: '学员编号'
      })
      this.fieldList.push({ prop: 'num', width: '200', label: '交易流水号' })
      this.fieldList.push({
        prop: 'customerName',
        width: '200',
        label: '交易类型'
      })
      this.fieldList.push({ prop: 'money', width: '200', label: '支付方式' })
      this.fieldList.push({
        prop: 'startTime',
        width: '200',
        label: '金额（元）'
      })

      this.fieldList.push({ prop: 'endTime', width: '200', label: '交易凭证' })
      this.fieldList.push({ prop: 'checkStatus', width: '200', label: '交易时间' })
      this.fieldList.push({ prop: 'checkStatus', width: '200', label: '扣款/打款时间' })
      this.fieldList.push({ prop: 'checkStatus', width: '200', label: '审批状态' })
      this.fieldList.push({ prop: 'checkStatus', width: '200', label: '备注' })
      this.fieldList.push({ prop: 'checkStatus', width: '200', label: '创建人' })
    },

    getDetail() {
      // this.loading = true
      // const request = {
      //   customer: crmCustomerQueryContract,
      //   business: crmBusinessQueryContract
      // }[this.crmType]
      // const params = { pageType: 0 }
      // params[this.crmType + 'Id'] = this.id
      // request(params)
      //   .then(res => {
      //     if (this.fieldList.length == 0) {
      //       this.getFieldList()
      //     }
      //     this.nopermission = false
      //     this.loading = false
      //     this.list = res.data
      //   })
      //   .catch(data => {
      //     if (data.code == 102) {
      //       this.nopermission = true
      //     }
      //     this.loading = false
      //   })
    },

    /**
     * 格式化字段
     */
    fieldFormatter(row, column) {
      // 如果需要格式化
      if (column.property === 'checkStatus') {
        return this.getStatusName(row.checkStatus)
      } else if (column.property == 'money') {
        return separator(row[column.property] || 0)
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
