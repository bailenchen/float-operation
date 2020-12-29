import {
  crmMessagNumAPI
} from '@/api/customermanagement/message'

/**
 * 消息记录
 */
const app = {
  state: {
    // 待办事项消息
    messageNum: {
      todayCustomer: 0, // 今日需跟进LEADS
      followCustomer: 0, // 承诺到访LEADS
      checkDisputed: 10, // 待审核的争议
      allotCustomer: 0, // 分配给我的客户
      disputed: 0, // 待审核的争议
      checkContract: 0, // 待审核合同
      putInPoolRemind: 0, // 待进入公海的LEADS
      performanceDistributions: 0, // 待审核的业绩分配
      checkWater: 0, // 待审核的资金收款
      refundNumber: 0, // 待审核资金退款
      checkRefund: 0, // 待审核的充值返还
      totalNum: 0
    },
    showRing: false,
    showTimer: false,
    showBusy: false,
    showCallOut: true,
    isCall: false, // 呼叫中心权限
    callinTime: '00:00:00'
  },

  mutations: {
    /**
     * 更改待办事项
     */
    SET_MESSAGENUM: (state, messageNum) => {
      let totalNum = 0
      for (const key in messageNum) {
        if (key != 'totalNum') {
          totalNum += (messageNum[key] || 0)
        }
      }
      messageNum.totalNum = totalNum
      state.messageNum = messageNum
    },
    /**
     * 通话计时
     */
    CALL_STATUS: (state, callinTime) => {
      state.callinTime = callinTime
    },
    /**
     * 振铃中
     */
    SHOW_RING: (state, showRing) => {
      state.showRing = showRing
    },
    /**
     * 是否展示通话
     */
    SHOW_TIMER: (state, showTimer) => {
      state.showTimer = showTimer
    },
    /**
     * 是否展示置忙
     */
    SHOW_BUSY: (state, showBusy) => {
      state.showBusy = showBusy
    },
    /**
     * 展示来电弹框
     */
    SHOW_CALL_OUT: (state, showCallOut) => {
      state.showCallOut = showCallOut
    },
    /**
     * 呼叫中心权限
     */
    GET_IS_CALL: (state, isCall) => {
      state.isCall = isCall
    }
  },

  actions: {
    // 登录
    GetMessageNum({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        crmMessagNumAPI()
          .then(response => {
            commit('SET_MESSAGENUM', response.data)
            commit('SET_CRMROUTERSNUM', state.messageNum.totalNum)
            resolve(response)
          })
          .catch(error => {
            reject(error)
          })
      })
    }

  }
}

export default app
