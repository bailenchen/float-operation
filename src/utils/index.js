/**
 * Created by jiachenpan on 16/11/18.
 */

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/** 压缩文件
 * quality压缩百分比 0.3
 */
export function compressImage(file, quality, callback) {
  // quality 设置为0.3
  quality = quality || 0.3
  const reader = new FileReader()
  reader.onload = function(event) {
    var result = event.target.result
    if (file.size > 204800 && file.type !== 'image/gif' && quality < 1) { // 大于200Kb
      const img = new Image()
      img.src = result
      img.onload = function() {
        // // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
        // var initSize = img.src.length
        var width = img.width
        var height = img.height

        var ratio
        if ((ratio = width * height / 4000000) > 1) {
          ratio = Math.sqrt(ratio)
          width /= ratio
          height /= ratio
        } else {
          ratio = 1
        }
        var canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        // 铺底色
        var ctx = canvas.getContext('2d')
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        // 如果图片像素大于100万则使用瓦片绘制
        var count
        if ((count = width * height / 1000000) > 1) {
          count = ~~(Math.sqrt(count) + 1)
          // 计算要分成多少块瓦片
          // 计算每块瓦片的宽和高
          var nw = ~~(width / count)
          var nh = ~~(height / count)
          var tCanvas = document.createElement('canvas')
          tCanvas.width = nw
          tCanvas.height = nh
          for (var i = 0; i < count; i++) {
            for (var j = 0; j < count; j++) {
              var tctx = tCanvas.getContext('2d')
              tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)

              ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
            }
          }
          tCanvas.width = tCanvas.height = 0
        } else {
          ctx.drawImage(img, 0, 0, width, height)
        }
        // 进行最小压缩
        var ndata = canvas.toDataURL('image/jpeg', quality)
        canvas.width = canvas.height = 0
        callback(ndata)
      }
    } else { // 小于200K不需要压缩 直接返回
      callback(result)
    }
  }
  reader.readAsDataURL(file)
}

/** 根据date URL 创建blob 用于上传 */
export function createBlob(result) {
  var arr = result.split(',')
  var mime = arr[0].match(/:(.*?)/)[1]
  var bstr = atob(arr[1])
  var n = bstr.length
  var u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], {
    type: mime
  })
}

/** 获取file大小的名称 */
export function fileSize(size) {
  var size_int = size
  if (typeof size === 'string' && size.constructor == String) {
    size_int = parseInt(size)
  }
  var formatSize
  if (parseInt(size_int / 1024 / 1024) > 0) {
    formatSize = (size_int / 1024 / 1024).toFixed(2) + 'MB'
  } else if (parseInt(size_int / 1024) > 0) {
    formatSize = (size_int / 1024).toFixed(2) + 'kB'
  } else {
    formatSize = size_int + 'Byte'
  }
  return formatSize
}

/** 获取最大 z-index 的值 */
import {
  PopupManager
} from 'element-ui/lib/utils/popup'
export function getMaxIndex() {
  return PopupManager.nextZIndex()
}

/** 深拷贝 */
export function objDeepCopy(source) {
  if (typeof source === 'object') {
    var sourceCopy = source instanceof Array ? [] : {}
    for (var item in source) {
      if (!source[item]) {
        sourceCopy[item] = source[item]
      } else {
        sourceCopy[item] = typeof source[item] === 'object' ? objDeepCopy(source[item]) : source[item]
      }
    }
    return sourceCopy
  }
  return source
}

/** 获取文件类型图标 */
export function getFileTypeIcon(file) {
  if (file.type.indexOf('image') !== -1) {
    return getFileIconWithSuffix('png')
  } else if (file.type.indexOf('audio') !== -1) {
    return getFileIconWithSuffix('mp3')
  } else if (file.type.indexOf('video') !== -1) {
    return getFileIconWithSuffix('mp4')
  } else {
    const index = file.name.lastIndexOf('.')
    const ext = file.name.substr(index + 1) || ''

    return getFileIconWithSuffix(ext)
  }
}

