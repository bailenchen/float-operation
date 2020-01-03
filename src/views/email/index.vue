<template>
  <div class="main">
    <email-list-head
      :search.sync="search"
      :email-type="emailType"
      :title="sideNavTitle"
      placeholder="搜索邮件"
      @on-search="emailSearch">
      <template>
        <div v-if="emailType == 'receive'" slot="header" class="record-receive">
          （收件箱有<span class="blue-font">0</span>封未读）
          <span class="blue-font">全部标为已读</span>
        </div>
      </template>
      <template slot="emailbtn">
        <el-button type="primary" @click="createEmail">新建邮件</el-button>
      </template>
    </email-list-head>
    <div class="email-container">
      <email-table-head
        ref="crmTableHead"
        :operat-list="tableHeadList"
        :email-type="emailType"
        @change="operatList"/>
      <table border="0px" cellpadding="0px" cellspacing="0">
        <thead>
          <tr class="table-row">
            <td class="tb-head border-bottom" width="55px">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange"/>
            </td>
            <td class="tb-head border-bottom" width="55px">
              <i
                class="wk wk-focus-on"
                style="cursor: not-allowed; color: #9DA9C2;"/>
            </td>
            <td class="tb-head border-bottom" width="55px">
              <i
                class="wk wk-focus-on"
                style="cursor: not-allowed; color: #9DA9C2;"/>
            </td>
            <td class="tb-head border-bottom" width="55px">
              <i
                class="wk wk-email"
                style="cursor: not-allowed; color: #9DA9C2;"/>
            </td>
            <td class="tb-h-align head-font-color border-bottom">
              发件人
            </td>
            <td class="tb-h-align head-font-color border-bottom">
              主题
            </td>
            <td class="tb-h-align head-font-color end-column border-bottom">
              时间
            </td>
          </tr>
        </thead>
        <tbody>
          <tr class="table-row">
            <span class="row-title">今天<span class="number">3</span>封</span>
          </tr>
          <tr v-for="(item, index) in lists" :key="index" class="table-row" @click.stop="clickRow(item, index)">
            <td class="tb-head" width="55px">
              <el-checkbox @change="handleCheckedCitiesChange"/>
            </td>
            <td class="tb-head" width="55px">
              <i
                class="wk wk-focus-on"
                style="cursor: not-allowed; color: #9DA9C2;"/>
            </td>
            <td class="tb-head" width="55px">
              <i
                class="wk wk-focus-on"
                style="cursor: not-allowed; color: #9DA9C2;"/>
            </td>
            <td class="tb-head" width="55px">
              <i
                class="wk wk-email"
                style="cursor: not-allowed; color: #9DA9C2;"/>
            </td>
            <td class="tb-h-align font-color">
              {{ item.send }}
            </td>
            <td class="tb-h-align font-color">
              {{ item.subject }}
            </td>
            <td class="tb-h-align font-color end-column">
              {{ item.time }}
            </td>
          </tr>
          <tr class="table-row">
            <span class="row-title">今天<span class="number">3</span>封</span>
          </tr>
        </tbody>
      </table>
      <el-table
        id="crm-table"
        :data="list"
        :height="tableHeight"
        :cell-class-name="cellClassName"
        :span-method="arraySpanMethod"
        class="n-table--border"
        stripe
        border
        highlight-current-row
        style="width: 100%"
        @selection-change="handleSelectionChange"
        @row-click="handleRowClick">
        <!-- v-loading="loading"
        @header-dragend="handleHeaderDragend" -->
        <el-table-column
          show-overflow-tooltip
          type="selection"
          align="center"
          width="55"/>
        <el-table-column
          :resizable="false"
          align="center"
          fixed
          width="55">
          <template slot="header" slot-scope="slot">
            <i
              class="wk wk-focus-on"
              style="cursor: not-allowed; color: #9DA9C2;"/>
          </template>
        </el-table-column>
        <el-table-column
          :resizable="false"
          align="center"
          fixed
          width="55">
          <template slot="header" slot-scope="slot">
            <i
              class="wk wk-focus-on"
              style="cursor: not-allowed; color: #9DA9C2;"/>
          </template>
        </el-table-column>
        <el-table-column
          :resizable="false"
          align="center"
          fixed
          width="55">
          <template slot="header" slot-scope="slot">
            <i
              class="wk wk-email"
              style="cursor: not-allowed; color: #9DA9C2;"/>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in fieldList"
          :key="index"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <!-- 行标题 <span class="row-title">今天<span class="number">3</span>封</span>-->
            <template v-if="item.prop == 'fa'">
              <!-- <span v-if="item.title == '标题'" class="row-title">今天<span class="number">3</span>封</span> -->
              <span>{{ scope.row[item.prop] }}</span>
            </template>
            <template v-else-if="item.prop == 'zhu'">
              <span>{{ scope.row[item.prop] }}</span>
            </template>
            <template v-else-if="item.prop == 'shi'">
              <span>{{ scope.row[item.prop] }}</span>
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
          class="p-bar"
          background
          layout="prev, pager, next, sizes, total, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"/>
      </div>
    </div>
    <!-- 相关详情页面 -->
    <email-detail
      :visible.sync="showDview"
      :email-type="emailType"
      :id="rowID"
      class="d-view"
      @close="hideView"/>

    <!-- 新建邮件 -->
    <create-email
      v-if="isCreate"
      @hiden-view="isCreate = false"/>
  </div>
