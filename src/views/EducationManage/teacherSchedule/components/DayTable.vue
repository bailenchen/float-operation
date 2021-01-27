<template>
  <div>
    <el-table
      id="crm-table"
      :data="list"
      :height="tableHeight"
      :span-method="mergeRow"
      :border="border"
      class="n-table--border"
      stripe
      highlight-current-row
      style="width: 100%">
      <el-table-column
        v-for="(item, index) in fieldLists"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        min-width="200"
        align="center"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="item.prop == 'realname'">
            <span>{{ scope.row.realname }} </span><br>
            <span class="blue click" @click="openClass(index)">开班</span>
          </div>
          <div v-else-if="scope.row[item.prop].batchId">
            <span class="red">{{ scope.row[item.prop].coachType }}</span><br>
            <span style="color:#00CC76;">{{ scope.row[item.prop].gradeName }}</span>
            <span class="blue">{{ scope.row[item.prop].subjectName }}</span>
            <span v-if="scope.row[item.prop].batchId && education.classschedule && education.classschedule.shifts" class="blue click" @click="handle('shift',scope.row[item.prop])">[换挡]</span>
            <span v-if="scope.row[item.prop].batchId && education.class && education.class.course" class="blue click" @click="handle('rank',scope.row[item.prop])">[排课]</span>
            <span
              v-if="scope.row[item.prop].batchId && education.classschedule && education.classschedule.insert"
              class="blue click"
              @click="handle('insert',scope.row[item.prop])">
              [插班]
            </span><br>
            <span v-if="scope.row[item.prop].customers.length">
              【 <span v-for="(ite,idx) in scope.row[item.prop].customers" :key="idx">
                {{ ite.customerName }}
                <span v-if="ite.classStatusType">(</span>
                <span
                  v-if="ite.classStatusType"
                  :class="{'green': ite.classStatusType === '请假' || ite.classStatusType === '出勤'}">
                  {{ ite.classStatusType }}
                </span>
                <span v-if="ite.isShiftIn == 1" class="red">临时插班</span>
                <span v-if="ite.classStatusType">)</span>
              </span>】
            </span>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 排课 -->
    <rank-course
      v-if="isRank"
      :selection-list="currentInfo"
      :type="type"
      crm-type="teacher"
      @save-success="createSaveSuccess"
      @hiden-view="hideView"/>

    <!-- 插班 -->
    <insert-class
      v-if="isInsert"
      :type="type"
      :selection-list="currentInfo"
      crm-type="teacher"
      @save-success="createSaveSuccess"
      @hiden-view="hideView"/>

    <!-- 换挡 -->
    <shift-handle
      v-if="isShift"
      :type="type"
      :selection-list="currentInfo"
      crm-type="teacher"
      @save-success="createSaveSuccess"
      @hiden-view="hideView"/>

  </div>
</template>

