/** 任务审批路由+ */
import Layout from '@/views/layout/taskExamineLayout'

const taskExamineLayout = {
  path: '/taskExamine',
  component: Layout,
  redirect: '/taskExamine/task-index/1',
  name: 'taskExamine',
  hidden: true,
  meta: {
    requiresAuth: true
  },
  children: [
    {
      path: 'task-index/:type',
      hidden: true,
      component: () => import('@/views/taskExamine/task/index')
    },
    {
      path: 'task-index/1',
      component: () => import('@/views/taskExamine/task/index'),
      meta: {
        title: '我的任务',
        icon: 'my-task'
      }
    },
    {
      path: 'task-index/2',
      component: () => import('@/views/taskExamine/task/index'),
      meta: {
        title: '下属的任务',
        icon: 'o-task'
      }
    },
    {
      path: 'examine-index/:type',
      hidden: true,
      component: () => import('@/views/taskExamine/examine/index')
    },
    {
      path: 'examine-index/my',
      component: () => import('@/views/taskExamine/examine/index'),
      meta: {
        title: '我发出的审批',
        icon: 'apply-for'
      }
    },
    {
      path: 'examine-index/wait',
      component: () => import('@/views/taskExamine/examine/index'),
      meta: {
        title: '待我审批',
        icon: 'approve'
      }
    }
  ]
}

export default taskExamineLayout
