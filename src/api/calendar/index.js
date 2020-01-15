import request from '@/utils/request'

/**
 * 新增日程
 *
 */
export function canlendarSaveAPI(data) {
  return request({
    url: 'OaEvent/save',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

/**
 * 删除日程
 *
 */
export function canlendarDeleteAPI(data) {
  return request({
    url: 'OaEvent/delete',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

/**
 * 查询日程
 *
 */
export function canlendarQueryListAPI(data) {
  return request({
    url: 'OaEvent/queryList',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

/**
 * 编辑日程 OaEvent/queryById
 *
 */
export function canlendarUpdateAPI(data) {
  return request({
    url: 'OaEvent/update',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

/**
 * 查询日程详情
 *
 */
export function canlendarQueryByIdAPI(data) {
  return request({
    url: 'OaEvent/queryById',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

/**
 * 查询自定义列表
 */

export function canlendarQueryTypeListAPI(data) {
  return request({
    url: 'OaCalendar/queryTypeListByUser',
    method: 'post',
    data: data
  })
}

/**
 * 编辑自定义列表 OaCalendar/todayTask
 */

export function canlendarUpdateTypeAPI(data) {
  return request({
    url: 'OaCalendar/updateTypeUser',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

/**
 * 今日需联系任务
 */

export function canlendarTodayTaskAPI(data) {
  return request({
    url: 'OaCalendar/todayTask',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

/**
 * 今日到期的合同
 */

export function canlendarTodayContractAPI(data) {
  return request({
    url: 'OaCalendar/todayContract',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

/**
 * 今日需联系客户 OaEvent/queryListStatus
 */

export function canlendarTodayCustomerAPI(data) {
  return request({
    url: 'OaCalendar/todayCustomer',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

/**
 * 小日历标记 OaEvent/queryListStatus
 */

export function canlendarQueryListStatusAPI(data) {
  return request({
    url: 'OaEvent/queryListStatus',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}
