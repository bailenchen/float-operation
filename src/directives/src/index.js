import { getImageData } from '@/utils'

const loadData = (el, binding) => {
  const loadingImg = require('@/assets/img/send_img.png')

  if (binding.arg) {
    el.style[binding.arg] = 'url("' + loadingImg + '")'
  } else {
    el.setAttribute('src', loadingImg)
  }

  if (binding.value.indexOf('data:image') == 0) {
    if (binding.arg) {
      el.style[binding.arg] = 'url("' + binding.value + '")'
    } else {
      el.setAttribute('src', binding.value)
    }
  } else {
    getImageData(binding.value).then((data) => {
      if (binding.arg) {
        el.style[binding.arg] = 'url("' + data.src + '")'
      } else {
        el.setAttribute('src', data.src)
      }
    }).catch(() => {})
  }
}

export default {
  name: 'src',
  inserted(el, binding) {
    loadData(el, binding)
  },
  update: function(el, binding) {
    loadData(el, binding)
  },

  unbind(el) {
  }
}

