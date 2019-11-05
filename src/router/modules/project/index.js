import Layout from '@/views/layout/projectLayout'

const layout = function(path = '/project', meta = {}) {
  return {
    path: path,
    component: Layout,
    meta: {
      requiresAuth: true,
      permissions: ['project'],
      ...meta
    }
  }
}

export default [
  {
    ...layout(),
    children: [{
      path: 'workbench', // 工作台
      component: () => import('@/views/projectManagement/task/index'),
      meta: {
        title: '工作台',
        icon: 'workbench'
      }
    }]
  },
  {
    ...layout('/project-list'),
    children: [{
      name: 'project-list',
      path: 'project/:id', // 项目
      component: () => import('@/views/projectManagement/project/index'),
      hidden: true,
      meta: {
        activeMenu: '/project-list/index'
      }
    }, {
      path: 'index', // 展示用
      meta: {
        title: '项目',
        icon: 'project',
        disabled: true // 禁止next
      }
    }]
  },
  {
    ...layout(),
    children: [{
      path: 'statistics', // 统计分析
      component: () => import('@/views/projectManagement/statistics/index'),
      meta: {
        title: '统计分析',
        icon: 'results-solid'
      }
    }]
  },
  {
    ...layout(),
    children: [{
      path: 'archive', // 归档项目
      component: () => import('@/views/projectManagement/archive/index'),
      meta: {
        title: '归档项目',
        icon: 'archive'
      }
    }]
  },
  {
    ...layout('/tag-list'),
    children: [{
      name: 'tag-list',
      path: 'tag/:id', // 项目
      component: () => import('@/views/projectManagement/tag/index'),
      hidden: true,
      meta: {
        activeMenu: '/tag-list/index'
      }
    }, {
      path: 'index', // 展示用
      meta: {
        title: '标签',
        icon: 'label',
        disabled: true // 禁止next
      }
    }]
  },
  {
    ...layout(),
    children: [{
      path: 'recycle', // 回收站
      component: () => import('@/views/projectManagement/recycle/index'),
      meta: {
        title: '回收站',
        icon: 'bin'
      }
    }]
  }
]
