/** 项目管理路由 */

const workbenchRouter = {
  path: 'workbench',
  meta: {
    icon: 'workbench',
    title: '工作台'
  },
  children: [{
    name: 'my-task',
    path: 'my-task',
    component: () => import('@/views/projectManagement/task/index'),
    meta: {
      title: '我的任务'
    }
  },
  {
    path: 'task-calendars',
    component: () => import('@/views/projectManagement/calendars/index'),
    meta: {
      title: '任务日历'
    }
  }
  ]
}

// 项目
const projectRouter = {
  path: 'project-list',
  meta: {
    icon: 'project',
    title: '项目',
    disabled: true
  }
}

// 统计分析
const statisticsRouter = {
  path: 'statistics',
  component: () => import('@/views/projectManagement/statistics/index'),
  meta: {
    icon: 'results-solid',
    title: '统计分析'
  }
}

// 项目归档
const archiveRouter = {
  path: 'archive-project',
  component: () => import('@/views/projectManagement/archive/index'),
  meta: {
    icon: 'archive',
    title: '归档项目'
  }
}

// 标签
const tagRouter = {
  path: 'tag',
  meta: {
    icon: 'label',
    title: '标签',
    disabled: true
  }
}

// 回收站
const recycleRouter = {
  path: 'recycle',
  component: () => import('@/views/projectManagement/recycle/index'),
  meta: {
    icon: 'bin',
    title: '回收站'
  }
}

// 其他
const otherRouter = {
  hidden: true,
  meta: {
    title: '项目管理'
  },
  children: [{
    name: 'tag-list',
    path: 'tag/:id',
    component: () => import('@/views/projectManagement/tag/index')
  },
  {
    name: 'project-list',
    path: 'list/:id',
    component: () => import('@/views/projectManagement/project/index')
  }
  ]
}

export const children = [...workbenchRouter.children, projectRouter, statisticsRouter, archiveRouter, tagRouter, recycleRouter, ...otherRouter.children]
export const childrenMenu = [workbenchRouter, projectRouter, statisticsRouter, archiveRouter, tagRouter, recycleRouter]
