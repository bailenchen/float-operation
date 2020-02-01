<template>
  <flexbox v-loading="loading" :style="{height: contentHeight + 'px'}" class="calendar-box">
    <el-button type="warning" icon="el-icon-plus" @click="createEvents">新建日程</el-button>
    <div class="box-left">
      <div class="left-title" >
        <img width="20px" src="@/assets/img/system/app/ce_index.png" alt="">
        <xh-user-cell
          v-if="showUser"
          ref="xhuserCell"
          :value="checkedUser"
          :info-request="subUserListIndex"
          :radio="true"
          v-bind="$attrs"
          class="left-user"
          placement="bottom-start"
          @value-change="selectUser">
          <flexbox slot="reference" class="user-box">
            <span class="username">{{ checkedUser[0]?checkedUser[0].realname + '的日程': '我的日程' }}</span>
            <span :class="{ 'is-reverse' : $refs.xhuserCell && $refs.xhuserCell.showPopover }" class="el-icon-arrow-up icon"/>
          </flexbox>
        </xh-user-cell>
        <span v-else class="username">我的日历</span>
      </div>
      <div class="left-scroll">
        <schedule
          v-loading="scheduleLoading"
          ref="schedule"
          :list-data-type="listDataType"
          :active-time="activeTime"
          :calendar-arr="calendarArr"
          @choseDay="gotoPast"
          @changeMonth="changeMonth"/>
        <div class="left-main">
          <div class="main-title" @click="showSys = !showSys">
            <img src="@/assets/img/calendar_sys.png" alt="" width="20px">
            <span class="main-text">系统类型</span>
            <span :class="{ 'is-reverse' : showSys }" class="el-icon-arrow-up icon"/>
          </div>
          <template v-if="showGroup">

            <el-checkbox-group v-show="showSys" v-model="checkCusList" @change="customFifter">
              <el-checkbox
                v-for="item in cusCheck"
                v-if="item.type === 1"
                :checked="item.select"
                :class="item.class"
                :label="item.typeName"
                :key="item.typeName"/>
            </el-checkbox-group>

          </template>
        </div>
        <div class="left-bottom">
          <div class="bottom-title" @click="showCus = !showCus">
            <img src="@/assets/img/calendar_cus.png" alt="" width="20px">
            <span class="main-text">自定义类型</span>
            <span :class="{ 'is-reverse' : showCus }" class="el-icon-arrow-up icon"/>
          </div>
          <template v-if="showGroup">
            <el-checkbox-group v-show="showCus" v-model="checkCusList" @change="customFifter">
              <el-checkbox
                v-for="item in cusCheck"
                v-if="item.type === 2"
                :class="item.class"
                :checked="item.select"
                :label="item.typeName"
                :key="item.typeId"/>
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
      :id="eventId"
      :show-today-detail="showTodayDetail"
      :cus-check="cusCheck"
      :today-detail-data="todayDetailData"
      @deleteSuccess="handleSuccess"
      @createSuccess="handleSuccess"
      @close="showTodayDetail = false"/>

    <c-r-m-full-screen-detail
      :visible.sync="showFullDetail"
      :crm-type="relationCrmType"
      :id="relationID" />
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
import XhUserCell from '@/components/CreateCom/XhUserCell'
import {
  canlendarQueryListAPI,
  canlendarQueryTypeListAPI,
  canlendarEventCrmAPI,
  canlendarEventTaskAPI,
  canlendarUpdateTypeAPI
} from '@/api/calendar'
import { subUserListIndex } from '@/api/common'
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
    TodayListDetail,
    XhUserCell,
    CRMFullScreenDetail: () =>
      import('@/views/customermanagement/components/CRMFullScreenDetail.vue')
  },
  data() {
    return {
      loading: false,
      eventId: '',
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
      calendarEvents: [],
      // 存储所有事件，方便筛选
      calendarList: [],
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
      // 储存当前活动的时间，保证月份切换时，小日历跟随切换
      currentActiveTime: '',
      checkSysList: [
      ],
      sysCheck: [
        { label: '分配的任务' },
        { label: '需联系的客户' },
        { label: '即将到期的合同' },
        { label: '计划回款' }
      ],
      checkCusList: [],
      cusCheck: [],
      showGroup: false,
      showCreate: false,
      choseTitle: '',
      showTodayDetail: false,
      todayDetailData: {},
      selectDiv: null,
      typeIds: [],
      // 储存显示日期的开始时间和结束时间
      activeTime: {},
      listDataType: '',
      // 今日显示的联系
      todaySchedule: [],
      // 相关的系统联系字段
      needData: {
        customerTimeList: [],
        endContractTimeList: [],
        receiveContractTimeList: []
      },
      checkedUser: [],
      showUser: true,
      showpover: false,
      showSys: true,
      showCus: false,
      taskList: [],
      showFullDetail: false,
      relationCrmType: 'task',
      relationID: '',
      selectSysList: [],
      sysTypeId: []
    }
  },
  computed: {
    subUserListIndex() {
      return subUserListIndex
    }
  },
  mounted() {
    window.onresize = () => {
      this.contentHeight = document.documentElement.clientHeight - 80
    }
    this.showUserSelect()
    this.addBus()
  },

  destroyed() {
    this.$bus.off('handleSuccess')
  },
  /**
   * 路由进入前切换顶部导航条
   */
  beforeRouteEnter(to, from, next) {
    next(
      vm => {
        vm.$store.commit('SET_NAVACTIVEINDEX', to.fullPath)
      }
    )
  },

  /**
   *  路由更新
   */
  beforeUpdate(to, from, next) {
    this.updateList()
    next()
  },

  methods: {

    /**
     * 添加监听事件
     */
    addBus() {
      this.$bus.on('handleSuccess', () => {
        this.getCusCheck()
      })
    },

    /**
     * 查询列表
     */
    getList() {
      this.loading = true
      this.activeTime.typeIds = this.typeIds
      this.$refs.schedule.getDateList(this.activeTime)
      canlendarQueryListAPI(this.activeTime).then(res => {
        this.calendarEvents = []
        const list = [
          ...res.data, ...this.todaySchedule, ...this.taskList
        ]
        list.forEach(item => {
          this.handleSure(item, item.color)
        })
        this.calendarList = this.calendarEvents
        this.showGroup = true
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * 查询自定义日历类型
     */
    getCusCheck() {
      this.loading = true
      this.typeIds = []
      this.checkSysList = []
      this.calendarEvents = []
      this.checkCusList = []
      this.showGroup = false
      this.sysTypeId = []
      canlendarQueryTypeListAPI({
        userId: this.activeTime.userId
      }).then(res => {
        this.cusCheck = res.data
        this.todaySchedule = []
        this.cusCheck.forEach(item => {
          if (item.select) {
            this.typeIds.push(item.typeId)
          }
          if (item.type === 1) {
            this.sysTypeId.push(
              { typeId: item.typeId, name: item.typeName }
            )
          }

          this.activeTime.typeIds = this.typeIds
          if (item.color === '1') {
            item.class = 'color_8'
          } else if (item.color === '2') {
            item.class = 'color_1'
          } else if (item.color === '3') {
            item.class = 'color_5'
          } else if (item.color === '4') {
            item.class = 'color_11'
          }
          this.colorList.forEach((color, index) => {
            if (item.color === color) {
              item.class = `color_${index + 1}`
              item.color = color
            }
          })
        })
        this.getTodayTypeList()
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * 编辑左侧多选框列表
     */
    updateList() {
      this.loading = true
      this.activeTime.typeIds = this.typeIds
      canlendarUpdateTypeAPI({ typeIds: this.typeIds, userId: this.activeTime.userId }).then(res => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
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
    gotoPast(date, boolean) {
      // 获取日历对象
      if (this.isFirstToDay) {
        this.isFirstToDay = false
        return
      }
      const timestamp = new Date(date).getTime()
      const newDate = moment(timestamp).format('YYYY-MM-DD')
      this.selectDiv = newDate
      const calendarApi = this.$refs.fullCalendar.getApi() // from the ref="..."
      if (calendarApi) {
        if (!boolean) {
          calendarApi.changeView('listDay')
        }
        calendarApi.gotoDate(newDate)
      }
    },

    /**
     * 天点击
     */

    handleDateClick(arg) {
      if (this.selectDiv === arg.dateStr) {
        this.showCreate = true
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
      if (td && td.length) {
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
      } else if (info.view.type === 'dayGridMonth') {
        if (this.currentTime === info.view.title) {
          if (this.selectDiv && document.querySelector(`td[data-date="${this.selectDiv}"]`)) {
          // 保证切换模式时，关联的日期被选中
            document.querySelector(`td[data-date="${this.selectDiv}"]`).classList.add('select-day')
          }
        } else {
          // this.$refs.schedule.selectMouth(info.view.activeStart)
          this.currentTime = info.view.title
        }
        if (this.activeTime.startTime !== new Date(info.view.activeStart).getTime()) {
          this.activeTime.startTime = new Date(info.view.activeStart).getTime()
          this.activeTime.endTime = new Date(info.view.activeEnd).getTime()
          // 优化 只有月切换才会刷新列表
          const leadTime = this.activeTime.endTime - this.activeTime.startTime
          if (leadTime > 24 * 60 * 60 * 1000) {
            this.getCusCheck()
          }
        }
      } else if (info.view.type === 'timeGridWeek') {
        // 周逻辑处理
      }
      this.listDataType = info.view.type
    },

    /**
     * 点击事件
     */
    eventClick(data) {
      if (data.event.groupId == -2) {
        this.relationID = data.event.id
        this.relationCrmType = 'task'
        setTimeout(() => {
          this.showFullDetail = true
        }, 200)
        return
      }
      this.eventId = data.event.id
      this.todayDetailData = {
        startTime: data.event.start || '',
        endTime: data.event.end || data.event.start,
        id: data.event.id,
        title: data.event.title,
        userId: this.activeTime.userId,
        groupId: data.event.groupId,
        backgroundColor: data.event.backgroundColor
      }
      // 不是组件自带的字段都会被插入到entendedProps里面
      if (data.event.extendedProps) {
        this.todayDetailData.name = data.event.extendedProps.name
        this.todayDetailData.createTime = data.event.extendedProps.createTime
        this.todayDetailData.headTitle = data.event.title
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
    changeMonth(data, boolean) {
      this.gotoPast(data, true)
    },

    /**
     * 筛选
     */
    customFifter(data) {
      this.typeIds = []
      const list = []
      data.forEach(item => {
        this.cusCheck.forEach(element => {
          if (item === element.typeName) {
            this.typeIds.push(element.typeId)
            list.push({ typeId: element.typeId, title: item })
          }
        })
      })
      this.updateEvent(list)
    },

    /**
     * 筛选完成后处理的函数
     */
    updateEvent(data) {
      const list = []
      this.calendarList.forEach(item => {
        data.forEach(element => {
          if (element.typeId === item.groupId) {
            list.push(item)
          }
        })
      })
      this.calendarEvents = list
    },

    /**
     * 新建日程
     */
    createEvents() {
      this.selectDiv = ''
      this.showCreate = true
    },

    /**
     * 新建日程
     */
    handleSure(data, color) {
      this.calendarEvents.push({
        title: data.title,
        start: moment(data.startTime).format('YYYY-MM-DD HH:mm:ss'),
        id: data.eventId,
        color: color,
        groupId: data.typeId,
        end: moment(data.endTime).format('YYYY-MM-DD HH:mm:ss')
      })
    },

    /**
     * 新建或者编辑成功的回调
     */
    createSuccess() {
      this.showCreate = false
      this.getCusCheck()
    },

    /**
     * 删除/编辑成功的回调
     */
    handleSuccess() {
      this.showTodayDetail = false
      this.getCusCheck()
    },

    /**
     * 选择员工
     */
    selectUser(data) {
      this.checkedUser = data.value
      if (data.value.length) {
        this.activeTime.userId = data.value.map(item => {
          return item.userId
        }).join(',')
      } else {
        this.activeTime.userId = ''
      }
      this.getCusCheck()
    },

    /**
     * 展示员工选框
     */
    showUserSelect() {
      subUserListIndex().then(res => {
        if (res.data.length === 0) {
          this.showUser = false
        } else {
          this.showUser = true
        }
      }).catch(() => {})
    },

    /**
     * 获取今日需要展示的日程
     */
    getTodayTypeList() {
      this.loading = true
      const params = {
        startTime: this.activeTime.startTime,
        endTime: this.activeTime.endTime,
        userId: this.activeTime.userId
      }
      canlendarEventCrmAPI(params).then(res => {
        this.needData = res.data
        this.todaySchedule = this.handleData(this.cusCheck)
        if (this.selectSysList.includes('1')) {
          this.getTask()
        } else {
          this.taskList = []
          this.getList()
        }
      }).catch(() => {})
    },

    /**
     * 获取分配给我的任务
     */
    getTask() {
      this.taskList = []
      const params = {
        startTime: this.activeTime.startTime,
        endTime: this.activeTime.endTime,
        userId: this.activeTime.userId
      }
      console.log(this.sysTypeId[0].typeId)
      canlendarEventTaskAPI(params).then(res => {
        res.data.forEach(item => {
          this.taskList.push({
            title: item.name,
            startTime: moment(item.startTime).format('YYYY-MM-DD HH:mm:ss'),
            id: item.taskId,
            eventId: item.taskId,
            color: '#AEA1EA',
            groupId: this.sysTypeId[0].typeId,
            typeId: this.sysTypeId[0].typeId,
            endTime: moment(item.endTime).format('YYYY-MM-DD HH:mm:ss')
          })
        })
        this.getList()
      }).catch(() => {})
    },

    /**
     * 将需要展示的日程拼接入日程展示的数组
     * color 1 分配给我的任务 2 需联系的客户 3 即将到期的合同 4 需要回款的合同
     */
    handleData(list) {
      this.selectSysList = []
      const dataList = []
      list.forEach(item => {
        if (item.type === 1) {
          if (item.select) {
            this.selectSysList.push(item.color)
          }
        }
      })
      if (this.selectSysList.includes('2')) {
        this.needData.customerTimeList.forEach(date => {
          dataList.push({
            title: '需联系的客户',
            startTime: date,
            eventId: -1,
            color: '#53D397',
            typeId: this.sysTypeId[1].typeId,
            groupId: this.sysTypeId[1].typeId,
            endTime: date
          })
        })
      }
      if (this.selectSysList.includes('3')) {
        this.needData.endContractTimeList.forEach(date => {
          dataList.push({
            title: '即将到期的合同',
            startTime: date,
            eventId: -1,
            color: '#3498DB',
            typeId: this.sysTypeId[2].typeId,
            groupId: this.sysTypeId[2].typeId,
            endTime: date
          })
        })
      }
      if (this.selectSysList.includes('4')) {
        this.needData.receiveContractTimeList.forEach(date => {
          dataList.push({
            title: '计划回款',
            startTime: date,
            eventId: -1,
            color: '#FF6F6F',
            typeId: this.sysTypeId[3].typeId,
            groupId: this.sysTypeId[3].typeId,
            endTime: date
          })
        })
      }
      return dataList
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
    display: flex;
    border-bottom: 1px solid rgb(239,239,239);
    height: 50px;
    line-height: 50px;
    .title-text{
      font-size: 16px;
      color: #323232;
      display: inline-block;
      width: 120px;
      font-weight: bolder;
    }
    img{
      vertical-align: sub;
      margin-left: 16px;
      margin-right: 10px;
      height: 20px;
      margin-top: 14px;
    }
    .left-user{
      margin-top: 7px;
      width: 180px;
    }
  }
  .left-main{
    width: 100%;
    padding: 0px;
    color:#666666;

    // border-bottom: 1px solid rgb(239,239,239);
    // border-top: 1px solid rgb(239,239,239);
    .main-title:hover{
      background-color: #EDF2FF;
    }
    .main-title{
      font-size: 12px;
      margin-top: 10px;
      display: flex;
      padding: 15px;
      width: 100%;
      height: 45px;
      cursor: pointer;

      .main-text{
        display: inline-block;
        color: #333;
        font-weight: bolder;
        width: 240px;
      }
       img {
        width: 18px;
        height: 18px;
        margin-top: -2px;
        margin-right: 10px;
      }
    }
  }
  .left-bottom{
    width: 100%;
     padding: 0px;
    .bottom-title:hover{
      background-color: #EDF2FF;
      }
    .bottom-title{
      color:#666666;
      font-size: 12px;
      padding: 15px;
      display: flex;
      height: 45px;
      cursor: pointer;

       .main-text{
        display: inline-block;
        color: #333;
        font-weight: bolder;
        width: 240px;
      }
      img {
        width: 18px;
        height: 18px;
        margin-top: -2px;
        margin-right: 10px;
      }
    }
  }
   /deep/.el-checkbox{
      height: 40px;
      line-height: 40px;
      padding-left: 15px;
      display: block;
      .el-checkbox__label{
        padding-left: 15px;
        font-size: 13px;
      }
   }
   /deep/.el-checkbox:hover{
     width: 100%;
     background-color: #F6F8FA;
   }
}
.box-right{
  background-color: #fff;
  height: 100%;
  width: 100%;
  overflow: hidden;
  border:1px solid #f3f3f3;
  padding: 10px 0px 0px;
}
.user-box {
    width: unset;
    height: 36px;
    background-color: white;
    margin-right: 10px;
    display: flex;
    cursor: pointer;
    .user-icon {
      background: $xr-color-primary;
      color: white;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      line-height: 28px;
      text-align: center;
    }
    .username {
      font-size: 13px;
      display: inline-block;
      text-overflow: ellipsis;
      overflow: hidden;
      margin-right: 3px;
      white-space: nowrap;
    }
  }
/deep/.select-day{
  background-color: #4983EF !important;
  opacity: 0.04 !important;
}
.el-icon-arrow-up {
  color: #333;
  font-size: 14px;
  transition: transform .3s;
  transform: rotate(180deg);
  cursor: pointer;
  margin-right: 10px;
}
.el-icon-arrow-up.is-reverse {
  transform: rotate(0deg);
}
</style>
