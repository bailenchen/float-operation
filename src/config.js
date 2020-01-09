const getLocationOrigin = () => {
  return window.location.protocol + '//' + window.location.host + (window.location.port ? ':' + window.location.port : '')
}

const companyName = '悟空CRM'
const version = 'V10.1.1.20200109'

export default {
  version,
  companyName,
  getLocationOrigin
}
