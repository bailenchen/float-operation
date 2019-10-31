/** 通讯录路由 */
import Layout from '@/views/layout/addressBook'
const layout = function(hidden, meta = {}) {
  return {
    path: '/addressBook',
    component: Layout,
    alwaysShow: false,
    hidden: hidden,
    meta: {
      requiresAuth: true,
      permissions: ['oa', 'book'],
      ...meta
    }
  }
}

export default [
  {
    ...layout(true),
    children: [{
      path: 'index/:type',
      component: () => import('@/views/addressBook/index')
    }]
  },
  {
    ...layout(false),
    children: [{
      path: 'index/all',
      component: () => import('@/views/addressBook/index'),
      meta: {
        title: '全部',
        icon: 'all'
      }
    }]
  },
  {
    ...layout(false),
    children: [{
      path: 'index/attention',
      component: () => import('@/views/addressBook/index'),
      meta: {
        title: '我的关注',
        icon: 'focus-on'
      }
    }]
  }
]
