/** 项目管理路由 */
import Layout from '@/views/layout/businessLayout'

// 员工客户分析
const customerRouter = {
  path: 'customer',
  meta: {
    icon: 'employeestatistics',
    title: '员工客户分析'
  },
  children: [{
    path: 'customerTotal', // 客户总量分析
    component: () => import('@/views/businessIntelligence/customer/CustomerTotalStatistics'),
    meta: {
      requiresAuth: true,
      title: '客户总量分析',
      icon: 'employeestatistics',
      index: 1,
      type: 'bi',
      subType: 'customer'
    }
  }, {
    path: 'customerRecord', // 客户跟进次数分析
    component: () => import('@/views/businessIntelligence/customer/CustomerRecordStatistics'),
    meta: {
      requiresAuth: true,
      title: '客户跟进次数分析',
      icon: 'employeestatistics',
      index: 1,
      type: 'bi',
      subType: 'customer'
    }
  }, {
    path: 'customerRecordmode', // 客户跟进方式分析
    component: () => import('@/views/businessIntelligence/customer/CustomerRecordModeStatistics'),
    meta: {
      requiresAuth: true,
      title: '客户跟进方式分析',
      icon: 'employeestatistics',
      index: 1,
      type: 'bi',
      subType: 'customer'
    }
  }, {
    path: 'customerConversion', // 客户转化率分析
    component: () => import('@/views/businessIntelligence/customer/CustomerConversionStatistics'),
    meta: {
      requiresAuth: true,
      title: '客户转化率分析',
      icon: 'employeestatistics',
      index: 1,
      type: 'bi',
      subType: 'customer'
    }
  }, {
    path: 'customerPool', // 公海客户分析
    component: () => import('@/views/businessIntelligence/customer/CustomerPoolStatistics'),
    meta: {
      requiresAuth: true,
      title: '公海客户分析',
      icon: 'employeestatistics',
      index: 1,
      type: 'bi',
      subType: 'customer'
    }
  }, {
    path: 'customerCycle', // 成交周期分析
    component: () => import('@/views/businessIntelligence/customer/CustomerCycleStatistics'),
    meta: {
      requiresAuth: true,
      title: '成交周期分析',
      icon: 'employeestatistics',
      index: 1,
      type: 'bi',
      subType: 'customer'
    }
  }]
}

// 销售漏斗分析
const businessRouter = {
  path: 'business',
  meta: {
    icon: 'funnelstatistics',
    title: '销售漏斗分析'
  },
  children: [{
    path: 'funnelstatistics', // 销售漏斗
    component: () => import('@/views/businessIntelligence/business/FunnelStatistics'),
    meta: {
      requiresAuth: true,
      title: '销售漏斗',
      icon: 'funnelstatistics',
      index: 1,
      type: 'bi',
      subType: 'business'
    }
  }, {
    path: 'businessTrend', // 新增商机分析
    component: () => import('@/views/businessIntelligence/business/BusinessTrendStatistics'),
    meta: {
      requiresAuth: true,
      title: '新增商机分析',
      icon: 'funnelstatistics',
      index: 1,
      type: 'bi',
      subType: 'business'
    }
  }, {
    path: 'businessWin', // 商机转化率分析
    component: () => import('@/views/businessIntelligence/business/BusinessWinStatistics'),
    meta: {
      requiresAuth: true,
      title: '商机转化率分析',
      icon: 'funnelstatistics',
      index: 1,
      type: 'bi',
      subType: 'business'
    }
  }]
}

