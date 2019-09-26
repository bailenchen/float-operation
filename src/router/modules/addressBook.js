/** 通讯录路由 */
import Layout from '@/views/layout/addressBook'

const addressBookRouter = {
  path: '/addressBook',
  component: Layout,
  redirect: '/addressBook/index',
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
      path: 'index',
      component: () => import('@/views/addressBook/index'),
      meta: {
        title: '全部',
        icon: 'all'
      }
    },
    {
      path: 'attention',
      component: () => import('@/views/addressBook/attention'),
      meta: {
        title: '我的关注',
        icon: 'copy-to'
      }
    }
  ]
}

export default addressBookRouter
