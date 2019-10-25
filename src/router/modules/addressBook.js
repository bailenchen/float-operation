/** 通讯录路由 */
import Layout from '@/views/layout/addressBook'

const addressBookRouter = {
  path: '/addressBook',
  component: Layout,
  redirect: '/addressBook/index/all',
  name: 'addressBook',
  hidden: true,
  meta: {
    title: '全部',
    requiresAuth: true,
    index: 1,
    type: 'oa',
    subType: 'book'
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
