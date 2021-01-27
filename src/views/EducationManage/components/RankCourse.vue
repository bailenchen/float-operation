<template>
  <create-view
    :loading="loading"
    :body-style="{ height: '100%'}">
    <flexbox
      direction="column"
      align="stretch"
      class="crm-create-container">
      <flexbox class="crm-create-header">
        <div style="flex:1;font-size:17px;color:#333;font-weight: bold;">班级排课</div>
        <i
          class="el-icon-close close"
          @click="hidenView" />
      </flexbox>
      <flexbox
        class="crm-create-flex"
        direction="column"
        align="stretch">
        <create-sections title="基本信息">
          <div class="crm-create-body">
            <div class="content create-sections-content">
              <flexbox
                :gutter="0"
                align="stretch"
                wrap="wrap"
                style="padding: 10px 8px 0;">
                <flexbox-item
                  v-for="(item, index) in baseInfoList"
                  :span="false ? 12 : 0.25"
                  :key="index">
                  <flexbox
                    align="stretch"
                    direction="column"
                    class="b-cell-b">
                    <div class="b-cell-name">{{ item.name }}</div>
                    <div class="b-cell-value">{{ item.value }}</div>
                  </flexbox>
                </flexbox-item>
              </flexbox>
            </div>

          </div>
        </create-sections>
        <create-sections title="上课时间段">
          <div class="crm-create-body">
            <div class="content create-sections-content">
              <flexbox
                class="row-set"
                direction="row"
                align="center">
                <span>上课时间段：</span>
                <div class="time-select">
                  <el-time-select
                    v-model="startTime"
                    :picker-options="{
                      start: '08:00',
                      step: '00:60',
                      end: '22:00'
                    }"
                    :clearable="false"
                    placeholder="起始时间"
                    @change="changeTime"/>
                  至
                  <el-time-select
                    v-model="endTime"
                    :clearable="false"
                    :picker-options="{
                      start: '08:00',
                      step: '00:60',
                      end: maxEndTime,
                      minTime: startTime,
                    }"
                    placeholder="结束时间"/>
                </div>
              </flexbox>
              <flexbox
                class="row-set"
                direction="row"
                align="center">
                <span>上课日期：</span>
                <el-input v-model="currentAddDate" disabled style="width:45%;margin-right:10px;" placeholder="请选择后添加日期"/>
                <el-button type="primary" size="mini" @click="selectDate">添加日期</el-button>
                <el-button type="primary" size="mini" @click="reset">重置</el-button>
              </flexbox>
              <flexbox
                class="row-set"
                direction="row"
                wrap="wrap"
                align="center">
                <span>提交排课日期：</span>
                <el-button
                  v-for="(item, index) in [4, 8, 12, 16, 20]"
                  :key="index"
                  size="mini"
                  @click="selectWeek(item)">
                  连排{{ item }}周
                </el-button>
              </flexbox>
              <flexbox
                class="row-set"
                direction="row"
                wrap="wrap"
                align="center">
                <span>自定义连排周数：</span>
                <el-select
                  v-model="weeks" clearable
                  placeholder="请选择"
                  @change="customRankClass">
                  <el-option
                    v-for="item in weekList"
                    :key="item"
                    :label="item"
                    :value="item"/>
                </el-select>&nbsp;&nbsp;周&nbsp;&nbsp;
                <el-button type="primary" size="mini" @click="clearWeek">清除</el-button>
              </flexbox>
              <flexbox
                class="time-rank"
                direction="row"
                wrap="wrap"
                justify="flex-start"
                align="left">
                <div v-for="(item,index) in dateList" :key="index" class="date-item" style="width: 33%">
                  {{ item }}
                  <i
                    v-if="dateList.length > 1"
                    class="el-icon-remove"
                    @click="deleteDate()"/>
                </div>
              </flexbox>

              <!-- 展示时间段列表 -->
              <el-table
                id="crm-table"
                ref="multipleTable"
                :row-height="40"
                :data="timeList"
                :height="300"
                class="n-table--border"
                use-virtual
                stripe
                border
                highlight-current-row
                style="width: 100%">
                <el-table-column
                  v-for="(item, index) in timeLists"
                  :key="index"
                  :fixed="index==0"
                  :prop="item.prop"
                  :label="item.label"
                  :width="item.width"
                  align="center"
                  show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="item.prop == 'name'">{{ scope.row.name }}</span>
                    <span v-else-if="item.prop == 'time'">{{ scope.row.time }}</span>
                    <span v-else>{{ scope.row[item.prop] }}</span>
                  </template>
                </el-table-column>
                <el-table-column/>
              </el-table>
            </div>
          </div>
        </create-sections>
        <create-sections title="学员名称" class="student-wrap">
          <add-student
            :base-info="selectionList[0]"
            :current-date="currentAddDateTime"
            @added-stu="getStuInfo"/>
        </create-sections>
      </flexbox>
      <div
        class="handle-bar">
        <el-button
          class="handle-button"
          @click.native="hidenView">取消</el-button>
        <el-button
          class="handle-button"
          type="primary"
          @click.native="submitForm">保存</el-button>
      </div>
    </flexbox>

    <el-dialog :visible.sync="dateVisible" append-to-body title="添加日期">
      <div class="date-wrap">
        <!-- 单选多个日期 -->
        <vc-calendar :attributes="attributes" @dayclick="onDayClick" />
        <!-- 选时间段 -->
        <vc-date-picker v-model="addDateRange" :model-config="modelConfig" is-range />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dateVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSelDate">确 定</el-button>
      </div>
    </el-dialog>
  </create-view>
