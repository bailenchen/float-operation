import axios from 'axios'
// import Lockr from 'lockr'
import config from '../config'
/**
 * 软乎 cmd
 * 2001：拨打电话
 * 2002：挂断电话
 * 2003：接通电话
 * 2004：通话结束
 * 2005：拨打或者挂断 成功
 * 2006：拨打或者 挂断失败
 */
class MyWs {
  constructor() {
    this.config = config.callCenterConfig
    this.requestHeaders = {}
    this.phoneLines = [] // 电话线路集合
    this.phoneClient = window.PhoneClient.getInstance()
  }
  webSokets
  callinTime
  timer
  callNumber
  referCallNumber
  data
  /**
   * 配置变量
   */
  setEnv(d) {
    this.data = d
    const that = this
    const reqArr = [this._getTokenByLogin(), this._getGatewaySignature()]
    Promise.all(reqArr).then(data => {
      const { token } = data[0] || {}
      const { signature, appCode, timestamp } = data[1] || {}
      that.requestHeaders = {
        singnature: signature,
        token,
        appkey: appCode,
        timestamp
      }
      return that._getUserBasicInfo()
    }).then(data => {
      const { agent } = data
      if (!agent) {
        alert('客服信息为空')
        return false
      }

      const { sip, phoneOptionInfo } = agent
      if (!sip || !phoneOptionInfo) {
        alert('技能组和电话信息获取异常')
        return false
      }

      const { account, password, domain } = sip
      const { phoneAgentGroups } = phoneOptionInfo
      const skillGroupCode = []
      if (phoneAgentGroups) {
        if (phoneAgentGroups && phoneAgentGroups.length > 0) {
          for (let i = 0; i < phoneAgentGroups.length; i++) {
            skillGroupCode.push(phoneAgentGroups[i].number)
          }
        }
      }
      if (that.data.channel === 'webrtc') {
        // 软呼
        const envConfig = {
          socketUrl: that.data.socketUrl,
          timeout: that.data.timeout,
          channel: that.data.channel,
          account,
          password,
          domain,
          skillGroupCode
        }
        that.phoneClient.setEnv(envConfig)
      } else {
        // 硬呼
        const account = that.data.telephone
        const envConfig = {
          socketUrl: that.data.socketUrl,
          timeout: that.data.timeout,
          channel: that.data.channel,
          account: account,
          domain: that.data.domain,
          skillGroupCode
        }
        that.phoneClient.setEnv(envConfig)
        that._loginHardPhone(account).then(data => {
          console.log('_loginHardPhone: ', data)
          that.initAndConnect()
        }).catch(() => {})
      }
    })
  }

  /**
   * 设置电话事件监听、设置电话连接状态监听
   */
  setListener() {
    const that = this
    this.phoneClient.setPhoneStatusListener({
      handler: that.phoneStatusListener,
      reset: true
    })

    this.phoneClient.setPhoneEventListener({
      handler: (...args) => {
        that.phoneEventListener(...args, that)
      },
      reset: true
    })
    console.log('wolaile-----------', this.phoneClient)
  }

  /**
   * 电话状态监听
   */
  phoneStatusListener(phoneStatus) {
    console.log('电话状态', phoneStatus)
    // work:工作中 pause:暂停
  }

