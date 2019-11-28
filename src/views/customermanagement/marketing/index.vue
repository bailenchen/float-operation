<template>
  <div>
    <c-r-m-list-head
      :create-fun="createClick"
      :search.sync="search"
      :crm-type="crmType"
      title="推广管理"
      placeholder="请输入推广名称"
      main-title="新建推广"
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
        <div slot="custom">
          关联对象：<el-select
            v-model="scene_id"
            class="type-select"
            placeholder="请选择"
            @change="refreshList">
            <el-option
              v-for="(item, index) in [{ name: '全部', value: '' }, { name: '客户', value: 1 }, { name: '线索', value: 2 }]"
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
      @hide-view="showDview = false"/>
  </div>
</template>

<script>
import moment from 'moment'
import Create from './components/create'
import Detail from './detail'
import { getDateFromTimestamp } from '@/utils'
import table from '../mixins/table'

export default {
  /** 客户管理 的 推广列表 */
  name: 'Index',

  components: {
    Create,
    Detail
  },

  mixins: [table],

  data() {
    return {
      crmType: 'marketing',
      scene_id: '', // 类型
      isCreate: false // 是创建
    }
  },

  computed: {},

  created() {
    this.fieldList = [
      {
        prop: 'name',
        label: '客户名称',
        width: '150'
      },
      {
        prop: 'object',
        label: '关联对象',
        width: '80'
      },
      {
        prop: 'create_user_id_info',
        label: '创建人',
        width: '150'
      },
      {
        prop: 'end_time',
        label: '截止时间',
        width: '180'
      },
      {
        prop: 'update_time',
        label: '更新时间',
        width: '180'
      },
      {
        prop: 'create_time',
        label: '创建时间',
        width: '180'
      },
      {
        prop: 'state',
        label: '状态',
        width: '80'
      }
    ]

    // 格式方式
    function fieldFormatter(time) {
      if (time == 0 || !time) {
        return ''
      }
      return moment(getDateFromTimestamp(time)).format('YYYY-MM-DD HH:mm:ss')
    }
    this.formatterRules['end_time'] = {
      formatter: fieldFormatter
    }
    this.formatterRules['update_time'] = {
      formatter: fieldFormatter
    }
    this.formatterRules['create_time'] = {
      formatter: fieldFormatter
    }

    this.formatterRules['create_user_id_info'] = {
      formatter: create_user_id => {
        return create_user_id.realname || ''
      }
    }

    this.formatterRules['object'] = {
      formatter: object => {
        if (object == 1) {
          return '客户'
        } else if (object == 2) {
          return '线索'
        }
        return ''
      }
    }

    this.formatterRules['state'] = {
      formatter: state => {
        if (state == 1) {
          return '启用'
        } else if (state == 2) {
          return '停用'
        }
        return ''
      }
    }
  },

  methods: {
    /**
     * 新建操作
     */
    createClick() {
      this.isCreate = true
      console.log('createClick')
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
      if (column.property === 'name') {
        return 'can-visit--underline'
      } else {
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/table.scss';
.type-select {
  width: 65px;
  /deep/ .el-input__inner {
    border-color: white;
  }

  /deep/ .is-focus {
    .el-input__inner {
      border-color: white !important;
    }
  }
}
</style>
