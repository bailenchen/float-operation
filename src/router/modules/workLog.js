/** 工作日志路由+ */
import Layout from '@/views/layout/workLog'

const workLogRouter = {
  path: '/workLog',
  component: Layout,
  redirect: '/workLog/index/all',
  name: 'workLog',
  hidden: true,
  meta: {
    requiresAuth: true,
    title: '全部',
    index: 0,
    type: 'workLog'
  },
  children: [
    {
      path: 'index/:type',
      hidden: true,
      component: () => import('@/views/workLog/index'),
      meta: {}
    },
    {
      path: 'index/all',
      component: () => import('@/views/workLog/index'),
      meta: {
        title: '全部',
        icon: 'all'
      }
    },
    {
      path: 'index/send',
      component: () => import('@/views/workLog/index'),
      meta: {
        title: '我发出的',
        icon: 'copy-to'
      }
    },
    {
      path: 'index/received',
      component: () => import('@/views/workLog/index'),
      meta: {
        title: '我收到的',
        icon: 'email'
      }
    }
  ]
}

export default workLogRouter
