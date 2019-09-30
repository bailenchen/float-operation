<template>
  <div class="crm-workbench">
    <flexbox class="head">
      <flexbox class="user-box">
        <div
          v-photo="userInfo"
          v-lazy:background-image="$options.filters.filterUserLazyImg(userInfo.img || '')"
          class="user-img div-photo" />
        <span class="username">{{ userInfo.username }}</span>
        <span class="el-icon-caret-bottom icon" />
      </flexbox>
      <el-radio-group v-model="timeType">
        <el-radio-button label="today">今日</el-radio-button>
        <el-radio-button label="week">本周</el-radio-button>
        <el-radio-button label="month">本月</el-radio-button>
        <el-radio-button label="year">本年</el-radio-button>
        <el-radio-button label="custom">自定义</el-radio-button>
      </el-radio-group>
      <flexbox justify="flex-end" class="others">
        <el-button
          type="primary"
          icon="el-icon-menu">
          管理仪表盘
        </el-button>
      </flexbox>
    </flexbox>

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
        <flexbox direction="column" class="brief-item__others">
          <div class="text">
            同比
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

    <flexbox class="section">
      <sale-statistics class="left" />
      <data-statistics class="right" />
    </flexbox>
    <flexbox class="section">
      <received-statistics class="left" />
      <sales-funnel class="right" />
    </flexbox>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SaleStatistics from './components/saleStatistics'
import DataStatistics from './components/dataStatistics'
import ReceivedStatistics from './components/receivedStatistics'
import SalesFunnel from './components/salesFunnel'
export default {
  name: 'Workbench',
  components: {
    SaleStatistics,
    DataStatistics,
    ReceivedStatistics,
    SalesFunnel
  },
  data() {
    return {
      timeType: 'today',
      briefList: [
        { label: '新增客户(人)', icon: 'wk-customer', num: '12', rate: '12', status: 'top', color: '#2362FB' },
        { label: '新增联系人数(人)', icon: 'wk-contacts', num: '12', rate: '12', status: 'top', color: '#27BA4A' },
        { label: '新增商机数(个)', icon: 'wk-business', num: '12', rate: '12', status: 'top', color: '#FB9323' },
        { label: '阶段变化商机(个)', icon: 'wk-icon-opportunities', num: '12', rate: '1.5', status: 'bottom', color: '#AD5CFF' },
        { label: '合同成交量(笔)', icon: 'wk-contract', num: '12', rate: '12', status: 'top', color: '#4A5BFD' },
        { label: '收款金额(元)', icon: 'wk-receivables', num: '12', rate: '0.5', status: 'bottom', color: '#FFB940' },
        { label: '新增跟进记录条(条)', icon: 'wk-record', num: '12', rate: '12', status: 'top', color: '#4A5BFD' },
        { label: '公海新增客户数(个)', icon: 'wk-seas', num: '12', rate: '12', status: 'top', color: '#19B5F6' },
        { label: '今日待联系客户(个)', icon: 'wk-customer', num: '8', rate: '4.5', status: 'bottom', color: '#2362FB' }
      ]
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  methods: {}
}
</script>

<style scoped lang="scss">
  .crm-workbench {
    width: 100%;
    min-width: 1600px;
    height: 100%;
    padding: 20px;
    overflow: auto;

    .head {
      margin-bottom: 20px;
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

    .brief {
      width: 100%;
      background-color: white;
      padding: 10px 10px 14px 10px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      flex-wrap: wrap;
      .brief-item {
        width: calc(20% - 20px);
        height: 100px;
        box-shadow: 0 0 16px 0 rgba(0,0,0,0.08);
        border-radius: 4px;
        margin: 10px;
        .brief-item__body {
          flex: 1;
          .icon-box {
            width: 50px;
            height: 50px;
            line-height: 50px;
            text-align: center;
            border-radius: 50%;
            margin-right: 10px;
            margin-left: 18px;
            .icon {
              color: white;
              font-size: 24px;
            }
          }
          .info {
            .title {}
            .number {
              font-size: 28px;
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
