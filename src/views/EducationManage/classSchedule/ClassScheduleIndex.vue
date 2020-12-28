<template>
  <div>
    <c-r-m-list-head
      :search.sync="search"
      :crm-type="crmType"
      title="班级排课表"
      placeholder="请输入中心/教室名称/班级名称"
      main-title=""
      @on-handle="listHeadHandle"
      @on-search="crmSearch"
      @on-export="exportInfos"/>
    <div
      v-empty="!education.classschedule.index"
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
          sortable="custom"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <template>
              <span v-if="item.prop == 'classConfirmationName'" style="color:red;">{{ scope.row[item.prop] }}</span>
              <span v-else>{{ fieldFormatter(scope.row, scope.column) }}</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column/>
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
  </div>
</template>

<script>

import table from '../mixins/table'

export default {
  /** 教务管理 的 班级排课表列表 */
  name: 'ClassScheduleIndex',
  mixins: [table],
  data() {
    return {
      crmType: 'classschedule'
    }
  },
  mounted() {},
  methods: {

  }
}
</script>

<style lang="scss" scoped>
@import '../../customermanagement/styles/table.scss';
</style>
