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
    url: 'EmailRecord/saveDraftsBox',
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
 * 操作邮件状态 EmailAccount/queryAccountById
 * @param {*} data
 */
export function emailStateUpdateAPI(data) {
  return request({
    url: 'EmailRecord/changeEmailState',
    method: 'post',
    data: data
  })
}
/**
 * 查询邮箱基本信息
 * @param {*} data
 */
export function emailQueryAccountByIdAPI(data) {
  return request({
    url: 'EmailAccount/queryAccountById',
    method: 'post',
    data: data
  })
}

/**
 * 邮箱模糊查询
 * @param {*} data
 */
export function emailAccountSearchEmailAPI(data) {
  return request({
    url: 'EmailAccount/searchEmail',
    method: 'post',
    data: data
  })
}

/**
 * 同步数据
 * @param {*} data
 */
export function emailRecordReceivingEmailAPI(data) {
  return request({
    url: 'EmailRecord/receivingEmail',
    method: 'post',
    data: data
  })
}

/**
 * 解除绑定
 * @param {*} data
 */
export function emailUnbundleAccountAPI(data) {
  return request({
    url: 'EmailAccount/unbundleEmailAccount',
    method: 'post',
    data: data
  })
}

/**
 * 编辑发送昵称 EmailAccount/updateSignature
 * @param {*} data
 */
export function emailUpdateSendNickAPI(data) {
  return request({
    url: 'EmailAccount/updateSendNick',
    method: 'post',
    data: data
  })
}

/**
 * 编辑个性签名
 * @param {*} data
 */
export function emailUpdateSignatureAPI(data) {
  return request({
    url: 'EmailAccount/updateSignature',
    method: 'post',
    data: data
  })
}

/**
 * 逻辑删除
 * @param {*} data
 */
export function emailRecordLogicDeleteAPI(data) {
  return request({
    url: 'EmailRecord/logicDelete',
    method: 'post',
    data: data
  })
}

/**
 * 彻底删除
 * @param {*} data
 */
export function emailRecordDeleteByEmailIdAPI(data) {
  return request({
    url: 'EmailRecord/deleteByEmailId',
    method: 'post',
    data: data
  })
}

/**
 * 移动邮件
 * @param {*} data
 */
export function emailRecordShiftEmailAPI(data) {
  return request({
    url: 'EmailRecord/shiftEmail',
    method: 'post',
    data: data
  })
}

/**
 * 移动邮件 EmailAccount/queryLately
 * @param {*} data
 */
export function emailAccountQueryLatelyAPI(data) {
  return request({
    url: 'EmailAccount/queryLately',
    method: 'post',
    data: data
  })
}
