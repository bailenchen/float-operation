import request from '@/utils/request'

// 班级管理 列表
export function crmClassIndex(data) {
  return request({
    url: 'educationalClass/queryPageList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 班级管理 保存与修改
export function crmClassSave(data) {
  return request({
    url: 'educationalClass/addOrUpdate',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 班级管理 删除
export function crmClassDelete(data) {
  return request({
    url: 'educationalClass/deleteByIds',
    method: 'post',
    data: data
  })
}

// 班级管理 关闭
export function crmClassClose(data) {
  return request({
    url: 'educationalClass/closeByIds',
    method: 'post',
    data: data
  })
}


// 班级管理 全部导出
export function crmClassExcelAllExport(data) {
  return request({
    url: 'educationalClass/allExportExcel',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
