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
        <el-select
          v-model="filterParams.productType"
          class="product-type"
          placeholder="选择课程类别"
          @change="refreshList">
          <el-option
            v-for="item in [{
              label: '全部',
              value: ''
            },{
              label: '线上',
              value: 1
            },{
              label: '线下',
              value: 2
            }]"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>

        <el-date-picker
          v-model="filterParams.schoolTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择上课日期"
          @change="refreshList"/>

        <el-select
          v-model="filterParams.status"
          placeholder="选择考勤状态"
          @change="refreshList">
          <el-option
            v-for="item in [
              { name: '全部', value: '' },
              { name: '未出勤', value: 0 },
              { name: '已出勤', value: 1 },
              { name: '旷课', value: 2 },
              { name: '请假', value: 3 }
            ]"
            :key="item.value"
            :label="item.name"
            :value="item.value"/>
        </el-select>
      </xr-table-header>
      <el-table
        v-loading="loading"
        id="crm-table"
        :row-height="40"
        :data="list"
        :height="tableHeight"
        use-virtual
        class="n-table--border"
        stripe
        border
        highlight-current-row
        style="width: 100%"
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
          show-overflow-tooltip/>
        <el-table-column
          :resizable="false"
          label="操作"
          fixed="right"
          width="100">
          <template slot-scope="scope">
            <el-button
              :disabled="scope.row.isType == 1"
              type="text"
              @click.native="markReceivables(scope)">{{ scope.row.isType == 1 ? '已开票':'标记为开票' }}</el-button>
          </template>
        </el-table-column>
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
      :detail="rowDetail"
    />
  </div>
</template>

<script>
import {
  crmInvoiceIndexAPI,
  crmMakeAttendanceAPI
} from '@/api/customermanagement/invoice'

import XrHeader from '@/components/xr-header'
import XrTableHeader from '@/components/xr-table-header'
import Create from './Create'
import MarkInvoice from './components/MarkInvoice'

import moment from 'moment'

export default {
  name: 'Invoice', // 发票
  components: {
    XrHeader,
    XrTableHeader,
    Create,
    MarkInvoice
  },
  props: {},
  data() {
    return {
      loading: false,
      tableHeight: document.documentElement.clientHeight - 235, // 表的高度
      filterParams: {
        productType: '',
        status: '',
        schoolTime: moment().format('YYYY-MM-DD'),
        product: []
      },
      filterCustomers: {
        customer: [],
        purposecustomer: []
      },
      list: [],
      handles: [{
        label: '旷课',
        command: 'truant',
        icon: 'zoom-on'
      }, {
        label: '请假',
        command: 'leave',
        icon: 'time'
      }, {
        label: '出勤',
        command: 'attendance',
        icon: 'location'
      }],
      fieldList: [{
        label: '班级编号',
        prop: 'clazzNo'
      }, {
        label: '课程类型',
        prop: 'productType'
      }, {
        label: '课程名称',
        prop: 'productName'
      }, {
        label: '学员姓名',
        prop: 'customerName'
      }, {
        label: '英文名',
        prop: 'englishName'
      }, {
        label: '上课日期',
        prop: 'schoolTime'
      }, {
        label: '上课时间',
        prop: 'startSchoolTime'
      }, {
        label: '出勤状态',
        prop: 'status'
      }, {
        label: '授课老师',
        prop: 'lecturerName'
      }],
      currentPage: 1,
      pageSize: 15,
      pageSizes: [15, 30, 60, 100],
      total: 0,
      selectionList: [], // 勾选数据 用于全局导出
      isCreate: false,
      rowDetail: {},
      markShow: false
    }
  },
  computed: {},
  watch: {},
  mounted() {
    // 控制table的高度
    window.onresize = () => {
      this.tableHeight = document.documentElement.clientHeight - 235
    }

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

      params.productType = this.filterParams.productType
      params.status = this.filterParams.status
      params.schoolTime = this.filterParams.schoolTime
      params.productId = this.filterParams.product && this.filterParams.product.length ? this.filterParams.product[0].productId : ''

      let customerValue = null

      const showTypes = ['customer', 'purposecustomer']
      for (let index = 0; index < showTypes.length; index++) {
        const key = showTypes[index]
        const tempValue = this.filterCustomers[key]
        if (tempValue && tempValue.length > 0) {
          customerValue = tempValue[0]
        }
      }

      if (customerValue) {
        params.customerId = customerValue ? customerValue.customerId : ''
      }

      crmInvoiceIndexAPI(params)
        .then(res => {
          console.log('res---', res)
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
     * 开票操作
     */
    markReceivables(scope) {
      this.rowDetail = scope.row
      this.markShow = true
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
      //  0.未出勤 1 已出勤 2.旷课 3.请假'
      this.loading = true
      crmMakeAttendanceAPI({
        status: {
          truant: 2,
          leave: 3,
          attendance: 1
        }[command],
        ids: this.selectionList.map(item => item.makeId).join(',')
      })
        .then(res => {
          this.getList()
        })
        .catch(() => {
          this.loading = false
        })
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
    .el-date-editor,
    .el-select {
      width: 150px;
      margin-right: 10px;
    }

    .user-container {
      width: 150px;
      margin-right: 10px;
      padding: 0;
    }
  }
}
</style>