<script>
import { crmTeacherSchduleQueryByDay } from '@/api/educationmanage/teacherSchedule'
import create from './create'
import {
  mapGetters
} from 'vuex'
export default {
  // 按天显示--行合并
  name: 'DayTable',
  mixins: [create],
  data() {
    return {
      border: true,
      tableHeight: document.documentElement.clientHeight - 306, // 表的高度
      list: [],
      firstColumnId: [],
      fieldTime: {
        t1: '08:00:00',
        t2: '09:00:00',
        t3: '10:00:00',
        t4: '11:00:00',
        t5: '12:00:00',
        t6: '13:00:00',
        t7: '14:00:00',
        t8: '15:00:00',
        t9: '16:00:00',
        t10: '17:00:00',
        t11: '18:00:00',
        t12: '19:00:00',
        t13: '20:00:00',
        t14: '21:00:00',
        t15: '22:00:00',
        t16: '23:00:00',
        t17: '24:00:00'
      },
      fieldLists: [
        { prop: 'realname', label: ' ' },
        { prop: 't1', label: '08:00-9:00' },
        { prop: 't2', label: '09:00-10:00' },
        { prop: 't3', label: '10:00-11:00' },
        { prop: 't4', label: '11:00-12:00' },
        { prop: 't5', label: '12:00-13:00' },
        { prop: 't6', label: '13:00-14:00' },
        { prop: 't7', label: '14:00-15:00' },
        { prop: 't8', label: '15:00-16:00' },
        { prop: 't9', label: '16:00-17:00' },
        { prop: 't10', label: '17:00-18:00' },
        { prop: 't11', label: '18:00-19:00' },
        { prop: 't12', label: '19:00-20:00' },
        { prop: 't13', label: '20:00-21:00' },
        { prop: 't14', label: '21:00-22:00' },
        { prop: 't15', label: '22:00-23:00' },
        { prop: 't16', label: '23:00-24:00' }
      ],

      type: 'day',

      // 合并标记相关
      objRow: {}
    }
  },
  computed: {
    ...mapGetters(['education'])
  },
  created() {
  },
  methods: {
    getWillMergeColumns() {
      this.list = []
      this.objRow = {}
      const params = {
        types: 1,
        ...this.$parent.form
      }
      crmTeacherSchduleQueryByDay(params).then(res => {
        this.list = this.handleResData(res.data)
        const list = this.list
        // console.log(JSON.parse(JSON.stringify(list)))
        // 对象所有的key集合
        for (let indexs = 0; indexs < list.length; indexs++) {
          const element = list[indexs]
          const keyList = Object.keys(element)
          keyList.forEach((key, index) => {
            if (key == 'realname') {
              this.objRow[indexs] = {
                arrColumn: [],
                position: 0
              }
              this.objRow[indexs].arrColumn.push(1)
              this.objRow[indexs].position = 0
            } else {
              if (key == 't1') {
                this.objRow[indexs].arrColumn.push(1)
                this.objRow[indexs].position = 0
              } else {
                if (element[key].batchId && element[keyList[index - 1]].batchId && (element[key].batchId == element[keyList[index - 1]].batchId)) {
                  this.objRow[indexs].arrColumn[key == 't2' ? this.objRow[indexs].position += 1 : this.objRow[indexs].position] += 1
                  this.objRow[indexs].arrColumn.push(0)
                } else {
                  this.objRow[indexs].arrColumn.push(1)
                  this.objRow[indexs].position = index
                }
              }
            }
          })
        }
        this.$emit('close-loading')
      }).catch(() => {
        this.$emit('close-loading')
      })
    },

    handleResData(list) {
      this.firrstColumnId = []
      const newList = []
      for (let indexs = 0; indexs < list.length; indexs++) {
        const item = list[indexs]
        this.firstColumnId.push({
          userId: item.userId,
          realname: item.realname
        })
        const newitem = { realname: `[${item.subjectName}] ${item.realname}` }
        const keys = Object.keys(this.fieldTime)
        for (let indexs = 0; indexs < keys.length; indexs++) {
          const key = keys[indexs]
          const elements = this.fieldTime[key]
          for (let sindex = 0; sindex < item.data.length; sindex++) {
            const selement = item.data[sindex]
            if (elements == selement.timeSlotStart) {
              newitem[key] = selement
            }
          }
          if (!newitem[key]) {
            newitem[key] = {}
          }
        }
        newList.push(newitem)
      }
      return newList
    },
    mergeRow({ row, column, rowIndex, columnIndex }) {
      // 按天实行行合并
      if (this.objRow[rowIndex]) {
        const dcolumn = this.objRow[rowIndex].arrColumn[columnIndex]
        const drow = dcolumn > 0 ? 1 : 0
        return {
          rowspan: drow,
          colspan: dcolumn
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.blue {
  color:#0000FF;
}

.red {
  color: red;
}

.click {
  cursor: pointer;
}

.green {
  color: #70B603;
}
</style>
