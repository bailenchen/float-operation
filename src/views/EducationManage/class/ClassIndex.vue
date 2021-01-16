<template>
  <div>
    <c-r-m-list-head
      :search.sync="search"
      :crm-type="crmType"
      title="班级管理"
      placeholder="请输入中心/班级名称/教师名称"
      main-title="添加班级"
      @create-class="createClick"
      @on-handle="listHeadHandle"
      @on-search="crmSearch"
      @on-export="exportInfos"/>
    <div
      v-empty="!education.class.index"
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
          :sortable="item.prop != 'isCourse'"
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

    <create-class
      v-if="showHandleView"
      :handle="rowInfo"
      @save="getDataList"
      @hiden-view="showHandleView=false" />
  </div>
</template>

<script>
import CreateClass from './components/CreateClass'
import table from '../mixins/table'

export default {
  /** 教务管理 的 班级管理列表 */
  name: 'ClassIndex',
  components: {
    CreateClass
  },
  mixins: [table],
  data() {
    return {
      crmType: 'class',
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
