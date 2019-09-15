import request from '@/utils/request'

export function login(params) {
  return request({
    url: '/login',
    method: 'post',
    data: params
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: {
      token
    }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

/**
 * 获取短信验证码
 * @param params
 */
export function SendSmsAPI(params) {
  return request({
    url: 'cloud/sendSms',
    method: 'post',
    data: params
  })
}

/**
 * 注册
 * @param params
 */
export function RegisterAPI(params) {
  return request({
    url: 'cloud/register',
    method: 'post',
    data: params
  })
}

/**
 * 注册
 * @param params
 */
export function SliderVerifyAPI(params) {
  return request({
    url: 'cloud/isVerify',
    method: 'post',
    data: params,
    useJson: true
  })
}

/**
 * 多公司选择登陆
 * @param params
 */
export function ChooseLoginAPI(params) {
  return request({
    url: 'reLogin',
    method: 'post',
    data: params
  })
}

/**
 * 找回密码
 * @param params
 */
export function ForgetPwdAPI(params) {
  return request({
    url: 'cloud/findpwd',
    method: 'post',
    data: params
  })
}

/**
 * 重置密码
 * @param params
 */
export function ResetPwdAPI(params) {
  return request({
    url: 'cloud/resetpwd',
    method: 'post',
    data: params
  })
}
