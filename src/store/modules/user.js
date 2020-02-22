import {
  login,
  logout
} from '@/api/login'
import {
  adminIndexAuthList
} from '@/api/common'
import {
  resetRouter
} from '@/router'

import {
  adminUsersRead
} from '@/api/personCenter/personCenter'
import {
  addAuth,
  removeAuth
} from '@/utils/auth'
import Lockr from 'lockr'
// import { RSAencrypt } from '@/utils'

const user = {
  state: {
    userInfo: null, // 用户信息
    // 权限信息
    allAuth: null, // 总权限信息 默认空 调整动态路由
    crm: {}, // 客户管理
    bi: {}, // 商业智能
    manage: {}, // 管理后台
    oa: {}, // 办公
    emailMsg: {},
    project: {} // 项目管理
  },

  mutations: {
    SET_EMAIL: (state, emailMsg) => {
      state.emailMsg = emailMsg
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
      localStorage.setItem('loginUserInfo', JSON.stringify(userInfo))
    },
    SET_ALLAUTH: (state, allAuth) => {
      state.allAuth = allAuth
    },
    SET_CRM: (state, crm) => {
      state.crm = crm
    },
    SET_BI: (state, bi) => {
      state.bi = bi
    },
    SET_MANAGE: (state, manage) => {
      state.manage = manage
    },
    SET_OA: (state, oa) => {
      state.oa = oa
    },
    SET_PROJECT: (state, project) => {
      state.project = project
    },
    SET_AUTH: (state, data) => {
      Lockr.set('Admin-Token', data['Admin-Token'])
      // 开启了小程序
      if (data && data.hasOwnProperty('cardAuth')) {
        data.user.cardAuth = data.cardAuth
      }

      // 邮件信息
      if (data && data.hasOwnProperty('emailId')) {
        data.user.emailId = data.emailId
      }
      Lockr.set('loginUserInfo', data.user)

      Lockr.set('authList', data.auth)

      addAuth(data['Admin-Token'])
      state.userInfo = data.user
      // 权限
      state.allAuth = data.auth
      state.crm = data.auth.crm
      state.bi = data.auth.bi
      state.manage = data.auth.manage
      state.oa = data.auth.oa
      state.project = data.auth.project
    }
  },

  actions: {
    // 登录
    Login({
      commit
    }, userInfo) {
      // const username = userInfo.username.trim()
      // const password = RSAencrypt(userInfo.password)
      return new Promise((resolve, reject) => {
        login(userInfo).then(data => {
          if (!data.hasOwnProperty('companyList')) {
            commit('SET_AUTH', data)
          }
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取权限
    getAuth({
      commit
    }) {
      return new Promise((resolve, reject) => {
        adminIndexAuthList().then((response) => {
          const data = response.data
          Lockr.set('authList', data)
          commit('SET_ALLAUTH', data)
          commit('SET_CRM', data.crm)
          commit('SET_BI', data.bi)
          commit('SET_MANAGE', data.manage)
          commit('SET_OA', data.oa)
          commit('SET_PROJECT', data.project)

          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetUserInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        adminUsersRead().then(response => {
          // 开启了小程序
          if (response && response.hasOwnProperty('cardAuth')) {
            response.data.cardAuth = response.cardAuth
          }
          // 邮件信息
          if (response && response.hasOwnProperty('emailId')) {
            response.data.emailId = response.emailId
          }
          commit('SET_USERINFO', response.data)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({
      commit
    }) {
      return new Promise((resolve, reject) => {
        logout().then(() => {
          /** flush 清空localStorage .rm('authKey') 按照key清除 */
          removeAuth()
          resetRouter()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