// 员工业绩分析
const achievementRouter = {
  path: 'achievement',
  meta: {
    icon: 'BI_Employee_performance',
    title: '员工业绩分析'
  },
  children: [{
    path: 'moneystatistics', // 回款统计
    component: () => import('@/views/businessIntelligence/achievement/MoneyStatistics'),
    meta: {
      requiresAuth: true,
      title: '回款统计',
      icon: 'moneystatistics',
      index: 1,
      type: 'bi',
      subType: 'receivables'
    }
  }, {
    path: 'achievementCount', // 合同数量分析
    component: () => import('@/views/businessIntelligence/achievement/AchievementCountStatistics'),
    meta: {
      requiresAuth: true,
      title: '合同数量分析',
      icon: 'moneystatistics',
      index: 1,
      type: 'bi',
      subType: 'receivables'
    }
  }, {
    path: 'achievementMoney', // 合同金额分析
    component: () => import('@/views/businessIntelligence/achievement/AchievementMoneyStatistics'),
    meta: {
      requiresAuth: true,
      title: '合同金额分析',
      icon: 'moneystatistics',
      index: 1,
      type: 'bi',
      subType: 'receivables'
    }
  }, {
    path: 'achievementBack', // 回款金额分析
    component: () => import('@/views/businessIntelligence/achievement/AchievementBackStatistics'),
    meta: {
      requiresAuth: true,
      title: '回款金额分析',
      icon: 'moneystatistics',
      index: 1,
      type: 'bi',
      subType: 'receivables'
    }
  }, {
    path: 'achievementSummary', // 合同汇总表
    component: () => import('@/views/businessIntelligence/achievement/AchievementSummaryStatistics'),
    meta: {
      requiresAuth: true,
      title: '合同汇总表',
      icon: 'moneystatistics',
      index: 1,
      type: 'bi',
      subType: 'receivables'
    }
  }]
}

// 客户画像分析
const portrayalRouter = {
  path: 'portrayal',
  meta: {
    icon: 'customer',
    title: '客户画像分析'
  },
  children: [{
    path: 'portrayalAddress', // 城市分布分析
    component: () => import('@/views/businessIntelligence/customerPortrayal/CustomerAddressStatistics'),
    meta: {
      requiresAuth: true,
      title: '城市分布分析',
      icon: 'employeestatistics',
      index: 1,
      type: 'bi',
      subType: 'customer'
    }
  },{
    path: 'portrayalIndustry/:type', // 客户行业分析
    component: () => import('@/views/businessIntelligence/customerPortrayal/CustomerPortrayalStatistics'),
    meta: {
      requiresAuth: true,
      title: '客户画像分析',
      icon: 'employeestatistics',
      index: 1,
      type: 'bi',
      subType: 'customer'
    }
  }]
}

const portrayalRouterMenu = {
  path: 'portrayal',
  meta: {
    icon: 'customer',
    title: '客户画像分析'
  },
  children: [{
    path: 'portrayalAddress', // 城市分布分析
    component: () => import('@/views/businessIntelligence/customerPortrayal/CustomerAddressStatistics'),
    meta: {
      requiresAuth: true,
      title: '城市分布分析',
      icon: 'employeestatistics',
      index: 1,
      type: 'bi',
      subType: 'customer'
    }
  },{
    path: 'portrayalIndustry/industry', // 客户行业分析
    component: () => import('@/views/businessIntelligence/customerPortrayal/CustomerPortrayalStatistics'),
    meta: {
      requiresAuth: true,
      title: '客户行业分析',
      icon: 'employeestatistics',
      index: 1,
      type: 'bi',
      subType: 'customer'
    }
  },{
    path: 'portrayalIndustry/level', // 客户级别分析
    component: () => import('@/views/businessIntelligence/customerPortrayal/CustomerPortrayalStatistics'),
    meta: {
      requiresAuth: true,
      title: '客户级别分析',
      icon: 'employeestatistics',
      index: 1,
      type: 'bi',
      subType: 'customer'
    }
  },{
    path: 'portrayalIndustry/source', // 客户来源分析
    component: () => import('@/views/businessIntelligence/customerPortrayal/CustomerPortrayalStatistics'),
    meta: {
      requiresAuth: true,
      title: '客户来源分析',
      icon: 'employeestatistics',
      index: 1,
      type: 'bi',
      subType: 'customer'
    }
  }]
}

// 产品分析
const productRouter = {
  path: 'product',
  meta: {
    icon: 'productstatistics',
    title: '产品分析'
  },
  children: [{
    path: 'productstatistics', // 产品销售情况统计
    component: () => import('@/views/businessIntelligence/product/ProductStatistics'),
    meta: {
      requiresAuth: true,
      title: '产品销售情况统计',
      icon: 'productstatistics',
      index: 1,
      type: 'bi',
      subType: 'product'
    }
  }, {
    path: 'productCategory', // 产品分类销量分析
    component: () => import('@/views/businessIntelligence/product/ProductCategoryStatistics'),
    meta: {
      requiresAuth: true,
      title: '产品分类销量分析',
      icon: 'productstatistics',
      index: 1,
      type: 'bi',
      subType: 'product'
    }
  }]
}