  /**
 *  电话状态设置（置忙）
 */
  setPhoneStatus(status) {
    this.phoneClient.setPhoneStatus({ phoneStatus: status })
  }
  /**
   * 电话事件监听
   */
  phoneEventListener(callInfo, that) {
    console.log('event listener', callInfo)
    if (callInfo.eventType === 'PhoneEnum.CallStatus.GETUSERMEDIAFAILED') {
      alert('检测不到麦克风和耳机设备，请查看设备是否正常接入')
      return
    }
    let currentLine = that.phoneLines.find(x => x.callId === callInfo.callId)
    console.log('data1', currentLine, that.phoneLines)
    if (!currentLine) {
      callInfo.isAnswered = false
      callInfo.callTime = new Date().getTime()
      callInfo.targetLine = true
      callInfo.callStream = null
      callInfo.hold = false
      callInfo.callType = 'PhoneEnum.CallType.PHONE'
      // 默认置为呼出
      callInfo.direction = 0
      currentLine = callInfo
      this.phoneLines.push(currentLine)
      // this.phoneLines[0] = currentLine
      // currentLine.callStatus = callInfo.callStatus
      // switch (callInfo.eventType) {
      //   case 'seized': // 摘机事件
      //     break
      //   case 'PhoneEnum.CallStatus.ADDSTREAM':
      //     break
      //   case 'originated': // 拨号事件
      //     // 主叫
      //     currentLine.direction = 0
      //     break
      //   case 'ringing': // 振铃事件
      //     break
      //   case 'alerting': // 来电振铃事件
      //     // 被叫
      //     currentLine.direction = 1
      //     break
      //   case 'established': // 接通事件
      //     currentLine.isAnswered = true
      //     currentLine.begin = callInfo.begin
      //     break
      //   case 'held': // 保持事件
      //     currentLine.hold = callInfo.held
      //     break
      //   case 'held_retrieved': // 取消保持事件
      //     currentLine.hold = callInfo.held
      //     break
      //   case 'mute': // 静音
      //     currentLine.mute = callInfo.mute
      //     break
      //   case 'mute_retrieved': // 取消静音
      //     currentLine.mute = callInfo.mute
      //     break
      //   case 'cleared': // 挂断事件
      //     currentLine.end = callInfo.end
      //     currentLine.duration = currentLine.isAnswered ? parseInt(currentLine.end - currentLine.begin) : 0
      //     break
      // }
    }
    // callInfo.isAnswered = false
    // callInfo.callTime = new Date().getTime()
    // callInfo.targetLine = true
    // callInfo.callStream = null
    // callInfo.hold = false
    // callInfo.callType = 'PhoneEnum.CallType.PHONE'
    // // 默认置为呼出
    // callInfo.direction = 0
    // currentLine = callInfo

    // this.phoneLines.push(currentLine)
    currentLine.callStatus = callInfo.callStatus
    switch (callInfo.eventType) {
      case 'seized': // 摘机事件
        break
      case 'PhoneEnum.CallStatus.ADDSTREAM':
        break
      case 'originated': // 拨号事件
        // 主叫
        currentLine.direction = 0
        currentLine.callStatus = 'originated'
        // that.callNumber = callInfo.remote
        callInfo.event = 'OutGoing'
        that.onLineMessage(callInfo)

        break
      case 'ringing': // 振铃事件
        currentLine.callStatus = 'ringing'
        callInfo.event = 'RingBack'
        that.onLineMessage(callInfo)

        break
      case 'alerting': // 来电振铃事件
        if (that.phoneLines.filter(x => x.callStatus !== 'cleared').length > 1) {
          that.phoneClient.hangUpWhenHasCurrentLine({ callId: callInfo.callId })
          return false
        }
        callInfo.event = 'InComing'
        currentLine.callStatus = 'alerting'
        that.callNumber = callInfo.remote
        that.onLineMessage(callInfo)
        // 被叫
        currentLine.direction = 1
        console.log('----phoneLines----', that.phoneLines)
        break
      case 'established': // 接通事件
        currentLine.isAnswered = true
        currentLine.callStatus = 'established'
        currentLine.begin = callInfo.begin

        callInfo.event = 'Answer'
        that.onLineMessage(callInfo)
        break
      case 'held': // 保持事件
        currentLine.hold = callInfo.held
        break
      case 'held_retrieved': // 取消保持事件
        currentLine.hold = callInfo.held
        break
      case 'mute': // 静音
        currentLine.mute = callInfo.mute
        break
      case 'mute_retrieved': // 取消静音
        currentLine.mute = callInfo.mute
        break
      case 'cleared': // 挂断事件
        currentLine.end = callInfo.end
        currentLine.duration = currentLine.isAnswered ? parseInt(currentLine.end - currentLine.begin) : 0
        currentLine.callStatus = 'cleared'
        callInfo.event = 'HangUp'
        that.onLineMessage(callInfo)
        if (currentLine.duration > 0) {
          callInfo.event = 'CallRecord'
          that.onLineMessage(callInfo)
        }

        // that.OnHungUp()

        break
      case 'refer': // 转接
        // currentLine.end = callInfo.end
        // currentLine.duration = currentLine.isAnswered ? parseInt(currentLine.end - currentLine.begin) : 0
        // currentLine.callStatus = 'cleared'
        // callInfo.event = 'HangUp'
        // that.onLineMessage(callInfo)
        // if (currentLine.duration > 0) {
        //   callInfo.event = 'CallRecord'
        //   that.onLineMessage(callInfo)
        // }

        break
      case 'PhoneEnum.CallStatus.GETUSERMEDIAFAILED': // 获取用户媒体失败
        break
    }
    // else {
    //   if (callInfo.eventType == 'cleared') {
    //     currentLine.end = callInfo.end
    //     currentLine.duration = currentLine.isAnswered ? parseInt(currentLine.end - currentLine.begin) : 0

    //     callInfo.event = 'HangUp'
    //     this.onLineMessage(callInfo)
    //   }
    // }
  }

