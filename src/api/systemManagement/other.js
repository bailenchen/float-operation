import request from '@/utils/request'

// 设置日志欢迎语
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

