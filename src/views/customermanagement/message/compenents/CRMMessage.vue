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
        <i class="wk wk-help wk-help-tips"/>
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
          :save-scene="false"
          @filter="handleFilter"/>
          <!-- <el-button
          :disabled="!canMark"
          class="el-button--margin"
          icon="wk wk-tag"
          style="margin-left: 10px;"
          type="primary"
          plain
          @click="allMarkReadClick">
          全部标记已处理
        </el-button> -->
      </div>
      <!-- 勾选展示 -->
      <flexbox
        v-else
        class="selection-bar">
        <div class="selected—title">已选中<span class="selected—count">{{ selectionList.length }}</span>项</div>
        <flexbox class="selection-items-box">
          <div v-if="infoType!=='todayCustomer'">
            <el-button
              v-for="(item, index) in selectionButtonList"
              :icon="item.icon"
              :key="index"
              type="primary"
              @click.native="selectionBarClick(item.type)">{{ item.name }}</el-button>
          </div>
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
      highlight-current-row
      style="width: 100%"
      @row-click="handleRowClick"
      @selection-change="handleSelectionChange">
      <!-- <el-table-column
        v-if="showSelection"
        show-overflow-tooltip
        type="selection"
        align="center"
        width="55"/> -->
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
              :crm-type="rowType"
              @changeType="changeCRMType"/>
            <el-button
              slot="reference"
              ref="telbtn"
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
              v-if="scope.row.status == 9"
              class="wk wk-circle-password customer-lock"/>
          </template>
          <template v-else-if="item.prop == 'relevanceContractNum'">
            <span v-if="scope.row['relevanceContractNum']">
              <span
                v-for="(sitem, sindex) in scope.row['relevanceContractNum']"
                :key="sindex"
                @click.stop="enterDetail(sitem)">{{ sitem.num }}
                <span
                  v-if="sindex != scope.row['relevanceContractNum'].length - 1"
                  style="margin-right:10px;">,</span>
              </span>
            </span>
            <span v-else/>
          </template>
          <template v-else-if="item.prop == 'customerType'">
            <img v-if="scope.row.customerType == 2" class="student-img" src="@/assets/img/student.jpg" alt="">
          </template>
          <template v-else-if="item.prop == 'checkStatus'">
            <span :style="getStatusStyle(scope.row.checkStatus)" class="status-mark"/>
            <span>{{ getStatusName(scope.row.checkStatus) }}</span>
          </template>
          <template v-else>
            {{ transformData(item.prop, scope.row[item.prop]) }}
          </template>
        </template>
      </el-table-column>
      <el-table-column :resizable="false"/>
      <el-table-column
        v-if="infoType == 'performanceDistributions'"
        :resizable="false"
        label="审核"
        align="center"
        fixed="right"
        width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.checkStatus == '0'">
            <el-button type="success" size="mini" @click="handleExamine(scope.row, 1)">通过</el-button>
            <el-button type="danger" size="mini" @click="handleExamine(scope.row, 2)">拒绝</el-button>
          </div>
          <div v-else>
            {{ scope.row.checkStatus }}
          </div>
        </template>
      </el-table-column>
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
      :click-field="clickField"
      :base-list="baseList"
      :id="rowID"
      @handle="getList"
      @refresh-list="refreshParentList"/>


    <!-- 争议详情页面 -->
    <dispute-detail
      v-if="showDisputedDview"
      :record-id="recID"
      :owner-user-id="ownId"
      :id="rowID"
      @hide-view="hiddenDisputeView" />

      <!-- <dispute-detail
      v-if="showDview"
      :id="rowID"
      :detail-index="0"
      :no-listener-class="['examine-content']"
      class="d-view"
      @hide-view="showDview=false"
      @on-examine-handle="detailHandleCallBack" /> -->
  </div>
</template>

<script>
import crmTypeModel from '@/views/customermanagement/model/crmTypeModel'
import { filterIndexfields } from '@/api/customermanagement/common'
import {
  crmMessageHandleStatusAPI,
  UpdateAllTodayCustomer,
  UpdateAllFollowUpLeads,
  crmMessageHandleDisputedStatusAPI,
  crmExamineContractAllocListAPI
  // crmMessageFollowCustomerAPI
} from '@/api/customermanagement/message'
import message_table from '../mixins/message_table'
import filterForm from '@/views/customermanagement/components/filterForm'
import filterContent from '@/views/customermanagement/components/filterForm/filterContent'
import CRMAllDetail from '@/views/customermanagement/components/CRMAllDetail'
import CallCenter from '@/callCenter/CallCenter'
import DisputeDetail from './DisputeDetail'

