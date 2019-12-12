const getLocationOrigin = () => {
  return window.location.protocol + '//' + window.location.host + (window.location.port ? ':' + window.location.port : '')
}

// 版本号码
const version = 'V10.0.191203'

export default {
  version,
  getLocationOrigin
}
