<template>
  <div ref="workbench" class="crm-workbench">
    <flexbox class="head">
      <flexbox class="user-box">
        <div
          v-photo="avatarData"
          v-lazy:background-image="$options.filters.filterUserLazyImg(avatarData.img || '')"
          class="user-img div-photo" />
        <span class="username">{{ filterText }}</span>
        <span class="el-icon-caret-bottom icon" />
      </flexbox>

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
          class="brief-item">
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SaleStatistics from './components/saleStatistics'
import DataStatistics from './components/dataStatistics'
import ReceivedStatistics from './components/receivedStatistics'
import SalesFunnel from './components/salesFunnel'
import PerformanceChart from './components/performanceChart'
import timeTypeSelect from '@/components/timeTypeSelect'

import { crmIndexIndex } from '@/api/customermanagement/workbench'

/**
 * TODO 1、销售简报及点击查看详情（回款金额只需要保留整数）
 *      2、员工部门筛选选择，
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
    timeTypeSelect
  },
  data() {
    return {
      briefList: [
        { label: '新增客户(人)', field: '', icon: 'wk-customer', num: '12', rate: '88.5', status: 'top', color: '#2362FB' },
        { label: '新增联系人(人)', field: '', icon: 'wk-contacts', num: '12', rate: '12', status: 'top', color: '#27BA4A' },
        { label: '新增商机(个)', field: '', icon: 'wk-business', num: '12', rate: '12', status: 'top', color: '#FB9323' },
        { label: '新增合同(个)', field: '', icon: 'wk-contract', num: '12', rate: '12', status: 'top', color: '#4A5BFD' },
        { label: '阶段变化商机(个)', field: '', icon: 'wk-icon-opportunities', num: '12', rate: '1.5', status: 'bottom', color: '#AD5CFF' },
        { label: '回款金额(元)', field: '', icon: 'wk-receivables', num: '56218', rate: '0.5', status: 'bottom', color: '#FFB940' },
        { label: '新增跟进记录(条)', field: '', icon: 'wk-record', num: '12', rate: '12', status: 'top', color: '#4A5BFD' },
        { label: '公海新增客户(个)', field: '', icon: 'wk-seas', num: '12', rate: '0.00', status: '', color: '#19B5F6' }
      ],
      filterValue: {
        users: [],
        strucs: [],
        timeLine: 'year'
      },

      loading: false
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
      return str || ''
    },
    // 如果只筛选一个人则头像显示当前被筛选人的头像，否则显示默认错误头像
    avatarData() {
      const users = this.filterValue.users || []
      const strucs = this.filterValue.strucs || []
      if (users.length === 1 && strucs.length === 0) return users[0]
      return {
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
    }
  },
  created() {
    this.filterValue.users.push(this.userInfo)
    this.getBriefData()
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
      this.getBriefData()
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
        // const data = res.data
        // this.briefList.forEach(item => {
        //   if (res.data.hasOwnProperty(item.field)) {
        //     item.num = data[item.field].num || 0 // 数量
        //     item.status = data[item.field].status || '' // 状态 top 增长  bottom 下降 '' 持平
        //     item.rate = data[item.field].rate || '0.00' // 增长比例/下降比例
        //   }
        // })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
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
        border-radius: 4px;
        background-color: white;
        margin-right: 20px;
        display: flex;
        cursor: pointer;
        .user-img {
          width: 28px;
          height: 28px;
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
      border-radius: 4px;
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
          width: calc(25% - 20px);
          height: 88px;
          box-shadow: 0 0 16px 0 rgba(0,0,0,0.08);
          border-radius: 4px;
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