export default {
  /** 客户管理 的待审核系统 */
  name: 'CRMMessage',

  components: {
    filterForm,
    filterContent,
    CRMAllDetail,
    CallCenter,
    DisputeDetail
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
        // {
        //   name: '已处理',
        //   type: 'follow',
        //   icon: 'wk wk-edit'
        // }
      ], // 操作按钮列表
      /** 控制详情展示 */
      rowID: '', // 行信息
      recID: '',
      ownId: '',
      rowType: '', // 详情类型
      showDview: false, // 详情显示与否
      showDisputedDview: false, // 争议显示与否
      showCount: -1, // 储存客户id作为展示的标识
      modelData: {}, // 储存电话信息作为详情展示通话的依据

      baseList: [] // 传递列表头
    }
  },
  computed: {
    // 展示勾选框
    showSelection() {
      return [
        'todayCustomer',
        'allotCustomer',
        'followCustomer',
        'putInPoolRemind',
        'disputed'
      ].includes(this.infoType)
    },

    // 展示筛选
    showFilterView() {
      return [
        'todayCustomer',
        'allotCustomer',
        'followCustomer',
        'putInPoolRemind',
        'disputed',
        'checkContract',
        'performanceDistributions',
        'refundNumber'
      ].includes(this.infoType)
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
      return [
        'todayCustomer',
        'followCustomer',
        'returnVisitRemind',
        'putInPoolRemind',
        'disputed'
      ].includes(this.infoType)
    },

    // 下拉数据
    options() {
      if (this.infoType === 'todayCustomer') {
        return [
          { name: '今日需联系', value: 1 },
          { name: '已逾期', value: 2 },
          { name: '已处理', value: 3 }
        ]
      }
      if (this.infoType == 'allotCustomer') {
        return [{ name: '待跟进', value: 1 }, { name: '已跟进', value: 2 }]
      } else if (this.infoType == 'checkContract' || this.infoType == 'performanceDistributions' || this.infoType == 'refundNumber') {
        return [{ name: '待审核', value: 1 }, { name: '已审核', value: 2 }]
      }
      return []
      // if (this.infoType == 'todayCustomer') {
      //   return [
      //     { name: '今日需跟进', value: 1 },
      //     { name: '今日需跟进', value: 1 },
      //     { name: '已联系', value: 3 }
      //   ]
      // } else if (
      //   this.infoType == 'followLeads' ||
      //   this.infoType == 'followCustomer'
      // ) {
      //   return [{ name: '待跟进', value: 1 }, { name: '已跟进', value: 2 }]
      // } else if (
      //   this.infoType == 'checkContract' ||
      //   this.infoType == 'checkReceivables'
      // ) {
      //   return [{ name: '待审核', value: 1 }, { name: '已审核', value: 2 }]
      // } else if (this.infoType == 'remindReceivablesPlan') {
      //   return [
      //     { name: '待回款', value: 1 },
      //     { name: '已回款', value: 2 },
      //     { name: '已逾期', value: 3 }
      //   ]
      // } else if (this.infoType == 'endContract') {
      //   return [{ name: '即将到期', value: 1 }, { name: '已到期', value: 2 }]
      // }
      //
      // return []
    },
    // 权限
    showCall() {
      if (
        this.infoType == 'todayCustomer' ||
        this.infoType == 'allotCustomer' ||
        this.infoType == 'followLeads' ||
        this.infoType == 'putInPoolRemind' ||
        this.infoType == 'followCustomer') {
        return this.$store.state.customer.isCall
      }
      return false
    },

    /**
     * 能标记
     */
    canMark() {
      if (this.options.length) {
        if (this.showSubType && this.showOptions) {
          return this.optionsType == 1 && this.isSubType == 1
        }
        if (this.showSubType) {
          return this.isSubType == 1
        }
        if (this.showOptions) {
          return this.optionsType == 1
        }
        return false
      }
      return true
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
    // 隐藏详情
    hiddenDisputeView() {
      this.showDisputedDview = false
    },
    /**
     * 初始化表头数据
     */
    initTableHead() {
      if (this.show) {
        this.currentPage = 1
        if (this.fieldList.length == 0) {
          this.getFieldList()
        } else {
          this.getList(false)
          this.$store.dispatch('GetMessageNum')
        }
      }
    },

    enterDetail(item) {
      this.rowID = item.contractId
      this.rowType = 'contract'
      this.clickField = 'num'
      this.showDview = true
    },

    transformData(name, value) {
      if (name === 'contractType') {
        return {
          1: '购买',
          2: '赠送'
        }[value]
      } else if (name === 'isEarlyRetirement') {
        return {
          0: '否',
          1: '是',
          null: ''
        }[value]
      } else if (name === 'isNew') {
        return {
          0: '续签',
          1: '新签',
          2: '引流'
        }[value]
      } else if (name === 'contractStatus') {
        return {
          1: '申请中',
          2: '放弃',
          3: '合同完成',
          4: '合同变更中',
          5: '执行中',
          6: '草稿',
          7: '合同充值返还',
          8: '确认放弃',
          9: '家长审核中',
          10: '家长拒绝'
        }[value]
      }
      return value
    },

    /**
     * 跟进后刷新列表
     */
    refreshParentList() {
      this.getList()
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
              todayCustomer: crmMessageHandleStatusAPI,
              followCustomer: crmMessageHandleStatusAPI,
              // allotCustomer: crmMessageFollowCustomerAPI,
              disputed: crmMessageHandleDisputedStatusAPI
            }[this.infoType]
            request({
              customerIds: this.selectionList
                .map(item => {
                  return item[this.crmType + 'Id']
                })
                .join(',')
            })
              .then(res => {
                this.$message.success('操作成功')
                this.refreshList()
                this.$store.dispatch('GetMessageNum')

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
      let keytype = this.crmType == 'globalAlloc' ? 28 : crmTypeModel[this.crmType]
      if (this.crmType == 'refound') {
        keytype = 23
      }
      filterIndexfields({
        label: keytype
      })
        .then(res => {
          this.filterFieldList = res.data || []
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
     * 通过与拒绝
     */
    handleExamine(row, way) {
      const params = {
        contractAllotId: row.contractAllotId,
        checkStatus: way
      }
      crmExamineContractAllocListAPI(params).then(res => {
        this.$message.success('操作成功')
        this.$store.dispatch('GetMessageNum')
        this.getList()
      }).catch(() => {

      })
    },

    /**
     * 通过回调控制class
     */
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (
        (column.property === 'name' && this.crmType != 'contract') ||
        column.property === 'number' ||
        column.property === 'leadsName' ||
        column.property === 'serialNumber' ||
        column.property === 'leadsNumber' ||
        column.property === 'customerName' ||
        column.property === 'businessName' ||
        column.property === 'contactsName' ||
        column.property === 'num' ||
        column.property === 'relevanceContractNum' ||
        column.property === 'visitNumber'
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
        this.infoType == 'allotCustomer' ||
        this.infoType == 'followCustomer' ||
        this.infoType == 'putInPoolRemind') {
        this.showCount = val.customerId
        this.rowType = 'customer'
      } else if (this.infoType == 'followLeads') {
        this.showCount = val.leadsId
        this.rowType = 'leads'
      }
    },
    /**
       * 查看详情
       * @param val
       */
    changeCRMType(val) {
      console.log('查看详情')


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
      console.log('123456')
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
        this.infoType == 'allotCustomer' ||
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
    },

    /**
     * 全部标记
     */
    allMarkReadClick() {
      this.$confirm('您确定此操作吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const request = {
          todayCustomer: UpdateAllTodayCustomer,
          followCustomer: UpdateAllFollowUpLeads
        }[this.infoType]
        const params = {
          page: this.currentPage,
          limit: this.pageSize,
          isSub: this.isSubType
        }

        if (this.showOptions) {
          params.type = this.optionsType
        }
        const filterObj = this.filterObj.obj
        if (filterObj && Object.keys(filterObj).length > 0) {
          params.data = filterObj
        }
        request(params).then(res => {
          this.$message.success('操作成功')
          this.refreshList()
          this.$store.dispatch('GetMessageNum')

          this.$emit('on-handle', {
            type: 'follow',
            value: this.selectionList.length,
            infoType: this.infoType
          })
        }).catch(() => {})
      }).catch(() => {
        this.$message.info('已取消操作')
      })
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

.el-button--primary.is-plain {
  background-color: white;
}

.el-button--primary.is-plain:hover,
.el-button--primary.is-plain:focus {
  color: $xr-color-primary;
}

// 拉开图标与文字距离
.el-button--margin {
  /deep/ i {
    margin-right: 5px;
  }
}
</style>
