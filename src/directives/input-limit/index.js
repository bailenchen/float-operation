export default {
  install(Vue, options = {}) {
    // 限制数据数值
    Vue.directive('WkNumber', {
      update(ele, { value }) {
        console.log('v', value)
        const el = ele.getElementsByTagName('input')[0]
        const copyValue = el.value
        el.value = el.value.replace(/[^\-?\d.]/g, '')
        if (!value) { // 默认保留两位小数
          el.value = el.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
        } else if (value == 'noMinus') { // 默认保留两位小数
          el.value = el.value.replace(/[\-\+]*(\d+)(\.?)(\d?)(\d?).*$/, function(...arg) {
            console.log('匹配', arg)
            arg[3] = arg[3] ? arg[3] : ''
            arg[4] = arg[4] ? arg[4] : ''
            return `${arg[1]}${arg[2]}${arg[3]}${arg[4]}`
          })
        }
        if (el.value != copyValue) {
          el.dispatchEvent(new Event('input'))
        }
      }
    })
  }
}
