<template>
  <div>
    <c-r-m-list-head
      :search.sync="search"
      :crm-type="crmType"
      title="合同管理"
      placeholder="请输入合同编号/姓名/第一联系人电话"
      main-title="新建合同"
      @on-handle="listHeadHandle"
      @on-search="crmSearch"
      @on-export="exportInfos"/>
    <div
      v-empty="!crm.contract.index"
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
        :row-height="40"
        :data="list"
        :height="tableHeight"
        :cell-class-name="cellClassName"
        :header-cell-class-name="headerCellClassName"
        class="n-table--border"
        use-virtual
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
          v-for="(item, index) in fieldList"
          :key="index"
          :fixed="index==0"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :sortable="item.prop != 'relevanceContractNum'"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="item.prop == 'checkStatus'">
              <!-- <span :style="getStatusStyle(scope.row.checkStatus)" class="status-mark"/> -->
              <span>{{ getStatusNames(scope.row.checkStatus) }}</span>
            </template>
            <template v-else-if="item.prop == 'relevanceContractNum'">
              <span v-if="scope.row['relevanceContractNum']">
                <span
                  v-for="(sitem, sindex) in scope.row['relevanceContractNum']"
                  :key="sindex"
                  @click.stop="enterDetail(sitem)">{{ sitem.num }}
                  <span
                    v-if="sindex != scope.row['relevanceContractNum'].length - 1"
                    style="margin-right:10px;">,</span>
                </span>
              </span>
              <span v-else/>
            </template>
            <template v-else>
              {{ fieldFormatter(scope.row, scope.column) }}
            </template>
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
          :pager-count="5"
          class="p-bar"
          background
          layout="prev, pager, next, sizes, total, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
          <!-- <span class="money-bar">合同总金额：{{ moneyPageData.contractMoney || 0 | separator }} / 已回款金额：{{ moneyPageData.receivedMoney || 0 | separator }} / 未回款金额：{{ moneyPageData.unReceivedMoney || 0 | separator }}</span> -->
      </div>
    </div>
    <!-- 相关详情页面 -->
    <c-r-m-all-detail
      :visible.sync="showDview"
      :crm-type="rowType"
      :click-field="clickField"
      :base-list="baseList"
      :id="rowID"
      class="d-view"
      @handle="handleHandle"/>
  </div>
</template>

<script>
import CRMAllDetail from '@/views/customermanagement/components/CRMAllDetail'

import table from '../mixins/table'
import { floatAdd } from '@/utils'

export default {
  /** 客户管理 的 合同列表 */
  name: 'ContractIndex',
  components: {
    CRMAllDetail
  },
  mixins: [table],
  data() {
    return {
      crmType: 'contract',
      moneyData: null, // 合同列表金额
      baseList: []
    }
  },
  computed: {
    moneyPageData() {
      // 未勾选展示合同总金额信息
      if (this.selectionList.length == 0) {
        if (this.moneyData) {
          const unReceivedMoney = (this.moneyData.contractMoney - this.moneyData.receivedMoney).toFixed(2)
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.moneyData.unReceivedMoney = unReceivedMoney < 0 ? 0 : unReceivedMoney
          return this.moneyData
        }
        return {}
      } else {
        let contractMoney = 0.0
        let receivedMoney = 0.0
        for (let index = 0; index < this.selectionList.length; index++) {
          const element = this.selectionList[index]
          // 1 审核通过的合同
          if (element.checkStatus == 1) {
            contractMoney = floatAdd(contractMoney, parseFloat(element.money))
            receivedMoney = floatAdd(receivedMoney, parseFloat(element.receivedMoney))
          }
        }

        const unReceivedMoney = (contractMoney - receivedMoney).toFixed(2)
        return {
          contractMoney: contractMoney.toFixed(2),
          receivedMoney: receivedMoney.toFixed(2),
          unReceivedMoney: unReceivedMoney < 0 ? 0 : unReceivedMoney
        }
      }
    }
  },
  mounted() {},
  methods: {
    /**
     * 通过回调控制class
     */
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (
        column.property === 'num' ||
        column.property === 'customerName' ||
        column.property === 'leadsNumber' ||
        column.property === 'relevanceContractNum'
      ) {
        return 'can-visit--underline'
      } else if (column.property === 'money') {
        return 'xr-money can-visit--bold'
      } else if (column.property === 'receivedMoney') {
        return 'xr-money green'
      } else if (column.property === 'unreceivedMoney') {
        return 'xr-money red'
      } else {
        return ''
      }
    },

    getStatusNames(status) {
      return {
        0: '待审核',
        1: '通过',
        2: '拒绝',
        3: '审核中',
        4: '撤回',
        5: '未提交',
        6: '创建 ',
        7: '已删除',
        8: '作废',
        9: '家长审核中',
        10: '家长拒绝'
      }[status]
    },

    enterDetail(item) {
      this.rowID = item.contractId
      this.rowType = 'contract'
      this.clickField = 'num'
      this.showDview = true
    },

    headerCellClassName({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'num') {
        return 'header-can-visit-backgroud'
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/table.scss';
</style>
