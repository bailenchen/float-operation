import request from '@/utils/request'

/**
 * 推广列表
 * @param {*} data
 */
export function crmMarketingIndexAPI(data) {
  return request({
    url: 'crm/marketing/index',
    method: 'post',
    data: data
  })
}

/**
 * 推广字段
 * @param {*} data
 */
export function crmMarketingFieldInfoAPI(data) {
  return request({
    url: 'crm/marketing/fieldInfo',
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
    url: 'crm/marketing/save',
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
    url: 'crm/marketing/update',
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
    url: 'crm/marketing/delete',
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
    url: 'crm/marketing/read',
    method: 'post',
    data: data
  })
}

/**
 * 推广概览
 * @param {*} data
 */
export function crmMarketingOverviewAPI(data) {
  return request({
    url: 'crm/marketing/overview',
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
    url: 'crm/marketing/census',
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
    url: 'crm/marketing/isEnable',
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
    url: 'crm/marketing/synchroField',
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
    url: 'crm/marketing/synchro',
    method: 'post',
    data: data
  })
}

/**
 * 列表字段
 * @param {*} data
 */
export function crmMarketingCensusFieldAPI(data) {
  return request({
    url: 'crm/marketing/censusField',
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
    url: 'crm/marketing/excelExport',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