export function getFileIconWithSuffix(ext) {
  ext = (ext && ext.toLowerCase()) || ''

  if (['jpg', 'png', 'jpeg', 'gif'].includes(ext)) {
    return require('@/assets/img/file/file_img.png')
  } else if (ext === 'bmp') {
    return require('@/assets/img/file/file_bmp.png')
  } else if (ext === 'psd') {
    return require('@/assets/img/file/file_psd.png')
  } else if (ext === 'tif') {
    return require('@/assets/img/file/file_tif.png')
  } else if (['mp4', 'avi', 'mov', 'wmv', '3gp'].includes(ext)) {
    return require('@/assets/img/file/file_video.png')
  } else if (['mp3', 'wma', 'wav'].includes(ext)) {
    return require('@/assets/img/file/file_music.png')
  } else if (['xlsx', 'xls'].includes(ext)) {
    return require('@/assets/img/file/file_excle.png')
  } else if (['doc', 'docx'].includes(ext)) {
    return require('@/assets/img/file/file_word.png')
  } else if (['rar', 'zip', '7z', 'tar', 'iso', 'dmg'].includes(ext)) {
    return require('@/assets/img/file/file_zip.png')
  } else if (ext === 'pdf') {
    return require('@/assets/img/file/file_pdf.png')
  } else if (['ppt', 'pptx'].includes(ext)) {
    return require('@/assets/img/file/file_ppt.png')
  } else if (['txt', 'text'].includes(ext)) {
    return require('@/assets/img/file/file_txt.png')
  }
  return require('@/assets/img/file/file_unknown.png')
}

/** 判断输入的是number */
export function regexIsNumber(nubmer) {
  var regex = /^[0-9]+.?[0-9]*/
  if (!regex.test(nubmer)) {
    return false
  }
  return true
}

/** 判断输入的是crm数字 数字的整数部分须少于15位，小数部分须少于4位*/
export function regexIsCRMNumber(nubmer) {
  var regex = /^([-+]?\d{1,15})(\.\d{0,4})?$/
  if (!regex.test(nubmer)) {
    return false
  }
  return true
}

/** 判断输入的是货币 货币的整数部分须少于15位，小数部分须少于2位*/
export function regexIsCRMMoneyNumber(nubmer) {
  var regex = /^([-+]?\d{1,15})(\.\d{0,2})?$/
  if (!regex.test(nubmer)) {
    return false
  }
  return true
}

/** 判断输入的是电话*/
export function regexIsCRMMobile(mobile) {
  var regex = /^(\+?0?\d{2,4}\-?)?\d{6,11}$/
  if (!regex.test(mobile)) {
    return false
  }
  return true
}

/** 判断输入的是邮箱*/
export function regexIsCRMEmail(email) {
  var regex = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/
  if (!regex.test(email)) {
    return false
  }
  return true
}

/**
 * 时间操作
 * @param
 */
/** 时间戳转date*/
import moment from 'moment'

export function formatTime(time) {
  const timeMoment = moment(time)
  const nowMoment = moment()
  const diff = nowMoment.diff(timeMoment, 'seconds')

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }

  const timeYear = timeMoment.format('YYYY')
  const nowYear = nowMoment.format('YYYY')

  if (timeYear == nowYear) {
    return timeMoment.format('MM月DD日')
  } else {
    return timeMoment.format('YY年MM月DD日')
  }
}

export function getDateFromTimestamp(time) {
  var times = 0
  if (time.length === 13) {
    times = parseInt(time)
  } else {
    times = parseInt(time) * 1000
  }
  return new Date(times) // 如果date为13位不需要乘1000
}

/**
 *
 * @param {*} timestamp 时间戳
 * @param {*} format 格式化
 */
export function timestampToFormatTime(timestamp, format) {
  if (timestamp && timestamp.toString().length >= 10) {
    return moment(getDateFromTimestamp(timestamp.toString())).format(format)
  }
  return ''
}
/**
 *
 * @param {*} format 格式化字符串
 */
export function formatTimeToTimestamp(format) {
  if (format && format.length > 0) {
    var timeValue = moment(format)
      .valueOf()
      .toString()
    return timeValue.length > 10 ? timeValue.substr(0, 10) : timeValue
  }
  return ''
}

/** image 下载 */
import { downloadFileAPI } from '@/api/common'

/**
 *
 * @param {*} data url
 * @param {*} filename 名称
 */
export function getImageData(url) {
  return new Promise((resolve, reject) => {
    downloadFileAPI(url).then(res => {
      const blob = new Blob([res.data], {
        type: ''
      })

      var reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload = (evt) => {
        resolve({
          blob: blob,
          src: evt.target.result
        })
      }
    }).catch(() => {
      reject()
    })
  })
}

/**
 * path  和 name
 */
export function downloadFile(data) {
  downloadFileAPI(data.path).then(res => {
    const blob = new Blob([res.data], {
      type: ''
    })
    downloadFileWithBuffer(blob, data.name || '文件')
  }).catch(() => {})
}

export function dataURLtoBlob(dataurl) {
  // eslint-disable-next-line one-var
  var arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], {
    type: mime
  })
}

