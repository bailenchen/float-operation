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
                      end: '19:00'
                    }"
                    placeholder="起始时间"
                    @change="changeTime"/>
                  至
                  <el-time-select
                    v-model="endTime"
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
            </div>
          </div>
        </create-sections>
        <create-sections title="学员名称" class="student-wrap">
          <!-- 添加学员 -->
          <el-popover
            v-model="showPopover"
            placement="right"
            width="700"
            trigger="click">
            <crm-relative
              v-if="showSelectView"
              ref="crmrelative"
              :show-types="showTypes"
              crm-type="student"
              @close="showPopover=false"
              @changeCheckout="checkInfos"/>
            <el-button
              slot="reference"
              type="primary"
              size="mini"
              class="add-customer"
              @click.native="contentClick">添加学员</el-button>
          </el-popover>
          <div class="crm-create-body" style="margin-top:10px;">
            <div class="content create-sections-content">
              <!-- 已勾选数据列表 -->
              <div style="line-height:25px;">已勾选的数据</div>
              <el-table
                id="crm-table"
                :row-height="40"
                :data="addedList"
                :height="300"
                class="n-table--border"
                use-virtual
                stripe
                border
                highlight-current-row
                style="width: 100%">
                <el-table-column
                  v-for="(item, index) in fieldLists"
                  :key="index"
                  :fixed="index==0"
                  :prop="item.prop"
                  :label="item.label"
                  :width="item.width"
                  align="center"
                  show-overflow-tooltip>
                  <template slot-scope="scope">
                    {{ scope.row[item.prop] }}
                  </template>
                </el-table-column>
                <el-table-column fixed="right" width="110" align="center" label="操作">
                  <template slot-scope="scope">
                    <el-button @click="deleteAddItem(scope.$index)">删除</el-button>
                  </template>
                </el-table-column>
                <el-table-column/>
              </el-table>
              <!-- 列表顶部信息 -->
              <flexbox
                :gutter="0"
                align="stretch"
                wrap="wrap"
                style="padding: 10px 8px;">
                <flexbox-item
                  v-for="(item, index) in stuInfoList"
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
              <!-- 列表信息 -->
              <el-table
                id="crm-table"
                :row-height="40"
                :data="list"
                :height="350"
                class="n-table--border"
                use-virtual
                stripe
                border
                highlight-current-row
                style="width: 100%"
                @selection-change="handleSelectionChange">
                <el-table-column
                  show-overflow-tooltip
                  type="selection"
                  align="center"
                  width="55"/>
                <el-table-column
                  v-for="(item, index) in fieldLists"
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
import CrmRelative from '@/components/CreateCom/CrmRelative'
import { getDateStr } from '@/utils/dateDiff'
import moment from 'moment'

import { crmClassContractIndext, crmClassRankCourse } from '@/api/educationmanage/class'
import { objDeepCopy } from '@/utils'