  initAndConnect() {
    this.init().then(() => {
      this.connect().catch(() => {})
    }).catch(() => {})
  }

  /**
   * 初始化
   */
  init() {
    const that = this
    return new Promise((resolve, reject) => {
      console.log('that.init()', that.phoneClient)
      that.phoneClient.init(data => {
        if (data.phone.ack === 'success') {
          data.event = '电话初始化成功'
          that.appendLog(data.event, data)
          that.setListener()
          resolve()
        } else {
          data.event = '电话初始化失败'
          reject(data)
        }
      }, () => {
        reject('init error reject')
      })
    })
  }

  /**
   * 连接硬件
   */
  connect() {
    const that = this
    return new Promise((resolve, reject) => {
      console.log('connect')
      that.phoneClient.connect(data => {
        if (data.phone.ack == 'success') {
          data.event = '电话连接成功'
          that.appendLog(data.event, data)
          resolve()
        } else {
          data.event = '电话连接失败'
          reject(data)
        }
      }, () => {
        reject('connect error reject')
      })
    })
  }

  appendLog(event, message) {
    console.log('client log: ', event, message)
  }

  getTargetLine(remote) {
    return this.phoneLines.find(x => x.remote == remote && x.callStatus !== 'cleared')
  }

  open(f, error_func) {
    console.log('open')
    // const callData = Lockr.get('wkCallData')
    // // hisUse 0 是默认硬呼 1 是软乎
    // if (callData && callData.hisUse == 1) {
    //   const token = axios.defaults.headers['Admin-Token']
    //   this.hisUse = 1
    //   this.webSokets = new WebSocket('ws://192.168.1.116:9986?token=' + token)
    //   // ws://192.168.1.52:9986?token= wss://s.72crm.com/webim?token=
    // } else {
    //   this.hisUse = 0
    //   this.webSokets = new WebSocket('ws://127.0.0.1:9501')
    // }
    // this.callinTime = '00:00:00'
    // var that = this
    // this.webSokets.onopen = () => {
    //   f()
    //   that.startTimePiece()
    // }
    // this.webSokets.onerror = (e) => {
    //   error_func(e)
    // }
    // this.webSokets.onclose = () => {
    //   that.close()
    //   clearInterval(this.timer) // 清除心跳包
    // }
  }

  // hisUse 0 是默认硬呼 1 是软乎
  getHisUse() {
    return this.data.channel === 'telephone' ? 1 : 0
  }

  close() {
    // this.webSokets.close()
    clearInterval(this.timer)
  }

  message(f) {
    // this.webSokets.onmessage = (e) => {
    //   console.log('JSON.parse(e.data)--', JSON.parse(e.data))
    //  f(JSON.parse(e.data))
    // }
    this.onLineMessage = f
    console.log('888', this.onLineMessage)
  }
  send(data) {
    // this.webSokets.send(JSON.stringify(data))
  }

  // 清除计时器
  clearWebSoketsInterval() {
    // clearInterval(this.timer)
  }
  // 重启计时器,保持连接
  // 计数器
  startTimePiece() {
    // this.timer = setInterval(() => {
    //   const callData = Lockr.get('wkCallData')
    //   // hisUse 0 是默认硬呼 1 是软乎
    //   if (callData && callData.hisUse == 1) {
    //     this.send({
    //       cmd: 1000
    //     })
    //   } else {
    //     this.send({
    //       event: 'HeartBeat'
    //     })
    //   }
    // }, 30000)
  }
  addFix(num, length) {
    // return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num
  }

  /**
   * 拨号
   * @param callNumber 被叫号码
   */
  OnDailout(callNumber) {
    if (!callNumber) {
      alert('请输入电话号码')
      return
    }
    const currentLine = this.phoneLines.find(x => x.callStatus !== 'cleared')
    console.log('ding phoneLines: ', this.phoneLines)
    console.log('ding currentLine: ', currentLine)
    console.log('ding ding: ', callNumber)
    if (!currentLine) {
      this.callNumber = callNumber
      console.log()
      console.log('ding1: ', this.phoneClient)
      this.phoneClient.makeCall({ dnis: callNumber, extraHeaders: ['X-UUI:123456789'] })
    } else if (currentLine && callNumber != currentLine.remote) {
      // this.referCallNumber = callNumber
      console.log('ding2: ', callNumber)
      this.phoneClient.consult({ dnis: callNumber })
      // alert('当前正在通话')
    } else {
      alert('该号码当前正在通话')
    }
  }

