/** 通讯录路由 */
import Layout from '@/views/layout/addressBook'

const addressBookRouter = {
  path: '/addressBook',
  component: Layout,
  redirect: '/addressBook/index/all',
  name: 'addressBook',
  hidden: true,
  meta: {
    requiresAuth: true,
    title: '全部',
    index: 0,
    type: 'addressBook'
  },
  children: [
    {
      path: 'index/:type',
      hidden: true,
      component: () => import('@/views/addressBook/index'),
      meta: {
      }
    },
    {
      path: 'index/all',
      component: () => import('@/views/addressBook/index'),
      meta: {
        title: '全部',
        icon: 'all'
      }
    },
    {
      path: 'index/attention',
      component: () => import('@/views/addressBook/index'),
      meta: {
        title: '我的关注',
        icon: 'focus-on'
      }
    }
  ]
}

export default addressBookRouter
