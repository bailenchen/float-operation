<template>
  <div>
    <c-r-m-list-head
      :search.sync="search"
      :crm-type="crmType"
      title="内部通讯录"
      placeholder="请输入工号/姓名/手机号码"
      @on-handle="listHeadHandle"
      @on-search="crmSearch"
      @on-export="exportInfos" />
    <div
      v-empty="!crm.insideUser.index"
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
        :cell-class-name="cellClassName"
        class="n-table--border"
        use-virtual
        stripe
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
          v-if="Show"
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
              @show="showData(scope.row.insideId)"
              @hiden="showCount = -1">
              <call-center
                :scope="scope"
                :show="scope.row.insideId === showCount"
                crm-type="insideUser"
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
          :fixed="index==0"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :sortable="item.prop != 'poolDay' ? 'custom' : false"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <!--<template v-if="item.prop == 'dealStatus'">
              <i :class="scope.row[item.prop] | dealIcon"/>
              <span>{{ scope.row[item.prop] | dealName }}</span>
            </template>-->
            <template v-if="item.prop == 'status'">
              <i
                v-if="scope.row.status == 9"
                class="wk wk-circle-password customer-lock"/>
            </template>
            <template v-else-if="item.prop == 'customerType'">
              <img v-if="scope.row.customerType == 2" class="student-img" src="@/assets/img/student.jpg" alt="">
            </template>
            <template v-else>{{ fieldFormatter(scope.row, scope.column) }}</template>
          </template>
        </el-table-column>
        <el-table-column/>
        <!-- <el-table-column
          label="关注"
          align="center"
          fixed="right"
          width="60">
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.star == 0 ? '添加关注' : '取消关注'" effect="dark" placement="top">
              <i
                :class="{active: scope.row.star != 0}"
                class="wk wk-focus-on focus-icon"
                @click="toggleStar(scope.row)" />
            </el-tooltip>
          </template>
        </el-table-column> -->
        <!-- <el-table-column
          :resizable="false"
          fixed="right"
          width="40">
          <template
            slot="header"
            slot-scope="slot">
            <field-set
              :crm-type="crmType"
              @change="setSave"/>
          </template>
        </el-table-column> -->
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
    <!-- 相关详情页面 -->
    <c-r-m-all-detail
      :visible.sync="showDview"
      :crm-type="rowType"
      :model-data="modelData"
      :id="rowID"
      class="d-view"
      @handle="handleHandle"
      @refresh-list="refreshList"/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import CRMAllDetail from '@/views/customermanagement/components/CRMAllDetail'
import table from '../mixins/table'
import CallCenter from '@/callCenter/CallCenter'

export default {
  /** 内部通讯录 的 客户列表 */
  name: 'AddressIndex',
  components: {
    CRMAllDetail,
    CallCenter
  },
  filters: {
    dealIcon(statu) {
      return statu == 1 ? 'wk wk-success deal-suc' : 'wk wk-close deal-un'
    },

    dealName(statu) {
      return statu == 10 ? '已成交' : '未成交'
      // return ''
    }
  },
  mixins: [table],
  data() {
    return {
      crmType: 'insideUser',
      showCount: 0,
      modelData: {},
      studentImg: '@/assets/img/student1.jpg'
    }
  },
  computed: {
    ...mapGetters(['CRMConfig']),
    Show() {
      return this.$store.state.customer.isCall
      // return true
    }
  },
  mounted() {
    this.$nextTick(() => {
      const callOutData = JSON.parse(localStorage.getItem('callOutData'))
      if (callOutData) {
        this.modelData = {
          modelId: callOutData.id,
          model: callOutData.type
        }
      }
    })
  },
  deactivated: function() {
    this.$refs.elMenu.activeIndex = this.crmType
  },
  methods: {
    getOtherParams() {
      // customerType: 1、LEADS；2、学员
      return {
        customerType: 1
      }
    },

    refreshList() {
      this.getList()
    },

    /**
     * 通过回调控制class
     */
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (['leadsNumber', 'customerName'].includes(column.property)) {
        return 'can-visit--underline'
      } else if (column.property === 'businessCheck') {
        return 'can-visit'
      } else {
        return ''
      }
    },
    /**
       * pover 显示时触发
       */
    showData(val) {
      this.showCount = val
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
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/table.scss';

.student-img {
  margin-top: 2px;
  // display: inline-block;
  display: block;
  border-radius: 50%;
}
</style>
