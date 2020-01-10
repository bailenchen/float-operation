<template>
  <flexbox v-loading="loading" :style="{height: contentHeight + 'px'}" class="calendar-box">
    <el-button type="warning" icon="el-icon-plus" @click="createEvents">新建日程</el-button>
    <div class="box-left">
      <div class="left-title" >
        <img width="20px" src="@/assets/img/crm/todo.png" alt="">
        <span class="title-text">日历</span>
      </div>
      <div class="left-scroll">
        <schedule
          v-loading="scheduleLoading"
          ref="schedule"
          :calendar-arr="calendarArr"
          @choseDay="gotoPast"
          @changeMonth="changeMonth"/>
        <div class="left-main">
          <div class="main-title">系统类型</div>
          <template>
            <el-checkbox-group v-model="checkSysList" @change="sysFifter">
              <el-checkbox v-for="item in sysCheck" :label="item.label" :key="item.label"/>
            </el-checkbox-group>
          </template>
        </div>
        <div class="left-bottom">
          <div class="bottom-title">自定义类型</div>
          <template>
            <el-checkbox-group v-model="checkCusList" @change="customFifter">
              <el-checkbox v-for="item in cusCheck" :class="item.class" :label="item.typeName" :key="item.typeId"/>
            </el-checkbox-group>
          </template>
        </div>
      </div>
      <div class="left-bottom-text">
        <i class="el-icon-warning"/>
        <span class="text-span">日历的自定义类型可以在企业管理后台-其他设置-日历类型设置里面进行编辑</span>
      </div>
    </div>
    <div class="box-right">
      <FullCalendar
        ref="fullCalendar"
        :button-text="buttonText"
        :header="{
          left: 'listDay,timeGridWeek,dayGridMonth, today',
          center: 'prevYear,prev, title, next,nextYear',
          right: ''
        }"
        :plugins="calendarPlugins"
        :weekends="calendarWeekends"
        :first-day="firstDay"
        :event-time-format="evnetTime"
        :all-day-slot="true"
        :event-limit="true"
        :events="calendarEvents"
        :event-limit-text="eventLimiTtext"
        :now-indicator="true"
        :display-event-end="false"
        :slot-label-format="{ // 周，日视图时，左侧的显示的时间格式，以下为：00:00，00:30...5:30
          hour: 'numeric',
          minute: '2-digit',
          omitZeroMinute: false,
          meridiem: 'short',
          hour12: false
        }"
        :column-format="{day: 'dddd M/d'}"
        :list-day-format="listDayFormat"
        all-day-text="全天"
        no-events-message="暂无日程"
        locale="zh-cn"
        class="calendar-main"
        week-number-calculation="ISO"
        default-view="dayGridMonth"
        @changeMonth="changeMonths"
        @eventClick="eventClick"
        @datesRender="datesRender"
        @dateClick="handleDateClick"
      />
    </div>
    <create-event
      :show-create="showCreate"
      :select-div="selectDiv"
      :color-list="colorList"
      :cus-check="cusCheck"
      @createSuccess="createSuccess"
      @close="showCreate = false"/>
    <!-- 今日需..的详情 -->
    <today-list-detail
      :show-today-detail="showTodayDetail"
      :cus-check="cusCheck"
      :today-detail-data="todayDetailData"
      @deleteSuccess="deleteSuccess"
      @close="showTodayDetail = false"/>
  </flexbox>
</template>

