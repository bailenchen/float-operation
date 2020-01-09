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
