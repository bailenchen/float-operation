const getLocationOrigin = () => {
  return window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '')
}
const wkURL = 'https://s.72crm.com/api/' // 内部私有服务
/**
 * 悟空暗号
 * @type {string}
 */
const cipherStr = 'wk'

const companyName = '悟空CRM'
const version = 'V10.1.3.20200214'

export default {
  version,
  companyName,
  getLocationOrigin,
  wkURL,
  cipherStr
}
