<template>
  <div>
    <c-r-m-list-head
      :search.sync="search"
      :crm-type="crmType"
      title="客户管理"
      placeholder="请输入客户名称/手机/电话"
      main-title="新建客户"
      @on-handle="listHeadHandle"
      @on-search="crmSearch"
      @on-export="exportInfos"/>
    <div
      v-empty="!crm.customer.index"
      xs-empty-icon="nopermission"
      xs-empty-text="暂无权限"
      class="crm-container">
      <c-r-m-table-head
        ref="crmTableHead"
        :crm-type="crmType"
        @filter="handleFilter"
        @handle="handleHandle"
        @scene="handleScene"/>
      <el-table
        v-loading="loading"
        id="crm-table"
        :data="list"
        :height="tableHeight"
        :cell-class-name="cellClassName"
        class="n-table--border"
        stripe
        border
        highlight-current-row
        style="width: 100%"
        @row-click="handleRowClick"
        @sort-change="sortChange"
        @header-dragend="handleHeaderDragend"
        @selection-change="handleSelectionChange">
        <el-table-column
          show-overflow-tooltip
          type="selection"
          align="center"
          width="55"/>
        <el-table-column
          :resizable="false"
          prop="businessCheck"
          fixed
          label=""
          width="38">
          <template
            slot="header"
            slot-scope="slot">
            <i
              class="wk wk-business"
              style="cursor: not-allowed; color: #9DA9C2;"/>
          </template>
          <template slot-scope="scope">
            <el-popover
              :disabled="scope.row.businessCount == 0"
              :offset="250"
              placement="right"
              popper-class="no-padding-popover"
              width="500"
              trigger="click">
              <business-check
                :data="scope"
                :show="scope.row.show"
                @click="relativeBusinessClick"
                @close="businessClose($event, scope)"/>
              <i
                slot="reference"
                :style="{'opacity' :scope.row.businessCount > 0 ? 1 : 0}"
                class="wk wk-business"
                style="color: #FC6E51"
                @click="businessCheckClick($event, scope)"/>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          v-if="Show"
          :resizable="false"
          prop="call"
          fixed
          label=""
          width="55">
          <template
            slot="header"
            slot-scope="slot">
            <i
              class="el-icon-phone"
              style="cursor: not-allowed; opacity: 0.5;color: #2486E4"/>
          </template>
          <template slot-scope="scope">
            <el-popover
              placement="right"
              width="500"
              popper-class="no-padding-popover"
              trigger="click"
              @show="showData(scope.row.customerId)"
              @hiden="showCount = -1">
              <call-center
                :scope="scope"
                :show="scope.row.customerId === showCount"
                crm-type="customer"
                @changeType="changeCRMType"/>
              <el-button
                slot="reference"
                :style="{'opacity' :scope.$index >= 0 ? 1 : 0}"
                type="primary"
                icon="el-icon-phone"
                circle
                @click.stop="callCheckClick($event,scope,scope.$index)"/>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in fieldList"
          :key="index"
          :fixed="index==0"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          sortable="custom"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="item.prop == 'dealStatus'">
              <i :class="scope.row[item.prop] | dealIcon"/>
              <span>{{ scope.row[item.prop] | dealName }}</span>
            </template>
            <template v-else-if="item.prop == 'poolDay'">
              <div v-if="scope.row.status == 1">{{ scope.row.poolDay }}</div>
              <i
                v-else
                class="wukong wukong-lock customer-lock"/>
            </template>
            <template v-else>{{ fieldFormatter(scope.row, scope.column) }}</template>
          </template>
        </el-table-column>
        <el-table-column/>
        <el-table-column
          :resizable="false"
          fixed="right"
          width="40">
          <template
            slot="header"
            slot-scope="slot">
            <field-set
              :crm-type="crmType"
              @change="setSave"/>
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
          background
          layout="prev, pager, next, sizes, total, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </div>
    </div>
    <!-- 相关详情页面 -->
    <c-r-m-all-detail
      :visible.sync="showDview"
      :crm-type="rowType"
      :model-data="modelData"
      :id="rowID"
      class="d-view"
      @handle="handleHandle"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CRMAllDetail from '@/views/customermanagement/components/CRMAllDetail'
import BusinessCheck from './components/BusinessCheck' // 相关商机
import table from '../mixins/table'
import CallCenter from '@/callCenter/CallCenter'

export default {
  /** 客户管理 的 客户列表 */
  name: 'CustomerIndex',
  components: {
    CRMAllDetail,
    BusinessCheck,
    CallCenter
  },
  filters: {
    dealIcon(statu) {
      return statu == 1 ? 'wk wk-success deal-suc' : 'wk wk-close deal-un'
    },

    dealName(statu) {
      return statu == 1 ? '已成交' : '未成交'
    }
  },
  mixins: [table],
  data() {
    return {
      crmType: 'customer',
      showCount: 0,
      modelData: {}
    }
  },
  computed: {
    ...mapGetters(['CRMConfig']),
    Show() {
      return this.$store.state.customer.isCall
    }
  },
  mounted() {
    this.$nextTick(() => {
      const callOutData = JSON.parse(localStorage.getItem('callOutData'))
      if (callOutData) {
        this.modelData = {
          modelId: callOutData.id,
          model: callOutData.type
        }
      }
    })
  },
  methods: {
    relativeBusinessClick(data) {
      this.rowID = data.businessId
      this.rowType = 'business'
      this.showDview = true
    },

    /**
     * 通过回调控制class
     */
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'customerName') {
        return 'can-visit--underline'
      } else if (column.property === 'businessCheck') {
        return 'can-visit'
      } else {
        return ''
      }
    },
    // 商机信息查看
    businessCheckClick(e, scope) {
      if (scope.row.businessCount == 0) {
        return
      }

      const popoverEl = e.target.parentNode
      this.$set(scope.row, 'show', !scope.row.show)
      popoverEl.__vue__.showPopper = !scope.row.show
    },
    businessClose(e, scope) {
      const popoverEl = e.parentNode
      popoverEl.__vue__.showPopper = false
      this.$set(scope.row, 'show', false)
    },
    /**
       * pover 显示时触发
       */
    showData(val) {
      this.showCount = val
    },
    /**
       * 查看详情
       * @param val
       */
    changeCRMType(val) {
      this.rowType = val.type
      this.rowID = val.id

      this.modelData = {
        modelId: val.id,
        model: val.type
      }

      this.showDview = true

      let callOutData = {
        modelId: val.id,
        model: val.type
      }
      callOutData = JSON.stringify(callOutData)
      localStorage.setItem('callOutData', callOutData)
    },
    /** 解决povper重复的bug */
    callCheckClick(e, scope) {
      this.list.forEach(item => {
        this.$set(item, 'callShow', false)
      })
      this.$set(scope.row, 'callShow', !scope.row.callShow)
      const popoverEl = e.target.parentNode
      popoverEl.__vue__.showPopper = !scope.row.callShow
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/table.scss';
</style>
