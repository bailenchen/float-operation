import { getImageData } from '@/utils'

const dataCache = {}

const loadData = (el, binding) => {
  const loadingImg = require('@/assets/img/white.png')
  setSrc(el, binding, loadingImg)


  if (binding.value && binding.value.indexOf('/file/downFile') == 0) {
    if (dataCache[binding.value]) {
      setSrc(el, binding, dataCache[binding.value])
    } else {
      getImageData(binding.value).then((data) => {
        setSrc(el, binding, data.src)
        dataCache[binding.value] = data.src
      }).catch(() => {})
    }
  } else {
    setSrc(el, binding, binding.value)
  }
}

const setSrc = (el, binding, src) => {
  if (binding.arg) {
    el.style[binding.arg] = 'url("' + src + '")'
  } else {
    el.setAttribute('src', src)
  }
}

export default {
  name: 'src',
  inserted(el, binding) {
    loadData(el, binding)
  },
  update: function(el, binding) {
    if (binding.oldValue != binding.value) {
      loadData(el, binding)
    }
  },

  unbind(el) {
  }
}

