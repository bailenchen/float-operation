import request from '@/utils/request'

/**
 * 通话记录列表
 * type
 * structure_id: 部门id
 * user_id 员工ID
 * 分页
 */
export function crmCallIndex(data) {
  return request({
    url: 'call/index',
    method: 'post',
    data: data
  })
}
/**
 * 通话记录统计分析
 * type
 * structure_id: 部门id
 * user_id 员工ID
 * 分页
 */
export function crmCallAnalysis(data) {
  return request({
    url: 'call/analysis',
    method: 'post',
    data: data
  })
}
/**
 * 下载 crm/call/inNumberSearch
 */
export function crmCallDownload(data) {
  return request({
    url: 'call/download',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    responseType: 'blob'
  })
}
/**
 * 下载 crm/call/inNumberSearch
 */
export function crmCallInNumberSearch(data) {
  return request({
    url: 'call/searchPhone',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}
/**
 * 查询客户模块电话号码 /crm/call/queryPhoneNumber
 */
export function crmCallQueryPhoneNumber(data) {
  return request({
    url: 'call/queryPhoneNumber',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}
