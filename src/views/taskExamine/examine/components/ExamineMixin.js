export default {
  methods: {
    /**
     * 获取图标
     */
    getCategoryIcon(categoryId) {
      // 系统审批
      categoryId = parseInt(categoryId)
      if (categoryId <= 6 && categoryId > 0) {
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
        ][categoryId - 1]
      } else {
        return {
          icon: 'approve',
          color: '#9376FF'
        }
      }
    }
  }
}
