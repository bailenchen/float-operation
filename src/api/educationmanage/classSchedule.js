import request from '@/utils/request'

// 班级排课表 列表
export function crmClassSchduleIndex(data) {
  return request({
    url: 'educationalClasstime/queryPageList',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 班级排课表 删除
export function crmClassSchduleDelete(data) {
  return request({
    url: 'educationalClasstime/deleteByIds',
    method: 'post',
    data: data
  })
}

// 班级排课表 查询班级信息根据id
export function crmClassSchduleDetail(data) {
  return request({
    url: 'educationalClasstime/queryById',
    method: 'post',
    data: data
  })
}

// 班级排课表 查询换挡列表
export function crmClassSchduleShift(data) {
  return request({
    url: 'educationalClasstime/batchShifting',
    method: 'post',
    data: data
  })
}

// 班级排课表 查询教室组件列表
export function crmClassroomSelectList(data) {
  return request({
    url: 'educationalClass/selectClassroom',
    method: 'post',
    data: data
  })
}

// 班级排课表 查询班级类型列表
export function crmClassTypeSelectList(data) {
  return request({
    url: 'CrmProduct/selectCoachingMethodsNews',
    method: 'post',
    data: data
  })
}

// 班级排课表 全部导出
export function crmClassSchduleExcelAllExport(data) {
  return request({
    url: 'educationalClasstime/allExportExcel',
    method: 'post',
    data: data,
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

// 班级排课表 换挡保存
export function crmClassSchduleShiftSave(data) {
  return request({
    url: 'educationalClasstime/shifts',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
// 班级排课表 课时确认--查询基本信息
export function crmClassSchduleConfirmInfo(data) {
  return request({
    url: 'educationalClasstime/queryById',
    method: 'post',
    data: data
  })
}

// 班级排课表 课时确认--学生请假
export function crmClassSchduleConfirmLeave(data) {
  return request({
    url: 'educationalClasstime/leaveStudent',
    method: 'post',
    data: data
  })
}

// 班级排课表 课时确认保存
export function crmClassSchduleConfirmSave(data) {
  return request({
    url: 'educationalClasstime/classConfirmation',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

