/** 工作日志路由+ */
import Layout from '@/views/layout/workLog'

const layout = function(hidden, meta = {}) {
  return {
    path: '/workLog',
    component: Layout,
    alwaysShow: false,
    hidden: hidden,
    meta: {
      requiresAuth: true,
      permissions: ['oa', 'log'],
      ...meta
    }
  }
}

export default [
  {
    ...layout(true),
    children: [{
      path: 'index/:type',
      meta: {
        redirect: 'index/all' // 获取传参的重置链接
      },
      component: () => import('@/views/workLog/index')
    }]
  },
  {
    ...layout(false),
    ignore: true, // 路由添加时忽略
    children: [{
      path: 'index/all',
      meta: {
        title: '全部',
        icon: 'all'
      }
    }]
  },
  {
    ...layout(false),
    ignore: true,
    children: [{
      path: 'index/send',
      meta: {
        title: '我发出的',
        icon: 'copy-to'
      }
    }]
  },
  {
    ...layout(false),
    ignore: true,
    children: [{
      path: 'index/received',
      meta: {
        title: '我收到的',
        icon: 'email'
      }
    }]
  },
  {
    ...layout(false),
    component: () => import('@/views/workLog/FollowIndex'),
    children: [{
      path: 'follow',
      meta: {
        title: '跟进记录',
        icon: 'message'
      }
    }]
  }
]
