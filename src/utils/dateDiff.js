// startDate: 计划开始时间； endDate：计划结束时间；dayLength：每隔几天，0-代表每天，1-代表日期间隔一天
export function getDateStr(startDate, endDate, dayLength) {
  var str = startDate
  for (var i = 0; ; i++) {
    var getDate = getTargetDate(startDate, dayLength)
    startDate = getDate
    if (getDate <= endDate) {
      str += ',' + getDate
    } else {
      break
    }
  }
  return str
}

// startDate: 开始时间；dayLength：每隔几天，0-代表获取每天，1-代表日期间隔一天
function getTargetDate(date, dayLength) {
  dayLength = dayLength + 1
  var tempDate = new Date(date)
  tempDate.setDate(tempDate.getDate() + dayLength)
  var year = tempDate.getFullYear()
  var month = tempDate.getMonth() + 1 < 10 ? '0' + (tempDate.getMonth() + 1) : tempDate.getMonth() + 1
  var day = tempDate.getDate() < 10 ? '0' + tempDate.getDate() : tempDate.getDate()
  return year + '-' + month + '-' + day
}


// 得到本周、上周、下周的起始、结束日期
// getMonday(type,dates)    type为字符串类型，有两种选择，"s"代表开始,"e"代表结束，dates为数字类型，不传或0代表本周，-1代表上周，1代表下周
export function getMonday(type, dates) {
  var now = new Date()
  var nowTime = now.getTime()
  var day = now.getDay()
  var longTime = 24 * 60 * 60 * 1000
  var n = longTime * 7 * (dates || 0)
  if (type == 's') {
    var dd = nowTime - (day - 1) * longTime + n
  }
  if (type == 'e') {
    var dd = nowTime + (7 - day) * longTime + n
  }
  dd = new Date(dd)
  var y = dd.getFullYear()
  var m = dd.getMonth() + 1
  var d = dd.getDate()
  m = m < 10 ? '0' + m : m
  d = d < 10 ? '0' + d : d
  var day = y + '-' + m + '-' + d
  return day
}
