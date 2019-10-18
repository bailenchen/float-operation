/** 项目管理路由 */

const workbenchRouter = {
  name: 'workbench',
  path: 'workbench',
  component: () => import('@/views/projectManagement/task/index'),
  meta: {
    icon: 'workbench',
    title: '工作台'
  }
}

// 项目
const projectRouter = {
  path: 'project',
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
    component: () => import('@/views/projectManagement/tag/index'),
    meta: {
      menuIndex: '/project/tag'
    }
  },
  {
    name: 'project-list',
    path: 'project/:id',
    component: () => import('@/views/projectManagement/project/index'),
    meta: {
      menuIndex: '/project/project'
    }
  }
  ]
}

export const children = [workbenchRouter, projectRouter, statisticsRouter, archiveRouter, tagRouter, recycleRouter, ...otherRouter.children]
export const childrenMenu = [workbenchRouter, projectRouter, statisticsRouter, archiveRouter, tagRouter, recycleRouter]
