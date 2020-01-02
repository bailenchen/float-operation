// 日历
import Layout from '@/views/layout/calendarLayout'

const layout = function(meta = {}) {
  return {
    path: '/calendar',
    component: Layout,
    meta: {
      requiresAuth: false,
      ...meta
    }
  }
}

export default [
  {
    ...layout({
      permissions: ['crm']
    }),
    children: [{
      path: 'index', // 列表
      component: () => import('@/views/calendar/index'),
      meta: {
        title: '列表',
        icon: 'board'
      }
    }]
  }
]
