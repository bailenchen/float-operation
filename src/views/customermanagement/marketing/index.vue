<template>
  <div>
    <c-r-m-list-head
      :create-fun="createClick"
      :search.sync="search"
      :crm-type="crmType"
      title="市场活动管理"
      placeholder="请输入活动名称"
      main-title="新建活动"
      @on-handle="listHeadHandle"
      @on-search="crmSearch"/>
    <div
      v-empty="!crm.leads.index"
      xs-empty-icon="nopermission"
      xs-empty-text="暂无权限"
      class="crm-container">
      <c-r-m-table-head
        ref="crmTableHead"
        :crm-type="crmType"
        @filter="handleFilter"
        @handle="handleHandle">
        <div>
          关联对象：<el-select
            v-model="marketingCrmType"
            class="type-select"
            placeholder="请选择"
            @change="refreshList">
            <el-option
              v-for="(item, index) in [{ name: '全部', value: '' }, { name: '客户', value: 2 }, { name: '线索', value: 1 }]"
              :key="index"
              :label="item.name"
              :value="item.value"/>
          </el-select>
        </div>
      </c-r-m-table-head>
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
    <create
      v-if="isCreate"
      @hiden-view="isCreate = false"
      @save-success="refreshList"/>
    <detail
      v-if="showDview"
      :crm-type="rowType"
      :id="rowID"
      @hide-view="showDview = false"
      @handle="handleHandle"/>
  </div>
</template>

<script>
import Create from './components/create'
import Detail from './detail'
import table from '../mixins/table'

export default {
  /** 客户管理 的 活动列表 */
  name: 'Index',

  components: {
    Create,
    Detail
  },

  mixins: [table],

  data() {
    return {
      crmType: 'marketing',
      marketingCrmType: '', // 类型
      isCreate: false // 是创建
    }
  },

  computed: {},

  created() {
    this.fieldList = [
      {
        prop: 'marketingName',
        label: '活动名称',
        width: '150'
      },
      {
        prop: 'crmType',
        label: '关联对象',
        width: '80'
      },
      {
        prop: 'createUserName',
        label: '创建人',
        width: '100'
      },
      {
        prop: 'marketingType',
        label: '活动类型',
        width: '150'
      },
      {
        prop: 'startTime',
        label: '开始时间',
        width: '180'
      },
      {
        prop: 'endTime',
        label: '截止时间',
        width: '180'
      },
      {
        prop: 'marketingMoney',
        label: '活动预算',
        width: '100'
      },
      {
        prop: 'address',
        label: '活动地址',
        width: '180'
      },
      {
        prop: 'updateTime',
        label: '更新时间',
        width: '180'
      },
      {
        prop: 'createTime',
        label: '创建时间',
        width: '180'
      },
      {
        prop: 'status',
        label: '状态',
        width: '80'
      }
    ]
  },

  methods: {
    /**
     * 新建操作
     */
    createClick() {
      this.isCreate = true
    },

    /**
     * 刷新数据
     */
    refreshList() {
      this.currentPage = 1
      this.getList()
    },

    /** 通过回调控制style */
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'marketingName') {
        return 'can-visit--underline'
      } else {
        return ''
      }
    },
    /** 格式化 */
    fieldFormatter(row, column, cellValue) {
      if (column.property === 'status') {
        if (cellValue == 1) {
          return '启用'
        } else if (cellValue == 0) {
          return '停用'
        }
      } else if (column.property === 'crmType') {
        if (cellValue == 1) {
          return '线索'
        } else if (cellValue == 2) {
          return '客户'
        }
      } else {
        return cellValue
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/table.scss';
.type-select {
  width: 180px;
}
</style>
