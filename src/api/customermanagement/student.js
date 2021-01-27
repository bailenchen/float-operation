
import request from '@/utils/request'


// 学员导出
export function crmStudentExcelExport(data) {
  return request({
    url: 'CrmCustomer/batchExportExcels',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

export function crmStudentExcelAllExport(data) {
  return request({
    url: 'CrmCustomer/allExportExcels',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 学员变更中心
export function crmChangeCenterAPI(data) {
  return request({
    url: 'CrmCustomer/changeDept',
    method: 'post',
    data: data
  })
}

// 校区班主任变更记录
export function crmQueryChangeLogAPI(data) {
  return request({
    url: 'CrmCustomer/selectTearcher',
    method: 'post',
    data: data
  })
}


/**
 * 学员删除
 * @param {*} data
 */
export function crmStudentDeleteAPI(data) {
  return request({
    url: 'CrmCustomer/deleteByIdss',
    method: 'post',
    data: data
  })
}
