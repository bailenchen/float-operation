const getLocationOrigin = () => {
  return window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '')
}

const version = 'V10.1.2.20200117'
const companyName = '悟空CRM'

export default {
  version,
  companyName,
  getLocationOrigin
}
