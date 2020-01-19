import request from '@/utils/request'

/**
 * 邮件列表
 * @param {*} data
 */
export function emailListsAPI(data) {
  return request({
    url: 'EmailRecord/queryEmailList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 验证邮箱是否已存在
 * @param {*} data
 */
export function isExistenceEmail(data) {
  return request({
    url: 'EmailAccount/validationAccount',
    method: 'post',
    data: data
  })
}

/**
 * 邮件发送
 * @param {*} data
 */
export function emailSendAPI(data) {
  return request({
    url: 'EmailRecord/sendEmail',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 存稿箱
 * @param {*} data
 */
export function saveDraftBoxAPI(data) {
  return request({
    url: 'EmailRecord/saveTheBox',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 数量查询
 * @param {*} data
 */
export function emailNumAPI(data) {
  return request({
    url: 'EmailRecord/queryEmailNumber',
    method: 'post',
    data: data
  })
}

/**
 * 邮件验证
 * @param {*} data
 */
export function emailValidAPI(data) {
  return request({
    url: 'EmailAccount/saveOrUpdateEmailAccount',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 操作邮件状态
 * @param {*} data
 */
export function emailStateUpdateAPI(data) {
  return request({
    url: 'EmailRecord/updateEmailState',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
