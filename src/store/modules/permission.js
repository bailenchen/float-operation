import {
  asyncRouterMap
} from '@/router'
import Vue from 'vue'
import { adminGroupsTypeListAPI } from '@/api/systemManagement/RoleAuthorization'

/**
 *
 * @param {*} router
 * @param {*} authInfo
 */
function checkAuth(router, authInfo) {
  // 判断当前路由在权限数组中是否存在
  if (router.meta) {
    const metaInfo = router.meta
    if (!metaInfo.requiresAuth) {
      return true
    } else {
      authInfo = { ...authInfo }
      for (let index = 0; index < metaInfo.permissions.length; index++) {
        const key = metaInfo.permissions[index]
        authInfo = authInfo[key]
        if (!authInfo) {
          return false
        } else if (metaInfo.permissions.length - 1 === index) {
          return true
        }
      }
    }
  }
  return true
}

/**
 *
 * @param {*} routers
 * @param {*} authInfo
 */
const filterAsyncRouter = function(routers, authInfo) {
  const res = []
  routers.forEach(router => {
    const tmp = {
      ...router
    }
    if (checkAuth(tmp, authInfo)) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, authInfo)
      }
      res.push(tmp)
    }
  })
  return res
}


/**
 * 忽略用于菜单展示的传参路由
 * @param {*} routers
 * @param {*} authInfo
 */
const filterIgnoreRouter = function(routers) {
  const res = []
  routers.forEach(router => {
    const tmp = {
      ...router
    }
    if (!tmp.ignore) {
      if (tmp.children) {
        tmp.children = filterIgnoreRouter(tmp.children)
      }
      res.push(tmp)
    }
  })
  return res
}

/**
 * 路由重定向和角色路由完善
 */
const perfectRouter = function(authInfo, result) {
  getGroupData(authInfo, (groupData) => {
    const routerObj = {}
    let addRouter = []
    let redirect = ''
    for (let index = 0; index < asyncRouterMap.length; index++) {
      const mainRouter = asyncRouterMap[index]
      const accessedRouters = filterAsyncRouter(mainRouter.router, authInfo)

      for (let childIndex = 0; childIndex < accessedRouters.length; childIndex++) {
        const element = accessedRouters[childIndex]

        // 处理系统管理逻辑
        if (groupData.requiresAuth && element.name == 'manage-role-auth') {
          const roleMenus = groupData.list.map(item => {
            return {
              name: 'role-auth',
              path: `role-auth/${item.roleType}/${encodeURI(item.name)}`,
              ignore: true, // 不加入路由 仅菜单展示
              meta: {
                title: item.name
              }
            }
          })

          if (roleMenus && roleMenus.length > 0) {
            const roleFirstChild = element.children[0]
            roleFirstChild.meta.redirect = roleMenus[0].path
            element.children = element.children.concat(roleMenus)
          }
        }


        if (element.children && element.children.length > 0) {
          const firstChild = element.children[0]
          const childPath = firstChild.meta ? firstChild.meta.redirect || firstChild.path : firstChild.path
          element.redirect = element.path + '/' + childPath
        }

        // 获取跳转
        if (element.redirect) {
          if (!redirect) {
            redirect = element.redirect
          }

          // 为导航头 获取每个模块的 重定向 url
          accessedRouters.push({
            path: `/${mainRouter.type}`,
            name: mainRouter.type,
            redirect: element.redirect,
            hidden: true
          })

          if (mainRouter.type != 'manage') {
            break
          } else if (element.name == 'manage-role-auth') {
            break
          }
        }
      }
      routerObj[mainRouter.type] = accessedRouters
      addRouter = addRouter.concat(filterIgnoreRouter(accessedRouters))
    }

    if (redirect) {
      addRouter.push({
        path: '/',
        redirect: redirect,
        hidden: true
      })
    }

    if (result) {
      result({ router: routerObj, addRouter })
    }
  })
}

/**
 * 获取角色列表
 * @param {*} authInfo 授权信息
 * @param {*} result 回调
 */
function getGroupData(authInfo, result) {
  if (authInfo && authInfo.manage && authInfo.manage.permission) {
    adminGroupsTypeListAPI().then((response) => {
      if (result) {
        result({
          requiresAuth: true,
          list: response.data || []
        })
      }
    }).catch(() => {})
  } else {
    if (result) {
      result({
        requiresAuth: false
      })
    }
  }
}

const permission = {
  state: {
    addRouters: [],
    crmRouters: [],
    taskExamineRouters: [],
    workLogRouters: [],
    addressBookRouters: [],
    projectRouters: [],
    biRouters: [],
    manageRouters: []


  },
  mutations: {
    SET_ROUTERS: (state, data) => {
      state.addRouters = data.addRouter
      state.crmRouters = data.router.crm || []
      state.workLogRouters = data.router.workLog || []
      state.taskExamineRouters = data.router.taskExamine || []
      state.addressBookRouters = data.router.addressBook || []
      state.projectRouters = data.router.project || []
      state.biRouters = data.router.bi || []
      state.manageRouters = data.router.manage || []
    },

    /**
     * 客户管理待办消息数
     */
    SET_CRMROUTERSNUM: (state, num) => {
      const messageItem = state.crmRouters[1]
      messageItem.children[0].meta.num = num
      Vue.set(state.crmRouters, 1, messageItem)
    },

    SET_GROUPSLIST: (state, data) => {
      state.groupsList = data
    }
  },
  actions: {
    GenerateRoutes({
      commit,
      state
    }, data) {
      return new Promise(resolve => {
        // 路由完善
        perfectRouter(data, (routers) => {
          commit('SET_ROUTERS', routers)
          resolve()
        })
      })
    }
  }
}

export default permission
