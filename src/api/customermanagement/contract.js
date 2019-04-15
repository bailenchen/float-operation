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
    url: 'CrmContract/queryPage',
    method: 'post',
    data: data
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

// crm 更新
export function crmContractUpdate(data) {
  return request({
    url: 'crm/contract/update',
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
 * 合同审核
 * @param {*} data
 * id
 * status 1通过0拒绝
 * content
 */
export function crmContractCheck(data) {
  return request({
    url: 'crm/contract/check',
    method: 'post',
    data: data
  })
}

/**
 * 合同撤回审核
 * @param {*} data
 * id
 * status 1通过 0拒绝
 * 0失败，1通过，2撤回，3创建，4待审核 状态信息
 */
export function crmContractRevokeCheck(data) {
  return request({
    url: 'crm/contract/revokeCheck',
    method: 'post',
    data: data
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
 * 相关团队创建
 * @param {*} data
 * types crm_leads
 * types_id 分类ID
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
