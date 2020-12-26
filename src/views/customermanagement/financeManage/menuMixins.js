/**
 * Create by yxk at 2020/7/27 0027
 */
export default {
  computed: {
    menuItems() {
      const list = []
      if (this.crm.receive) {
        list.push(
          {
            title: '合同充值',
            path: 'receive',
            icon: require('@/assets/img/crm/customer.png')
          },
        )
      }
      list.push(
        {
          title: '合同充值返还',
          path: 'refund',
          icon: require('@/assets/img/crm/customer.png')
        }
      )
      return list
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
