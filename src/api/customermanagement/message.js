import request from '@/utils/request'

/**
 * 待审核合同
 * @param {*} data
 */
export function crmMessageCheckContractAPI(data) {
  return request({
    url: 'CrmBackLog/checkContract',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 待审核回款
 * @param {*} data
 */
export function crmMessageCheckReceivablesAPI(data) {
  return request({
    url: 'CrmBackLog/checkReceivables',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 今日需联系客户
 * @param {*} data
 */
export function crmMessageTodayCustomerAPI(data) {
  return request({
    url: 'CrmBackLog/todayCustomer',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 待跟进线索
 * @param {*} data
 */
export function crmMessageFollowLeadsAPI(data) {
  return request({
    url: 'CrmBackLog/followLeads',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}


/**
 * 待跟进客户
 * @param {*} data
 */
export function crmMessageFollowCustomerAPI(data) {
  return request({
    url: 'CrmBackLog/followCustomer',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 分配给我的客户客户
 * @param {*} data
 */
export function crmMessageAllotCustomerAPI(data) {
  return request({
    url: 'CrmBackLog/allotCustomer',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 即将到期合同
 * @param {*} data
 */
export function crmMessagEndContractAPI(data) {
  return request({
    url: 'CrmBackLog/endContract',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 待回款合同
 * @param {*} data
 */
export function crmMessagRemindreceivablesplanAPI(data) {
  return request({
    url: 'CrmBackLog/remindReceivables',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 待办消息数
 * @param {*} data
 */
export function crmMessagNumAPI(data) {
  return request({
    url: 'CrmBackLog/num',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 待进入客户池
 * @param {*} data
 */
export function crmMessagRemindCustomerAPI(data) {
  return request({
    url: 'CrmBackLog/putInPoolRemind',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 待回访合同
 * @param {*} data
 */
export function crmMessagVisitRemindAPI(data) {
  return request({
    url: 'CrmBackLog/returnVisitRemind',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 承诺到访
 * @param {*} data
 */
export function crmMessagePromiseAPI(data) {
  return request({
    url: 'CrmBackLog/followUpLeads',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 标记为已处理
 * @param data
 */
export function crmMessageHandleStatusAPI(data) {
  return request({
    url: 'CrmBackLog/handleStatus',
    method: 'post',
    data: data
  })
}

/**
 * 全部标记今日需要跟进
 * @param data
 */
export function UpdateAllTodayCustomer(data) {
  return request({
    url: 'CrmBackLog/updateTodayCustomer',
    method: 'post',
    data: data
  })
}
/**
 * 全部标记承诺到访LEADS
 * @param data
 */
export function UpdateAllFollowUpLeads(data) {
  return request({
    url: 'CrmBackLog/updateFollowUpLeads',
    method: 'post',
    data: data
  })
}

/**
 * 待审核争议
 * @param data
 */
export function crmMessageCheckDisputedAPI(data) {
  return request({
    url: 'CrmBackLog/toBeDisputed',
    method: 'post',
    data: data
  })
}

/**
 * 争议标记为已处理
 * @param data
 */
export function crmMessageHandleDisputedStatusAPI(data) {
  return request({
    url: 'CrmBackLog/handleStatuses',
    method: 'post',
    data: data
  })
}


/**
 * 待审核合同业绩分配表头
 * @param {*} data
 */
export function crmContractAllocHeaderAPI(data) {
  return request({
    url: 'field/queryListHead',
    method: 'post',
    data: data
  })
}

/**
 * 待审核合同业绩分配列表
 * @param {*} data
 */
export function crmContractAllocListAPI(data) {
  return request({
    url: 'CrmBackLog/performanceDistribution',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 待审核合同业绩分配 -- 审批
 * @param {*} data
 */
export function crmExamineContractAllocListAPI(data) {
  return request({
    url: 'CrmBackLog/updatePerformanceDistribution',
    method: 'post',
    data: data
  })
}

/**
 * 待审核资金退款
 * @param {*} data
 */
export function crmCheckWaterListAPI(data) {
  return request({
    url: 'CrmBackLog/checkWater',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 待审核退款列表
 * @param {*} data
 */
export function crmRefoundListAPI(data) {
  return request({
    url: 'CrmBackLog/fundAudit',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

