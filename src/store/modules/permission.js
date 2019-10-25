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
      if (metaInfo.index == 0) {
        return !!authInfo[metaInfo.type]
      } else if (metaInfo.index == 1) {
        if (authInfo[metaInfo.type]) {
          return !!authInfo[metaInfo.type][metaInfo.subType]
        }
        return false
      } else {
        var typeAuth = authInfo[metaInfo.type]
        for (let index = 0; index < metaInfo.subType.length; index++) {
          const field = metaInfo.subType[index]
          typeAuth = typeAuth[field]
          if (typeAuth && metaInfo.subType.length - 1 == index) {
            return true
          } else if (!typeAuth) {
            return false
          }
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
 * 路由重定向和角色路由完善
 */
const perfectRouter = function(routers, authInfo, result) {
  getGroupData(authInfo, (groupData) => {
    let redirect = ''
    for (let index = 0; index < routers.length; index++) {
      const element = routers[index]
      // 角色模块，加入菜单 后期菜单会刚才标准效果
      if (groupData.requiresAuth && element.name == 'manager') {
        for (let childIndex = 0; childIndex < element.children.length; childIndex++) {
          const child = element.children[childIndex]
          if (child.meta.subType == 'permission') {
            child.meta.menuChildren = groupData.list.map(item => {
              return {
                name: 'role-auth',
                path: `role-auth/${item.roleType}/${encodeURI(item.name)}`,
                meta: {
                  title: item.name
                }
              }
            })
          }
        }

        if (element.children && element.children.length > 0) {
          const firstChild = element.children[0]
          if (firstChild.meta.subType == 'permission') {
            element.redirect = element.path + '/' + firstChild.meta.menuChildren[0].path
          } else {
            element.redirect = element.path + '/' + firstChild.path
          }
        }
      } else {
        if (!element.redirect && element.children && element.children.length > 0) {
          element.redirect = element.path + '/' + element.children[0].path
        }
      }
      // 获取跳转
      if (element.redirect && !redirect) {
        redirect = element.redirect
      }
    }

    if (redirect) {
      routers.push({
        path: '/',
        redirect: redirect,
        hidden: true
      })
    }

    if (result) {
      result(routers)
    }
  })
}

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
    crmRouters: {
      name: 'crm',
      children: []
    },
    biRouters: {
      name: 'bi',
      children: []
    },
    manageRouters: {
      name: 'manager',
      children: []
    },
    oaRouters: {
      name: 'oa',
      children: []
    }
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      for (let index = 0; index < routers.length; index++) {
        const element = routers[index]
        if (element.name == 'oa') {
          state.oaRouters = element
        } else if (element.name == 'crm') {
          state.crmRouters = element
        } else if (element.name == 'bi') {
          state.biRouters = element
        } else if (element.name == 'manager') {
          state.manageRouters = element
        }
      }
    },

    /**
     * 客户管理待办消息数
     */
    SET_CRMROUTERSNUM: (state, num) => {
      const messageItem = state.crmRouters.children[1]
      messageItem.meta.num = num
      Vue.set(state.crmRouters.children, 1, messageItem)
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
        const accessedRouters = filterAsyncRouter(asyncRouterMap, data)
        perfectRouter(accessedRouters, data, (routers) => {
          commit('SET_ROUTERS', routers)
          resolve()
        })
      })
    }
  }
}

export default permission
