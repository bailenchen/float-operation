import request from '@/utils/request'

// 学员排课表 列表
export function crmTeacherSchduleQueryByDay(data) {
  return request({
    url: 'educationalTimecontract/selectTeacherSchedule',
    method: 'post',
    data: data,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}
