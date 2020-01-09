export default {
  install(Vue, options = {}) {
    // 限制数据数值
    Vue.directive('WkNumber', {
      update(ele, { value }) {
        const el = ele.getElementsByTagName('input')[0]
        const copyValue = el.value
        el.value = el.value.replace(/[^\-?\d.]/g, '')
        el.value = el.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3')
        if (el.value != copyValue) {
          el.dispatchEvent(new Event('input'))
        }
      }
    })
  }
}
