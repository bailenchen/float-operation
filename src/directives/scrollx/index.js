
// 盒子滚动条拖拽
import { on, off } from '@/utils/dom'
import Vue from 'vue'
// import { debounce } from 'throttle-debounce'

let targetDrag = { // 托拽
  isDown: false,
  coord: {
    x: 0,
    y: 0
  }
}

let dom = null
let ignoreClass = [] // 忽略的类名

const scrollMousedown = event => {
  dom.style.cursor = 'pointer'
  targetDrag.isDown = true
  targetDrag.coord.x = event.pageX
  targetDrag.coord.y = event.pageY
}

const scrollMouseup = event => {
  dom.style.cursor = 'default'
  targetDrag.isDown = false
  targetDrag.coord.x = 0
  targetDrag.coord.y = 0
}

const scrollMousemove = event => {
  if (targetDrag.isDown) {
    const movX = targetDrag.coord.x - event.pageX
    targetDrag.coord.x = event.pageX
    dom.scrollLeft = dom.scrollLeft + movX
  }
}

// const scrollMouseout = event => {
//   dom.style.cursor = 'default'
//   targetDrag.isDown = false
// }

const scrollMousewheel = event => {
  if (checkIsIgnore(event)) {
    dom.style.cursor = 'default'
    targetDrag.isDown = false
  } else {
    dom.scrollLeft += event.deltaY
  }
}

/**
 * 检查dom是否忽略
 * @param {*} e
 */
// const checkDomIsIgnore = debounce(300, (e) => {
//   let ignore = false
//   ignoreClass.forEach(element => {
//     var items = document.getElementsByClassName(element)
//     if (items && !ignore) {
//       for (let index = 0; index < items.length; index++) {
//         const element = items[index]
//         if (element.contains(e.target)) {
//           ignore = true
//           break
//         }
//       }
//     }
//   })
//   return ignore
// })

/**
 * 忽略滚轮
 * @param {*} e
 */
const checkIsIgnore = (e) => {
  let ignore = false
  ignoreClass.forEach(element => {
    var items = document.getElementsByClassName(element)
    if (items && !ignore) {
      for (let index = 0; index < items.length; index++) {
        const element = items[index]
        const rect = element.getBoundingClientRect()
        if ((e.clientY > rect.top && (e.clientY < (rect.top + rect.height))) && (e.clientX > rect.left && (e.clientX < (rect.left + rect.width)))) {
          ignore = true
          break
        }
      }
    }
  })
  return ignore
}

export default Vue.directive('scrollx', {
  bind: function(el, binding, vnode) {
    const valueData = binding.value
    ignoreClass = valueData.ignoreClass
  },

  inserted: function(el) {
    dom = el

    // 鼠标按下
    on(document, 'mousedown', scrollMousedown)
    // on(document, 'mouseout', scrollMouseout)
    on(document, 'wheel', scrollMousewheel)
    // 鼠标释放
    on(document, 'mouseup', scrollMouseup)
    // 鼠标托拽
    on(document, 'mousemove', scrollMousemove)
  },

  unbind: function(el) {
    off(document, 'mousedown', scrollMousedown)
    off(document, 'mouseup', scrollMouseup)
    // off(document, 'mouseout', scrollMouseout)
    off(document, 'wheel', scrollMousewheel)
    off(document, 'mousemove', scrollMousemove)

    // 清空
    targetDrag = { // 托拽
      isDown: false,
      coord: {
        x: 0,
        y: 0
      }
    }
  }
})

