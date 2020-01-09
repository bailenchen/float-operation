const getLocationOrigin = () => {
  return window.location.protocol + '//' + window.location.host + (window.location.port ? ':' + window.location.port : '')
}

const version = 'V10.1.1.20200109'
const companyName = '数字管家'

export default {
  version,
  companyName,
  getLocationOrigin
}
