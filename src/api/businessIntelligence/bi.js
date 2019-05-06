import request from '@/utils/request'

/**
 * 业绩目标完成情况
 * @param {*} data
 * year 年
 * status 1销售（目标）2回款（目标）
 * userId 员工ID
 * structure_id 部门ID
 */
export function biAchievementStatistics(data) {
  return request({
    url: 'bi/taskCompleteStatistics',
    method: 'post',
    data: data
  })
}

/**
 * 产品销售情况统计
 * @param {*} data
 * year 年
 * status 1销售（目标）2回款（目标）
 * userId 员工ID
 * structure_id 部门ID
 */
export function biProductStatistics(data) {
  return request({
    url: 'bi/productStatistics',
    method: 'post',
    data: data
  })
}

/**
 * 回款统计
 * @param {*} data
 * year 年
 * userId 员工ID
 * structure_id 部门ID
 */
export function biReceivablesStatistics(data) {
  return request({
    url: 'bi/moneyStatistics',
    method: 'post',
    data: data
  })
}

/**
 * 回款统计列表
 * @param {*} data
 * year 年
 * month 1-12
 * userId 员工ID
 * structure_id 部门ID
 */
export function biReceivablesStatisticList(data) {
  return request({
    url: 'bi/queryByMonth',
    method: 'post',
    data: data
  })
}

/**
 * 员工客户分析
 * @param {*} data
 * start_time
 * end_time
 * userId 员工ID
 * structure_id 部门ID
 */
export function biCustomerStatistics(data) {
  return request({
    url: 'CrmCustomer/getUserCustomerAnalysis',
    method: 'post',
    data: data
  })
}

/**
 * 销售漏斗
 * @param {*} data
 * start_time
 * end_time
 * userId 员工ID
 * structure_id 部门ID
 * type_id 商机组
 */
export function biBusinessFunnel(data) {
  return request({
    url: 'bi/funnelStatistics',
    method: 'post',
    data: data
  })
}
