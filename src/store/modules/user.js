import {
  login,
  logout
} from '@/api/login'
import {
  adminIndexAuthList
} from '@/api/common'

import {
  adminUsersRead
} from '@/api/personCenter/personCenter'
import {
  addAuth,
  removeAuth
} from '@/utils/auth'
import Lockr from 'lockr'

const user = {
  state: {
    userInfo: null, // 用户信息
    // 权限信息
    allAuth: null, //总权限信息 默认空 调整动态路由
    crm: {}, // 客户管理
    bi: {}, // 商业智能
    manage: {} // 管理后台
  },

  mutations: {
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
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
    }
  },

  actions: {
    // 登录
    Login({
      commit
    }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(data => {
          Lockr.set('Admin-Token', data['Admin-Token'])
          Lockr.set('loginUserInfo', data.user)

          data.authList = {
              "crm": {
                "leads": {
                  "save": true,
                  "update": true,
                  "index": true,
                  "read": true,
                  "excelimport": true,
                  "excelexport": true,
                  "delete": true,
                  "transfer": true,
                  "transform": true
                },
                "customer": {
                  "save": true,
                  "update": true,
                  "index": true,
                  "read": true,
                  "excelimport": true,
                  "excelexport": true,
                  "delete": true,
                  "transfer": true,
                  "putinpool": true,
                  "lock": true,
                  "teamsave": true,
                  "pool": true,
                  "distribute": true,
                  "receive": true
                },
                "contacts": {
                  "save": true,
                  "update": true,
                  "index": true,
                  "read": true,
                  "delete": true,
                  "transfer": true
                },
                "business": {
                  "save": true,
                  "update": true,
                  "index": true,
                  "read": true,
                  "delete": true,
                  "transfer": true,
                  "teamsave": true
                },
                "contract": {
                  "save": true,
                  "update": true,
                  "index": true,
                  "read": true,
                  "delete": true,
                  "transfer": true,
                  "teamsave": true
                },
                "receivables": {
                  "save": true,
                  "update": true,
                  "index": true,
                  "read": true,
                  "delete": true
                },
                "product": {
                  "save": true,
                  "update": true,
                  "index": true,
                  "read": true,
                  "status": true
                }
              },
              "bi": {
                "customer": {
                  "read": true
                },
                "business": {
                  "read": true
                },
                "receivables": {
                  "read": true
                },
                "product": {
                  "read": true
                },
                "achievement": {
                  "read": true
                }
              },
              "manage": {
                "system": true,
                "user": true,
                "permission": true,
                "examineFlow": true,
                "oa": true,
                "crm": true
              }
          }

          Lockr.set('authList', data.authList)

          addAuth(data['Admin-Token'])
          commit('SET_USERINFO', data.user)
          // 权限

          commit('SET_CRM', data.authList.crm)
          commit('SET_BI', data.authList.bi)
          commit('SET_MANAGE', data.authList.manage)
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
        // adminIndexAuthList().then((response) => {
        const data = {
          "crm": {
            "leads": {
              "save": true,
              "update": true,
              "index": true,
              "read": true,
              "excelimport": true,
              "excelexport": true,
              "delete": true,
              "transfer": true,
              "transform": true
            },
            "customer": {
              "save": true,
              "update": true,
              "index": true,
              "read": true,
              "excelimport": true,
              "excelexport": true,
              "delete": true,
              "transfer": true,
              "putinpool": true,
              "lock": true,
              "teamsave": true,
              "pool": true,
              "distribute": true,
              "receive": true
            },
            "contacts": {
              "save": true,
              "update": true,
              "index": true,
              "read": true,
              "delete": true,
              "transfer": true
            },
            "business": {
              "save": true,
              "update": true,
              "index": true,
              "read": true,
              "delete": true,
              "transfer": true,
              "teamsave": true
            },
            "contract": {
              "save": true,
              "update": true,
              "index": true,
              "read": true,
              "delete": true,
              "transfer": true,
              "teamsave": true
            },
            "receivables": {
              "save": true,
              "update": true,
              "index": true,
              "read": true,
              "delete": true
            },
            "product": {
              "save": true,
              "update": true,
              "index": true,
              "read": true,
              "status": true
            }
          },
          "bi": {
            "customer": {
              "read": true
            },
            "business": {
              "read": true
            },
            "receivables": {
              "read": true
            },
            "product": {
              "read": true
            },
            "achievement": {
              "read": true
            }
          },
          "manage": {
            "system": true,
            "user": true,
            "permission": true,
            "examineFlow": true,
            "oa": true,
            "crm": true
          }
        }
        Lockr.set('authList', data)
        commit('SET_ALLAUTH', data)
        commit('SET_CRM', data.crm)
        commit('SET_BI', data.bi)
        commit('SET_MANAGE', data.manage)

        resolve(data)
        // }).catch(error => {
        //   reject(error)
        // })
      })
    },

    // 获取用户信息
    GetUserInfo({
      commit,
      state
    }) {
      return new Promise((resolve, reject) => {
        adminUsersRead().then(response => {
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
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    }
  }
}

export default user
