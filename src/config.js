const getLocationOrigin = () => {
  return window.location.protocol + '//' + window.location.hostname + (window.location.port ? ':' + window.location.port : '')
}
const wkURL = '' // 内部私有服务
const macUrl = 'https://www.5kcrm.com/download/desktop/mac/10/%E6%82%9F%E7%A9%BACRM-10.0.1.dmg'
const winUrl = 'https://www.5kcrm.com/download/desktop/win/10.1.3/%E6%82%9F%E7%A9%BACRM%20Setup%2010.1.3.exe'
const iOSUrl = 'https://apps.apple.com/cn/app/%E6%82%9F%E7%A9%BAcrm-10-0/id1489143707'
const androidUrl = 'https://sj.qq.com/myapp/detail.htm?apkName=com.kakarote.crm10'

var callCenterConfig = {
  // socketUrl: 'wss://xagent.vocustcloud.com/phoneConnect', // 电话websocket连接url
  // socketUrl: 'wss://xagent.vocustcloud.com/phoneConnect', // 电话websocket连接url
  socketUrl: 'wss://xagent-new-uat.vocustcloud.com/phoneConnect',
  // account: '18337132251', // 登录账号
  // password: '132251', // 登录密码
  // channel: 'telephone', // 渠道
  // domain: '1301395827943612416.ctrip', // 域信息
  domain: '1217320380889497600.ctrip',
  skillGroupCode: [] // 技能组编号列表
  // telephone: '500020' // 硬话机
}
/**
 *
 * @type {string}
 */
const cipherStr = ''

const companyName = 'CRM'
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
  androidUrl,
  callCenterConfig
}
