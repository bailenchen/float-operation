<template>
  <el-dialog
    :visible="show"
    :append-to-body="true"
    top="10vh"
    width="80%"
    custom-class="no-padding-dialog"
    @close="hideView">

    <div
      slot="title"
      class="header"
      @click="closeDetail">
      <span class="title">{{ title }}</span>
      <el-input
        v-if="placeholder"
        :placeholder="placeholder"
        v-model="inputContent"
        class="search-input"
        @keyup.enter.native="searchInput">
        <el-button
          slot="append"
          icon="el-icon-search"
          @click.native="searchInput" />
      </el-input>
    </div>

    <div class="container">
      <div class="content">
        <div class="list-body">
          <el-table
            v-loading="loading"
            id="crm-table"
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
                <template v-if="item.prop == 'dealStatus'">
                  <i :class="scope.row[item.prop] | dealIcon"/>
                  <span>{{ scope.row[item.prop] | dealName }}</span>
                </template>
                <template v-else-if="item.prop == 'checkStatus'">
                  <span
                    :style="{
                      backgroundColor: getStatusColor(scope.row.checkStatus)
                  }" class="status-mark"/>
                  <span>{{ getStatusName(scope.row.checkStatus) }}</span>
                </template>
                <template v-else>{{ fieldFormatter(scope.row, scope.column) }}</template>
              </template>
            </el-table-column>
            <el-table-column v-if="showFillColumn" />
          </el-table>
          <div
            v-if="showPagination"
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
<script type="text/javascript">
import { journalQueryBulletinByTypeAPI } from '@/api/oamanagement/journal'

import Lockr from 'lockr'
import CheckStatusMixin from '@/mixins/CheckStatusMixin'

export default {
  name: 'ReportList', // 简报列表
  components: {},
  filters: {
    dealIcon(statu) {
      return statu == 1 ? 'wk wk-success deal-suc' : 'wk wk-close deal-un'
    },

    dealName(statu) {
      return statu == 1 ? '已成交' : '未成交'
    }
  },
  mixins: [CheckStatusMixin],
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: String,
    placeholder: {
      type: String,
      default: '请输入搜索内容'
    },
    id: String,
    crmType: String,
    type: String //  1 客户 2 商机 3 合同 4 回款 5 跟进记录
  },
  data() {
    return {
      inputContent: '',

      loading: false, // 加载动画
      tableHeight: this.getTableHeight(), // 表的高度
      list: [],
      showFieldList: [],
      sortData: {}, // 字段排序
      currentPage: 1,
      pageSize: Lockr.get('crmPageSizes') || 15,
      pageSizes: [15, 30, 60, 100],
      total: 0,

      /** 控制详情展示 */
      rowID: '', // 行信息
      rowType: '', // 详情类型
      showDview: false
    }
  },
  computed: {
    sortable() {
      return false // 'custom'
    },
    showFillColumn() {
      return true
    },
    showPagination() {
      return true
    }
  },
  watch: {
    show(value) {
      if (value) {
        this.initInfo()
      }
    }
  },
  mounted() {},

  destroyed() {},
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
     * 初始化数据
     */
    initInfo() {
      this.inputContent = ''
      this.showFieldList = []
      this.sortData = {}
      this.currentPage = 1

      window.onresize = () => {
        this.tableHeight = this.getTableHeight()
      }

      this.getList()
    },

    /**
     * 搜索
     */
    searchInput() {
      this.currentPage = 1
      this.getList()
    },

    /**
     * 获取列表数据
     */
    getList() {
      this.loading = true
      var params = {
        page: this.currentPage,
        limit: this.pageSize,
        search: this.inputContent,
        type: this.type,
        logId: this.id
      }

      if (this.sortData.order) {
        params.sortField = this.sortData.prop
        params.order = this.sortData.order == 'ascending' ? 2 : 1
      }

      journalQueryBulletinByTypeAPI(params)
        .then(res => {
          this.list = res.data.list
          this.total = res.data.totalRow
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },


    /**
     * 格式化字段
     */
    fieldFormatter(row, column) {
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
     * 查看详情
     */
    handleRowClick(row, column, event) {
      this.$emit('row-click', row, column, event)
    },

    /**
     * 详情操作
     */
    handleHandle(data) {
      if (
        data.type === 'alloc' ||
        data.type === 'get' ||
        data.type === 'transfer' ||
        data.type === 'transform' ||
        data.type === 'delete' ||
        data.type === 'put_seas'
      ) {
        this.showDview = false
      }

      if (data.type !== 'edit') {
        this.getList()
      }
    },

    /**
     * 通过回调控制class
     */
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (
        this.crmType &&
        (column.property === 'customerName' ||
          column.property === 'businessName' ||
          (this.crmType != 'contract' && column.property === 'name') ||
          column.property === 'contactsName' ||
          column.property === 'num' ||
          column.property === 'contractNum' ||
          column.property === 'number' ||
          (this.crmType === 'record' && column.property === 'count')) &&
        row[column.property]
      ) {
        return 'can-visit--underline'
      } else {
        return ''
      }
    },

    /**
     * 隐藏视图
     */
    hideView() {
      this.$emit('update:show', false)
      this.$emit('hide')
    },

    /**
     * 关闭详情
     */
    closeDetail() {
      this.$emit('close-detail')
    }
  }
}
</script>
<style lang="scss" scoped>

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