</template>

<script>
import CreateView from '@/components/CreateView'
import CreateSections from '@/components/CreateSections'
import AddStudent from './AddStudent'
import { getDateStr } from '@/utils/dateDiff'
import moment from 'moment'

import { crmClassRankCourse, crmClassQueryInsertBaseInfo } from '@/api/educationmanage/class'
import { objDeepCopy } from '@/utils'

export default {
  name: 'RankCourse',
  components: {
    CreateView,
    CreateSections,
    AddStudent
  },
  props: {
    // 操作数据
    selectionList: {
      type: Array,
      default: () => {
        return []
      }
    },
    crmType: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      loading: false,

      fieldObj: {
        deptName: '中心',
        className: '班级名称',
        subjectTeacherName: '学科老师',
        coachType: '辅导方式',
        classroomName: '教室',
        subjectName: '科目',
        gradeName: '年级',
        classType: '班级类型',
        totalNumber: '满班人数',
        remarks: '备注'
      },
      baseInfoList: [],

      // 时间段
      startTime: '08:00',
      endTime: '10:00',

      // 当前添加的日期
      currentAddDate: '',
      currentAddDateTime: [],

      // 添加日期
      dateVisible: false,
      addSingleDate: [],
      addDateRange: {
        start: '',
        end: ''
      },
      modelConfig: {
        type: 'string',
        mask: 'YYYY-MM-DD'
      },

      weekList: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      weeks: null,

      // 排课列表
      dateList: [],
      markWeek: null, // 连排周数
      // 连排时的数据
      activeData: [],
      storedDate: [],

      timeList: [],
      timeLists: [
        { prop: 'num', label: '序号', width: 60 },
        { prop: 'dateTime', label: '日期/时间', width: 170 },
        { prop: 'customerName', label: '上课学员', width: 170 },
        { prop: 'maxs', label: '实际学员/最大人数', width: 170 }
      ],

      // 已添加学员信息
      addedList: []
    }
  },
  computed: {
    maxEndTime() {
      const maxt = parseInt(this.startTime) + 2
      const maxv = String(maxt).length == 2 ? `${maxt}:00` : `0${maxt}:00`
      return maxv
    },

    // 日历组件计算属性
    dates() {
      return this.addSingleDate.map(day => day.date)
    },
    attributes() {
      return this.dates.map(date => ({
        highlight: true,
        dates: date
      }))
    }
  },
  created() {
    console.log(this.selectionList, 'xbbbbbb')
    if (!this.crmType) {
      this.createBase(this.selectionList[0])
    }
    this.queryBaseInfo()
  },
  methods: {
    createBase(obj) {
      for (const key in this.fieldObj) {
        if (Object.hasOwnProperty.call(this.fieldObj, key)) {
          const element = this.fieldObj[key]
          this.baseInfoList.push({
            name: element,
            value: obj[key]
          })
        }
      }
    },
    queryBaseInfo() {
      this.loading = true
      const { classId } = this.selectionList[0]
      crmClassQueryInsertBaseInfo({ classId }).then(res => {
        const data = res.data
        if (this.crmType) {
          this.createBase(data)
        }
        // 上课时间段列表
        this.timeList = data.list.map((item, index) => {
          item.num = index + 1
          item.dateTime = item.classTime ? `${item.classTime.slice(0, 10)} ${item.timeSlotStart.slice(0, 5)}~${item.timeSlotEnd.slice(0, 5)}` : ''
          item.customerId = []
          let actual = 0
          item.customerName = item.students.map(ite => {
            item.customerId.push(ite.customerId)
            if (ite.classStatus === 1) {
              actual++
            }
            return `${ite.customerName}(${ite.classStatusName})`
          }).join(',')
          item.actual = actual
          item.totalNumbers = item.totalNumber
          item.maxs = `${item.actual}/${item.totalNumbers}`
          return item
        })
        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.log(err)
      })
    },
    hidenView() {
      this.$emit('hiden-view', 'schedule')
    },

    getStuInfo(data) {
      this.addedList = data
    },

    changeTime() {
      this.endTime = ''
    },

    // 选择连排
    selectWeek(weeks) {
      this.weeks = null
      this.rankCourse(weeks)
    },

    // 自定义连排
    customRankClass(item) {
      this.rankCourse(item)
    },

    // 连排公共方法
    rankCourse(weeks) {
      if (this.markWeek === weeks) {
        return
      }
      if (this.currentAddDateTime.length) {
        if (this.markWeek) {
          this.activeData.length = 0
        }
        this.markWeek = weeks
        // 待连排的所有日期 this.currentAddDateTime
        if (this.currentAddDate && this.currentAddDateTime.length) {
          for (let index = 0; index < this.currentAddDateTime.length; index++) {
            const element = this.currentAddDateTime[index].slice(0, 10)
            if (weeks == 1) {
              this.activeData.push(`${element} ${this.startTime}~${this.endTime}`)
            } else {
              var day = new Date(element)
              var wks = weeks - 1
              for (let index = 0; index < wks; index++) {
                day.setDate(day.getDate() + 7)
                const newdate = moment(day).format('YYYY-MM-DD')
                const itemData = `${newdate} ${this.startTime}~${this.endTime}`
                if (index == 0) {
                  this.activeData.push(`${element} ${this.startTime}~${this.endTime}`)
                }
                this.activeData.push(itemData)
              }
            }
          }
          this.dateList = this.storedDate.concat(this.activeData)
        }
      }
    },

    // 清除
    clearWeek() {
      this.weeks = null
      this.dateList = []
      this.storedDate = []
      this.markWeek = null
    },

    // 删除日期
    deleteDate(index) {
      this.dateList.splice(index, 1)
    },

    // 选择日期
    selectDate() {
      if (!this.endTime || !this.startTime) {
        return this.$message.error('请选择上课时间段')
      }
      this.addSingleDate = []
      this.addDateRange = {
        start: '',
        end: ''
      }
      this.weeks = null
      this.dateVisible = true
    },

    // 单选多个日期
    onDayClick(day) {
      const idx = this.addSingleDate.findIndex(d => d.id === day.id)
      if (idx >= 0) {
        this.addSingleDate.splice(idx, 1)
      } else {
        this.addSingleDate.push({
          id: day.id,
          date: day.date
        })
      }
    },

    // 确定选择的日期
    confirmSelDate() {
      // 将日期段转化为单个日期
      let comDate = []
      const { start, end } = this.addDateRange
      if (start && end) {
        const everyDay = getDateStr(start, end, 0).split(',')
        comDate = [...comDate, ...everyDay]
      }
      if (this.addSingleDate.length) {
        const filterDates = this.addSingleDate.map(item => {
          return item.id
        })
        comDate.push(...filterDates)
      }
      this.currentAddDate = String(Array.from(new Set(comDate)))
      comDate = comDate.map(item => {
        item = `${item} ${this.startTime}~${this.endTime}`
        return item
      })
      this.currentAddDateTime = Array.from(new Set(comDate))
      const totalDate = [...this.dateList, ...this.currentAddDateTime]
      console.log(totalDate, 'totalDate')
      // 有新日期添加进来时，就正式合并连排日期与之前添加的所有日期
      if (this.currentAddDate) {
        this.dateList = this.storedDate = this.storedDate.concat(this.activeData)
        this.markWeek = null
        this.activeData.length = 0
      }
      // 过滤重复的日期，然后拼上已添加的日期
      this.dateList = Array.from(new Set(totalDate))
      // 与已经添加的日期时间比较 获取重复的数据
      this.currentAddRepeatDateTime = this.outRepeat(totalDate)
      // 去掉重复的日期，显示在上课日期栏里
      this.showCurrentDate(this.currentAddRepeatDateTime)
      console.log(this.dateList, 'bbbbbb')

      console.log(comDate, 'bbjjjj')
      this.dateVisible = false
    },

    // 利用去重
    outRepeat(array) {
      const hash = []
      const unRepeatArr = []
      const repeatArr = []
      for (var i = 0, elem; (elem = array[i]) != null; i++) {
        if (!hash[elem]) {
          unRepeatArr.push(elem)
          hash[elem] = true
        } else {
          repeatArr.push(elem)
        }
      }
      return { repeatArr, unRepeatArr }
    },

    showCurrentDate({ repeatArr }) {
      // 重复标记
      const mark = []
      if (repeatArr.length) {
        for (let index = 0; index < this.dateList.length; index++) {
          const element = this.dateList[index]
          for (let indexs = 0; indexs < repeatArr.length; indexs++) {
            const ele = repeatArr[indexs]
            if (element == ele) {
              mark.push(index)
            }
          }
        }
      }
      if (mark.length) {
        const flag = []
        for (let index = 0; index < mark.length; index++) {
          const element = mark[index]
          for (let sindex = 0; sindex < this.currentAddDate.split(',').length; sindex++) {
            const selement = this.currentAddDate.split(',')[sindex]
            if (this.dateList[element].slice(0, 10) == selement) {
              flag.push(sindex)
            }
          }
        }
        const cAD = this.currentAddDate.split(',')
        for (let index = 0; index < flag.length; index++) {
          const element = flag[index]
          cAD.splice(element, 1)
          this.currentAddDateTime.splice(element, 1)
        }
        this.currentAddDate = String(cAD)
        console.log(this.currentAddDate, this.currentAddDateTime, 'vvvvvv')
      }
    },

    // 重置
    reset() {
      this.startTime = '08:00'
      this.endTime = '10:00'
      this.currentAddDate = ''
      this.weeks = null
      this.activeData.length = 0
    },

    /**
     * 保存
     */
    submitForm() {
      const { classId, classroomId, subjectTeacherId, totalNumber, subjectId } = this.selectionList[0]
      const timeList = []
      const bstudentList = []
      this.dateList.forEach(item => {
        console.log(item, 'bbbbb')
        timeList.push({
          classId,
          classroomId,
          classTime: item.slice(0, 10),
          timeSlot: `${item.slice(11, -6)}:00-${item.slice(17).includes('24') ? '23:59:59' : item.slice(17) + ':00'}`,
          subjectTeacherId
        })
      })

      const newList = objDeepCopy(this.addedList)
      const customerIds = []
      newList.forEach(item => {
        customerIds.push(item.customerId)
      })
      // 去重
      const newCustomerIds = Array.from(new Set(customerIds))
      for (let index = 0; index < newCustomerIds.length; index++) {
        const element = newCustomerIds[index]
        const stuList = []
        for (let indexs = 0; indexs < this.addedList.length; indexs++) {
          const selement = this.addedList[indexs]
          if (element == selement.customerId) {
            stuList.push({
              customerId: selement.customerId,
              rId: selement.rId,
              notArranged: selement.notArranged
            })
          }
        }
        bstudentList.push({
          list: stuList
        })
      }
      console.log(this.addedList)

      const params = {
        subjectId,
        totalNumber,
        classroomId,
        list1: timeList,
        list2: bstudentList
      }

      crmClassRankCourse(params).then(res => {
        this.hidenView()
        this.$message.success('操作成功')
        this.$emit('save-success', { type: 'schedule' })
      }).catch((err) => {
        console.log(err)
      })

      console.log(params, 'params')
    }
  }
}
</script>

