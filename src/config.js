const getLocationOrigin = () => {
  return window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '')
}

const companyName = '悟空CRM'
const version = 'V10.1.1.20200113'

export default {
  version,
  companyName,
  getLocationOrigin
}
