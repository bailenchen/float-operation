const getLocationOrigin = () => {
  return window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '')
}

const companyName = '数字管家'
const version = 'V10.1.4.20200226'

export default {
  version,
  companyName,
  getLocationOrigin
}
