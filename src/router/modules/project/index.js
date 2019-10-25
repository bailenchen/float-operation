import Layout from '@/views/layout/projectLayout'
import {
  children
} from './project'

const workbenchRouter = {
  path: '/project',
  component: Layout,
  redirect: '/project/workbench',
  name: 'project',
  meta: {
    icon: 'workbench',
    title: '项目管理',
    requiresAuth: true,
    index: 0,
    type: 'project'
  },
  children: children
}

export default workbenchRouter