  /**
   * 接听
   */
  OnAnswer() {
    const currentLine = this.phoneLines.find(x => x.callStatus != 'cleared' && !x.hold)
    if (currentLine) {
      this.phoneClient.answer({ callId: currentLine.callId })
    }
  }

  /**
   * 转接
   * @param callNumber 被转接的线路号码
   * @param targetNumber 转接的目标号码
   */
  // OnRefer(callNumber, targetNumber) {
  OnRefer(targetNumber) {
    const that = this
    // const activeLine = this.getTargetLine(callNumber)
    const activeLine = that.getTargetLine(that.callNumber)
    console.log('-------------', that.phoneLines, that.callNumber, activeLine)
    if (activeLine) {
      that.phoneClient.refer({
        callId: activeLine.callId,
        targetNum: targetNumber
      })
    }
  }

  afterTransfer(targetNumber) {
    const that = this
    /** number2正常通话中*/
    var activeLine = that.getTargetLine(targetNumber)
    /* hold住number的线路*/
    var holdLine = that.getTargetLine(that.callNumber)

    console.log('------转-------', that.phoneLines, 'holdLine:' + holdLine, 'callNumber:' + that.callNumber, 'activeLine转接得线路:' + activeLine, 'targetNumber:' + targetNumber)

    if (activeLine && holdLine) {
      this.phoneClient.refer({
        callId: holdLine.callId,
        targetNum: that.callNumber,
        targetId: activeLine.callId
      })
    }
    // 挂断电话
    // window._self.$store.commit('SHOW_TIMER', false)
    // window._self.$bus.emit('show', false)
    // localStorage.removeItem('IntervalTime')
    // window._self.$store.commit('SHOW_RING', false)
    that.onLineMessage({ event: 'HangUp' })
    this.referCallNumber = ''
  }
  /**
   * 挂断
   * @param callNumber 要挂断的电话号码
   */
  OnHungUp(callNumber) {
    const currentLine = this.getTargetLine(this.callNumber)
    console.log('挂断号码', this.callNumber)
    console.log('挂断线路', currentLine)
    console.log('---phoneLines---', this.phoneLines)
    if (currentLine) {
      this.phoneClient.hangUp({ callId: currentLine.callId })
      currentLine.callStatus = 'cleared'
    }
  }
  // 获取通话状态
  OnGetCallState() {
    // const callData = Lockr.get('wkCallData')
    // // hisUse 0 是默认硬呼 1 是软乎
    // if (callData && callData.hisUse == 1) {
    //   this.send({
    //     cmd: 2010 // 主动获取话机状态：2010
    //   })
    // } else {
    //   this.send({
    //     event: 'GetCallState'
    //   })
    // }
  }
  // 上传
  OnUploadFile(url, session_id) {
    // this.send({
    //   event: 'UploadRecord',
    //   url,
    //   session_id
    // })
  }

  /**
   * 登录
   * @private
   */
  _getTokenByLogin() {
    const that = this
    return new Promise((resolve, reject) => {
      const url = 'https://xagent.vocustcloud.com/getTokenByLogin'
      axios.post(
        url,
        {
          username: that.data.account,
          password: that.data.password
        }
      ).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  }
  _getGatewaySignature() {
    return new Promise((resolve, reject) => {
      const url = 'https://xagent.vocustcloud.com/getGatewaySignature'
      axios.get(url).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  }
  _getUserBasicInfo() {
    return new Promise((resolve, reject) => {
      const url = 'https://xagent.vocustcloud.com/apigateway/CallCenterDataService/api/getUserBasicInfo'
      axios.post(
        `${url}?_=${new Date().getTime()}`,
        {},
        {
          headers: this.requestHeaders
        }
      ).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  }
  _loginHardPhone(deviceId) {
    const that = this
    return new Promise((resolve, reject) => {
      const url = 'https://xagent.vocustcloud.com/apigateway/CallCenterDataService/api/loginHardPhone'
      axios.post(
        `${url}?_=${new Date().getTime()}`,
        {
          hardPhone: that.data.telephone,
          deviceId: deviceId,
          loginTime: new Date().getTime()
        },
        {
          headers: this.requestHeaders
        }
      ).then(res => {
        resolve(res.data)
      }).catch(err => {
        reject(err)
      })
    })
  }
}

export default new MyWs()
