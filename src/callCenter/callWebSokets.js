import axios from 'axios'
import Lockr from 'lockr'

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
  webSokets
  callinTime
  timer
  open(f, error_func) {
    const callData = Lockr.get('wkCallData')
    console.log('callData--', callData)
    // hisUse 0 是默认硬呼 1 是软乎
    if (callData && callData.hisUse == 1) {
      const token = axios.defaults.headers['Admin-Token']
      this.hisUse = 1
      this.webSokets = new WebSocket('ws://192.168.1.52:9986?token=' + token)
    } else {
      this.hisUse = 0
      this.webSokets = new WebSocket('ws://127.0.0.1:9501')
    }
    this.callinTime = '00:00:00'
    var that = this
    this.webSokets.onopen = () => {
      f()
      that.startTimePiece()
    }
    this.webSokets.onerror = (e) => {
      error_func(e)
    }
    this.webSokets.onclose = () => {
      that.close()
      clearInterval(this.timer) // 清除心跳包
    }
  }

  // hisUse 0 是默认硬呼 1 是软乎
  getHisUse() {
    const callData = Lockr.get('wkCallData')
    return callData ? callData.hisUse : 0
  }

  close() {
    this.webSokets.close()
    clearInterval(this.timer)
  }

  message(f) {
    this.webSokets.onmessage = (e) => {
      console.log('JSON.parse(e.data)--', JSON.parse(e.data))
      f(JSON.parse(e.data))
    }
  }

  send(data) {
    this.webSokets.send(JSON.stringify(data))
  }

  // 清除计时器
  clearWebSoketsInterval() {
    clearInterval(this.timer)
  }
  // 重启计时器,保持连接
  // 计数器
  startTimePiece() {
    this.timer = setInterval(() => {
      const callData = Lockr.get('wkCallData')
      // hisUse 0 是默认硬呼 1 是软乎
      if (callData && callData.hisUse == 1) {
        this.send({
          cmd: 1000
        })
      } else {
        this.send({
          event: 'HeartBeat'
        })
      }
    }, 30000)
  }
  addFix(num, length) {
    return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num
  }
  // 拨号
  OnDailout(phoneNumber) {
    const callData = Lockr.get('wkCallData')
    // hisUse 0 是默认硬呼 1 是软乎
    console.log('OnDailout---', callData, phoneNumber)
    if (callData && callData.hisUse == 1) {
      this.send({
        cmd: 2001, // 2001：拨打电话
        phone: String(phoneNumber)
      })
    } else {
      this.send({
        event: 'Dial',
        number: String(phoneNumber)
      })
    }
  }
  // 接听
  OnAnswer() {
    const callData = Lockr.get('wkCallData')
    // hisUse 0 是默认硬呼 1 是软乎
    if (callData && callData.hisUse == 1) {
      // 暂无主动接通，只能通过软乎接通
    } else {
      this.send({
        event: 'Answer'
      })
    }
  }
  // 挂断
  OnHungUp() {
    const callData = Lockr.get('wkCallData')
    // hisUse 0 是默认硬呼 1 是软乎
    if (callData && callData.hisUse == 1) {
      this.send({
        cmd: 2002 // 2002：挂断电话
      })
    } else {
      this.send({
        event: 'HangUp'
      })
    }
  }
  // 获取通话状态
  OnGetCallState() {
    const callData = Lockr.get('wkCallData')
    // hisUse 0 是默认硬呼 1 是软乎
    if (callData && callData.hisUse == 1) {
      this.send({
        cmd: 2010 // 主动获取话机状态：2010
      })
    } else {
      this.send({
        event: 'GetCallState'
      })
    }
  }
  // 上传
  OnUploadFile(url, session_id) {
    this.send({
      event: 'UploadRecord',
      url,
      session_id
    })
  }
}

export default new MyWs()
