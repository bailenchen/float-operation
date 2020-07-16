import request from '@/utils/request'

// 日志列表
export function journalList(data) {
  return request({
    url: 'OaLog/queryList',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}
// 新建日志
export function journalAdd(data) {
  return request({
    url: 'OaLog/addOrUpdate',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}
// 日志编辑
export function journalEdit(data) {
  return request({
    url: 'OaLog/addOrUpdate',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}
// 日志评论添加
export function journalCommentSave(data) {
  return request({
    url: 'OaLog/addComment',
    method: 'post',
    data
  })
}
// 日志删除
export function journalDelete(data) {
  return request({
    url: 'OaLog/deleteById',
    method: 'post',
    data
  })
}
// 日志评论删除
export function journalCommentDelete(data) {
  return request({
    url: 'OaLog/delComment',
    method: 'post',
    data
  })
}
// 日志标记已读
export function journalSetread(data) {
  return request({
    url: 'OaLog/readLog',
    method: 'post',
    data
  })
}

/**
 * 日志详情
 * @param {*} data
 */
export function journalQueryByIdAPI(data) {
  return request({
    url: 'OaLog/queryById',
    method: 'post',
    data
  })
}

/**
 * 日志概要
 * @param {*} data
 */
export function journalQueryBulletinAPI(data) {
  return request({
    url: 'OaLog/queryLogBulletin',
    method: 'post',
    data
  })
}

/**
 * 日志简报预览
 * @param {*} data
 */
export function journalQueryBulletinByTypeAPI(data) {
  return request({
    url: 'OaLog/queryLogBulletinByType',
    method: 'post',
    data
  })
}

/**
 * 日志简报跟进记录预览
 * @param {*} data
 */
export function journalQueryRecordCountAPI(data) {
  return request({
    url: 'OaLog/queryLogRecordCount',
    method: 'post',
    data
  })
}

/**
 * 随机返回一条
 * @param {*} data
 */
export function journalGetLogWelcomeAPI(data) {
  return request({
    url: 'OaLog/getLogWelcomeSpeech',
    method: 'post',
    data
  })
}

/**
 * 日志导出
 * @param {*} data
 */
export function OaLogExportAPI(data) {
  return request({
    url: 'OaLog/export',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

/**
 * 查询日志完成概要
 * @param {*} data
 */
export function OaLogCompleteStatsAPI(data) {
  return request({
    url: 'OaLog/queryCompleteStats',
    method: 'post',
    data
  })
}

/**
 * 查询日志完成情况
 * @param {*} data
 */
export function OaLogCompleteListAPI(data) {
  return request({
    url: 'OaLog/queryCompleteOaLogList',
    method: 'post',
    data
  })
}

/**
 * 查询日志未完成情况
 * @param {*} data
 */
export function OaLogUnCompleteListAPI(data) {
  return request({
    url: 'OaLog/queryIncompleteOaLogList',
    method: 'post',
    data
  })
}
