<template>
  <div>
    <c-r-m-list-head
      :search.sync="search"
      :crm-type="crmType"
      title="教室管理"
      placeholder="请输入教室名称/教室状态"
      main-title="添加教室"
      @create-room="createClick"
      @on-handle="listHeadHandle"
      @on-search="crmSearch"
      @on-export="exportInfos"/>
    <div
      v-empty="!education.classroom.index"
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

    <create-classroom
      v-if="showHandleView"
      :handle="rowInfo"
      @save="getDataList"
      @hiden-view="showHandleView=false" />
  </div>
</template>

<script>
import CreateClassroom from './components/CreateClassroom'

import table from '../mixins/table'

export default {
  /** 教务管理 的 教室列表 */
  name: 'ClassroomIndex',
  components: {
    CreateClassroom
  },
  mixins: [table],
  data() {
    return {
      crmType: 'classroom',
      showHandleView: false,
      rowInfo: null
    }
  },
  mounted() {},
  methods: {
    // 重新获取列表
    getDataList() {
      this.getList()
    },

    createClick() {
      console.log('object')
      this.rowInfo = {
        action: 'add', // save 创建  update 编辑
        data: null // 编辑数据
      }
      this.showHandleView = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../customermanagement/styles/table.scss';
</style>
