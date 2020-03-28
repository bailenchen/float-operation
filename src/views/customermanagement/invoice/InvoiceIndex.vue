<template>
  <div>
    <xr-header
      style="padding: 15px 23px;"
      icon-class="wk wk-invoice"
      icon-color="#13BF97"
      label="发票管理" >
      <template slot="ft">
        <el-button
          class="xr-btn--orange"
          icon="el-icon-plus"
          type="primary"
          @click="createClick">新建发票</el-button>
      </template>
    </xr-header>
    <div
      class="crm-container">
      <xr-table-header
        :handles="handles"
        :selects="selectionList"
        @command="handleCommand">
        <el-input v-model="filterParams.invoiceNumber" placeholder="请输入发票号码" @input="debouncedRefreshList" />
        <el-date-picker
          v-model="filterParams.realInvoiceDate"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择实际开票日期"
          @change="refreshList"/>
        <el-input v-model="filterParams.customerName" placeholder="请输入客户姓名" @input="debouncedRefreshList" />
        <el-input v-model="filterParams.logisticsNumber" placeholder="请输入物流单号" @input="debouncedRefreshList" />
        <el-select
          v-model="filterParams.invoiceStatus"
          class="product-type"
          placeholder="选择开票状态"
          @change="refreshList">
          <el-option
            v-for="(item, index) in [{
              label: '未开票',
              value: 0
            },{
              label: '已开票',
              value: 1
            }]"
            :key="index"
            :label="item.label"
            :value="item.value"/>
        </el-select>

        <el-select
          v-model="filterParams.checkStatus"
          placeholder="选择审核状态"
          @change="refreshList">
          <el-option
            v-for="(item, index) in getXhStatusList()"
            :key="index"
            :label="item.name"
            :value="item.value"/>
        </el-select>

        <xh-user-cell
          :value="filterParams.ownerUserId"
          placeholder="选择负责人"
          @value-change="changeUserCell"/>
      </xr-table-header>
      <el-table
        v-loading="loading"
        id="crm-table"
        :row-height="40"
        :data="list"
        :height="tableHeight"
        :cell-class-name="cellClassName"
        :header-cell-class-name="headerCellClassName"
        use-virtual
        class="n-table--border"
        stripe
        border
        highlight-current-row
        style="width: 100%"
        @row-click="handleRowClick"
        @selection-change="handleSelectionChange">
        <el-table-column
          show-overflow-tooltip
          type="selection"
          align="center"
          width="55"/>
        <el-table-column
          v-for="(item, index) in fieldList"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :min-width="item.width"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="item.prop == 'checkStatus'">
              <span :style="getStatusStyle(scope.row.checkStatus)" class="status-mark"/>
              <span>{{ getStatusName(scope.row.checkStatus) }}</span>
            </template>
            <template v-else>
              {{ fieldFormatter(scope.row, scope.column) }}
            </template>
          </template>
        </el-table-column>
        <el-table-column
          v-if="canUpdateStatus"
          :resizable="false"
          label="操作"
          fixed="right"
          width="150">
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.invoiceStatus == 1"
              :type="scope.row.invoiceStatus == 1 ? '' : 'primary'"
              plain
              @click.native="markReceivables(scope)">{{ scope.row.invoiceStatus == 1 ? '已开票':'标记为开票' }}</el-button>
          </template>
        </el-table-column>
        <el-table-column />
      </el-table>
      <div class="p-contianer">
        <el-pagination
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size.sync="pageSize"
          :total="total"
          class="p-bar"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </div>
    </div>

    <create
      v-if="isCreate"
      @save-success="refreshList"
      @close="isCreate = false"/>
    <mark-invoice
      :visible.sync="markShow"
      :reset="isResetInvoice"
      :detail="rowDetail"
      @change="refreshList"
    />

    <!-- 相关详情页面 -->
    <c-r-m-all-detail
      :visible.sync="showDview"
      :crm-type="rowType"
      :id="rowID"
      class="d-view"
      @handle="refreshList"/>

    <transfer-handle
      :crm-type="crmType"
      :selection-list="selectionList"
      :dialog-visible.sync="transferDialogShow"
      @handle="refreshList" />
  </div>
</template>

