/** 客户管理路由 */
import Layout from '@/views/layout/customerLayout'

const layout = function(meta = {}) {
  return {
    path: '/crm',
    component: Layout,
    meta: {
      requiresAuth: true,
      ...meta
    }
  }
}

export default [
  {
    ...layout({
      permissions: ['crm']
    }),
    children: [{
      path: 'workbench', // 仪表盘
      component: () => import('@/views/customermanagement/workbench/workbench'),
      meta: {
        title: '仪表盘',
        icon: 'board'
      }
    }]
  },
  {
    ...layout({
      permissions: ['crm']
    }),
    children: [{
      path: 'message', // 待办事项
      component: () => import('@/views/customermanagement/message/Message'),
      meta: {
        title: '待办事项',
        icon: 'message',
        num: 0
      }
    }]
  },
  {
    ...layout({
      permissions: ['crm', 'leads']
    }),
    children: [{
      path: 'clue', // 线索列表
      component: () => import('@/views/customermanagement/clue/ClueIndex'),
      meta: {
        title: '线索',
        icon: 'leads'
      }
    }]
  },
  {
    ...layout({
      permissions: ['crm', 'applet']
    }),
    children: [{
      path: 'applet', // 名片列表
      component: () => import('@/views/customermanagement/applet/AppletIndex'),
      meta: {
        title: '小程序线索',
        icon: 'mp'
      }
    }]
  },
  {
    ...layout({
      permissions: ['crm', 'customer']
    }),
    children: [{
      path: 'customer', // 客户列表
      component: () => import('@/views/customermanagement/customer/CustomerIndex'),
      meta: {
        title: '客户',
        icon: 'customer'
      }
    }]
  },
  {
    ...layout({
      permissions: ['crm', 'customer', 'nearbyCustomer']
    }),
    children: [{
      path: 'map', // 附近的客户
      component: () => import('@/views/customermanagement/map/MapIndex'),
      meta: {
        title: '附近的客户',
        icon: 'nearby'
      }
    }]
  },
  {
    ...layout({
      permissions: ['crm', 'contacts']
    }),
    children: [{
      path: 'contacts', // 附近的客户
      component: () => import('@/views/customermanagement/contacts/ContactsIndex'),
      meta: {
        title: '联系人',
        icon: 'contacts'
      }
    }]
  },
  {
    ...layout({
      permissions: ['crm', 'pool']
    }),
    children: [{
      path: 'seas', // 公海列表
      component: () => import('@/views/customermanagement/seas/SeasIndex'),
      meta: {
        title: '公海',
        icon: 'seas'
      }
    }]
  },
  {
    ...layout({
      permissions: ['crm', 'business']
    }),
    children: [{
      path: 'business', // 商机列表
      component: () => import('@/views/customermanagement/business/BusinessIndex'),
      meta: {
        title: '商机',
        icon: 'business'
      }
    }]
  },
  {
    ...layout({
      permissions: ['crm', 'contract']
    }),
    children: [{
      path: 'contract', // 合同列表
      component: () => import('@/views/customermanagement/contract/ContractIndex'),
      meta: {
        title: '合同',
        icon: 'contract'
      }
    }]
  },
  {
    ...layout({
      permissions: ['crm', 'receivables']
    }),
    children: [{
      path: 'receivables', // 回款列表
      component: () => import('@/views/customermanagement/money/MoneyIndex'),
      meta: {
        title: '回款',
        icon: 'receivables'
      }
    }]
  },
  {
    ...layout({
      permissions: ['crm', 'product']
    }),
    children: [{
      path: 'product', // 产品列表
      component: () => import('@/views/customermanagement/product/ProductIndex'),
      meta: {
        title: '产品',
        icon: 'product'
      }
    }]
  },
  {
    ...layout({
      permissions: ['crm', 'marketing']
    }),
    children: [{
      path: 'marketing', // 活动列表
      component: () => import('@/views/customermanagement/marketing/index'),
      meta: {
        title: '市场活动',
        icon: 'airplane'
      }
    }]
  }
]
