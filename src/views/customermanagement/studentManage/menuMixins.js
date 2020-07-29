/**
 * Create by yxk at 2020/7/27 0027
 */
export default {
  computed: {
    menuItems() {
      return [
        {
          title: '学员',
          path: 'student',
          icon: require('@/assets/img/crm/customer.png')
        },
        {
          title: '资金账户',
          path: 'account',
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
