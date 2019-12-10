import request from '@/utils/request'

/**
 * 推广列表
 * @param {*} data
 */
export function crmMarketingIndexAPI(data) {
  return request({
    url: 'CrmMarketing/queryPageList',
    method: 'post',
    data: data
  })
}

/**
 * 推广创建
 * @param {*} data
 */
export function crmMarketingSaveAPI(data) {
  return request({
    url: 'CrmMarketing/add',
    method: 'post',
    data: data
  })
}

/**
 * 推广编辑
 * @param {*} data
 */
export function crmMarketingUpdateAPI(data) {
  return request({
    url: 'CrmMarketing/update',
    method: 'post',
    data: data
  })
}

/**
 * 推广删除
 * @param {*} data
 */
export function crmMarketingDeleteAPI(data) {
  return request({
    url: 'CrmMarketing/deleteByIds',
    method: 'post',
    data: data
  })
}

/**
 * 推广详情
 * @param {*} data
 */
export function crmMarketingReadAPI(data) {
  return request({
    url: 'CrmMarketing/queryById',
    method: 'post',
    data: data
  })
}

/**
 * 推广统计
 * @param {*} data
 */
export function crmMarketingCensusAPI(data) {
  return request({
    url: 'CrmMarketing/census',
    method: 'post',
    data: data
  })
}

/**
 * 推广启用/禁用
 * @param {*} data
 */
export function crmMarketingIsEnableAPI(data) {
  return request({
    url: 'CrmMarketing/updateStatus',
    method: 'post',
    data: data
  })
}

/**
 * 同步数据/字段
 * @param {*} data
 */
export function crmMarketingSynchroFieldAPI(data) {
  return request({
    url: 'CrmMarketing/queryField',
    method: 'post',
    data: data
  })
}

/**
 * 同步数据
 * @param {*} data
 */
export function crmMarketingSynchroAPI(data) {
  return request({
    url: 'CrmMarketing/syncData',
    method: 'post',
    data: data
  })
}

/**
 * 导出
 * @param {*} data
 */
export function crmMarketingExcelExportAPI(data) {
  return request({
    url: 'CrmMarketing/customerExportExcel',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
/**
 * 详情
 * @param {*} data
 */
export function crmMarketingInformationAPI(data) {
  return request({
    url: 'CrmMarketing/information',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
