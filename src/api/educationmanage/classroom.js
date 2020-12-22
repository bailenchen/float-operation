import request from '@/utils/request'

// 教室管理 列表
export function crmClassroomIndex(data) {
  return request({
    url: 'educationalClassroom/queryPageList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 教室管理 保存与修改
export function crmClassroomSave(data) {
  return request({
    url: 'educationalClassroom/addOrUpdate',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 教室管理 删除
export function crmClassroomDelete(data) {
  return request({
    url: 'educationalClassroom/deleteByIds',
    method: 'post',
    data: data
  })
}


// 教室管理 全部导出
export function crmClassroomExcelAllExport(data) {
  return request({
    url: 'educationalClassroom/allExportExcel',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
