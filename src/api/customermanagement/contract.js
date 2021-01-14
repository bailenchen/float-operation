import request from '@/utils/request'

// crm 新建合同
export function crmContractSave(data) {
  return request({
    url: 'CrmContract/saveAndUpdate',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// crm 列表
export function crmContractIndex(data) {
  return request({
    url: 'CrmContract/queryPageList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 删除
export function crmContractDelete(data) {
  return request({
    url: 'CrmContract/deleteByIds',
    method: 'post',
    data: data
  })
}

// crm 详情
export function crmContractRead(data) {
  return request({
    url: 'CrmContract/queryById',
    method: 'post',
    data: data
  })
}

/**
 * 回款计划创建
 * @param {*} data
 */
export function crmReceivablesPlanSave(data) {
  return request({
    url: 'Crm/ReceivablesPlan/saveAndUpdate',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 合同相关产品
 * @param {*} data
 * contract_id
 */
export function crmContractProduct(data) {
  return request({
    url: 'CrmContract/qureyProductListByContractId',
    method: 'post',
    data: data
  })
}

// 转移
export function crmContractTransfer(data) {
  return request({
    url: 'CrmContract/transfer',
    method: 'post',
    data: data
  })
}

/**
 * 合同下回款
 * @param {*} data
 */
export function crmContractQueryReceivables(data) {
  return request({
    url: 'CrmContract/qureyReceivablesListByContractId',
    method: 'post',
    data: data
  })
}

/**
 * 合同下回款计划
 * @param {*} data
 */
export function crmContractQueryReceivablesPlan(data) {
  return request({
    url: 'CrmContract/qureyReceivablesPlanListByContractId',
    method: 'post',
    data: data
  })
}

/**
 * 跟进记录
 * @param {*} data
 */
export function crmContractRecordSave(data) {
  return request({
    url: 'CrmContract/addRecord',
    method: 'post',
    data: data
  })
}
export function crmContractRecordIndex(data) {
  return request({
    url: 'CrmContract/getRecord',
    method: 'post',
    data: data
  })
}
// 团队操作

/**
 * 团队成员创建
 * @param {*} data
 */
export function crmContractSettingTeamSave(data) {
  return request({
    url: 'CrmContract/addMembers',
    method: 'post',
    data: data
  })
}

export function crmContractSettingTeamDelete(data) {
  return request({
    url: 'CrmContract/deleteMembers',
    method: 'post',
    data: data
  })
}

export function crmContractTeamMembers(data) {
  return request({
    url: 'CrmContract/getMembers',
    method: 'post',
    data: data
  })
}

export function crmContractUpdateMembers(data) {
  return request({
    url: 'CrmContract/updateMembers',
    method: 'post',
    data: data
  })
}

// 退出团队
export function crmContractExitTeam(data) {
  return request({
    url: 'CrmContract/exitTeam',
    method: 'post',
    data: data
  })
}

/**
 * 新建回款查询回款计划
 * @param {*} data
 */
export function crmQueryReceivablesPlansByContractId(data) {
  return request({
    url: 'CrmContract/queryReceivablesPlansByContractId',
    method: 'post',
    data: data
  })
}

/**
 * 作废
 * @param {*} data
 */
export function crmContractCancelAPI(data) {
  return request({
    url: 'CrmContract/contractDiscard',
    method: 'post',
    data: data
  })
}

/**
 * 附件列表
 * @param {*} data
 *
 */
export function crmContractFileListAPI(data) {
  return request({
    url: 'CrmContract/queryFileList',
    method: 'post',
    data: data
  })
}

/**
 * tab数量
 * @param {*} data
 *
 */
export function crmContractNumAPI(data) {
  return request({
    url: 'CrmContract/num',
    method: 'post',
    data: data
  })
}

/**
 * 合同导出
 * @param {*} data
 */
export function crmContractExcelExportAPI(data) {
  return request({
    url: 'CrmContract/batchExportExcel',
    method: 'post',
    data: data,
    responseType: 'blob',
    timeout: 60000
  })
}

export function crmContractExcelAllExportAPI(data) {
  return request({
    url: 'CrmContract/allExportExcel',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 回访
 * @param {*} data
 */
export function crmContractQueryVisitAPI(data) {
  return request({
    url: 'CrmContract/queryReturnVisit',
    method: 'post',
    data: data
  })
}

/**
 * 获取可赠送课次
 * @param {*} data
 */
export function QueryGiveAPI(data) {
  return request({
    url: 'CrmContract/queryGive',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 业绩分配
 * @param {*} data
 */
export function markAllocSaveAPI(data) {
  return request({
    url: 'CrmContract/allotPerformance',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 查询业绩分配
 * @param {*} data
 */
export function queryMarkAllocSaveAPI(data) {
  return request({
    url: 'CrmContract/queryallotPerformance',
    method: 'post',
    data: data
  })
}

/**
 * 查询合同充值列表
 * @param {*} data
 */
export function queryRechargeListAPI(data) {
  return request({
    url: 'CrmContract/queryContractCapital',
    method: 'post',
    data: data
  })
}

/**
 * 合同 放弃\取消
 * @param {*} data
 *
 */
export function CrmContractAffirmContractStatusAPI(data) {
  return request({
    url: 'CrmContract/affirmContractStatus',
    method: 'post',
    data: data
  })
}

/**
 * 合同 续签/新签
 * @param {*} data
 *
 */
export function queryIsNewByCustomerIdAPI(data) {
  return request({
    url: 'CrmContract/queryIsNewByCustomerId',
    method: 'post',
    data: data
  })
}


// crm 下载
export function crmAccountWaterDown(data) {
  return request({
    url: 'CrmContract/documents',
    method: 'post',
    data: data
  })
}

// 额外赠送合同授权审批
export function judgeGiveAPI(data) {
  return request({
    url: 'adminDictionary/judgeGive',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 生成合同模板
export function generateTemplateAPI(data) {
  return request({
    url: 'CrmContract/generate',
    method: 'post',
    data: data
  })
}