</template>

<script>
import table from './mixins/table'
import EmailDetail from './EmailDetail'
import createEmail from './components/CreateEmail'
export default {
  // 列表
  name: 'Index',
  components: {
    EmailDetail,
    createEmail
  },
  // props: {},
  mixins: [table],
  data() {
    return {
      search: '', // 搜索内容
      emailType: 'receive',
      list: [
        { fa: '123', zhu: '156', shi: '124', id: 0 },
        { fa: '', zhu: '', shi: '', id: 1, title: '标题' }
      ], // 列表数组
      fieldList: [
        { label: '发件人', width: 200, prop: 'fa' },
        { label: '主题', width: 600, prop: 'zhu' },
        { label: '时间', width: 200, prop: 'shi' }
      ],
      lists: [
        { send: '123', subject: '156', time: '124', id: 0 },
        { send: '1235', subject: 'zhuti', time: 'shijain', id: 0 }
      ],
      showDview: false,
      isCreate: false,

      // 勾选
      checkAll: false,
      isIndeterminate: true,
      checkedItem: [], // 勾选的数据
      itemObj: '',
      objIndex: ''
    }
  },
  computed: {
    sideNavTitle() {
      return {
        receive: '收件箱',
        star: '星标邮件',
        draft: '草稿箱',
        sent: '已发送',
        deleted: '已删除',
        spam: '垃圾邮件'
      }[this.emailType]
    },
    tableHeadList() {
      const handleInfos = {
        transfer: {
          name: '转移',
          type: 'transfer',
          icon: 'transfer'
        },
        transform: {
          name: '转化为客户',
          type: 'transform',
          icon: 'transform'
        },
        transformLead: {
          name: '转化为线索',
          type: 'transformLead',
          icon: 'transform'
        },
        export: {
          name: '导出选中',
          type: 'export',
          icon: 'export'
        },
        delete: {
          name: '删除',
          type: 'delete',
          icon: 'delete'
        },
        put_seas: {
          name: '放入公海',
          type: 'put_seas',
          icon: 'seas'
        },
        lock: {
          name: '锁定',
          type: 'lock',
          icon: 'lock'
        },
        unlock: {
          name: '解锁',
          type: 'unlock',
          icon: 'unlock'
        },
        add_user: {
          name: '添加团队成员',
          type: 'add_user',
          icon: 'add'
        },
        delete_user: {
          name: '移除团队成员',
          type: 'delete_user',
          icon: 'remove'
        },
        alloc: {
          name: '分配',
          type: 'alloc',
          icon: 'alloc'
        },
        get: {
          name: '领取',
          type: 'get',
          icon: 'receive'
        },
        start: {
          name: '上架',
          type: 'start',
          icon: 'shelves'
        },
        disable: {
          name: '下架',
          type: 'disable',
          icon: 'sold-out'
        },
        state_start: {
          name: '启用',
          type: 'state_start',
          icon: 'activation'
        },
        state_disable: {
          name: '停用',
          type: 'state_disable',
          icon: 'remove'
        },
        deal_status: {
          name: '更改成交状态',
          type: 'deal_status',
          icon: 's-status'
        }
      }
      return {
        receive: [handleInfos['delete'], handleInfos['export']],
        star: [],
        draft: [],
        sent: [],
        deleted: [],
        spam: []
      }[this.emailType]
    }
  },
  watch: {},
  mounted() {},

  beforeDestroy() {},

  created() {
    this.emailType = this.$route.params.type
    console.log(this.emailType, this.$route, 'leixing')
  },

  beforeRouteUpdate(to, from, next) {
    this.emailType = to.params.type
    // this.totalCount = 0
    // if (this.$refs.createLog) {
    //   this.$refs.createLog.showMore = false
    // }
    // this.filterForm = {
    //   categoryId: 0,
    //   createUserId: ''
    // }
    // this.userSelects = []

    // this.timeSelect = {
    //   type: 'default',
    //   value: 'month'
    // }
    // this.refreshList()
    next()
  },

  methods: {
    // 全选
    handleCheckAllChange(val) {
      console.log('全部勾选', val)
      this.checkedCities = val ? this.lists : []
      this.isIndeterminate = false
    },

    handleCheckedCitiesChange(value) {
      console.log('局部勾选', value)
      if (value) {
        this.checkedItem[this.itemIndex] = this.itemObj
        // this.checkedItem.push(this.itemObj)
        console.log(this.checkedItem, '已勾选')
        const checkedCount = this.checkedItem.length
        this.checkAll = checkedCount === this.lists.length
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.lists.length
      } else {
        this.checkedItem[this.itemIndex] = this.itemObj
        
      }
    },

    clickRow(item, index) {
      this.itemObj = item
      this.itemIndex = index
      console.log(item, index, 'item')
    },

    /**
     * 邮件搜索
     */
    emailSearch(value) {
      console.log(value, 'search')
    },

    /**
     * 勾选后操作列表
     */
    operatList(type) {
      console.log(type, 'leixing')
    },

    /**
     * 独占一行
     */
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      console.log(row, column, rowIndex, columnIndex, 'SSS')
      if (row.title) {
        return [rowIndex, 8]
      } else {
        return ''
      }
    },

    /**
     * 通过回调控制class
     */
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'customerName') {
        return 'can-visit--underline'
      } else if (column.property === 'businessCheck') {
        return 'can-visit'
      } else {
        return ''
      }
    },

    /**
     * 创建邮件
     */
    createEmail() {
      this.isCreate = true
    }
  }
}
</script>

<style lang="scss" scoped>
@import './styles/table.scss';

.record-receive {
  display: inline-block;
  color: #666666;
  font-size: 14px;
  .blue-font {
    color: #2362FB;
  }
}

.row-title {
  display: block;
  text-align: left;
  font-size: 12px;
  color: #333333;
  .number {
    color: #2362FB;
  }
}

.table-row {
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid red;
}

.border-bottom {
  // border-bottom: 1px solid red;
}

.row-title {
  width: 100%;
  margin-left: 16px;
}

// 表
.tb-head {
  text-align: center;
}

table {
  border: 1px solid red;
  border-top: 1px solid red;
}

tr > td {
  // border-right: 1px solid red;
  // border-top: 1px solid red;
  height: 40px;
}

table tr {
  border-bottom: 1px solid red !important;
}

.end-column {
  border-right: 0 !important;
}

.head-font-color {
  font-weight: 600;
  font-size: 12px;
  color: #333333;
}

.font-color {
  font-size: 12px;
  color: #666666;
}

.tb-h-align {
  text-align: left;
  padding-left: 10px;
}


</style>
