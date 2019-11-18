import { mapGetters } from 'vuex'

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
    ...mapGetters([
      'userInfo'
    ])
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

    if (this.getData) {
      this.getData()
    }
  },
  beforeDestroy() {
    this.$bus.off('window-resize')
  },
  methods: {
    /**
     * 获取请求参数
     */
    getBaseParams() {
      const params = {}

      if (this.filterValue.strucs.length) {
        params.isUser = 0
        params.deptId = this.filterValue.strucs[0].id
      } else {
        params.isUser = 1
        params.userId = this.filterValue.users.length ? this.filterValue.users[0].userId : this.userInfo.userId
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
