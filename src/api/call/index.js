import request from '@/utils/request'

/**
 * 挂断接口
 * @param {*} data
 */
export function callHangUpPhoneAPI(data) {
  return request({
    url: 'call/hangUpPhone',
    method: 'post',
    data: data
  })
}

/**
 * 修改首页顶部导航栏设置接口
 * @param {*} data
 */
export function callBreathePhoneAPI(data) {
  return request({
    url: 'call/breathePhone',
    method: 'post',
    data: data
  })
}
