<template>
  <div class="ec-container">
    <div class="title">
      <i
        :class="['title-icon', iconData.iconClass]"
        :style="{ backgroundColor: iconData.color }" />{{ infoTitle }}
      <el-tooltip
        v-if="infoTips"
        :content="infoTips"
        effect="dark"
        placement="top">
        <i class="wk wk-help"/>>
      </el-tooltip>
    </div>
    <div class="option-bar">
      <div v-if="selectionList.length == 0">
        <el-select
          v-if="showOptions"
          v-model="optionsType"
          placeholder="请选择"
          @change="refreshList">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.name"
            :value="item.value"/>
        </el-select>
        <el-select
          v-if="showSubType"
          v-model="isSubType"
          :style="{'margin-left': showOptions ? '10px' : 0}"
          style="width: 120px;"
          placeholder="请选择"
          @change="refreshList">
          <el-option
            v-for="item in [{name: '我的', value: 1}, {name: '我下属的', value: 2}]"
            :key="item.value"
            :label="item.name"
            :value="item.value"/>
        </el-select>
        <el-button
          v-if="showFilterView"
          style="margin-left: 10px;"
          type="primary"
          class="filter-button"
          icon="wk wk-screening"
          @click="getFilterFieldInfo">高级筛选</el-button>
        <filter-form
          :field-list="filterFieldList"
          :dialog-visible.sync="showFilter"
          :obj="filterObj"
          :crm-type="crmType"
          :is-seas="true"
          @filter="handleFilter"/>
      </div>
      <flexbox
        v-else
        class="selection-bar">
        <div class="selected—title">已选中<span class="selected—count">{{ selectionList.length }}</span>项</div>
        <flexbox class="selection-items-box">
          <el-button
            v-for="(item, index) in selectionButtonList"
            :icon="item.icon"
            :key="index"
            type="primary"
            @click.native="selectionBarClick(item.type)">{{ item.name }}</el-button>
        </flexbox>
      </flexbox>
    </div>
    <filter-content
      v-if="filterObj.form && filterObj.form.length > 0"
      :obj="filterObj"
      @delete="handleDeleteField"/>
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
        v-if="showSelection"
        show-overflow-tooltip
        type="selection"
        align="center"
        width="55"/>
      <el-table-column
        v-if="showCall"
        :resizable="false"
        prop="call"
        fixed
        label=""
        width="55">
        <template
          slot="header"
          slot-scope="slot">
          <i
            class="el-icon-phone"
            style="cursor: not-allowed; opacity: 0.5;color: #2486E4"/>
        </template>
        <template slot-scope="scope">
          <el-popover
            placement="right"
            width="500"
            popper-class="no-padding-popover"
            trigger="click"
            @show="showData(scope.row)"
            @hiden="showCount = -1">
            <call-center
              :scope="scope"
              :show="showCallCenter(scope.row)"
              crm-type="customer"
              @changeType="changeCRMType"/>
            <el-button
              slot="reference"
              :style="{'opacity' :scope.$index >= 0 ? 1 : 0}"
              type="primary"
              icon="el-icon-phone"
              circle
              @click.stop="callCheckClick($event,scope,scope.$index)"/>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        v-for="(item, index) in fieldList"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        :formatter="fieldFormatter"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <template v-if="item.prop == 'dealStatus'">
            <i :class="scope.row[item.prop] | dealIcon"/>
            <span>{{ scope.row[item.prop] | dealName }}</span>
          </template>
          <template v-else-if="item.prop == 'status' && crmType === 'customer'">
            <i
              v-if="scope.row.status == 2"
              class="wk wk-circle-password customer-lock"/>
          </template>
          <template v-else-if="item.prop == 'checkStatus'">
            <span :style="getStatusStyle(scope.row.checkStatus)" class="status-mark"/>
            <span>{{ getStatusName(scope.row.checkStatus) }}</span>
          </template>
          <template v-else>
            {{ scope.row[item.prop] }}
          </template>
        </template>
      </el-table-column>
      <el-table-column :resizable="false"/>
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

    <!-- 相关详情页面 -->
    <c-r-m-all-detail
      :visible.sync="showDview"
      :crm-type="rowType"
      :model-data="modelData"
      :id="rowID"
      @handle="getList"/>
  </div>
</template>

<script>
import crmTypeModel from '@/views/customermanagement/model/crmTypeModel'
import { filterIndexfields } from '@/api/customermanagement/common'
import { crmLeadsSetFollowAPI } from '@/api/customermanagement/clue'
import { crmCustomerSetFollowAPI } from '@/api/customermanagement/customer'
import message_table from '../mixins/message_table'
import filterForm from '@/views/customermanagement/components/filterForm'
import filterContent from '@/views/customermanagement/components/filterForm/filterContent'
import CRMAllDetail from '@/views/customermanagement/components/CRMAllDetail'
import CallCenter from '@/callCenter/CallCenter'

