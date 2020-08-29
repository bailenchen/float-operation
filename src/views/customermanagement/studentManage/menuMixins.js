/*
 * @Author: your name
 * @Date: 2020-08-20 10:07:15
 * @LastEditTime: 2020-08-27 16:38:35
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dz-72crm-qiwen\src\views\customermanagement\studentManage\menuMixins.js
 */
/**
 * Create by yxk at 2020/7/27 0027
 */
export default {
  computed: {
    menuItems() {
      return [
        {
          title: '学员',
          path: 'customer',
          icon: require('@/assets/img/crm/customer.png')
        },
        {
          title: '资金账户',
          path: 'capitalAccount',
          icon: require('@/assets/img/crm/customer.png')
        }
      ]
    }
  },
  methods: {
    /**
     * 左侧菜单选择
     */
    menuSelect(key, keyPath) {
      // this.$emit('menu-select', key, keyPath)
      this.$router.push({
        path: key
      })
    }
  }
}
