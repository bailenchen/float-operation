<template>
  <div ref="workbench" class="crm-workbench">
    <flexbox class="head">
      <members-dep
        :dep-checked-data="filterValue.strucs"
        :user-checked-data="filterValue.users"
        @popoverSubmit="userStrucSelect">
        <flexbox slot="membersDep" class="user-box">
          <i v-if="avatarData.showIcon" class="wk wk-multi-user user-icon" />
          <xr-avatar
            v-else
            :name="avatarData.realname"
            :size="28"
            :src="avatarData.img" />
          <span class="username">{{ filterText }}</span>
          <span class="el-icon-caret-bottom icon" />
        </flexbox>
      </members-dep>
      <time-type-select
        :width="190"
        @change="timeTypeChange"/>
        <!--<flexbox justify="flex-end" class="others">
        <el-button
          type="primary"
          icon="el-icon-menu">
          管理仪表盘
        </el-button>
      </flexbox>-->
    </flexbox>

    <div
      v-loading="loading"
      class="brief-box">
      <div class="brief-title">
        <span class="icon wk wk-briefing" />
        <span class="text">销售简报</span>
      </div>
      <div class="brief">
        <flexbox
          v-for="(item, index) in briefList"
          :key="index"
          :span="2"
          class="brief-item"
          @click.native="reportClick(item)">
          <flexbox class="brief-item__body">
            <div
              :style="{backgroundColor: item.color}"
              class="icon-box">
              <span :class="item.icon" class="icon wk" />
            </div>
            <div class="info">
              <div class="title">
                {{ item.label }}
              </div>
              <div class="number">
                {{ item.num }}
              </div>
            </div>
          </flexbox>
          <flexbox v-if="rateText !== ''" direction="column" class="brief-item__others">
            <div class="text">
              {{ rateText }}
            </div>
            <div :class="item.status" class="rate">
              <span class="rate__num">{{ item.rate }}%</span>
              <span
                :class="`el-icon-${item.status}`"
                class="rate__icon" />
            </div>
          </flexbox>
        </flexbox>
      </div>
    </div>

    <flexbox class="section">
      <sale-statistics
        :filter-value="filterValue"
        class="left" />
      <data-statistics
        :filter-value="filterValue"
        class="right" />
    </flexbox>
    <flexbox class="section">
      <received-statistics
        :filter-value="filterValue"
        class="left" />
      <performance-chart
        :filter-value="filterValue"
        class="right" />
    </flexbox>
    <flexbox class="section">
      <sales-funnel
        :filter-value="filterValue"
        class="left" />
    </flexbox>

    <!-- 销售简报列表 -->
    <report-list
      :show.sync="reportListShow"
      :title="reportData.title"
      :placeholder="reportData.placeholder"
      :crm-type="reportData.crmType"
      :request="reportData.request"
      :record-request="reportData.recordRequest"
      :params="reportData.params"
      :field-list="fieldReportList"
      :paging="reportData.paging"
      :sortable="reportData.sortable"/>
  </div>
</template>

<script>
import {
  crmIndexIndex,
  crmIndexIndexListAPI,
  crmQueryRecordConuntAPI,
  crmIndexGetRecordListAPI
} from '@/api/customermanagement/workbench'

import SaleStatistics from './components/saleStatistics'
import DataStatistics from './components/dataStatistics'
import ReceivedStatistics from './components/receivedStatistics'
import SalesFunnel from './components/salesFunnel'
import PerformanceChart from './components/performanceChart'
import timeTypeSelect from '@/components/timeTypeSelect'
import ReportList from './components/reportList'
import membersDep from '@/components/selectEmployee/membersDep'

import { mapGetters } from 'vuex'

/**
 * TODO 2、员工部门筛选选择，
 *      3、员工部门筛选后刷新销售简报数据
 */

