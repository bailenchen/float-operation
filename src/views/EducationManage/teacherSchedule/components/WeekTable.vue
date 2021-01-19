<template>
  <div>
    <el-table
      v-loading="loading"
      id="crm-table"
      :row-height="40"
      :data="list"
      :span-method="mergeColumn"
      :height="tableHeight"
      class="n-table--border"
      use-virtual
      stripe
      border
      highlight-current-row
      style="width: 100%"
      @row-click="handleRowClick">
      <el-table-column
        v-for="(item, index) in fieldLists"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        min-width="100"
        align="center"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="item.prop == 'realname'">{{ scope.row.realname }}</div>
          <div v-else-if="item.prop == 'time'">{{ scope.row.time }}</div>
          <div v-else-if="scope.row[item.prop].batchId">
            <span class="red">{{ scope.row[item.prop].coachType }}</span><br>
            <span style="color:#00CC76;">{{ scope.row[item.prop].gradeName }}</span>
            <span class="blue">{{ scope.row[item.prop].subjectName }}</span>
            <span class="blue click">[换挡]</span>
            <span class="blue click">[排课]</span>
            <span class="blue click">[插班]</span>
          </div>
          <div v-else class="blue">开班</div>
        </template>
      </el-table-column>
      <el-table-column/>
    </el-table>
  </div>
</template>

