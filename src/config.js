const getLocationOrigin = () => {
  return window.location.protocol + '//' + window.location.host + (window.location.port ? ':' + window.location.port : '')
}

// 推广地址
const marketingUrl = 'http://192.168.1.200:8000/'

// 版本号码
const version = 'V10.0.191203'

export default {
  version,
  marketingUrl,
  getLocationOrigin
}
