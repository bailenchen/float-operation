import request from '@/utils/request'

/**
 * 查询系统登录日志列表页接口
 * @param {*} data
 */
export function queryLoginLogListAPI(data) {
  return request({
    url: 'system/log/queryLoginLogList',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

/**
 * 系统登录日志导出
 * @param {*} data
 */
export function loginLogExportAPI(data) {
  return request({
    url: 'system/log/loginLogExport',
    method: 'post',
    data: data,
    responseType: 'blob',
    timeout: 60000
  })
}

/**
 * 查看数据操作日志接口
 * @param {*} data
 */
export function queryActionRecordListAPI(data) {
  return request({
    url: 'system/log/queryActionRecordList',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

/**
 * 数据操作日志导出
 * @param {*} data
 */
export function actionRecordExportAPI(data) {
  return request({
    url: 'system/log/actionRecordExport',
    method: 'post',
    data: data,
    responseType: 'blob',
    timeout: 60000
  })
}

/**
 * 查看系统操作日志接口
 * @param {*} data
 */
export function querySystemLogListAPI(data) {
  return request({
    url: 'system/log/querySystemLogList',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}


/**
 * 系统操作日志导出
 * @param {*} data
 */
export function systemLogExportAPI(data) {
  return request({
    url: 'system/log/systemLogExport',
    method: 'post',
    data: data,
    responseType: 'blob',
    timeout: 60000
  })
}
