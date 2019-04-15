import store from '@/store'
import Lockr from 'lockr'
import axios from 'axios'

const cache = {
  /**
   * 载入全部登陆信息
   */
  loadingCache: function () {
    console.log('loadingCache---', Lockr.get('Admin-Token'));
    if (Lockr.get('Admin-Token') && !axios.defaults.headers['Admin-Token']) {
      /** 将用户信息放入缓存 */
      const userInfo = Lockr.get('loginUserInfo')
      if (userInfo) {
        store.commit('SET_USERINFO', userInfo)
      }
      const authList = Lockr.get('authList')
      if (authList) {
        store.commit('SET_CRM', authList.crm)
        store.commit('SET_BI', authList.bi)
        store.commit('SET_MANAGE', authList.manage)
      }
    }
    store.commit('SET_APPNAME', Lockr.get('systemName'))
    store.commit('SET_APPLOGO', Lockr.get('systemLogo'))
  },
  /**
   * 请求和更新登录缓存
   */
  updateAxiosCache: function () {
    axios.defaults.headers['Admin-Token'] = Lockr.get('Admin-Token')
    // store.dispatch("GetUserInfo")
    // store.dispatch('SystemLogoAndName')
  },
  /**
   * 移除登录信息
   * @param {*}  
   */
  rmAxiosCache: function () {
    Lockr.rm('Admin-Token')
  }
}

export default cache
