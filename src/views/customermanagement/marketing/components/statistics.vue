<template>
  <div class="b-cont">
    <div class="header">
      <div class="header-select">
        状态<el-select
          v-model="type"
          class="type-select"
          placeholder="请选择"
          @change="refreshList">
          <el-option
            v-for="(item, index) in [{ name: '全部', value: 'all' }, { name: '未同步', value: 0 }, { name: '同步成功', value: 1 }, { name: '同步失败', value: 2 }]"
            :key="index"
            :label="item.name"
            :value="item.value"/>
        </el-select>
      </div>
      <div class="header-handle">
        <span class="header-handle-tips">提示：不勾选数据提交更新，默认提交列表全部数据。</span>
        <div class="header-handle-button">
          <el-button
            type="primary"
            @click="syncDataClick()">同步到客户</el-button>
          <el-button
            type="primary"
            @click="exportDataClick()">导出</el-button>
        </div>
      </div>
      <div class="table-content">
        <el-table
          :data="list"
          :height="tableHeight"
          :cell-style="cellStyle"
          stripe
          border
          highlight-current-row
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column
            show-overflow-tooltip
            type="selection"
            align="center"
            width="55"/>
          <el-table-column
            :formatter="fieldFormatter"
            show-overflow-tooltip
            label="同步状态"
            prop="status"
            width="120"/>
          <el-table-column
            v-for="(item, index) in fieldList"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            :width="item.width"
            :formatter="fieldFormatter"
            show-overflow-tooltip/>
          <el-table-column/>
        </el-table>
        <div class="p-contianer">
          <el-pagination
            :current-page="currentPage"
            :page-sizes="pageSizes"
            :page-size.sync="pageSize"
            :total="total"
            class="p-bar"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"/>
        </div>
      </div>
    </div>
    <sync
      :dialog-visible.sync="showSyncView"
      :field-list="syncFieldList"
      :id="id"
      @sure="syncSureClick"/>
  </div>
</template>

<script>
import {
  crmMarketingCensusAPI,
  crmMarketingSynchroFieldAPI,
  crmMarketingExcelExportAPI,
  crmMarketingSynchroAPI
} from '@/api/customermanagement/marketing'
import { filedGetTableField } from '@/api/customermanagement/common'
import loading from '../../mixins/loading'
import Sections from '../../components/Sections'
import Sync from './sync'

import marketing from './marketing'

