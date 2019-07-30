import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/login',
    method: 'post',
    data: {
      username,
      password
    }
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

/** 云平台 登录 API */
/**
 * 账号密码登录
 * @param {*} data
 */
export function LoginAPI(data) {
  return request({
    url: '/login',
    method: 'post',
    data: data
  })
}
export function reLogin(data) {
  return request({
    url: '/reLogin',
    method: 'post',
    data: data
  })
}
/**
 * 发送验证码
 * @param {*} data
 */
export function sendSmsAPI(data) {
  return request({
    url: '/cloud/sendSms',
    method: 'post',
    data: data
  })
}

/**
 * 找回密码第一步验证
 * @param {*} data
 */
export function findpwdAPI(data) {
  return request({
    url: '/cloud/findpwd',
    method: 'post',
    data: data
  })
}

/**
 * 重置密码
 * @param {*} data
 */
export function resetpwdAPI(data) {
  return request({
    url: '/cloud/resetpwd',
    method: 'post',
    data: data
  })
}


/**
 * 注册
 * @param {*} data
 */
export function registerAPI(data) {
  return request({
    url: '/cloud/register',
    method: 'post',
    data: data
  })
}