<style lang="scss" scoped>
.crm-create-container {
  position: relative;
  height: 100%;
}

.crm-create-header {
  height: 40px;
  margin-bottom: 20px;
  padding: 0 10px;
  flex-shrink: 0;
  .close {
    display: block;
    font-size: 24px;
    color: #909399;
    margin-right: -10px;
    padding: 10px;
    cursor: pointer;
  }
  .close:hover {
    color: $xr-color-primary;
  }
}

/** 将其改变为flex布局 */
.crm-create-box {
  display: flex;
  flex-wrap: wrap;
  padding: 0 20px;
}

.crm-create-flex {
    position: relative;
    overflow-x: hidden;
    overflow-y: auto;
    flex: 1;
}

.crm-create-item {
  flex: 0 0 50%;
  flex-shrink: 0;
  padding-bottom: 10px;
}

.create-name {
  font-size: 14px;
  color: #333;
  font-weight: 600;
  padding-left: 12px;
  position: relative;
  margin-left: 15px;
  margin-bottom: 10px;
}

.create-name::before {
  content: ' ';
  position: absolute;
  top: 0;
  left: 0;
  height: 14px;
  border-radius: 2px;
  width: 4px;
  background-color: $xr-color-primary;
}

.crm-create-body {
  flex: 1;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 10px;
}

