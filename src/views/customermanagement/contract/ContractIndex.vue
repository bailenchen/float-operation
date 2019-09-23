<template>
  <div>
    <c-r-m-list-head
      :search.sync="search"
      :crm-type="crmType"
      title="合同管理"
      placeholder="请输入合同名称"
      main-title="新建合同"
      @on-handle="listHeadHandle"
      @on-search="crmSearch"/>
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
          v-for="(item, index) in fieldList"
          :key="index"
          :fixed="index==0"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="fieldFormatter"
          sortable="custom"
          show-overflow-tooltip/>
        <el-table-column
          :resizable="false"
          show-overflow-tooltip
          prop="checkStatus"
          label="状态"
          width="100"
          fixed="right">
          <template slot-scope="scope">
            <span :style="getStatusStyle(scope.row.checkStatus)" class="status-mark"/>
            <span>{{ getStatusName(scope.row.checkStatus) }}</span>
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
        <span class="money-bar">合同总金额：{{ moneyPageData.contractMoney || 0 }} / 已回款金额：{{ moneyPageData.receivedMoney || 0 }}</span>
      </div>
    </div>
    <!-- 相关详情页面 -->
    <c-r-m-all-detail
      :visible.sync="showDview"
      :crm-type="rowType"
      :id="rowID"
      class="d-view"
      @handle="handleHandle"/>
  </div>
</template>

<script>
import CRMAllDetail from '@/views/customermanagement/components/CRMAllDetail'
import FieldSet from '../components/fieldSet'
import table from '../mixins/table'

export default {
  /** 客户管理 的 合同列表 */
  name: 'ContractIndex',
  components: {
    CRMAllDetail,
    FieldSet
  },
  mixins: [table],
  data() {
    return {
      crmType: 'contract',
      moneyData: null // 合同列表金额
    }
  },
  computed: {
    moneyPageData() {
      // 未勾选展示合同总金额信息
      if (this.selectionList.length == 0 && this.moneyData) {
        return this.moneyData
      } else {
        let contractMoney = 0.0
        let receivedMoney = 0.0
        for (let index = 0; index < this.selectionList.length; index++) {
          const element = this.selectionList[index]
          // 2 审核通过的合同
          if (element.checkStatus == 2) {
            contractMoney += parseFloat(element.money)
            receivedMoney += parseFloat(element.receivedMoney)
          }
        }
        return {
          contractMoney: contractMoney.toFixed(2),
          receivedMoney: receivedMoney.toFixed(2)
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
        column.property === 'businessName' ||
        column.property === 'contactsName'
      ) {
        return 'can-visit--underline'
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/table.scss';
.money-bar {
  color: #99a9bf;
  line-height: 44px !important;
  position: absolute;
  left: 20px;
  top: 0;
}
</style>
