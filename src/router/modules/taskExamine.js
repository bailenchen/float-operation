/** 任务审批路由+ */
import Layout from '@/views/layout/taskExamineLayout'

const taskExamineLayout = {
  path: '/taskExamine',
  component: Layout,
  redirect: '/taskExamine/send',
  name: 'taskExamine',
  hidden: true,
  meta: {
    requiresAuth: true
  },
  children: [
    {
      path: 'send',
      component: () => import('@/views/taskExamine/examine/send'),
      meta: {
        title: '我发出的审批',
        icon: 'apply-for'
      }
    },
    {
      path: 'index',
      component: () => import('@/views/taskExamine/examine/index'),
      meta: {
        title: '待我审批',
        icon: 'approve'
      }
    }
  ]
}

export default taskExamineLayout
