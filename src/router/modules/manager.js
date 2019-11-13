/** 系统管理路由 */
import Layout from '@/views/layout/managerLayout'

const layout = function(meta = {}, path = '/manage', requiresAuth = true) {
  return {
    path: path,
    component: Layout,
    meta: {
      requiresAuth: requiresAuth,
      ...meta
    }
  }
}

export default [
  {
    ...layout({
      permissions: ['manage', 'system', 'read']
    }),
    children: [{
      name: 'systemconfig',
      path: 'systemconfig', // 企业首页
      component: () => import('@/views/SystemManagement/SystemConfig/index'),
      meta: {
        title: '企业首页',
        icon: 'enterprise'
      }
    }]
  },
  {
    ...layout({
      permissions: ['manage', 'configSet', 'read']
    }),
    children: [{
      name: 'application',
      path: 'application', // 应用管理
      component: () => import('@/views/SystemManagement/application/index'),
      meta: {
        title: '应用管理',
        icon: 'all'
      }
    }]
  },
  {
    ...layout({
      permissions: ['manage', 'users', 'read']
    }),
    children: [{
      name: 'employee-dep',
      path: 'employee-dep', // 员工与部门管理
      component: () => import('@/views/SystemManagement/SystemEmployee/EmployeeDepManagement'),
      meta: {
        title: '员工与部门管理',
        icon: 's-seas'
      }
    }]
  },
  {
    ...layout({
      permissions: ['manage', 'permission'],
      title: '角色权限管理',
      icon: 'user'
    }, '/manage/role-auth'),
    alwaysShow: true,
    name: 'manage-role-auth',
    children: [{
      name: 'role-auth',
      path: 'role-auth/:pid/:title',
      hidden: true,
      component: () => import('@/views/SystemManagement/roleAuth/index'),
      meta: {}
    }]
  },
  {
    ...layout({
      permissions: ['manage', 'examineFlow']
    }),
    children: [{
      name: 'system-examine',
      path: 'system-examine', // 审批流（合同/回款）
      component: () => import('@/views/SystemManagement/SystemExamine/SystemExamine'),
      meta: {
        title: '审批流（合同/回款）',
        icon: 'approve'
      }
    }]
  },
  {
    ...layout({
      permissions: ['manage', 'oa']
    }),
    children: [{
      name: 'system-workbench',
      path: 'system-workbench', // 审批流（办公）
      component: () => import('@/views/SystemManagement/SystemWorkbench'),
      meta: {
        title: '审批流（办公）',
        icon: 'approve'
      }
    }, {
      name: 'workbenchHandlefield',
      path: 'workbench-custom-field/:type/:id/:label', // type customer contacts business contract money
      component: () => import('@/views/SystemManagement/SystemCustomer/HandleField'),
      hidden: true,
      meta: {
        activeMenu: '/manage/system-workbench'
      }
    }]
  },
  {
    ...layout({
      permissions: ['manage', 'work']
    }),
    children: [{
      name: 'system-project',
      path: 'system-project', // 项目管理
      component: () => import('@/views/SystemManagement/project'),
      meta: {
        title: '项目管理',
        icon: 'project'
      }
    }]
  },
  {
    ...layout({
      permissions: ['manage', 'crm'],
      title: '客户管理',
      icon: 'customer'
    }, '/manage/customer'),
    alwaysShow: true,
    children: [{
      path: 'custom-field',
      component: () => import('@/views/SystemManagement/SystemCustomer/customField'),
      meta: {
        title: '自定义字段设置',
        requiresAuth: true,
        permissions: ['manage', 'crm', 'field']
      }
    }, {
      path: 'customer',
      component: () => import('@/views/SystemManagement/SystemCustomer/customer'),
      meta: {
        title: '客户公海规则设置',
        requiresAuth: true,
        permissions: ['manage', 'crm', 'pool']
      }
    }, {
      path: 'biz-param',
      component: () => import('@/views/SystemManagement/SystemCustomer/bizParam'),
      meta: {
        title: '业务参数设置',
        requiresAuth: true,
        permissions: ['manage', 'crm', 'setting']
      }
    }, {
      path: 'biz-goals',
      component: () => import('@/views/SystemManagement/SystemCustomer/bizGoals'),
      meta: {
        title: '业绩目标设置',
        requiresAuth: true,
        permissions: ['manage', 'crm', 'achievement']
      }
    }, {
      name: 'handlefield',
      path: 'custom-field/:type/:id/:label', // type customer contacts business contract money
      component: () => import('@/views/SystemManagement/SystemCustomer/HandleField'),
      hidden: true,
      meta: {
        activeMenu: '/manage/customer/custom-field',
        requiresAuth: true,
        permissions: ['manage', 'crm', 'field']
      }
    }]
  },
  {
    ...layout({
      permissions: ['manage', 'work']
    }, '/manage', false),
    children: [{
      name: 'system-other',
      path: 'system-other', // 其他配置
      component: () => import('@/views/SystemManagement/other'),
      meta: {
        title: '其他设置',
        icon: 'manage'
      }
    }]
  }
]
