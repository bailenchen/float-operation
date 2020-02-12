import request from '@/utils/request'

// 设置日志欢迎语 OaCalendar/addOrUpdate
export function sysSetLogWelcomeAPI(data) {
  return request({
    url: 'sysConfig/setLogWelcomeSpeech',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

// 设置日志欢迎语
export function sysGetLogWelcomeListAPI(data) {
  return request({
    url: 'sysConfig/getLogWelcomeSpeechList',
    method: 'post',
    data: data
  })
}

// 根据id删除日志欢迎语
export function sysDeleteConfigByIdAPI(data) {
  return request({
    url: 'sysConfig/deleteConfigById',
    method: 'post',
    data: data
  })
}

// 添加/修改日历类型
export function calendarAddOrUpdateAPI(data) {
  return request({
    url: 'OaCalendar/addOrUpdate',
    method: 'post',
    data: data
  })
}

// 查询日历类型
export function calendarQueryTypeListAPI(data) {
  return request({
    url: 'OaCalendar/queryTypeList',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data: data
  })
}

// 删除日历类型
export function calendarDeleteAPI(data) {
  return request({
    url: 'OaCalendar/delete',
    method: 'post',
    data: data
  })
}
