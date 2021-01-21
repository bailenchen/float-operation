<template>
  <div>
    <c-r-m-list-head
      :search.sync="search"
      :crm-type="crmType"
      :show-search="false"
      title="教师排课表"
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
          <el-button :type="comName == 'DayTable' ? 'primary' : ''" @click="toggleShow('day')">按天显示</el-button>
          <el-button :type="comName == 'WeekTable' ? 'primary' : ''" style="margin-left: 10px;" @click="toggleShow('week')">按周显示</el-button>
        </template>
      </c-r-m-table-head>
      <div class="filter-wrap">
        <el-form :inline="true" :model="form" class="demo-form-inline">
          <el-form-item label="学习中心">
            <xh-structure-cell
              :value="deptSelectValue"
              radio
              class="xh-structure-cell"
              @value-change="structureChange" />
          </el-form-item>
          <el-form-item label="日期">
            <el-date-picker
              v-model="form.time"
              style="width:150px;"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"/>
          </el-form-item>
          <el-form-item label="是否兼职">
            <el-select v-model="form.isJob" placeholder="请选择">
              <el-option label="是" value="1"/>
              <el-option label="否" value="0"/>
            </el-select>
          </el-form-item>
          <el-form-item label="科目">
            <el-select v-model="form.subjectId" placeholder="请选择">
              <el-option v-for="(item,index) in subList" :key="index" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="教师姓名">
            <el-input v-model="form.realname" placeholder="请输入教师姓名"/>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div v-loading="loading" >
        <div class="three-flex">
          <div class="toggle-btn" @click="preDayOrWeek">LAST</div>
          <div class="center-txt">
            <span style="color: red;">{{ date }}</span> 教师排课表
          </div>
          <div class="toggle-btn" @click="nextDayOrWeek">NEXT</div>
        </div>
        <component ref="table" :is="comName" @close-loading="closeLoading"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import DayTable from './components/DayTable'
import WeekTable from './components/WeekTable'
import {
  XhStructureCell
} from '@/components/CreateCom'
import table from '../mixins/table'
import { getDateStr, getMonday } from '@/utils/dateDiff'
import moment from 'moment'
import { QueryAdminSubject } from '@/api/systemManagement/params'

export default {
  /** 教务管理 的 教师排课表列表 */
  name: 'TeacherScheduleIndex',
  components: {
    DayTable,
    WeekTable,
    XhStructureCell
  },
  mixins: [table],
  data() {
    return {
      loading: false,
      crmType: 'teacherschedule',
      comName: 'DayTable',
      date: moment().format('YYYY-MM-DD'),
      currentWeekStartDate: '',
      currentWeekEndDate: '',

      form: {
        time: moment().format('YYYY-MM-DD')
      },
      deptSelectValue: [],
      subList: [],

      everyDay: '' // 周表使用
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    comName(val) {
      if (val === 'WeekTable') {
        this.handleDate()
      }
    }
  },
  created() {
    this.form.deptId = this.userInfo.deptId
    this.deptSelectValue = [{
      id: this.userInfo.deptId,
      name: this.userInfo.deptName
    }]
  },
  mounted() {
    this.getSubject()
    this.onSubmit()
  },
  methods: {
    // 按周/按天切换
    toggleShow(type) {
      this.loading = true
      this.comName = {
        week: 'WeekTable',
        day: 'DayTable'
      }[type]

      if (type === 'day') {
        this.date = moment().format('YYYY-MM-DD')
        this.form.time = moment().format('YYYY-MM-DD')
        this.onSubmit()
      }
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
        this.date = moment(day).format('YYYY-MM-DD')
        this.form.time = this.date
      } else if (this.comName === 'WeekTable') {
        if (type === 'add') {
          this.getWeekAllDate(1)
        } else if (type === 'minus') {
          this.getWeekAllDate(-1)
        } else {
          this.getWeekAllDate(0)
        }
      }
      this.onSubmit()
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
      this.everyDay = everyDay // 生成该周的每一天
      this.date = `${this.currentWeekStartDate} ~ ${this.currentWeekEndDate}`
      this.form.time = this.currentWeekStartDate
      this.$nextTick(() => {
        this.$refs.table.fieldLists.forEach((element, index) => {
          if (index > 1) {
            const date = everyDay.split(',')[index - 2].slice(5).split('-')
            element.label = `${element.label.slice(0, 1)}(${this.handleMonthDay(date)})`
          }
        })
        // console.log(this.currentWeekStartDate, this.currentWeekEndDate, this.$refs.table, 'xxxxxx')
      })
    },

    // 处理月日以0开头的
    handleMonthDay(md) {
      const str1 = md[0]
      const str2 = md[1]
      let newstr1 = ''
      let newstr2 = ''
      if (str1.startsWith('0')) {
        newstr1 = str1.slice(1)
      } else {
        newstr1 = str1
      }
      if (str2.startsWith('0')) {
        newstr2 = str2.slice(1)
      } else {
        newstr2 = str2
      }
      return `${newstr1}.${newstr2}`
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
    },

    // 中心选择
    structureChange(data) {
      this.deptNumber = data.value.length ? data.value[0].deptNumber : ''
      this.form.deptId = data.value.length ? data.value[0].id : ''
      this.deptSelectValue = data.value || []
    },

    getSubject() {
      // 获取科目
      QueryAdminSubject().then(res => {
        this.subList = res.data.map(item => {
          item.label = item.subjectName
          item.value = item.id
          return item
        })
      }).catch(() => {})
    },

    closeLoading() {
      this.loading = false
    },

    onSubmit() {
      this.loading = true
      if (this.comName === 'DayTable') {
        this.$nextTick(() => {
          this.$refs.table.getWillMergeColumns()
        })
      } else if (this.comName === 'WeekTable') {
        this.$nextTick(() => {
          this.$refs.table.getWillMergeRows()
        })
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

.filter-wrap {
  font-size: 13px;
  height: 50px;
  padding: 0 20px;
  margin-top: 15px;
}

.demo-form-inline {
  white-space: nowrap;
}

.demo-form-inline /deep/ .el-form-item {
  margin-bottom: 0;
}

.demo-form-inline /deep/ .el-form-item__content {
  width: 150px;
}

</style>
