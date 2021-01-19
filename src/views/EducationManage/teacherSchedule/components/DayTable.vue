<template>
  <div>
    <el-table
      v-loading="loading"
      id="crm-table"
      :row-height="40"
      :data="list"
      :height="tableHeight"
      :span-method="mergeRow"
      :border="border"
      class="n-table--border"
      use-virtual
      stripe
      highlight-current-row
      style="width: 100%"
      @row-click="handleRowClick">
      <el-table-column
        v-for="(item, index) in fieldLists"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        min-width="100"
        align="center"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <div v-if="item.prop == 'realname'">{{ scope.row.realname }}</div>
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
    </el-table>
  </div>
</template>

<script>
import { crmTeacherSchduleQueryByDay } from '@/api/educationmanage/teacherSchedule'
export default {
  // 按天显示--行合并
  name: 'DayTable',
  data() {
    return {
      border: true,
      loading: false,
      tableHeight: document.documentElement.clientHeight - 306, // 表的高度
      list: [
        { realname: '李艳', t1: { id: 1 }, t2: { id: 2 }, t3: { id: 2 }, t4: { id: 3 }, t5: { id: 2 }, t6: { id: 4 }, t7: { id: 2 }, t8: { id: 2 }, t9: { id: 2 }, t10: { id: 2 }, t11: { id: 2 }, t12: { id: 2 }, t13: { id: 2 }, t14: { id: 2 }, t15: { id: 2 }}
      ],
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
        t14: '补1小时A',
        t15: '补1小时B'
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
        { prop: 't14', label: '补1小时A' },
        { prop: 't15', label: '补1小时B' }
      ],

      // 合并标记相关
      objRow: {}
    }
  },
  created() {
    this.getWillMergeColumns()
  },
  methods: {
    getWillMergeColumns() {
      this.loading = true
      const params = {
        types: 1,
        time: '2021-1-18',
        ...this.form
      }
      crmTeacherSchduleQueryByDay(params).then(res => {
        this.list = this.handleResData(res.data)
        const list = this.list
        console.log(JSON.parse(JSON.stringify(list)))
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
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },

    handleResData(list) {
      const newList = []
      for (let indexs = 0; indexs < list.length; indexs++) {
        const item = list[indexs]
        const newitem = { realname: item.realname }
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
