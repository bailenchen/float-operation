const getLocationOrigin = () => {
  return window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '')
}

const version = 'V10.1.1.20200113'
const companyName = '数字管家'

export default {
  version,
  companyName,
  getLocationOrigin
}
