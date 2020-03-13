import axios from 'axios'
import {
  Message,
  MessageBox
} from 'element-ui'
import {
  removeAuth
} from '@/utils/auth'
import qs from 'qs'
import { debounce } from 'throttle-debounce'
import config from '@/config'
import Lockr from 'lockr'

/**
 * 检查dom是否忽略
 * @param {*} e
 */
const clearCacheEnterLogin = debounce(500, () => {
  removeAuth().then(() => {
    location.reload() // 为了重新实例化vue-router对象 避免bug
  }).catch(() => {
    location.reload()
  })
})

const errorMessage = debounce(500, (message) => {
  Message({
    message: message,
    type: 'error'
  })
})

const confirmMessage = debounce(1000, (message) => {
  MessageBox.confirm(message, '提示', {
    confirmButtonText: '确定',
    showCancelButton: false,
    type: 'warning'
  }).then(() => {
    clearCacheEnterLogin()
  }).catch(() => {
  })
})

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
// 创建axios实例
const service = axios.create({
  baseURL: Lockr.get('wkCipher') ? config.wkURL : process.env.BASE_API, // api 的 base_url
  timeout: 600000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    const flag = config.headers['Content-Type'] && config.headers['Content-Type'].indexOf('application/json') !== -1
    if (!flag) {
      const mult = config.headers['Content-Type'] && config.headers['Content-Type'].indexOf('multipart/form-data') !== -1
      if (mult) {
        config.data = config.data
      } else {
        config.data = qs.stringify(config.data)
      }
    }
    return config
  },
  error => {
    // Do something with request error
    return Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (response.status === 200 && response.config.responseType === 'blob') { // 文件类型特殊处理
      if (response.headers['content-disposition']) {
        return response
      } else {
        const resultBlob = new Blob([response.data], { type: 'application/json' })
        const fr = new FileReader()
        fr.onload = function() {
          const result = JSON.parse(this.result)
          if (result.code == 500 && result.msg) {
            errorMessage(result.msg)
          }
        }
        fr.readAsText(resultBlob)
      }
    } else if (res.code !== 0) {
      // 302	登录已失效
      if (res.code === 302) {
        if (res.extra == 1) {
          confirmMessage(`您的账号${res.extraTime}在别处登录。如非本人操作，则密码可能已泄漏，建议修改密码`)
        } else {
          clearCacheEnterLogin()
        }
      } else {
        if (res.msg) {
          errorMessage(res.msg)
        }
      }
      return Promise.reject(res)
    } else {
      return res
    }
  },
  error => {
    if (error.response && error.response.status == 500) {
      errorMessage('网络错误，请检查您的网络')
    }
    return Promise.reject(error)
  }
)

export default service