export default {
  /** 推广管理 的 统计*/
  name: 'Statistics',
  components: {
    Sections,
    Sync
  },
  mixins: [loading, marketing],
  props: {
    /** 模块ID */
    id: [String, Number],
    /** 详情 */
    detail: Object,
    /** 没有值就是全部类型 有值就是当个类型 */
    crmType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 筛选类型
      type: 'all',
      fieldList: [],
      list: [],
      selectionList: [],
      /** 格式化规则 */
      formatterRules: {},

      tableHeight: document.documentElement.clientHeight - 425,

      currentPage: 1,
      pageSize: 15,
      pageSizes: [15, 30, 45, 60],
      total: 0,

      // 同步控制
      showSyncView: false,
      syncFieldList: []
    }
  },
  computed: {},
  watch: {
    detail() {
      this.getFieldList()
    }
  },
  mounted() {
    this.getFieldList()
  },
  activated: function() {},
  deactivated: function() {},
  methods: {
    /** 获取字段 */
    getFieldList() {
      if (!this.detail) {
        return
      }
      this.loading = true
      filedGetTableField({
        label: this.detail.crmType
      })
        .then(res => {
          const showFieldsStr = this.detail.fieldDataId || ''

          const showFields = showFieldsStr.split(',').map(item => {
            return parseInt(item)
          })

          for (let index = 0; index < res.data.length; index++) {
            const element = res.data[index]
            if (this.isShowField(element.formType) && showFields.includes(element.fieldId)) {
              var width = 0
              if (!element.width) {
                if (element.name && element.name.length <= 6) {
                  width = element.name.length * 15 + 45
                } else {
                  width = 140
                }
              } else {
                width = element.width
              }

              this.fieldList.push({
                prop: element.fieldName,
                label: element.name,
                width: width
              })
            }
          }

          // 获取好字段开始请求数据
          this.getList()
        })
        .catch(() => {
          this.loading = false
        })
    },

    /** 格式化字段 */
    fieldFormatter(row, column) {
      // 如果需要格式化
      var aRules = this.formatterRules[column.property]
      if (aRules) {
        if (aRules.type === 'crm') {
          if (column.property) {
            return aRules.formatter(row[column.property + '_info']) || '--'
          } else {
            return ''
          }
        } else {
          return aRules.formatter(row[column.property]) || '--'
        }
      } else {
        if (column.property == 'status') {
          const status = row[column.property]
          if (status == 0) {
            return '未同步'
          } else if (status == 1) {
            return '同步成功'
          } else if (status == 2) {
            return '同步失败'
          }
        }
      }
      return row[column.property] || '--'
    },

    // 获取基础信息
    getList() {
      this.loading = true
      crmMarketingCensusAPI({
        page: this.currentPage,
        limit: this.pageSize,
        marketingId: this.id,
        type: this.type
      })
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
     * 刷新列表
     */
    refreshList() {
      this.currentPage = 1
      this.getList()
    },

    // 更改每页展示数量
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    // 更改当前页数
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },

    /** 勾选操作 */
    // 当选择项发生变化时会触发该事件
    handleSelectionChange(val) {
      this.selectionList = val // 勾选的行
    },

    /** 通过回调控制style */
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'status') {
        const status = row[column.property]
        if (status == 0) {
          return { color: '#999' }
        } else if (status == 1) {
          return { color: '#33D555' }
        } else if (status == 2) {
          return { color: '#F84F4F' }
        }
      } else {
        return ''
      }
    },

    /**
     * 同步 和 导出操作
     */
    syncDataClick() {
      // if (this.selectionList.length == 0) {
      //   this.$message.error('请先勾选数据')
      // } else {
      this.loading = true
      crmMarketingSynchroFieldAPI({
        marketingId: this.id
      })
        .then(res => {
          this.loading = false
          if (res.data.length > 0) {
            this.syncFieldList = res.data
            this.showSyncView = true
          } else {
            this.submiteSyncData()
          }
        })
        .catch(() => {
          this.loading = false
        })
      // }
    },

    /**
     * 同步确定
     */
    syncSureClick(list) {
      const params = {}
      let submite = true
      for (let index = 0; index < list.length; index++) {
        const element = list[index]
        if (!element.value || element.value == '' || element.value == []) {
          this.$message.error('请完善' + element.name)
          submite = false
          break
        } else {
          params[element.fieldName] = element.value
        }
      }

      if (submite) {
        this.submiteSyncData(params)
      }
    },

    /**
     * 同步请求
     */
    submiteSyncData(params) {
      this.loading = true
      if (!params) {
        params = {}
      }
      params.id = this.id
      params.rIds = this.selectionList.map(item => {
        return item.rId
      })
      crmMarketingSynchroAPI(params)
        .then(res => {
          this.loading = false
          this.$message.success(res.data)
          if (this.showSyncView) {
            this.showSyncView = false
          }
        })
        .catch(() => {
          this.loading = false
        })
    },

    exportDataClick() {
      var params = {
        id: this.id,
        type: this.type
      }

      // 勾选导出
      if (this.selectionList.length) {
        params.rIds = this.selectionList.map(item => {
          return item.rId
        })
      }
      crmMarketingExcelExportAPI(params)
        .then(res => {
          var blob = new Blob([res.data], {
            type: 'application/vnd.ms-excel;charset=utf-8'
          })
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(blob) // 创建下载的链接
          downloadElement.href = href
          downloadElement.download =
            decodeURI(
              res.headers['content-disposition'].split('filename=')[1]
            ) || '' // 下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.b-cont {
  position: relative;
  padding: 15px;
}

.header {
  &-select {
    .el-select {
      margin-left: 18px;
    }
  }

  &-handle {
    line-height: 30px;
    &-tips {
      color: #999;
      font-size: 12px;
    }
    &-button {
      float: right;
    }
  }
}

.table-content {
  padding-top: 20px;
}

.p-contianer {
  position: relative;
  background-color: white;
  height: 44px;

  .p-bar {
    float: right;
    margin: 5px 50px 0 0;
    font-size: 14px !important;
  }
}

.table-head-name {
  font-size: 14px;
  color: #475059;
  line-height: 23px;
  padding: 0;
}
</style>