.handle-bar {
  position: relative;
  bottom: 0;
  right: 0;
  .handle-button {
    float: right;
    margin-top: 5px;
    margin-right: 20px;
  }
}

.content-body {
  height: calc(100% - 30px);
  // min-height: 250px;
  padding: 10px 20px 30px;
  overflow-y: auto;
}

.b-cell-b {
  width: auto;
  padding: 8px 0;
  .b-cell-name {
    width: 100px;
    margin-right: 10px;
    margin-bottom: 10px;
    font-size: 13px;
    flex-shrink: 0;
    color: #777;
  }
  .b-cell-value {
    font-size: 13px;
    color: #333;
    line-height: 1.2;
    white-space: pre-wrap;
    word-wrap: break-word;
    word-break: break-all;
  }
}

.el-icon-remove {
  color: #ff6767;
  cursor: pointer;
  margin-left: 2px;
  display: none;
}

.date-item:hover {
  .el-icon-remove {
    display: inline;
  }
}

.row-set {
  line-height: 50px;
}

.time-rank {
  line-height: 40px;
}

.date-wrap {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.student-wrap {
  position: relative;
}

/deep/ .el-table--border {
  border: 1px solid #EBEEF5;
}

/deep/ .el-dialog {
  width: 580px;
}
</style>


