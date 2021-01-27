<!--
 * @Description: 悟空软件
 * @Author: 悟空
 * @Date: 2020-06-04 19:34:30
 * @LastEditTime: 2020-07-16 20:06:10
 * @LastEditors: 悟空
-->
<template>
  <el-dialog
    :visible="show"
    :append-to-body="true"
    :close-on-click-modal="false"
    top="10vh"
    width="80%"
    custom-class="no-padding-dialog"
    @close="hideView">

    <div
      slot="title"
      class="header"
      @click="showDview = false">
      <span class="title">开班列表</span>
      <!-- <el-input
        v-if="placeholder"
        :placeholder="placeholder"
        v-model="inputContent"
        class="search-input"
        @keyup.enter.native="searchInput">
        <el-button
          slot="append"
          icon="el-icon-search"
          @click.native="searchInput" />
      </el-input> -->
    </div>

    <div class="container">
      <div class="content">
        <div class="list-body">
          <el-table
            v-loading="loading"
            id="crm-table"
            ref="crmTable"
            :data="list"
            :height="tableHeight"
            :cell-class-name="cellClassName"
            stripe
            border
            highlight-current-row
            style="width: 100%"
            @row-click="handleRowClick"
            @sort-change="sortChange">
            <el-table-column
              v-for="(item, index) in showFieldList"
              :key="index"
              :sortable="sortable"
              :fixed="index==0"
              :prop="item.prop"
              :label="item.label"
              :width="item.width"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <template>{{ fieldFormatter(scope.row, scope.column) }}</template>
              </template>
            </el-table-column>
            <el-table-column v-if="showFillColumn"/>
          </el-table>
          <div
            class="p-contianer">
            <el-pagination
              :current-page="currentPage"
              :page-sizes="pageSizes"
              :page-size.sync="pageSize"
              :total="total"
              class="p-bar"
              background
              layout="prev, pager, next, sizes, total, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange" />
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
// import { crmTeacherOpenClassList } from '@/api/educationmanage/teacherSchedule'
import Lockr from 'lockr'
export default {
  name: 'ClassList',
  props: {
    currentId: [Number, String],
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      inputContent: '',

      loading: false, // 加载动画
      tableHeight: this.getTableHeight(), // 表的高度
      list: [],
      showFieldList: [
        { prop: 'deptName', label: '中心' }
      ],
      sortable: false,
      sortData: {}, // 字段排序
      currentPage: 1,
      pageSize: Lockr.get('crmPageSizes') || 15,
      pageSizes: [15, 30, 60, 100],
      total: 0
    }
  },
  computed: {
    showFillColumn() {
      if (this.fieldList && this.fieldList.length) {
        return false
      }
      return true
    }
  },
  watch: {
    currentId(value) {
      if (value) {
        this.getList()
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    /**
     * 获取表高
     */
    getTableHeight() {
      const clientHeight = document.documentElement.clientHeight
      const paddingHieght = clientHeight * 0.2

      return clientHeight - paddingHieght - 200
    },

    /**
     * 通过回调控制class
     */
    cellClassName({ row, column, rowIndex, columnIndex }) {

    },

    handleRowClick(row, column, event) {

    },

    /**
     * 获取列表数据
     */
    getList() {
      this.loading = true
      // var params = this.countData.params
      // if (this.inputContent) {
      //   params.search = this.inputContent
      // }

      // if (this.sortData.order) {
      //   params.sortField = this.sortData.prop
      //   params.order = this.sortData.order == 'ascending' ? 2 : 1
      // }
      // const params = {
      //   limit: this.pageSize,
      //   page: this.currentPage,
      //   subjectTeacherId: this.currentId
      // }

      // crmTeacherOpenClassList(params)
      //   .then(res => {
      //     this.list = res.data.list
      //     this.total = res.data.totalRow
      //     this.loading = false
      //   })
      //   .catch(() => {
      //     this.loading = false
      //   })
    },

    /**
     * 搜索
     */
    searchInput() {
      this.currentPage = 1
      this.getList()
    },

    /**
     * 格式化字段
     */
    fieldFormatter(row, column) {
      // 如果需要格式化
      // if (this.fieldList && this.fieldList.length) {
      //   if (column.property == 'crmType') {
      //     return crmTypeModel.convertTypeToName(row[column.property])
      //   }
      // }
      return row[column.property] || '--'
    },

    /**
     * 字段排序
     */
    sortChange(column, prop, order) {
      this.sortData = column
      this.getList()
    },

    /**
     * 更改每页展示数量
     */
    handleSizeChange(val) {
      Lockr.set('crmPageSizes', val)
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
     * 隐藏视图
     */
    hideView() {
      this.inputContent = ''
      this.$emit('update:show', false)
      this.$emit('hide')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../../../styles/table.scss';

/** 容器布局 */
.container {
  height: 100%;
}

.content {
  position: relative;
  height: 100%;
  padding: 0 15px 15px;
}

.header {
  position: relative;
  padding: 10px 20px 10px 0;

  .title {
    font-size: 16px;
    color: #333;
    font-weight: 600;
  }
  .search-input {
    width: 300px;
    margin: -18px 0 0 -150px;
    position: absolute;
    left: 50%;
    top: 50%;
  }
}

.p-contianer {
  border: 1px solid $xr-border-line-color;
  border-top: none;
}

.d-view {
  top: 0;
}
</style>


