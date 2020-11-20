import request from '@/utils/request'

// crm 内部通讯录列表
export function crmInsideUserIndex(data) {
  return request({
    url: 'CrmInsideUser/queryUserList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 删除
export function crmInsideUserDelete(data) {
  return request({
    url: 'CrmInsideUser/deleteByIds',
    method: 'post',
    data: data
  })
}

// 修改跟进
export function crmInsideUserModeFollow(data) {
  return request({
    url: 'CrmInsideUser/addActivity',
    method: 'post',
    data: data
  })
}

// 修改跟进下拉列表
export function crmInsideUserModeFollowList(data) {
  return request({
    url: 'CrmInsideUser/selectActivity',
    method: 'post',
    data: data
  })
}





/**
 * 内部通话记录导出
 * @param {*} data
 * customer_id 客户ID
 */
export function CrmInsideUserExcelExport(data) {
  return request({
    url: 'CrmInsideUser/batchExportExcel',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

export function CrmInsideUserExcelAllExport(data) {
  return request({
    url: 'CrmInsideUser/allExportExcel',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * 客户导入
 * @param {*} data
 * customer_id 客户ID
 */
export function CrmInsideUserExcelImport(data) {
  var param = new FormData()
  Object.keys(data).forEach(key => {
    param.append(key, data[key])
  })
  return request({
    url: 'CrmInsideUser/uploadExcel',
    method: 'post',
    data: param,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 内部通话记录导入模板下载
 * @param {*} data
 *
 */
export const crmCustomerExcelDownloadURL = process.env.BASE_API + 'CrmInsideUser/downloadExcel'
export function CrmInsideUserDownloadExcelAPI(data) {
  return request({
    url: 'CrmInsideUser/downloadExcel',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

