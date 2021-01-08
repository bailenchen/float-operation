
import request from '@/utils/request'

// 学员排课表 列表
export function crmStudentSchduleIndex(data) {
  return request({
    url: 'educationalTimecontract/queryPageList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 学员排课表 全部导出
export function crmStudentSchduleExcelAllExport(data) {
  return request({
    url: 'educationalTimecontract/allExportExcel',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 学员排课表 删除
export function crmStudentSchduleDelete(data) {
  return request({
    url: 'educationalTimecontract/deleteByIds',
    method: 'post',
    data: data
  })
}

// 学员排课表 请假
export function crmStudentSchduleLeave(data) {
  return request({
    url: 'educationalTimecontract/leaveStudent',
    method: 'post',
    data: data
  })
}
