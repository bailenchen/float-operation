import request from '@/utils/request'

// crm 新建商机
export function crmBusinessSave(data) {
  return request({
    url: 'CrmBusiness/addOrUpdate',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// crm 列表
export function crmBusinessIndex(data) {
  return request({
    url: 'CrmBusiness/queryPageList',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

// 删除
export function crmBusinessDelete(data) {
  return request({
    url: 'CrmBusiness/deleteByIds',
    method: 'post',
    data: data
  })
}

// crm 商机状态组
export function crmBusinessStatusList(data) {
  return request({
    url: 'CrmBusiness/queryBusinessStatusOptions',
    method: 'post',
    data: data
  })
}


// crm 商机下的状态组
export function crmBusinessStatusById(data) {
  return request({
    url: 'CrmBusiness/queryBusinessStatus',
    method: 'post',
    data: data
  })
}

// crm 详情
export function crmBusinessRead(data) {
  return request({
    url: 'CrmBusiness/queryById',
    method: 'post',
    data: data
  })
}

/**
 * 商机转移
 * @param {*} data
 */
export function crmBusinessTransfer(data) {
  return request({
    url: 'CrmBusiness/transfer',
    method: 'post',
    data: data
  })
}

/**
 * 商机转移
 * @param {*} data
 */
export function crmBusinessAdvance(data) {
  return request({
    url: 'CrmBusiness/boostBusinessStatus',
    method: 'post',
    data: data
  })
}

/**
 * 商机相关产品
 * @param {*} data
 */
export function crmBusinessProduct(data) {
  return request({
    url: 'CrmBusiness/queryProduct',
    method: 'post',
    data: data
  })
}

/**
 * 跟进记录
 * @param {*} data
 */
export function crmBusinessRecordSave(data) {
  return request({
    url: 'CrmBusiness/addRecord',
    method: 'post',
    data: data
  })
}
export function crmBusinessRecordIndex(data) {
  return request({
    url: 'CrmBusiness/getRecord',
    method: 'post',
    data: data
  })
}

// 合同
export function crmBusinessQueryContract(data) {
  return request({
    url: 'CrmBusiness/queryContract',
    method: 'post',
    data: data
  })
}
// 团队操作

/**
 * 团队成员创建
 * @param {*} data
 */
export function crmBusinessSettingTeamSave(data) {
  return request({
    url: 'CrmBusiness/addMembers',
    method: 'post',
    data: data
  })
}

export function crmBusinessSettingTeamDelete(data) {
  return request({
    url: 'CrmBusiness/deleteMembers',
    method: 'post',
    data: data
  })
}

export function crmBusinessTeamMembers(data) {
  return request({
    url: 'CrmBusiness/getMembers',
    method: 'post',
    data: data
  })
}

export function crmBusinessUpdateMembers(data) {
  return request({
    url: 'CrmBusiness/updateMembers',
    method: 'post',
    data: data
  })
}

// 退出团队
export function crmBusinessExitTeam(data) {
  return request({
    url: 'CrmBusiness/exitTeam',
    method: 'post',
    data: data
  })
}

/**
 * 商机关联联系人
 * @param {*} data
 */
export function crmBusinessRelateContactsAPI(data) {
  return request({
    url: 'CrmBusiness/relateContacts',
    method: 'post',
    data: data
  })
}

/**
 * 商机取消关联联系人
 * @param {*} data
 */
export function crmBusinessUnrelateContactsAPI(data) {
  return request({
    url: 'CrmBusiness/unrelateContacts',
    method: 'post',
    data: data
  })
}

/**
 * 商机下联系人
 * @param {*} data
 */
export function crmBusinessQueryContactsAPI(data) {
  return request({
    url: 'CrmBusiness/queryContacts',
    method: 'post',
    data: data
  })
}

/**
 * 设置首要联系人
 * @param {*} data
 *
 */
export function crmBusinessSetContactsAPI(data) {
  return request({
    url: 'CrmBusiness/setContacts',
    method: 'post',
    data: data
  })
}

/**
 * 附件列表
 * @param {*} data
 *
 */
export function crmBusinessFileListAPI(data) {
  return request({
    url: 'CrmBusiness/queryFileList',
    method: 'post',
    data: data
  })
}

/**
 * tab数量
 * @param {*} data
 *
 */
export function crmBusinessNumAPI(data) {
  return request({
    url: 'CrmBusiness/num',
    method: 'post',
    data: data
  })
}

/**
 * 商机导出
 * @param {*} data
 */
export function crmBusinessExcelExportAPI(data) {
  return request({
    url: 'CrmBusiness/batchExportExcel',
    method: 'post',
    data: data,
    responseType: 'blob',
    timeout: 60000
  })
}

export function crmBusinessExcelAllExportAPI(data) {
  return request({
    url: 'CrmBusiness/allExportExcel',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 标星
 * @param {*} data
 *
 */
export function crmBusinessStarAPI(data) {
  return request({
    url: 'CrmBusiness/star',
    method: 'post',
    data: data
  })
}