<script>
import FullCalendar from '@fullcalendar/vue'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import timelinePlugin from '@fullcalendar/timeline'
import listPlugin from '@fullcalendar/list'
import Schedule from './schedule'
import TodayListDetail from './components/TodayListDetail'
import calendarColor from '@/views/SystemManagement/other/components/calendarColor.js'
import {
  calendarQueryTypeListAPI
} from '@/api/systemManagement/other'
import {
  canlendarQueryListAPI
} from '@/api/calendar'
import moment from 'moment'
// import { getMaxIndex } from '@/utils'
import CreateEvent from './components/CreateEvent'
// must manually include stylesheets for each plugin
import '@fullcalendar/core/main.css'
import '@fullcalendar/daygrid/main.css'
import '@fullcalendar/timegrid/main.css'
import '@fullcalendar/list/main.css'
export default {
  components: {
    FullCalendar, // make the <FullCalendar> tag available
    Schedule,
    CreateEvent,
    TodayListDetail
  },
  data: function() {
    return {
      loading: false,
      contentHeight: document.documentElement.clientHeight - 80,
      // 你需要用到的插件
      calendarPlugins: [
        // plugins must be defined in the JS
        dayGridPlugin,
        timeGridPlugin,
        timelinePlugin,
        listPlugin,
        interactionPlugin // needed for dateClick
      ],
      // 是否展示周六周日
      calendarWeekends: true,
      // 默认选中当天
      calendarEvents: [
        {
          title: '今日需联系会员',
          start: '2019-1-7 10:00:00',
          color: '#2362FB',
          id: 1,
          groupId: 0, // 代办类型
          name: '张三',
          createTime: '2019-12-30'
        }
      ],
      colorList: calendarColor.colorList,
      // 按钮文字
      buttonText: {
        month: '月',
        week: '周',
        day: '日',
        today: '今天'
      },
      evnetTime: {
        hour: 'numeric',
        minute: '2-digit',
        hour12: false
      },
      firstDay: 1, // 把每周设置为从周一开始
      scheduleLoading: false,
      calendarArr: [],
      // 首次选中不进行跳转日列表操作
      isFirstToDay: true,
      // 视图当前所展示的时间： 保证月，年切换时，视图更新引起的报错
      currentTime: '',
      checkSysList: [
        '今日需联系客户',
        '今日到期的任务',
        '今日到期的合同',
        '今日回款的合同'
      ],
      sysCheck: [
        { label: '今日需联系客户' },
        { label: '今日到期的任务' },
        { label: '今日到期的合同' },
        { label: '今日回款的合同' }
      ],
      checkCusList: [],
      cusCheck: [],
      showCreate: false,
      choseTitle: '',
      showTodayDetail: false,
      todayDetailData: {},
      selectDiv: null,
      // 储存显示日期的开始时间和结束时间
      activeTime: {}
    }
  },
  mounted() {
    window.onresize = () => {
      this.contentHeight = document.documentElement.clientHeight - 80
    }
    // this.handleDateClick({ dayEl: document.getElementsByClassName('fc-today')[0] })
    this.getList()
    this.getCusCheck()
  },
  methods: {
    /**
     * 查询列表
     */
    getList() {
      this.loading = true
      canlendarQueryListAPI(this.activeTime).then(res => {
        this.calendarEvents = []
        this.calendarArr = []
        res.data.forEach(item => {
          this.handleSure(item, '#53D397')
        })
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * 查询自定义日历类型
     */
    getCusCheck() {
      calendarQueryTypeListAPI().then(res => {
        this.checkCusList = res.data.map(item => {
          return item.typeName
        })
        this.cusCheck = res.data
        this.cusCheck.forEach(item => {
          this.colorList.forEach((color, index) => {
            if (item.color === color) {
              item.class = `color_${index + 1}`
              item.color = color
            }
          })
        })
      }).catch((

      ) => {})
    },

    /**
     * 格式化日列表左侧的时间
     */
    listDayFormat(data) {
      const timestamp = new Date(data.date.marker).getTime()
      const dateTime = moment(timestamp).format('ll')
      const week = moment(timestamp).format('dddd').replace('星期', '周')
      const dataValue = week + '  ' + dateTime
      return dataValue
    },

    /**
     * 周点击
     */
    toggleWeekends() {
      this.calendarWeekends = !this.calendarWeekends // update a property
    },

    /**
     * 跳转到某天
     */
    gotoPast(date) {
      // 获取日历对象
      if (this.isFirstToDay) {
        this.isFirstToDay = false
        return
      }
      const timestamp = new Date(date).getTime()
      const newDate = moment(timestamp).format('YYYY-MM-DD')
      this.selectDiv = newDate
      const calendarApi = this.$refs.fullCalendar.getApi() // from the ref="..."
      calendarApi.changeView('listDay')
      calendarApi.gotoDate(newDate)
    },

    /**
     * 天点击
     */

    handleDateClick(arg) {
      if (this.selectDiv === arg.dateStr) {
        this.createEvents()
      } else {
        this.selectDiv = arg.dateStr
        // 注开会生成提示文字
        // const div = document.createElement('div')
        // div.style.position = 'absolute'
        // div.style.left = arg.jsEvent.clientX + 20 + 'px'
        // div.style.top = arg.jsEvent.clientY - 20 + 'px'
        // div.style.border = '1px solid #999'
        // div.style.backgroundColor = '#999'
        // div.style.padding = '10px'
        // div.style.fontSize = '12px'
        // div.style.zIndex = getMaxIndex()
        // div.style.boxShadow = ''
        // div.innerHTML = '双击新建'
        // div.style.color = '#333'
        // div.className = 'create__event?'
        // if (document.getElementsByClassName('create__event?')[0]) {
        //   const oldDiv = document.getElementsByClassName('create__event?')[0]
        //   document.documentElement.removeChild(oldDiv)
        // }
        // document.documentElement.appendChild(div)
        // console.log(arg, 'arg')
      }
      const td = document.getElementsByClassName('select-day')
      if (td.length) {
        td[0].classList.remove('select-day')
      }
      arg.dayEl.classList.add('select-day')
      // if (arg.dateStr) {
      //   this.$refs.schedule.selectDay(arg.dateStr, true)
      // }
    },

    /**
     * 展示更多的文字
     */
    eventLimiTtext(data) {
      return `查看剩余的${data}条`
    },

    /**
     *  日期渲染时，触发的事件，默认传入info,一个包含view和el的对象
     */
    datesRender(info) {
      // 只有单日列表无数据时，才创建img
      if (info.view.type === 'listDay') {
        if (info.el.textContent === '暂无日程') {
          const img = document.createElement('img')
          // 写id保证只创建一次
          img.id = 'emityImg'
          img.src = require('@/assets/img/empty.png')
          // 保证一定是暂无日程而不是有些事件叫做暂无日程
          const div = document.getElementsByClassName('fc-list-empty-wrap1')[0]
          if (div) {
            div.insertBefore(img, div.children[0])
          }
        }
      } else {
        if (this.currentTime === info.view.title) {
          if (this.selectDiv) {
          // 保证切换模式时，关联的日期被选中
            document.querySelector(`td[data-date="${this.selectDiv}"]`).classList.add('select-day')
          }
        } else {
          this.currentTime = info.view.title
        }
      }
      if (this.activeTime.startTime !== new Date(info.view.activeStart).getTime()) {
        this.activeTime.startTime = new Date(info.view.activeStart).getTime()
        this.activeTime.endTime = new Date(info.view.activeEnd).getTime()
        this.getList()
      }
    },

    /**
     * 点击事件
     */
    eventClick(data) {
      console.log(data)
      this.todayDetailData = {
        startTime: data.event.start || '',
        endTime: data.event.end || data.event.start,
        id: data.event.id,
        title: data.event.title,
        groupId: data.event.groupId,
        backgroundColor: data.event.backgroundColor
      }
      // 不是组件自带的字段都会被插入到entendedProps里面
      if (data.event.extendedProps) {
        this.todayDetailData.name = data.event.extendedProps.name
        this.todayDetailData.createTime = data.event.extendedProps.createTime
        this.todayDetailData.headTitle = data.event.extendedProps.headTitle
        this.todayDetailData.typeId = data.event.extendedProps.typeId || 3
      }
      this.showTodayDetail = true
    },

    /**
     * 选中某天
     */
    clickDay(data) {
      console.log(data)
    },

    /**
     * 选中某月
     */
    changeMonth(data) {
      console.log(data)
    },

    /**
     * 选中某月
     */
    changeMonths(data) {
      console.log(data, 'mouth')
    },
    /**
     * 系统筛选
     */
    sysFifter(data) {
      console.log(data)
    },

    /**
     * 自定义筛选
     */
    customFifter(data) {
      console.log(data)
    },

    /**
     * 新建日程
     */
    createEvents() {
      this.showCreate = true
    },

    /**
     * 新建日程
     */
    handleSure(data, color) {
      this.calendarEvents.push({
        title: data.title,
        start: moment(data.startTime).format('YYYY-MM-DD'),
        id: data.eventId,
        color: color,
        groupId: 1,
        name: '张三',
        headTitle: '集体会议',
        createTime: '2019-12-20',
        end: moment(data.endTime).format('YYYY-MM-DD')
      })
    },

    /**
     * 新建或者编辑成功的回调
     */
    createSuccess() {
      this.showCreate = false
      this.getList()
    },

    /**
     * 删除成功的回调
     */
    deleteSuccess() {
      this.showTodayDetail = false
      this.getList()
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style/color.scss';
@import './style/fullCalendar.scss';
.calendar-box {
  padding: 5px 5px 10px;
  min-width: 1200px;
  overflow-y: hidden;
  overflow-x: auto;
  font-size: 14px;
  position: relative;
}
.el-button{
  position: absolute;
  top: 17px;
  right: 40px;
  background-color: #FF6A00;
  border-color: #ff6a00;
}
.box-left {
  width: 280px;
  background-color: #fff;
  height: 100%;
  border:1px solid rgba(230,230,230,1);
  border-radius:4px;
  margin-right: 20px;
  flex-shrink: 0;
  .left-scroll{
    height: calc(100% - 120px);
    overflow-y: auto;
  }
  .left-bottom-text{
    color: #999;
    width: 240px;
    height: 40px;
    margin-top: 20px;
    margin-bottom: 10px;
    font-size: 12px;
    .text-span{
      display: inline-block;
      width: 200px;
      letter-spacing: 2px;
    }
    i{
      display: inline-block;
      vertical-align: top;
      margin-left: 10px;
    }
  }
  .left-title{
    width: 100%;
    border-bottom: 1px solid rgb(239,239,239);
    height: 50px;
    line-height: 50px;
    .title-text{
      font-size: 16px;
      color: #323232;
      font-weight: bolder;
    }
    img{
      vertical-align: sub;
      margin-left: 16px;
      margin-right: 10px;
    }
  }
  .left-main{
    width: 100%;
    padding: 10px;
    border-bottom: 1px solid rgb(239,239,239);
    border-top: 1px solid rgb(239,239,239);
    .main-title{
      color:#666666;
      font-size: 12px;
      margin-top: 10px;
      margin-bottom: 5px;
    }
  }
  .left-bottom{
    width: 100%;
    padding: 10px;
    .bottom-title{
      color:#666666;
      font-size: 12px;
      margin-top: 10px;
      margin-bottom: 5px;
    }
  }
   /deep/.el-checkbox{
      height: 40px;
      line-height: 40px;
      padding-left: 13px;
      display: block;
      .el-checkbox__label{
        padding-left: 15px;
        font-size: 13px;
      }
   }
}
.box-right{
  background-color: #fff;
  height: 100%;
  width: 100%;
  border:1px solid #f3f3f3;
  padding: 10px 0px 0px;
}
/deep/.select-day{
  background-color: #4983EF !important;
  opacity: 0.04 !important;
}
</style>
