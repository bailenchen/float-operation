export default {
  props: {
    filterValue: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      timeLineMap: {
        today: '今天',
        yesterday: '昨天',
        week: '本周',
        lastWeek: '上周',
        month: '本月',
        lastMonth: '上月',
        quarter: '本季度',
        lastQuarter: '上季度',
        year: '本年',
        lastYear: '去年'
      }
    }
  },
  computed: {
    // 筛选时间类型展示文本
    // timeLine() {
    //   const t = this.filterValue.timeLine
    //   if (t.type) {
    //     if (t.type === 'custom') {
    //       return `${t.startTime}至${t.endTime}`
    //     } else {
    //       return this.timeLineMap[t.value]
    //     }
    //   }
    //   return ''
    // },
    // 筛选员工/部门展示文本
    // filterText() {
    //   const users = this.filterValue.users || []
    //   const strucs = this.filterValue.strucs || []
    //   const userLen = users.length
    //   const strucsLen = strucs.length
    //   if (userLen === 1 && strucsLen === 0) return users[0].realname
    //   if (strucsLen === 1 && userLen === 0) return strucs[0].name
    //   let str = ''
    //   if (userLen > 0) str = userLen + '个员工'
    //   if (strucsLen > 0) str = `${str}，${strucsLen}个部门`
    //   return str || ''
    // }
  },
  watch: {
    // 根据筛选条件获取统计数据
    filterValue: {
      handler() {
        if (this.getData) {
          this.getData()
        }
      },
      deep: true
    }
  },
  mounted() {
    // 根据窗口的大小变化实时调整 chart 大小
    this.$bus.on('window-resize', () => {
      if (this.chartObj) {
        this.chartObj.resize()
      }
    })
  },
  beforeDestroy() {
    this.$bus.off('window-resize')
  },
  methods: {
    /**
     * 获取请求参数
     */
    getBaseParams() {
      const params = {
        userIds: this.filterValue.users.map(item => item.userId).join(',') || '',
        deptIds: this.filterValue.strucs.map(item => item.id).join(',') || ''
      }
      if (this.filterValue.timeLine.type) {
        if (this.filterValue.timeLine.type === 'custom') {
          params.startTime = this.filterValue.timeLine.startTime.replace(/\./g, '-')
          params.endTime = this.filterValue.timeLine.endTime.replace(/\./g, '-')
        } else {
          params.type = this.filterValue.timeLine.value || ''
        }
      }
      return params
    }
  }
}
