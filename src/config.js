const getLocationOrigin = () => {
  return window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '')
}

const companyName = '数字管家'
const version = 'V10.1.4.20200313'
const build = 14

export default {
  version,
  build,
  companyName,
  getLocationOrigin
}
