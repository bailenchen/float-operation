<template>
  <div>
    <c-r-m-list-head
      :search.sync="search"
      :is-seas="true"
      title="公海管理"
      placeholder="请输入客户名称/手机/电话"
      main-title="新建客户"
      crm-type="customer"
      @on-handle="listHeadHandle"
      @on-search="crmSearch"
      @on-export="exportInfos"/>
    <div
      v-empty="!crm.pool.index"
      xs-empty-icon="nopermission"
      xs-empty-text="暂无权限"
      class="crm-container">
      <c-r-m-table-head
        ref="crmTableHead"
        :is-seas="isSeas"
        crm-type="customer"
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
          sortable="custom"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="item.prop == 'dealStatus'">
              <i :class="scope.row[item.prop] | dealIcon"/>
              <span>{{ scope.row[item.prop] | dealName }}</span>
            </template>
            <template v-else-if="item.prop == 'poolDay'">
              <div v-if="scope.row.isLock == 0">{{ scope.row.poolDay }}</div>
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
              :is-seas="isSeas"
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
    <customer-detail
      v-if="showDview"
      :id="rowID"
      :is-seas="isSeas"
      class="d-view"
      @handle="handleHandle"
      @hide-view="showDview=false"/>
  </div>
</template>

<script>
import CustomerDetail from '../customer/CustomerDetail'
import FieldSet from '../components/fieldSet'
import table from '../mixins/table'

export default {
  /** 客户管理 的 公海列表 */
  name: 'SeacIndex',
  components: {
    CustomerDetail,
    FieldSet
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
      isSeas: true // 是公海
    }
  },
  computed: {},
  mounted() {},
  methods: {
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/table.scss';
</style>
