<template>
  <div style="height:100%;">
    <flexbox class="message-header"><img
      src="@/assets/img/crm/todo.png"
      class="title-icon">
      <span class="title">待办事项</span>
    </flexbox>
    <div class="message-body">
      <div class="message-content">
        <div class="message-body-side">
          <xr-menu-item
            v-for="(item, index) in showLeftSides"
            :key="index"
            :label="item.name"
            :icon-color="item.color"
            :icon-class="item.iconClass"
            :select="leftType==item.infoType"
            @click.native="sideClick(item)"/>
        </div>
        <div class="message-body-content">
          <c-r-m-message
            v-for="(item, index) in showLeftSides"
            v-show="leftType==item.infoType"
            :key="index"
            :crm-type="item.crmType"
            :info-type="item.infoType"
            :info-title="item.name"
            :info-tips="item.tips"
            :show="leftType==item.infoType"
            :icon-data="item"
            @on-handle="messageHandle"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CRMMessage from './compenents/CRMMessage' // 系统消息
import { mapGetters } from 'vuex'
import { objDeepCopy } from '@/utils'
import XrMenuItem from '@/components/xr-menu/XrMenuItem'

export default {
  /** 客户管理 的 消息列表 */
  name: 'Message',

  components: {
    CRMMessage,
    XrMenuItem
  },

  data() {
    return {
      leftType: 'todayCustomer',
      leftSides: [
        {
          name: '今日需联系客户',
          crmType: 'customer',
          color: '#2362FB',
          iconClass: 'wk wk-customer',
          infoType: 'todayCustomer',
          num: 0,
          tips: '下次跟进时间为今日的客户',
          hidden: false
        },
        {
          name: '分配给我的线索',
          crmType: 'leads',
          color: '#704AFD',
          iconClass: 'wk wk-leads',
          infoType: 'followLeads',
          num: 0,
          tips: '转移之后未跟进的线索',
          hidden: false
        },
        {
          name: '分配给我的客户',
          crmType: 'customer',
          color: '#19B5F6',
          iconClass: 'wk wk-s-seas',
          infoType: 'followCustomer',
          num: 0,
          tips: '转移、领取、分配之后未跟进的客户，默认显示自己负责的客户',
          hidden: false
        },
        {
          name: '待进入公海的客户',
          crmType: 'customer',
          color: '#26D4DA',
          iconClass: 'wk wk-seas',
          infoType: 'putInPoolRemind',
          num: 0,
          tips: '',
          hidden: false
        },
        {
          name: '待审核合同',
          crmType: 'contract',
          color: '#FD5B4A',
          iconClass: 'wk wk-contract',
          infoType: 'checkContract',
          num: 0,
          tips: '',
          hidden: false
        },
        {
          name: '待审核回款',
          crmType: 'receivables',
          color: '#FFB940',
          iconClass: 'wk wk-receivables',
          infoType: 'checkReceivables',
          num: 0,
          tips: '',
          hidden: false
        },
        {
          name: '待回款提醒',
          crmType: 'receivables_plan',
          color: '#27BA4A',
          iconClass: 'wk wk-bell',
          infoType: 'remindReceivablesPlan',
          num: 0,
          tips: '',
          hidden: false
        },
        {
          name: '即将到期的合同',
          crmType: 'contract',
          color: '#FF7A38',
          iconClass: 'wk wk-contract',
          infoType: 'endContract',
          num: 0,
          tips: '根据“合同到期时间”及设置的“提前提醒天数”提醒',
          hidden: false
        }
      ]
    }
  },

  computed: {
    ...mapGetters(['messageNum']),

    showLeftSides() {
      return this.leftSides.filter(item => {
        return !item.hidden
      })
    }
  },

  watch: {
    /** 变化就刷新数据 */
    messageNum() {
      this.refreshNum()
    }
  },

  mounted() {
    this.refreshNum()
    /** 控制table的高度 */
    window.onresize = () => {
      var offsetHei = document.documentElement.clientHeight
      this.$bus.emit('message-scroll', offsetHei - 300)
    }
  },

  methods: {
    /**
     * 刷新消息数据
     */
    refreshNum() {
      for (let index = 0; index < this.leftSides.length; index++) {
        const element = this.leftSides[index]
        if (this.messageNum.hasOwnProperty(element.infoType)) {
          element.num = this.messageNum[element.infoType] || 0
          element.hidden = false
        } else {
          element.hidden = true
        }
      }
    },

    /**
     * 消息页面点击操作
     */
    messageHandle(data) {
      if (data.type == 'follow') {
        const copyNum = objDeepCopy(this.messageNum)
        const num = parseInt(copyNum[data.infoType]) - data.value
        copyNum[data.infoType] = num > 0 ? num : 0
        this.$store.commit('SET_MESSAGENUM', copyNum)
      }
    },

    /**
     * 侧边点击
     */
    sideClick(item) {
      this.leftType = item.infoType
    }
  }
}
</script>

<style lang="scss" scoped>
.message-header {
  margin-left: 28px;
  height: 60px;
  .title-icon {
    width: 30px;
    height: 30px;
    margin-right: 10px;
  }

  .title {
    font-size: 16px;
    font-weight: 600;
  }
}
.message-body {
  position: relative;
  height: calc(100% - 75px);
  padding-left: 15px;
}
.message-content {
  position: relative;
  height: 100%;
}

.message-body-side {
  width: 200px;
  font-size: 14px;
  background-color: white;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 1;
  border: 1px solid #e6e6e6;
  border-radius: 2px;
  overflow-y: auto;
  .side-item {
    position: relative;
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    font-size: 13px;
    cursor: pointer;
    i {
      color: #999;
    }
  }
}
.message-body-content {
  margin-left: 210px;
  height: 100%;
  overflow: hidden;
  background-color: white;
  border: 1px solid #e6e6e6;
  border-radius: 2px;
}

.side-item-default {
  color: #333;
  border-right: 2px solid transparent;
}

.side-item-select {
  color: #409eff;
  border-right: 2px solid #46cdcf;
  background-color: #ecf5ff;
}

.block {
  padding: 10px;
}

.el-badge /deep/ .el-badge__content {
  border: none;
  top: 0;
}

.el-badge {
  position: absolute;
  right: 15px;
  top: 0;
}
</style>
