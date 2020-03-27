import request from '@/utils/request'

// 新建
export function crmReturnVisitSaveAPI(data) {
  return request({
    url: 'CrmReturnVisit/addOrUpdate',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 列表
export function crmReturnVisitIndexAPI(data) {
  return request({
    url: 'CrmReturnVisit/queryPageList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 删除
export function crmReturnVisitDeleteAPI(data) {
  return request({
    url: 'CrmReturnVisit/deleteByIds',
    method: 'post',
    data: data
  })
}

// 附件
export function crmReturnVisitFileAPI(data) {
  return request({
    url: 'CrmReturnVisit/queryFileList',
    method: 'post',
    data: data
  })
}

// 详情
export function crmReturnVisitReadAPI(data) {
  return request({
    url: 'CrmReturnVisit/queryById',
    method: 'post',
    data: data
  })
}