<script>
import {
  crmInvoiceIndexAPI,
  crmInvoiceDeleteIdsAPI
} from '@/api/customermanagement/invoice'

import XrHeader from '@/components/xr-header'
import XrTableHeader from '@/components/xr-table-header'
import Create from './Create'
import MarkInvoice from './components/MarkInvoice'
import { XhUserCell } from '@/components/CreateCom'
import TransferHandle from '../components/selectionHandle/TransferHandle' // 转移
import CRMAllDetail from '@/views/customermanagement/components/CRMAllDetail'

import CheckStatusMixin from '@/mixins/CheckStatusMixin'
import moment from 'moment'
import { debounce } from 'throttle-debounce'
import { mapGetters } from 'vuex'

export default {
  name: 'Invoice', // 发票
  components: {
    XrHeader,
    XrTableHeader,
    Create,
    MarkInvoice,
    XhUserCell,
    TransferHandle,
    CRMAllDetail
  },
  mixins: [CheckStatusMixin],
  props: {},
  data() {
    return {
      loading: false,
      crmType: 'invoice',
      tableHeight: document.documentElement.clientHeight - 235, // 表的高度
      filterParams: {
        invoiceStatus: '',
        invoiceNumber: '',
        logisticsNumber: '',
        customerName: '',
        realInvoiceDate: moment().format('YYYY-MM-DD'),
        checkStatus: '',
        ownerUserId: []
      },
      filterCustomers: {
        customer: [],
        purposecustomer: []
      },
      list: [],
      fieldList: [{
        label: '发票申请编号',
        width: '120px',
        prop: 'invoiceApplyNumber'
      }, {
        label: '客户名称',
        width: '120px',
        prop: 'customerName'
      }, {
        label: '合同编号',
        width: '120px',
        prop: 'contractNum'
      }, {
        label: '合同金额',
        width: '90px',
        prop: 'contractMoney'
      }, {
        label: '开票金额（元）',
        width: '120px',
        prop: 'invoiceMoney'
      }, {
        label: '开票日期',
        width: '120px',
        prop: 'invoiceDate'
      }, {
        label: '实际开票日期',
        width: '120px',
        prop: 'realInvoiceDate'
      }, {
        label: '开票类型',
        width: '120px',
        prop: 'invoiceType'
      }, {
        label: '发票号码',
        width: '90px',
        prop: 'invoiceNumber'
      }, {
        label: '物流单号',
        width: '90px',
        prop: 'logisticsNumber'
      }, {
        label: '负责人',
        width: '90px',
        prop: 'ownerUserName'
      }, {
        label: '审核状态',
        width: '90px',
        prop: 'checkStatus'
      }], // invoice_status
      currentPage: 1,
      pageSize: 15,
      pageSizes: [15, 30, 60, 100],
      total: 0,
      selectionList: [], // 勾选数据 用于全局导出
      isCreate: false,
      rowDetail: {},
      markShow: false,
      isResetInvoice: false,
      transferDialogShow: false,
      showDview: false,
      rowType: '',
      rowID: ''
    }
  },
  computed: {
    ...mapGetters(['crm']),
    handles() {
      const temps = []
      if (this.crm && this.crm[this.crmType]) {
        if (this.crm[this.crmType].delete) {
          temps.push({
            label: '删除',
            command: 'delete',
            icon: 'delete'
          })
        }

        if (this.crm[this.crmType].resetInvoiceStatus && this.selectionList.length == 1) {
          temps.push({
            label: '重置开票信息',
            command: 'reset',
            icon: 'reset'
          })
        }

        if (this.crm[this.crmType].transfer) {
          temps.push({
            name: '转移',
            type: 'transfer',
            icon: 'transfer'
          })
        }
      }
      return temps
    },
    // 是否能操作
    canUpdateStatus() {
      return this.crm && this.crm[this.crmType] && this.crm[this.crmType].resetInvoiceStatus
    }
  },
  watch: {},
  created() {
    // 控制table的高度
    window.onresize = () => {
      this.tableHeight = document.documentElement.clientHeight - 235
    }

    this.debouncedRefreshList = debounce(500, () => {
      this.refreshList()
    })
    this.refreshList()
  },

  beforeDestroy() {},
  methods: {
    /**
     * 刷新
     */
    refreshList() {
      this.handleCurrentChange(1)
    },

    /**
     * 更改每页展示数量
     */
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },

    /**
     * 更改当前页数
     */
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },

    /**
     * 获取列表
     */
    getList() {
      const params = {
        page: this.currentPage,
        limit: this.pageSize
      }

      params.invoiceStatus = this.filterParams.invoiceStatus
      params.invoiceNumber = this.filterParams.invoiceNumber
      params.customerName = this.filterParams.customerName
      params.realInvoiceDate = this.filterParams.realInvoiceDate
      params.checkStatus = this.filterParams.checkStatus

      params.ownerUserId = this.filterParams.ownerUserId && this.filterParams.ownerUserId.length ? this.filterParams.ownerUserId[0].userId : ''

      crmInvoiceIndexAPI(params)
        .then(res => {
          this.list = res.data.list
          this.total = res.data.totalRow
          this.loading = false

          this.$nextTick(() => {
            document.querySelector('.el-table__body-wrapper').scrollTop = 1
          })
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 格式化字段
     */
    fieldFormatter(row, column, cellValue) {
      if (column.property == 'invoiceType') {
        return {
          1: '增值税专用发票',
          2: '增值税普通发票',
          3: '国税通用机打发票',
          4: '地税通用机打发票',
          5: '收据'
        }[row[column.property]]
      }
      return row[column.property] || '--'
    },

    // 0待审核、1审核中、2审核通过、3已拒绝 4已撤回 5未提交
    getStatusStyle(status) {
      return {
        backgroundColor: this.getStatusColor(status)
      }
    },

    /**
     * 开票操作
     */
    markReceivables(scope) {
      this.rowDetail = scope.row
      this.isResetInvoice = false
      this.markShow = true
    },

    /**
     * 改变负责人筛选条件
     */
    changeUserCell(data) {
      this.filterParams.ownerUserId = data.value
      this.refreshList()
    },

    /**
     * 表头勾选
     */
    handleSelectionChange(val) {
      console.log('handleSelectionChange', val)
      this.selectionList = val // 勾选的行
    },

    /**
     * 列表操作
     */
    handleCommand(command) {
      if (command == 'delete') {
        this.$confirm('确定要删除吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            var ids = this.selectionList.map(item => {
              return item.invoiceId
            })
            this.loading = true
            crmInvoiceDeleteIdsAPI({
              invoiceIds: ids
            })
              .then(res => {
                this.loading = false
                this.$message({
                  type: 'success',
                  message: '删除成功'
                })
                this.refreshList()
              })
              .catch(() => {
                this.loading = false
              })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
      } else if (command == 'transfer') {
        this.transferDialogShow = true
      } else {
        this.rowDetail = this.selectionList[0]
        this.isResetInvoice = false
        this.markShow = true
      }
    },

    /**
     * 通过回调控制class
     */
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'invoiceApplyNumber') {
        return 'can-visit--underline can-visit--bold'
      } else if (
        column.property === 'customerName' ||
        column.property === 'contractNum'
      ) {
        return 'can-visit--underline'
      } else {
        return ''
      }
    },

    headerCellClassName({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'invoiceApplyNumber') {
        return 'header-can-visit-backgroud'
      }
      return ''
    },

    /**
     * 查看详情
     */
    handleRowClick(row, column, event) {
      if (column.property === 'customerName') {
        this.rowID = row.customerId
        this.rowType = 'customer'
        this.showDview = true
      } else if (column.property === 'contractNum') {
        this.rowID = row.contractId
        this.rowType = 'contract'
        this.showDview = true
      } else if (column.property === 'invoiceApplyNumber') {
        this.rowID = row.invoiceId
        this.rowType = 'invoice'
        this.showDview = true
      }
    },

    /**
     * 创建点击
     */
    createClick() {
      this.isCreate = true
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .xr-table-header {
  border-bottom: 1px solid #e6e6e6;
  border-top: 1px solid #e6e6e6;
  .xr-table-header__body {
    .el-input,
    .el-date-editor,
    .el-select {
      width: 150px;
      margin-right: 10px;
    }

    .user-container {
      width: 120px;
    }
  }
}

.status-mark {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: $xr-border-radius-base;
}
</style>