// 排行榜
const rankingRouter = {
  path: 'ranking',
  meta: {
    icon: 'BI_Leaderboard',
    title: '排行榜'
  },
  children: [{
    path: 'rankingContract', // 合同金额排行
    component: () => import('@/views/businessIntelligence/ranking/RankingContractStatistics'),
    meta: {
      requiresAuth: true,
      title: '合同金额排行',
      icon: 'productstatistics',
      index: 1,
      type: 'bi',
      subType: 'product'
    }
  }, {
    path: 'rankingReceivables', // 回款金额排行
    component: () => import('@/views/businessIntelligence/ranking/RankingReceivablesStatistics'),
    meta: {
      requiresAuth: true,
      title: '回款金额排行',
      icon: 'productstatistics',
      index: 1,
      type: 'bi',
      subType: 'product'
    }
  }, {
    path: 'rankingSigning', // 签约合同排行
    component: () => import('@/views/businessIntelligence/ranking/RankingSigningStatistics'),
    meta: {
      requiresAuth: true,
      title: '签约合同排行',
      icon: 'productstatistics',
      index: 1,
      type: 'bi',
      subType: 'product'
    }
  }, {
    path: 'rankingProduct', // 产品销量排行
    component: () => import('@/views/businessIntelligence/ranking/RankingProductStatistics'),
    meta: {
      requiresAuth: true,
      title: '产品销量排行',
      icon: 'productstatistics',
      index: 1,
      type: 'bi',
      subType: 'product'
    }
  }, {
    path: 'rankingAddCustomer', // 新增客户数排行
    component: () => import('@/views/businessIntelligence/ranking/RankingAddCustomerStatistics'),
    meta: {
      requiresAuth: true,
      title: '新增客户数排行',
      icon: 'productstatistics',
      index: 1,
      type: 'bi',
      subType: 'product'
    }
  }, {
    path: 'rankingAddContacts', // 新增联系人数排行
    component: () => import('@/views/businessIntelligence/ranking/RankingAddContactsStatistics'),
    meta: {
      requiresAuth: true,
      title: '新增联系人数排行',
      icon: 'productstatistics',
      index: 1,
      type: 'bi',
      subType: 'product'
    }
  }, {
    path: 'rankingRecordNun', // 跟进次数排行
    component: () => import('@/views/businessIntelligence/ranking/RankingRecordNunStatistics'),
    meta: {
      requiresAuth: true,
      title: '跟进次数排行',
      icon: 'productstatistics',
      index: 1,
      type: 'bi',
      subType: 'product'
    }
  }, {
    path: 'rankingRecordCustomer', // 跟进客户数排行
    component: () => import('@/views/businessIntelligence/ranking/RankingRecordCustomerStatistics'),
    meta: {
      requiresAuth: true,
      title: '跟进客户数排行',
      icon: 'productstatistics',
      index: 1,
      type: 'bi',
      subType: 'product'
    }
  }, {
    path: 'rankingExamine', // 出差次数排行
    component: () => import('@/views/businessIntelligence/ranking/RankingExamineStatistics'),
    meta: {
      requiresAuth: true,
      title: '出差次数排行',
      icon: 'productstatistics',
      index: 1,
      type: 'bi',
      subType: 'product'
    }
  }]
}



const taskCompleteRouteItem = {
  path: 'taskCompletestatistics', // 业绩目标完成情况
  component: () => import('@/views/businessIntelligence/TaskCompleteStatistics'),
  meta: {
    requiresAuth: true,
    title: '业绩目标完成情况',
    icon: 'taskCompletestatistics',
    index: 1,
    type: 'bi',
    subType: 'achievement'
  }
}


export const biRouter = {
  path: '/bi',
  component: Layout,
  redirect: '/bi/customerTotal',
  name: 'bi',
  hidden: true,
  meta: {
    requiresAuth: true,
    title: '商业智能',
    index: 0,
    type: 'bi'
  },
  children: [
    ...customerRouter.children,
    ...businessRouter.children,
    ...achievementRouter.children,
    ...portrayalRouter.children,
    ...productRouter.children,
    ...rankingRouter.children,
    taskCompleteRouteItem
  ]
}

export const biRouterMenu = [
  customerRouter,
  businessRouter,
  achievementRouter,
  portrayalRouterMenu,
  productRouter,
  rankingRouter,
  taskCompleteRouteItem
]
