// 邮箱
import Layout from '@/views/layout/emailLayout'

const layout = function(meta = {}, hidden) {
  return {
    path: '/email',
    component: Layout,
    hidden: hidden,
    meta: {
      requiresAuth: false,
      ...meta
    }
  }
}

export default [
  {
    path: '/email/set', // 设置
    name: 'email-set',
    component: () => import('@/views/email/set/index'),
    hidden: true,
    meta: {
      title: '设置',
      icon: 'board'
    }
  },
  {
    ...layout({}, true),
    children: [{
      path: 'index/:type', // 列表
      component: () => import('@/views/email/index'),
      meta: {
        icon: 'board'
      }
    }]
  },
  {
    ...layout({}),
    ignore: true, // 路由添加时忽略
    children: [{
      path: 'index/writeLetter', // 列表
      meta: {
        title: '写信',
        icon: 'board'
      }
    }]
  },
  {
    ...layout({}),
    ignore: true, // 路由添加时忽略
    children: [{
      path: 'index/receive', // 列表
      meta: {
        title: '收件箱',
        icon: 'board'
      }
    }]
  },
  {
    ...layout({}),
    ignore: true, // 路由添加时忽略
    children: [{
      path: 'index/star', // 列表
      meta: {
        title: '星标邮件',
        icon: 'board'
      }
    }]
  },
  {
    ...layout({}),
    ignore: true, // 路由添加时忽略
    children: [{
      path: 'index/draft', // 列表
      meta: {
        title: '草稿箱',
        icon: 'board'
      }
    }]
  },
  {
    ...layout({}),
    ignore: true, // 路由添加时忽略
    children: [{
      path: 'index/sent', // 列表
      meta: {
        title: '已发送',
        icon: 'board'
      }
    }]
  },
  {
    ...layout({}),
    ignore: true, // 路由添加时忽略
    children: [{
      path: 'index/deleted', // 列表
      meta: {
        title: '已删除',
        icon: 'board'
      }
    }]
  },
  {
    ...layout({}),
    ignore: true, // 路由添加时忽略
    children: [{
      path: 'index/spam', // 列表
      meta: {
        title: '垃圾邮件',
        icon: 'board'
      }
    }]
  }
]
