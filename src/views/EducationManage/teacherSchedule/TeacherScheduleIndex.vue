<template>
  <div>
    <c-r-m-list-head
      :search.sync="search"
      :crm-type="crmType"
      title="教师排课表"
      placeholder="请输入教师姓名"
      main-title=""
      @on-handle="listHeadHandle"
      @on-search="crmSearch"
      @on-export="exportInfos"/>
    <div
      v-empty="!education.teacherschedule.index"
      xs-empty-icon="nopermission"
      xs-empty-text="暂无权限"
      class="crm-container">
      <c-r-m-table-head
        ref="crmTableHead"
        :crm-type="crmType"
        class="filter-btn"
        @filter="handleFilter"
        @handle="handleHandle"
        @scene="handleScene">
        <template slot-scope="">
          <el-button :type="comName == 'WeekTable' ? 'primary' : ''" style="margin-left: 10px;" @click="toggleShow('week')">按周显示</el-button>
          <el-button :type="comName == 'DayTable' ? 'primary' : ''" @click="toggleShow('day')">按天显示</el-button>
        </template>
      </c-r-m-table-head>
      <div class="three-flex">
        <div class="toggle-btn" @click="preDayOrWeek">LAST</div>
        <div class="center-txt">
          <span style="color: red;">{{ date }}</span> 教师排课表
        </div>
        <div class="toggle-btn" @click="nextDayOrWeek">NEXT</div>
      </div>
      <component :is="comName"/>
    </div>
  </div>
</template>

<script>
import DayTable from './components/DayTable'
import WeekTable from './components/WeekTable'
import table from '../mixins/table'
import { getDateStr, getMonday } from '@/utils/dateDiff'
import moment from 'moment'

export default {
  /** 教务管理 的 教师排课表列表 */
  name: 'TeacherScheduleIndex',
  components: {
    DayTable,
    WeekTable
  },
  mixins: [table],
  data() {
    return {
      crmType: 'teacherschedule',
      comName: 'DayTable',
      date: moment().format('YYYY/MM/DD'),
      currentWeekStartDate: '',
      currentWeekEndDate: ''
    }
  },
  watch: {
    comName(val) {
      if (val === 'WeekTable') {
        this.handleDate()
      }
    }
  },
  mounted() {},
  methods: {
    // 按周/按天切换
    toggleShow(type) {
      this.comName = {
        week: 'WeekTable',
        day: 'DayTable'
      }[type]
    },

    // 前一天/周
    preDayOrWeek() {
      this.handleDate('minus')
    },
    // 后一天/周
    nextDayOrWeek() {
      this.handleDate('add')
    },

    // 加减一天/周 -- 公共方法
    handleDate(type, name) {
      const num = this.comName === 'DayTable' ? type === 'add' ? 1 : -1 : type === 'minus' ? -7 : 7
      if (this.comName === 'DayTable') {
        var day = new Date(this.date)
        day.setDate(day.getDate() + num)
        this.date = moment(day).format('YYYY/MM/DD')
      } else if (this.comName === 'WeekTable') {
        if (type === 'add') {
          this.getWeekAllDate(1)
        } else if (type === 'minus') {
          this.getWeekAllDate(-1)
        } else {
          this.getWeekAllDate(0)
        }
      }
    },

    // 获取上周、本周、下周所有的日期
    getWeekAllDate(way) {
      if (way === 0) {
        const start = getMonday('s', way)
        const end = getMonday('e', way)
        this.currentWeekStartDate = start
        this.currentWeekEndDate = end
      } else if (way === 1) {
        this.getStartEndDate(way)
      } else if (way === -1) {
        this.getStartEndDate(way)
      }
      const everyDay = getDateStr(this.currentWeekStartDate, this.currentWeekEndDate, 0)
      console.log(everyDay, '123')
      console.log(this.currentWeekStartDate, this.currentWeekEndDate, 'xxxxxx')
    },

    // 上周或下周的开始日期与结束日期
    getStartEndDate(way) {
      if (way === 1) {
        this.genDate(way)
      } else if (way === -1) {
        this.genDate(way)
      }
    },

    genDate(way) {
      const dateList = [this.currentWeekStartDate, this.currentWeekEndDate]
      const num = way * 7
      for (let index = 0; index < dateList.length; index++) {
        const element = dateList[index]
        var day = new Date(element)
        day.setDate(day.getDate() + num)
        if (index === 0) {
          this.currentWeekStartDate = moment(day).format('YYYY-MM-DD')
        } else {
          this.currentWeekEndDate = moment(day).format('YYYY-MM-DD')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../customermanagement/styles/table.scss';
.three-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  line-height: 50px;
  .toggle-btn {
    color: #2362FB;
    cursor: pointer;
  }
}

.filter-btn /deep/ .th-container .filter-button {
  margin-left: 0px;
}

/deep/ .el-table__header tr th {
  border-top: 1px solid #EBEEF5;
}
/deep/ .el-table__body td {
  border-right-color: #e6e6e6;
}
</style>
