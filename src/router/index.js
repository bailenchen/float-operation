import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

// import workbenchRouter from './modules/workbench'
import customerRouter from './modules/customer'
import projectRouter from './modules/project/index'
import { managerRouter } from './modules/manager'
import personRouter from './modules/person'
import biRouter from './modules/business'

import taskExamineRouter from './modules/taskExamine'
import workLogRouter from './modules/workLog'
import addressBookRouter from './modules/addressBook'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  personRouter,
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router

// export const asyncRouterMap = [
//   // workbenchRouter,
//   customerRouter,
//   biRouter,
//   managerRouter,
//   projectRouter,
//   workLogRouter,
//   taskExamineRouter,
//   addressBookRouter
// ]

export const asyncRouterMap = [
  { type: 'workLog', router: workLogRouter },
  { type: 'taskExamine', router: taskExamineRouter },
  { type: 'addressBook', router: addressBookRouter },
  { type: 'bi', router: biRouter }
]
