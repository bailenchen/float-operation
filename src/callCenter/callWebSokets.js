class MyWs {
  webSokets
  callinTime
  timer
  open(f, error_func) {
    this.webSokets = new WebSocket('ws://127.0.0.1:9501')
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

  close() {
    this.webSokets.close()
    clearInterval(this.timer)
  }

  message(f) {
    this.webSokets.onmessage = (e) => {
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
      this.send({
        event: 'HeartBeat'
      })
    }, 10000)
  }
  addFix(num, length) {
    return ('' + num).length < length ? ((new Array(length + 1)).join('0') + num).slice(-length) : '' + num
  }
  // 拨号
  OnDailout(phoneNumber) {
    this.send({
      event: 'Dial',
      number: String(phoneNumber)
    })
  }
  // 接听
  OnAnswer() {
    this.send({
      event: 'Answer'
    })
  }
  // 挂断
  OnHungUp() {
    this.send({
      event: 'HangUp'
    })
  }
  // 获取通话状态
  OnGetCallState() {
    this.send({
      event: 'GetCallState'
    })
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
