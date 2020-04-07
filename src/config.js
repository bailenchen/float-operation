const getLocationOrigin = () => {
  return window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '')
}
const wkURL = 'https://s.72crm.com/api/' // 内部私有服务
const macUrl = 'https://www.5kcrm.com/download/desktop/mac/10/%E6%82%9F%E7%A9%BACRM-10.0.1.dmg'
const winUrl = 'https://www.5kcrm.com/download/desktop/win/10.1.3/%E6%82%9F%E7%A9%BACRM%20Setup%2010.1.3.exe'
const iOSUrl = 'https://apps.apple.com/cn/app/%E6%82%9F%E7%A9%BAcrm-10-0/id1489143707'
const androidUrl = 'https://sj.qq.com/myapp/detail.htm?apkName=com.kakarote.crm10'

/**
 * 悟空暗号
 * @type {string}
 */
const cipherStr = 'wk'

const companyName = '悟空CRM'
const version = 'V10.1.5.20200407'
const build = 15

export default {
  version,
  build,
  companyName,
  getLocationOrigin,
  wkURL,
  cipherStr,
  macUrl,
  winUrl,
  iOSUrl,
  androidUrl
}