export default {
  name: 'Workbench',
  components: {
    SaleStatistics,
    DataStatistics,
    ReceivedStatistics,
    SalesFunnel,
    PerformanceChart,
    timeTypeSelect,
    ReportList,
    membersDep
  },
  data() {
    return {
      briefList: [
        { label: '新增客户(人)', title: '新增客户', type: 'customer', labelValue: 2, field: 'customerCount', icon: 'wk-customer', num: '', rate: '', status: '', color: '#2362FB' },
        { label: '新增联系人(人)', title: '新增联系人', type: 'contacts', labelValue: 3, field: 'contactsCount', icon: 'wk-contacts', num: '', rate: '', status: '', color: '#27BA4A' },
        { label: '新增商机(个)', title: '新增商机', type: 'business', labelValue: 5, field: 'businessCount', icon: 'wk-business', num: '', rate: '', status: '', color: '#FB9323' },
        { label: '新增合同(个)', title: '新增合同', type: 'contract', labelValue: 6, field: 'contractCount', icon: 'wk-contract', num: '', rate: '', status: '', color: '#4A5BFD' },
        { label: '合同金额(元)', title: '合同金额', type: 'contract', labelValue: 6, field: 'contractMoney', icon: 'wk-receivables', num: '', rate: '', status: '', color: '#19B5F6' },
        { label: '商机金额(元)', title: '商机金额', type: 'business', labelValue: 5, field: 'businessMoney', icon: 'wk-icon-opportunities', num: '', rate: '', status: '', color: '#AD5CFF' },
        { label: '回款金额(元)', title: '回款金额', type: 'receivables', labelValue: 7, field: 'receivablesMoney', icon: 'wk-receivables', num: '', rate: '', status: '', color: '#FFB940' },
        { label: '新增跟进记录(条)', title: '新增跟进记录', type: 'record', labelValue: '', field: 'recordCount', icon: 'wk-record', num: '', rate: '', status: '', color: '#4A5BFD' }
      ],
      filterValue: {
        users: [],
        strucs: [],
        timeLine: 'year'
      },

      loading: false,

      reportListShow: false,
      fieldReportList: null,
      reportData: {
        title: '',
        placeholder: '',
        crmType: '',
        request: null,
        recordRequest: crmIndexGetRecordListAPI,
        params: null,
        paging: true,
        sortable: false
      }
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'collapse'
    ]),
    // 筛选员工/部门展示文本
    filterText() {
      const users = this.filterValue.users || []
      const strucs = this.filterValue.strucs || []
      const userLen = users.length
      const strucsLen = strucs.length
      if (userLen === 1 && strucsLen === 0) return users[0].realname
      if (strucsLen === 1 && userLen === 0) return strucs[0].name
      let str = ''
      if (userLen > 0) str = userLen + '个员工'
      if (strucsLen > 0) str = `${str}，${strucsLen}个部门`
      return str || '本人及下属'
    },
    // 如果只筛选一个人则头像显示当前被筛选人的头像，否则显示默认错误头像
    avatarData() {
      const users = this.filterValue.users || []
      const strucs = this.filterValue.strucs || []
      if (users.length === 1 && strucs.length === 0) return users[0]
      return {
        showIcon: true,
        realname: '',
        img: ''
      }
    },
    // 销售简报百分比提示语
    rateText() {
      if (this.filterValue.timeLine.type === 'custom') return ''
      const type = this.filterValue.timeLine.value || 'year'
      return {
        today: '较昨天',
        yesterday: '较前天',
        week: '较上周',
        lastWeek: '较前周',
        month: '较上月',
        lastMonth: '较前月',
        quarter: '较上季度',
        lastQuarter: '较上上季度',
        year: '较去年',
        lastYear: '较前年'
      }[type] || ''
    }
  },
  watch: {
    collapse() {
      setTimeout(() => {
        this.$bus.emit('window-resize')
      }, 300)
    },
    filterValue: {
      handler() {
        this.getBriefData()
      },
      deep: true
    }
  },
  created() {
    // this.filterValue.users.push(this.userInfo)
  },
  mounted() {
    this.$nextTick(() => {
      window.addEventListener('resize', this.resizeFn)
    })
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.resizeFn)
    this.$bus.off('window-resize')
  },
  methods: {
    /**
     * 窗口尺寸发生改变实时调整 EChart 尺寸
     */
    resizeFn() {
      if (this.timer) return
      this.timer = setTimeout(() => {
        clearTimeout(this.timer)
        this.timer = null
      }, 30)
      this.$bus.emit('window-resize')
    },

    timeTypeChange(data) {
      this.filterValue.timeLine = data
    },

    /**
     * 员工部门选择
     */
    userStrucSelect(users, strucs) {
      this.filterValue.users = users
      this.filterValue.strucs = strucs
    },

    /**
     * 获取请求参数
     */
    getBaseParams() {
      const params = {
        userIds: this.filterValue.users.map(item => item.userId).join(',') || '',
        deptIds: this.filterValue.strucs.map(item => item.id).join(',') || ''
      }
      if (this.filterValue.timeLine.type) {
        if (this.filterValue.timeLine.type === 'custom') {
          params.startTime = this.filterValue.timeLine.startTime.replace(/\./g, '-')
          params.endTime = this.filterValue.timeLine.endTime.replace(/\./g, '-')
        } else {
          params.type = this.filterValue.timeLine.value || ''
        }
      }
      return params
    },
    /**
     * 获取销售简报数据
     */
    getBriefData() {
      this.loading = true
      crmIndexIndex(this.getBaseParams()).then(res => {
        this.loading = false
        this.briefList.forEach(item => {
          item.num = res.data[item.field] || 0 // 数量
          if (Number(res.prev[item.field]) !== 0) {
            // status状态   top 增长  bottom 下降 '' 持平
            item.status = Number(res.prev[item.field]) > 0 ? 'top' : 'bottom'
          } else {
            item.status = ''
          }
          item.rate = this.accMul(res.prev[item.field], 100) // 增长比例/下降比例
        })
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * 两个浮点数相乘
     * @param arg1
     * @param arg2
     * @return {number}
     */
    accMul(arg1, arg2) {
      let m = 0
      const s1 = arg1.toString()
      const s2 = arg2.toString()
      try {
        m += s1.split('.')[1].length
      } catch (e) {
        // console.log(e)
      }
      try {
        m += s2.split('.')[1].length
      } catch (e) {
        // console.log(e)
      }
      return Number(s1.replace('.', '')) * Number(s2.replace('.', '')) / Math.pow(10, m)
    },

    /**
     * 销售简报查看
     */
    reportClick(item) {
      if (item.type) {
        this.reportData.title = `销售简报-${item.title}`
        this.reportData.placeholder = {
          customer: '请输入客户名称/手机/电话',
          contacts: '请输入联系人姓名/手机/电话',
          business: '请输入商机名称',
          business_status: '请输入商机名称',
          contract: '请输入合同名称',
          receivables: '请输入回款编号',
          record: ''
        }[item.type]


        this.reportData.crmType = item.type
        this.reportData.params = this.getBaseParams()
        if (item.type == 'record') {
          this.fieldReportList = [
            {
              label: '模块',
              prop: 'crmType',
              width: 300
            },
            {
              label: '新增跟进记录数',
              prop: 'count'
            }
          ]
          this.reportData.request = crmQueryRecordConuntAPI
          this.reportData.paging = false
          this.reportData.sortable = false
        } else {
          this.fieldReportList = null
          this.reportData.request = crmIndexIndexListAPI
          this.reportData.paging = true
          this.reportData.sortable = 'custom'
        }

        this.reportData.params.label = item.labelValue
        this.reportListShow = true
      }
    }
  }
}
</script>

<style scoped lang="scss">
  .crm-workbench {
    width: 100%;
    min-width: 1200px;
    height: 100%;
    padding: 15px 20px 20px;
    overflow: auto;

    .head {
      margin-bottom: 10px;
      .user-box {
        width: unset;
        height: 36px;
        padding: 4px 7px;
        border: 1px solid #E1E1E1;
        border-radius: $xr-border-radius-base;
        background-color: white;
        margin-right: 20px;
        display: flex;
        cursor: pointer;
        .user-icon {
          background: $xr-color-primary;
          color: white;
          padding: 5px 6px;
          border-radius: 50%;
        }
        .username {
          font-size: 12px;
          margin: 0 8px;
        }
      }
      .el-radio-group {
        /deep/ .el-radio-button__inner {
          font-size: 12px;
          padding: 11px 12px;
        }
      }
      /deep/ .type-select {
        height: 36px;
      }
      .others {
        flex: 1;
        .el-button {
          font-size: 12px;
          padding: 10px 12px;
          /deep/ [class*="el-icon-"] + span {
            margin-left: 0;
          }
        }
      }
    }

    .brief-box {
      width: 100%;
      background-color: white;
      border: 1px solid #e6e6e6;
      border-radius: $xr-border-radius-base;
      .brief-title {
        padding: 15px 20px 0;
        .icon {
          color: #50CF9E;
          font-size: 18px;
        }
        .text {
          font-size: 16px;
          font-weight: bold;
          margin-left: 5px;
        }
      }
      .brief {
        width: 100%;
        padding: 10px 10px 14px 10px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        flex-wrap: wrap;
        .brief-item {
          cursor: pointer;
          width: calc(25% - 20px);
          height: 88px;
          box-shadow: 0 0 16px 0 rgba(0,0,0,0.08);
          border-radius: $xr-border-radius-base;
          margin: 10px;
          .brief-item__body {
            flex: 1;
            .icon-box {
              width: 36px;
              height: 36px;
              line-height: 36px;
              text-align: center;
              border-radius: 50%;
              margin-right: 10px;
              margin-left: 15px;
              .icon {
                color: white;
                font-size: 19px;
              }
            }
            .info {
              .title {
                font-size: 13px;
              }
              .number {
                font-size: 23px;
                font-weight: bold;
                line-height: 1;
                margin-top: 8px;
              }
            }
          }
          .brief-item__others {
            position: relative;
            width: 100px;
            &:before {
              position: absolute;
              top: 7.5%;
              left: 0;
              content: '';
              width: 1px;
              height: 85%;
              background-color: #e6e6e6;
              display: block;
            }
            .text {
              font-size: 12px;
              margin-left: -5px;
            }
            .rate {
              font-size: 14px;
              color: #2BBF24;
              margin-top: 8px;
              .rate__icon {
                font-size: 12px;
              }
              &.bottom {
                color: #F24B4B;
              }
              &.top {
                color: #2BBF24;
              }
            }
          }
          &:hover {
            box-shadow: 0 0 16px 0 rgba(0,0,0,0.2);
          }
        }
      }
    }

    .section {
      margin-top: 18px;
      .left {
        width: calc(60.5% - 20px);
        margin-right: 20px;
      }
      .right {
        width: 39.5%;
      }
    }
  }
</style>