export default {
  /** 客户管理 的待审核系统 */
  name: 'CRMMessage',

  components: {
    filterForm,
    filterContent,
    CRMAllDetail,
    CallCenter
  },

  filters: {
    dealIcon(statu) {
      return statu == 1 ? 'wk wk-success deal-suc' : 'wk wk-close deal-un'
    },

    dealName(statu) {
      return statu == 1 ? '已成交' : '未成交'
    }
  },

  mixins: [message_table],

  props: {
    // crm类型
    crmType: {
      type: String,
      default: ''
    },
    // crm某个类型下的类型数据
    infoType: {
      type: String,
      default: ''
    },

    infoTitle: {
      type: String,
      default: ''
    },

    infoTips: {
      type: String,
      default: ''
    },

    // 标示信息
    iconData: Object,

    // 展示的时候 才发请求
    show: Boolean
  },

  data() {
    return {
      optionsType: 0,
      isSubType: 1, // 是否是下属
      /** 高级筛选 */
      showFilter: false, // 控制筛选框
      filterFieldList: [],
      filterObj: { form: [] }, // 筛选确定数据
      /** 勾选数据操作 */
      selectionList: [], // 勾选的数据
      selectionButtonList: [
        {
          name: '已跟进',
          type: 'follow',
          icon: 'wk wk-edit'
        }
      ], // 操作按钮列表
      /** 控制详情展示 */
      rowID: '', // 行信息
      rowType: '', // 详情类型
      showDview: false,
      showCount: -1, // 储存客户id作为展示的标识
      modelData: {} // 储存电话信息作为详情展示通话的依据
    }
  },
  computed: {
    // 展示勾选框
    showSelection() {
      if (this.infoType == 'followLeads' || this.infoType == 'followCustomer') {
        return true
      }

      return false
    },

    // 展示筛选
    showFilterView() {
      if (this.crmType == 'receivables_plan') {
        return false
      }
      return true
    },

    // 展示审核状态
    showCheckStatus() {
      if (this.crmType == 'contract' || this.crmType == 'receivables') {
        return true
      }
      return false
    },

    // 展示客户池天数
    showPoolDay() {
      if (this.crmType == 'customer') {
        return true
      }
      return false
    },

    // 展示我的/下属筛选
    showSubType() {
      if (
        this.infoType == 'todayCustomer' ||
        this.infoType == 'putInPoolRemind'
      ) {
        return true
      }
      return false
    },

    // 下拉数据
    options() {
      if (this.infoType == 'todayCustomer') {
        return [
          { name: '今日需联系', value: 1 },
          { name: '已逾期', value: 2 },
          { name: '已联系', value: 3 }
        ]
      } else if (
        this.infoType == 'followLeads' ||
        this.infoType == 'followCustomer'
      ) {
        return [{ name: '待跟进', value: 1 }, { name: '已跟进', value: 2 }]
      } else if (
        this.infoType == 'checkContract' ||
        this.infoType == 'checkReceivables'
      ) {
        return [{ name: '待审核', value: 1 }, { name: '已审核', value: 2 }]
      } else if (this.infoType == 'remindReceivablesPlan') {
        return [
          { name: '待回款', value: 1 },
          { name: '已回款', value: 2 },
          { name: '已逾期', value: 3 }
        ]
      } else if (this.infoType == 'endContract') {
        return [{ name: '即将到期', value: 1 }, { name: '已到期', value: 2 }]
      }

      return []
    },
    // 权限
    showCall() {
      if (
        this.infoType == 'todayCustomer' ||
        this.infoType == 'followLeads' ||
        this.infoType == 'putInPoolRemind' ||
        this.infoType == 'followCustomer') {
        return this.$store.state.customer.isCall
      }
      return false
    }

  },

  watch: {
    show() {
      if (this.showOptions && this.options.length > 0) {
        this.optionsType = this.options[0].value
      }
      this.initTableHead()
    }
  },

  mounted() {
    if (this.showOptions && this.options.length > 0) {
      this.optionsType = this.options[0].value
    }

    this.initTableHead()
  },

  methods: {
    /**
     * 初始化表头数据
     */
    initTableHead() {
      if (this.show) {
        if (this.fieldList.length == 0) {
          this.getFieldList()
        } else {
          this.getList(false)
          this.$store.dispatch('GetMessageNum')
        }
      }
    },

    /**
     * 刷新列表
     */
    refreshList() {
      this.currentPage = 1
      if (this.fieldList.length > 0) {
        this.getList()
      } else {
        this.getFieldList()
      }
    },

    /**
     * 勾选数据
     */
    handleSelectionChange(val) {
      this.selectionList = val // 勾选的行
    },

    /**
     * 勾选后的操作
     */
    selectionBarClick(type) {
      if (type == 'follow') {
        this.$confirm('您确定此操作吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            const request = {
              followLeads: crmLeadsSetFollowAPI,
              followCustomer: crmCustomerSetFollowAPI
            }[this.infoType]
            request({
              ids: this.selectionList
                .map(item => {
                  return item[this.crmType + 'Id']
                })
                .join(',')
            })
              .then(res => {
                this.$message.success('操作成功')
                this.refreshList()

                this.$emit('on-handle', {
                  type: 'follow',
                  value: this.selectionList.length,
                  infoType: this.infoType
                })
              })
              .catch(() => {})
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
      }
    },

    /**
     * 获取高级筛选字段数据后展示
     */
    getFilterFieldInfo() {
      filterIndexfields({
        label: crmTypeModel[this.crmType]
      })
        .then(res => {
          this.filterFieldList = res.data
          this.showFilter = true
        })
        .catch(() => {})
    },

    /**
     * 选择筛选字段
     */
    handleFilter(form) {
      this.filterObj = form
      this.showFilter = false
      this.updateTableHeight()
      this.refreshList()
    },

    /**
     * 删除筛选字段
     */
    handleDeleteField(data) {
      this.filterObj = data.obj
      this.updateTableHeight()
      this.refreshList()
    },

    /**
     * 通过回调控制class
     */
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (
        (column.property === 'name' && this.crmType != 'contract') ||
        column.property === 'number' ||
        column.property === 'leadsName' ||
        column.property === 'customerName' ||
        column.property === 'businessName' ||
        column.property === 'contactsName' ||
        column.property === 'num'
      ) {
        return 'can-visit--underline'
      } else {
        return ''
      }
    },
    /**
       * pover 显示时触发
       */
    showData(val) {
      if (
        this.infoType == 'todayCustomer' ||
        this.infoType == 'followCustomer' ||
        this.infoType == 'putInPoolRemind') {
        this.showCount = val.customerId
      } else if (this.infoType == 'followLeads') {
        this.showCount = val.leadsId
      }
    },
    /**
       * 查看详情
       * @param val
       */
    changeCRMType(val) {
      this.rowType = val.type
      this.rowID = val.id

      this.modelData = {
        modelId: val.id,
        model: val.type
      }

      this.showDview = true

      let callOutData = {
        modelId: val.id,
        model: val.type
      }
      callOutData = JSON.stringify(callOutData)
      localStorage.setItem('callOutData', callOutData)
    },
    /**
     * 解决povper重复的bug
    */
    callCheckClick(e, scope) {
      this.list.forEach(item => {
        this.$set(item, 'callShow', false)
      })
      this.$set(scope.row, 'callShow', !scope.row.callShow)
      const popoverEl = e.target.parentNode
      popoverEl.__vue__.showPopper = !scope.row.callShow
    },
    /**
     * 展示呼出页面
     */
    showCallCenter(row) {
      if (
        this.infoType == 'todayCustomer' ||
        this.infoType == 'followCustomer' ||
        this.infoType == 'putInPoolRemind') {
        if (row.customerId === this.showCount) {
          return true
        }
      } else if (this.infoType == 'followLeads') {
        if (row.leadsId === this.showCount) {
          return true
        }
      }
      return false
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import '../../styles/table.scss';
/** 场景和筛选 */
.filtrate-button {
  cursor: pointer;
  margin-left: 10px;
  display: inline-block;
  &-img {
    vertical-align: middle;
    margin: 0 5px;
    width: 12px;
  }
}
.filtrate-button:hover {
  color: $xr-color-primary;
}

.ec-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.title {
  padding: 10px 20px;
  font-size: 14px;
  color: #333;

  .title-icon {
    display: inline-block;
    font-size: 12px;
    padding: 6px;
    border-radius: $xr-border-radius-base;
    color: white;
    margin-right: 10px;
  }
  .wk-help {
    margin-left: 5px;
  }
}
.option-bar {
  padding: 15px 20px;
}

/** 勾选操作 */
.selection-bar {
  font-size: 12px;
  height: 35px;
  color: #777;

  .selected—title {
    flex-shrink: 0;
    padding-right: 20px;
    color: #333;
    .selected—count {
      color: $xr-color-primary;
    }
  }
}

.selection-items-box {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 15px;

  .el-button {
    color: #666;
    background-color: $xr--background-color-base;
    border-color: $xr--background-color-base;
    font-size: 12px;
    height: 28px;
    border-radius: 14px;
    /deep/ i {
      font-size: 12px;
      margin-right: 5px;
    }
  }

  .el-button--primary:hover {
    background: $xr-color-primary;
    border-color: $xr-color-primary;
    color: #ffffff;
  }

  .el-button + .el-button {
    margin-left: 15px;
  }
}

.n-table--border {
  border-top: 1px solid $xr-border-line-color;
}
</style>
