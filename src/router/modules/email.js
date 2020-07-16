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
    ...layout({}, true),
    children: [{
      path: '/email/set', // 设置
      name: 'email_set',
      component: () => import('@/views/email/set/index'),
      meta: {
        title: '设置',
        icon: 'manage',
        name: 'email-set'
      }
    }]
  },
  {
    ...layout({}, true),
    children: [{
      path: '/email/person', // 个人中心
      component: () => import('@/views/email/person'),
      meta: {
        title: '个人中心',
        icon: 'user'
      }
    }]
  },
  {
    ...layout('/email'),
    children: [{
      path: 'sync', // 收信
      meta: {
        title: '收信（同步）',
        icon: 'b-download',
        disabled: true // 禁止next
      }
    }]
  },
  {
    ...layout({}, false),
    children: [{
      path: 'index/writeLetter', // 列表
      component: () => import('@/views/email/CreateEmail'),
      meta: {
        title: '写信',
        icon: 'circle-edit'
      }
    }]
  },
  {
    ...layout({}, true),
    children: [{
      path: 'index/:type', // 列表
      component: () => import('@/views/email/index'),
      meta: {
        icon: 'inbox'
      }
    }]
  },
  {
    ...layout({}, true),
    ignore: true, // 路由添加时忽略
    children: [{
      name: 'email_index',
      path: 'index/goTo', // 列表
      meta: {
        title: '往来邮件',
        icon: 'inbox'
      }
    }]
  },
  {
    ...layout({}),
    ignore: true, // 路由添加时忽略
    children: [{
      name: 'email_index',
      count: 0,
      path: 'index/receive', // 列表
      meta: {
        title: '收件箱',
        icon: 'inbox'
      }
    }]
  },
  {
    ...layout({}),
    ignore: true, // 路由添加时忽略
    children: [{
      path: 'index/star', // 列表
      count: 0,
      meta: {
        title: '星标邮件',
        icon: 'focus-on'
      }
    }]
  },
  {
    ...layout({}),
    ignore: true, // 路由添加时忽略
    children: [{
      path: 'index/draft', // 列表
      count: 0,
      meta: {
        title: '草稿箱',
        icon: 'drafts'
      }
    }]
  },
  {
    ...layout({}),
    ignore: true, // 路由添加时忽略
    children: [{
      path: 'index/sent', // 列表
      count: 0,
      meta: {
        title: '已发送',
        icon: 'inbox'
      }
    }]
  },
  {
    ...layout({}),
    ignore: true, // 路由添加时忽略
    children: [{
      path: 'index/deleted', // 列表
      count: 0,
      meta: {
        title: '已删除',
        icon: 'bin'
      }
    }]
  },
  {
    ...layout({}),
    ignore: true, // 路由添加时忽略
    children: [{
      path: 'index/spam', // 列表
      count: 0,
      meta: {
        title: '垃圾邮件',
        icon: 'recycle-bin'
      }
    }]
  }
]
