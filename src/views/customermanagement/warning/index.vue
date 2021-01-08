<template>
  <div>
    <c-r-m-list-head
      :search.sync="search"
      :crm-type="crmType"
      main-title="添加预警"
      title="学员管理"
      placeholder="请输入学员姓名/学习中心"
      @create-warning="createClick"
      @on-handle="listHeadHandle"
      @on-search="crmSearch"
      @on-export="exportInfos"/>
    <div
      v-empty="!crm.student.index"
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
          :sortable="item.prop != 'poolDay' ? 'custom' : false"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <template v-if="item.prop == 'dealStatus'">
              <i :class="scope.row[item.prop] | dealIcon"/>
              <span>{{ scope.row[item.prop] | dealName }}</span>
            </template>
            <template v-else-if="item.prop == 'status'">
              <i
                v-if="scope.row.status == 2"
                class="wk wk-circle-password customer-lock"/>
            </template>
            <template v-else>{{ fieldFormatter(scope.row, scope.column) }}</template>
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
    </div>

    <create-warning
      v-if="showHandleView"
      @save="getDataList"
      @hiden-view="showHandleView=false" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CreateWarning from './components/CreateWarning'
import table from '../mixins/table'

export default {
  /** 客户管理 的 学员列表 */
  name: 'WarningIndex',
  components: {
    CreateWarning
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
      crmType: 'studentWarning',
      showHandleView: false
    }
  },
  computed: {
    ...mapGetters(['CRMConfig'])
  },
  methods: {
    createClick() {
      this.showHandleView = true
    },
    // 重新获取列表
    getDataList() {
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/table';
</style>