export function getBase64Image(img) {
  var canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  var ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, img.width, img.height)
  var ext = img.src.substring(img.src.lastIndexOf('.') + 1).toLowerCase()
  var dataURL = canvas.toDataURL('image/' + ext)
  return dataURL
}

// 获取绑定参数
export function guid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4())
}

import CryptoJS from 'crypto-js'

export function encrypt(word) {
  const key = CryptoJS.enc.Utf8.parse('99c5b4fc63b64dcb9a7979993f33c760')
  const srcs = CryptoJS.enc.Utf8.parse(word)
  const encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
  return encrypted.toString()
}

export function decrypt(word) {
  const key = CryptoJS.enc.Utf8.parse('99c5b4fc63b64dcb9a7979993f33c760')
  const decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
  return CryptoJS.enc.Utf8.stringify(decrypt).toString()
}

import JsEncrypt from 'jsencrypt'

export function RSAencrypt(pas) {
  const publicKey = '-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4ZiC5JTMV6C12+cuxDoBBUN3wYdHnSF/sUV9a6lST4GpQTpBkC5vvMhb5mqnDzzAkOiRgrbjBqTuf6PVSgJt+b2rsV2A1zvhXLdVhU4Zw2R+iHDb+mXvZnFXKkwjb5+GMkX2tj4DxqEq3QP0XZHxuvpl5h7kdIIp/QS80Pk7jdlSi92TY5C62j6WU2Cw0SC0Ie4bOJQL5E5WphY3k6xJekpHh6y5k1utgV4RVCyxGnBpp1S0u2aupa1gd0A/AEjfv6uJJh6B8HY8DUgWgLEb0jGF5IviUKPu5B2GcLtZg45jjzZfcIt5gLVxBo9w870khq95MkSW0kULtG+1NVjz2wIDAQAB-----END PUBLIC KEY-----'
  // 实例化jsEncrypt对象
  const jse = new JsEncrypt()
  // 设置公钥
  jse.setPublicKey(publicKey)
  return jse.encrypt(pas)
}

import XLSX from 'xlsx'
export function getExcelLines(file) {
  var reader = new FileReader() // 读取操作就是由它完成.
  reader.readAsBinaryString(file)// 读取文件的内容,也可以读取文件的URL
  reader.onload = function(evt) {
    // 当读取完成后回调这个函数,然后此时文件的内容存储到了result中,直接操作即可
    try {
      var data = evt.target.result
      var workbook = XLSX.read(data, {
        type: 'binary'
      }) // 以二进制流方式读取得到整份excel表格对象
      var buildings = [] // 存储获取到的数据
      // var fromTo = ''
      // 遍历每张表读取
      for (var sheet in workbook.Sheets) {
        if (workbook.Sheets.hasOwnProperty(sheet)) {
          // fromTo = workbook.Sheets[sheet]['!ref']
          buildings = buildings.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]))
          break // 如果只取第一张sheet表，就取消注释这行
        }
      }
      const fileRows = buildings.length - 1// 表格内容行数，减去表头的一行

      return fileRows
    } catch (e) {
      console.log('文件类型不正确', e)
      return
    }
  }
}

/**
 * 两个浮点数求和
 * @param num1
 * @param num2
 * @return {number}
 */
export function floatAdd(num1, num2) {
  let r1, r2
  try {
    r1 = num1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = num2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  const m = Math.pow(10, Math.max(r1, r2))
  return Math.round(num1 * m + num2 * m) / m
}

/**
 * 下载excel
 */
export function downloadExcelWithResData(res) {
  let fileName = res.headers['content-disposition'].split('filename=')[1]
  if (!fileName) {
    fileName = res.headers['content-disposition'].split('UTF-8\'\'')[1]
  }
  fileName = fileName ? fileName.replace(/\"/g, '') : 'file.xlsx'
  fileName = decodeURI(fileName) || ''
  downloadFileWithBuffer(res.data, fileName, 'application/vnd.ms-excel;charset=utf-8')
}

export function downloadFileWithBuffer(data, name, type) {
  var blob = new Blob([data], {
    type: type || ''
  })
  var downloadElement = document.createElement('a')
  var href = window.URL.createObjectURL(blob) // 创建下载的链接
  downloadElement.href = href
  downloadElement.download = name // 下载后文件名
  document.body.appendChild(downloadElement)
  downloadElement.click() // 点击下载
  document.body.removeChild(downloadElement) // 下载完成移除元素
  window.URL.revokeObjectURL(href) // 释放掉blob对象
}
