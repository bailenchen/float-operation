<template>
  <flexbox :style="{height: contentHeight + 'px'}" class="calendar-box">
    <el-button type="warning" icon="el-icon-plus" @click="createEvents">新建日程</el-button>
    <div class="box-left">
      <div class="left-title" >
        <img width="20px" src="@/assets/img/crm/todo.png" alt="">
        <span class="title-text">日历类型</span>
      </div>
      <div class="left-scroll">
        <schedule
          v-loading="scheduleLoading"
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
              <el-checkbox v-for="item in cusCheck" :class="item.class" :label="item.label" :key="item.label"/>
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
          left: 'listDay,timeGridWeek,dayGridMonth',
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
        @eventClick="eventClick"
        @datesRender="datesRender"
        @dateClick="handleDateClick"
      />
    </div>
    <create-event
      :show-create="showCreate"
      @handleSure="handleSure"
      @close="showCreate = false"/>
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
import moment from 'moment'
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
    CreateEvent
  },
  data: function() {
    return {
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
      ],
      // 按钮文字
      buttonText: {
        month: '月',
        week: '周',
        day: '日'
      },
      evnetTime: {
        hour: 'numeric',
        minute: '2-digit',
        hour12: false
      },
      firstDay: 1, // 把每周设置为从周一开始
      scheduleLoading: false,
      calendarArr: [],
      checkSysList: [
        '今日续联系客户',
        '今日到期的任务',
        '今日到期的合同',
        '今日回款的合同'
      ],
      sysCheck: [
        { label: '今日续联系客户' },
        { label: '今日到期的任务' },
        { label: '今日到期的合同' },
        { label: '今日回款的合同' }
      ],
      checkCusList: [
        '自定义1',
        '自定义2',
        '自定义3',
        '自定义4',
        '自定义5',
        '自定义6',
        '自定义7',
        '自定义8',
        '自定义9',
        '自定义10',
        '自定义11'
      ],
      cusCheck: [
        { label: '自定义1', class: 'color_1' },
        { label: '自定义2', class: 'color_2' },
        { label: '自定义3', class: 'color_3' },
        { label: '自定义4', class: 'color_4' },
        { label: '自定义5', class: 'color_5' },
        { label: '自定义6', class: 'color_6' },
        { label: '自定义7', class: 'color_7' },
        { label: '自定义8', class: 'color_8' },
        { label: '自定义9', class: 'color_9' },
        { label: '自定义10', class: 'color_10' },
        { label: '自定义11', class: 'color_11' }
      ],
      showCreate: false,
      choseTitle: ''
    }
  },
  mounted() {
    window.onresize = () => {
      this.contentHeight = document.documentElement.clientHeight - 80
    }
    this.handleDateClick({ dayEl: document.getElementsByClassName('fc-today')[0] })
  },
  methods: {
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
      // const time = date.replace(/\//g, '-')
      const dateArr = date.split('/')
      let newDate = dateArr[0]
      newDate += '-' + (dateArr[1] < 10 ? '0' + dateArr[1] : dateArr[1])
      newDate += '-' + (dateArr[2] < 10 ? '0' + dateArr[2] : dateArr[2])
      const calendarApi = this.$refs.fullCalendar.getApi() // from the ref="..."
      calendarApi.changeView('dayGridDay')
      console.log(calendarApi)
      calendarApi.gotoDate(newDate)
    },
    /**
     * 天点击
     */

    handleDateClick(arg) {
      const td = document.getElementsByClassName('select-day')
      if (td.length) {
        td[0].classList.remove('select-day')
      }
      arg.dayEl.classList.add('select-day')
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
      }
    },

    /**
     * 点击事件
     */
    eventClick(data) {
      console.log(data)
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
     * 确定新建日程
     */
    handleSure(data, color) {
      this.calendarEvents.push({
        title: data.title,
        start: data.startTime,
        color: color,
        end: data.endTime
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style/color.scss';
@import './style/fullCalendar.scss';
.calendar-box {
  padding: 15px 10px;
  min-width: 1200px;
  overflow-y: hidden;
  overflow-x: auto;
  font-size: 14px;
  position: relative;
}
.el-button{
  position: absolute;
  top: 43px;
  right: 50px;
  background-color: #FF6A00;
  border-color: #ff6a00;
}
.box-left {
  width: 236px;
  background-color: #fff;
  height: 100%;
  border:1px solid rgba(230,230,230,1);
  border-radius:4px;
  margin-right: 9px;
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
      height: 50px;
      line-height: 50px;
      padding-left: 13px;
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
  border:1px solid rgba(230,230,230,1);
  padding: 25px 35px;
}
/deep/.select-day{
  background-color: #4983EF !important;
  opacity: 0.04 !important;
}
</style>
