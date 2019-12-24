// 邮箱
import Layout from '@/views/layout/emailLayout'

const layout = function(meta = {}) {
  return {
    path: '/email',
    component: Layout,
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
    ...layout({
      permissions: ['crm']
    }),
    children: [{
      path: 'index', // 列表
      component: () => import('@/views/email/index'),
      meta: {
        title: '列表',
        icon: 'board'
      }
    }]
  }
]
