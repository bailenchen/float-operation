<template>
  <div>
    <c-r-m-list-head
      :search.sync="search"
      :crm-type="crmType"
      title="学员排课表"
      placeholder="请输入学员姓名/学员编号/班级类型/教室"
      main-title=""
      @on-handle="listHeadHandle"
      @on-search="crmSearch"
      @on-export="exportInfos"/>
    <div
      v-empty="!education.studentschedule.index"
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
          :formatter="fieldFormatter"
          sortable="custom"
          show-overflow-tooltip/>
        <el-table-column fixed="right" width="90" align="center" label="课时确认">
          <template slot-scope="scope">
            <div :class="{'green': scope.row.classConfirmationType === '确认' }" style="color:red;">{{ scope.row.classConfirmationType }}</div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" width="90" align="center" label="考勤">
          <template slot-scope="scope">
            <div>{{ scope.row.classStatusType }}</div>
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
  /** 教务管理 的 学员排课表列表 */
  name: 'StudentScheduleIndex',
  mixins: [table],
  data() {
    return {
      crmType: 'studentschedule'
    }
  },
  mounted() {},
  methods: {

  }
}
</script>

<style lang="scss" scoped>
@import '../../customermanagement/styles/table.scss';

.green {
  color: #67c23a !important;
}
</style>
