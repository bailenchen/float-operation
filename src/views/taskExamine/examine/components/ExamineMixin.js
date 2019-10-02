export default {
  methods: {
    /**
     * 获取图标
     */
    getCategoryIcon(type) {
      // 系统审批
      type = parseInt(type)
      if (type <= 6 && type > 0) {
        return [
          {
            icon: 'approve',
            color: '#9376FF'
          },
          {
            icon: 'leave',
            color: '#00CAAB'
          },
          {
            icon: 'trip',
            color: '#3ABCFB'
          },
          {
            icon: 'overtime',
            color: '#FAAD14'
          },
          {
            icon: 'trip',
            color: '#3ABCFB'
          },
          {
            icon: 'go-out',
            color: '#FF6033'
          }
        ][type - 1]
      } else {
        return {
          icon: 'approve',
          color: '#9376FF'
        }
      }
    }
  }
}