export default {
  name: 'RankCourse',
  components: {
    CreateView,
    CreateSections,
    CrmRelative
  },
  props: {
    // 操作数据
    selectionList: {
      type: Array,
      default: () => {
        return []
      }
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

      stuObj: {
        deptName: '所在校区',
        leadsNumber: '学员编号',
        customerName: '学员姓名',
        gradeName: '年级',
        school: '就读学校',
        contractStatus: '状态',
        ownerUserName: '教育顾问',
        headmasterUserName: '班主任'
      },
      stuInfoList: [],

      // 时间段
      startTime: '08:00',
      endTime: '10:00',

      // 当前添加的日期
      currentAddDate: '',
      currentAddDateTime: '',

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

      // 已勾选数据
      addedList: [],

      // 学员合同表
      list: [],
      fieldLists: [
        { prop: 'num', label: '合同编号' },
        { prop: 'isnew', label: '合同属性' },
        { prop: 'coachType', label: '合同类型' },
        { prop: 'orderDate', label: '签约日期' },
        { prop: 'isGive', label: '是否赠送' },
        { prop: 'subjectName', label: '科目' },
        { prop: 'sumCourse', label: '课次' },
        { prop: 'alreadyCourse', label: '已排课次' },
        { prop: 'notArranged', label: '未排课次' },
        { prop: 'finishCourse', label: '已完成课次' }
      ],

      showPopover: false,
      showSelectView: false,
      showTypes: [],
      addStuCustomerId: null,

      // 当勾选发生变化时是否执行
      isExecute: true
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
    for (const key in this.fieldObj) {
      if (Object.hasOwnProperty.call(this.fieldObj, key)) {
        const element = this.fieldObj[key]
        this.baseInfoList.push({
          name: element,
          value: this.selectionList[0][key]
        })
      }
    }
  },
  methods: {
    hidenView() {
      this.$emit('hiden-view', 'schedule')
    },

    contentClick() {
      this.showSelectView = true
    },

    /** 选中 */
    checkInfos(seldata) {
      const data = seldata.data
      if (data && data.length) {
        this.getContractList(data[0].customerId)
      }
      console.log('kkkk', data)
    },

    // 添加学员并获取对应的合同
    getContractList(id) {
      this.stuInfoList = []
      this.list = []
      this.isExecute = false // 此时阻止勾选自动执行
      crmClassContractIndext({ customerId: id }).then(res => {
        const stuInfo = res.data
        this.addStuCustomerId = stuInfo.customerId
        this.resetDataByCustomerId(this.addStuCustomerId)
        for (const key in this.stuObj) {
          if (Object.hasOwnProperty.call(this.stuObj, key)) {
            const element = this.stuObj[key]
            this.stuInfoList.push({
              name: element,
              value: stuInfo[key]
            })
          }
        }
        this.list = res.data.list
        this.isExecute = true
      }).catch((err) => {
        this.isExecute = true
        console.log(err)
      })
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
      if (this.currentAddDateTime.length) {
        let week = weeks
        if (this.dateList.length) {
          week = weeks - 1
        }
        if (this.markWeek) {
          this.dateList.length = this.dateList.length - (this.markWeek - 1)
        }
        this.markWeek = weeks
        // 待连排的所有日期 this.currentAddDateTime
        if (this.currentAddDate && this.currentAddDateTime.length) {
          for (let index = 0; index < this.currentAddDateTime.length; index++) {
            const element = this.currentAddDateTime[index].slice(0, 10)

            var day = new Date(element)
            for (let index = 0; index < week; index++) {
              day.setDate(day.getDate() + 7)
              const newdate = moment(day).format('YYYY-MM-DD')
              this.dateList.push(`${newdate} ${this.startTime}~${this.endTime}`)
            }
          }
        }
      }
    },

    // 清除
    clearWeek() {
      this.weeks = null
      this.dateList = []
      this.markWeek = null
    },

    // 删除日期
    deleteDate(index) {
      this.dateList.splice(index, 1)
    },

    // 选择日期
    selectDate() {
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
      // 与已经添加的日期时间比较 获取重复的数据
      this.currentAddRepeatDateTime = this.outRepeat(totalDate)
      // 过滤重复的日期
      this.dateList = Array.from(new Set(totalDate))
      console.log(comDate, 'bbjjjj')
      // 去掉重复的日期，显示在上课日期栏里
      this.showCurrentDate(this.currentAddRepeatDateTime)
      console.log(this.dateList, 'bbbbbb')
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
    },

    // 勾选同时去重
    handleSelectionChange(data) {
      if (this.isExecute) {
        this.resetDataByCustomerId(this.addStuCustomerId)
        this.addedList.push(...data)
        this.addedList = this.arrayObjRepeat(this.addedList, 'rId')
      }
    },

    // 每次勾选都重置customerId一样的数据
    resetDataByCustomerId(id) {
      console.log(this.addedList, 'hhhhhh')
      this.addedList = this.addedList.filter(item => {
        return item.customerId !== id
      })
      console.log(this.addedList, 'hhhhhh')
    },

    // 数组对象去重
    arrayObjRepeat(list, id) {
      if (list.length) {
        const hash = {}
        const newList = list.reduce((preVal, curVal) => {
          hash[curVal[id]] ? '' : hash[curVal[id]] = true && preVal.push(curVal)
          return preVal
        }, [])
        return newList
      }
      return []
    },

    // 删除已添加的数据
    deleteAddItem(index) {
      this.addedList.splice(index, 1)
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
          timeSlot: `${item.slice(11, -6)}:00-${item.slice(17)}:00`,
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
  .add-customer {
    position: absolute;
    top: 0;
    right: 20px;
  }
}

/deep/ .el-table--border {
  border: 1px solid #EBEEF5;
}

/deep/ .el-dialog {
  width: 580px;
}
</style>