<script>
import { crmTeacherSchduleQueryByDay } from '@/api/educationmanage/teacherSchedule'
export default {
  // 按周显示--列合并
  name: 'WeekTable',
  data() {
    return {
      loading: false,
      tableHeight: document.documentElement.clientHeight - 306, // 表的高度
      list: [
        // { t1: { id: 1 }, t2: { id: 1 }, t3: { id: 1 }, t4: { id: 1 }, t5: { id: 1 }, t6: { id: 1 }, t7: { id: 1 }},
        // { t1: { id: 1 }, t2: { id: 1 }, t3: { id: 1 }, t4: { id: 1 }, t5: { id: 1 }, t6: { id: 1 }, t7: { id: 1 }},
        // { t1: { id: 1 }, t2: { id: 1 }, t3: { id: 1 }, t4: { id: 1 }, t5: { id: 1 }, t6: { id: 1 }, t7: { id: 1 }},
        // { t1: { id: 1 }, t2: { id: 1 }, t3: { id: 1 }, t4: { id: 1 }, t5: { id: 7 }, t6: { id: 1 }, t7: { id: 1 }},
        // { t1: { id: 5 }, t2: { id: 1 }, t3: { id: 1 }, t4: { id: 1 }, t5: { id: 1 }, t6: { id: 1 }, t7: { id: 1 }},
        // { t1: { id: 1 }, t2: { id: 1 }, t3: { id: 1 }, t4: { id: 9 }, t5: { id: 1 }, t6: { id: 1 }, t7: { id: 4 }},
        // { t1: { id: 1 }, t2: { id: 3 }, t3: { id: 1 }, t4: { id: 1 }, t5: { id: 1 }, t6: { id: 2 }, t7: { id: 1 }},
        // { t1: { id: 1 }, t2: { id: 1 }, t3: { id: 5 }, t4: { id: 1 }, t5: { id: 1 }, t6: { id: 1 }, t7: { id: 1 }},
        // { t1: { id: 2 }, t2: { id: 1 }, t3: { id: 1 }, t4: { id: 1 }, t5: { id: 1 }, t6: { id: 1 }, t7: { id: 1 }},
        // { t1: { id: 1 }, t2: { id: 1 }, t3: { id: 1 }, t4: { id: 1 }, t5: { id: 1 }, t6: { id: 1 }, t7: { id: 1 }},
        // { t1: { id: 1 }, t2: { id: 1 }, t3: { id: 1 }, t4: { id: 1 }, t5: { id: 1 }, t6: { id: 5 }, t7: { id: 1 }},
        // { t1: { id: 1 }, t2: { id: 4 }, t3: { id: 1 }, t4: { id: 1 }, t5: { id: 1 }, t6: { id: 1 }, t7: { id: 1 }},
        // { t1: { id: 1 }, t2: { id: 1 }, t3: { id: 1 }, t4: { id: 1 }, t5: { id: 1 }, t6: { id: 1 }, t7: { id: 1 }},
        // { t1: { id: 1 }, t2: { id: 1 }, t3: { id: 1 }, t4: { id: 1 }, t5: { id: 1 }, t6: { id: 1 }, t7: { id: 1 }},
        // { t1: { id: 1 }, t2: { id: 1 }, t3: { id: 1 }, t4: { id: 1 }, t5: { id: 1 }, t6: { id: 1 }, t7: { id: 1 }}
      ],
      fieldLists: [
        { prop: 'realname', label: '' },
        { prop: 'time', label: '' },
        { prop: 't1', label: '一' },
        { prop: 't2', label: '二' },
        { prop: 't3', label: '三' },
        { prop: 't4', label: '四' },
        { prop: 't5', label: '五' },
        { prop: 't6', label: '六' },
        { prop: 't7', label: '日' }
      ],



      // 时间段
      periodObj: {
        0: '08:00-9:00',
        1: '09:00-10:00',
        2: '10:00-11:00',
        3: '11:00-12:00',
        4: '12:00-13:00',
        5: '13:00-14:00',
        6: '14:00-15:00',
        7: '15:00-16:00',
        8: '16:00-17:00',
        9: '17:00-18:00',
        10: '18:00-19:00',
        11: '19:00-20:00',
        12: '20:00-21:00',
        13: '补1小时A',
        14: '补1小时B'
      },

      startTime: {
        0: '08:00:00',
        1: '09:00:00',
        2: '10:00:00',
        3: '11:00:00',
        4: '12:00:00',
        5: '13:00:00',
        6: '14:00:00',
        7: '15:00:00',
        8: '16:00:00',
        9: '17:00:00',
        10: '18:00:00',
        11: '19:00:00',
        12: '20:00:00',
        13: '补1小时A',
        14: '补1小时B'
      },

      timeDate: {
        t1: '',
        t2: '',
        t3: '',
        t4: '',
        t5: '',
        t6: '',
        t7: ''
      },

      // 合并标记相关
      arrObj: {
        'realname': {
          arrRow: [],
          position: 0
        },
        'time': {
          arrRow: [],
          position: 0
        },
        't1': {
          arrRow: [],
          position: 0
        },
        't2': {
          arrRow: [],
          position: 0
        },
        't3': {
          arrRow: [],
          position: 0
        },
        't4': {
          arrRow: [],
          position: 0
        },
        't5': {
          arrRow: [],
          position: 0
        },
        't6': {
          arrRow: [],
          position: 0
        },
        't7': {
          arrRow: [],
          position: 0
        }
      }

    }
  },
  created() {
    const dateRange = this.$parent.everyDay.split(',')
    for (let index = 0; index < dateRange.length; index++) {
      const element = dateRange[index]
      this.timeDate['t' + (index + 1)] = element
    }
    this.getWillMergeRows()
  },
  methods: {
    getWillMergeRows() {
      const params = {
        time: '2021-1-18',
        ...this.form
      }
      crmTeacherSchduleQueryByDay(params).then(res => {
        this.list = this.handleResData(res.data)
        const keyList = Object.keys(this.arrObj)
        this.list = this.list.map((item, bindex) => {
          keyList.forEach((key, sindex) => {
            this.markIsMerge(item, key, sindex, bindex)
          })
          return item
        })
        console.log(this.list, 'xxx123xx')
        console.log(this.arrObj, 'bbbbbbbbbb')
      }).catch(() => {})
    },

    handleResData(list) {
      const newList = []
      for (let index = 0; index < list.length; index++) {
        const element = list[index]
        const inList = element.data
        for (const rowkey in this.startTime) {
          if (Object.hasOwnProperty.call(this.startTime, rowkey)) { // 每条用户数据生成15行数据row
            const val = this.startTime[rowkey]
            const newitem = { realname: element.realname, time: this.periodObj[rowkey] }
            for (let indexs = 0; indexs < inList.length; indexs++) { // 循环每个时间段
              const item = inList[indexs]
              for (const key in this.timeDate) {
                if (Object.hasOwnProperty.call(this.timeDate, key)) {
                  const time = this.timeDate[key]

                  if (item.timeSlotStart && item.timeSlotStart === val) {
                    const sList = item.data
                    for (let sindex = 0; sindex < sList.length; sindex++) {
                      const sitem = sList[sindex]
                      if (sitem.classTime.includes(time)) {
                        newitem[key] = sitem
                      }
                    }

                    if (!newitem[key]) {
                      newitem[key] = {}
                    }
                  }

                  if (!newitem[key]) {
                    newitem[key] = {}
                  }
                }
              }
            }
            newList.push(newitem)
          }
        }
      }
      console.log(JSON.parse(JSON.stringify(newList)), 'xx456')
      return newList
    },

    markIsMerge(data, key, index, bindex) {
      if (key == 'realname') {
        this.collecMark(key, bindex, 'realname')
      } else if (key == 'time') {
        this.collecMark(key, bindex, 'time')
      } else if (['t1', 't2', 't3', 't4', 't5', 't6', 't7'].includes(key)) {
        this.collecMark(key, bindex, 'batchId')
      }
    },

    collecMark(key, bindex, keyType) {
      if (bindex == 0) {
        this.arrObj[key].arrRow.push(1)
        this.arrObj[key].position = 0
      } else {
        let condition = false
        if (key == 'realname' || key == 'time') {
          condition = this.list[bindex][keyType] == this.list[bindex - 1][keyType]
        } else {
          condition = this.list[bindex][key][keyType] && this.list[bindex - 1][key][keyType] && this.list[bindex][key][keyType] == this.list[bindex - 1][key][keyType]
          // debugger
        }
        if (condition) {
          this.arrObj[key].arrRow[this.arrObj[key].position] += 1
          this.arrObj[key].arrRow.push(0)
        } else {
          this.arrObj[key].arrRow.push(1)
          this.arrObj[key].position = bindex
        }
      }
    },
    // 主要合并列
    mergeColumn({ row, column, rowIndex, columnIndex }) {
      const key = {
        0: 'realname',
        1: 'time',
        2: 't1',
        3: 't2',
        4: 't3',
        5: 't4',
        6: 't5',
        7: 't6',
        8: 't7'
      }[columnIndex]
      if (['realname', 'time', 't1', 't2', 't3', 't4', 't5', 't6', 't7'].includes(key)) {
        const drow = this.arrObj[key].arrRow[rowIndex]
        const dcolimn = drow > 0 ? 1 : 0
        return {
          rowspan: drow,
          colspan: dcolimn
        }
      }
    },
    handleRowClick() {

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
</style>
