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
      // permissions: ['crm', 'leads']
      permissionList: [['crm', 'leads'], ['crm', 'applet']]
    }),
    children: [{
      path: 'leads', // 线索列表
      component: () => import('@/views/customermanagement/clue/ClueAllIndex'),
      meta: {
        title: '线索',
        icon: 'leads'
      }
    }]
  },
  // {
  //   ...layout({
  //     permissions: ['crm', 'applet']
  //   }),
  //   children: [{
  //     path: 'applet', // 名片列表
  //     component: () => import('@/views/customermanagement/applet/AppletIndex'),
  //     meta: {
  //       title: '名片线索',
  //       icon: 'mp'
  //     }
  //   }]
  // },
  {
    ...layout({
      // permissions: ['crm', 'customer']
      permissionList: [['crm', 'customer'], ['crm', 'pool'], ['crm', 'customer', 'nearbyCustomer']]
    }),
    children: [{
      path: 'customer', // 客户列表
      component: () => import('@/views/customermanagement/customer/CustomerAllIndex'),
      meta: {
        title: '客户',
        icon: 'customer'
      }
    }]
  },
  // {
  //   ...layout({
  //     permissions: ['crm', 'pool']
  //   }),
  //   hidden: true,
  //   children: [{
  //     path: 'seas', // 公海列表
  //     component: () => import('@/views/customermanagement/seas/SeasIndex'),
  //     meta: {
  //       title: '公海',
  //       icon: 'seas',
  //       activeMenu: '/crm/customer'
  //     }
  //   }]
  // },
  // {
  //   ...layout({
  //     permissions: ['crm', 'customer', 'nearbyCustomer']
  //   }),
  //   hidden: true,
  //   children: [{
  //     path: 'nearby', // 附近的客户
  //     component: () => import('@/views/customermanagement/map/MapIndex'),
  //     meta: {
  //       title: '附近的客户',
  //       icon: 'nearby',
  //       activeMenu: '/crm/customer'
  //     }
  //   }]
  // },
  {
    ...layout({
      permissions: ['crm', 'contacts']
    }),
    children: [{
      path: 'contacts', // 联系人
      component: () => import('@/views/customermanagement/contacts/ContactsIndex'),
      meta: {
        title: '联系人',
        icon: 'contacts'
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
      permissions: ['crm', 'invoice']
    }),
    children: [{
      path: 'invoice', // 发票列表
      component: () => import('@/views/customermanagement/invoice/InvoiceIndex'),
      meta: {
        title: '发票',
        icon: 'invoice'
      }
    }]
  },
  {
    ...layout({
      permissions: ['crm', 'visit']
    }),
    children: [{
      path: 'visit', // 回访列表
      component: () => import('@/views/customermanagement/visit/VisitIndex'),
      meta: {
        title: '回访',
        icon: 'house'
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
