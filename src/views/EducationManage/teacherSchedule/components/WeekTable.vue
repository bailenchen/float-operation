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
          <span v-if="item.prop == 'name'">{{ scope.row.name }}</span>
          <span v-else-if="item.prop == 'time'">{{ scope.row.time }}</span>
          <span v-else>{{ scope.row[item.prop].id }}</span>
        </template>
      </el-table-column>
      <el-table-column/>
    </el-table>
  </div>
</template>

<script>
export default {
  // 按周显示--列合并
  name: 'WeekTable',
  data() {
    return {
      loading: false,
      tableHeight: document.documentElement.clientHeight - 306, // 表的高度
      list: [
        { t1: { id: 1 }, t2: { id: 1 }, t3: { id: 1 }, t4: { id: 1 }, t5: { id: 1 }, t6: { id: 1 }, t7: { id: 1 }},
        { t1: { id: 1 }, t2: { id: 1 }, t3: { id: 1 }, t4: { id: 1 }, t5: { id: 1 }, t6: { id: 1 }, t7: { id: 1 }},
        { t1: { id: 1 }, t2: { id: 1 }, t3: { id: 1 }, t4: { id: 1 }, t5: { id: 1 }, t6: { id: 1 }, t7: { id: 1 }},
        { t1: { id: 1 }, t2: { id: 1 }, t3: { id: 1 }, t4: { id: 1 }, t5: { id: 7 }, t6: { id: 1 }, t7: { id: 1 }},
        { t1: { id: 5 }, t2: { id: 1 }, t3: { id: 1 }, t4: { id: 1 }, t5: { id: 1 }, t6: { id: 1 }, t7: { id: 1 }},
        { t1: { id: 1 }, t2: { id: 1 }, t3: { id: 1 }, t4: { id: 9 }, t5: { id: 1 }, t6: { id: 1 }, t7: { id: 4 }},
        { t1: { id: 1 }, t2: { id: 3 }, t3: { id: 1 }, t4: { id: 1 }, t5: { id: 1 }, t6: { id: 2 }, t7: { id: 1 }},
        { t1: { id: 1 }, t2: { id: 1 }, t3: { id: 5 }, t4: { id: 1 }, t5: { id: 1 }, t6: { id: 1 }, t7: { id: 1 }},
        { t1: { id: 2 }, t2: { id: 1 }, t3: { id: 1 }, t4: { id: 1 }, t5: { id: 1 }, t6: { id: 1 }, t7: { id: 1 }},
        { t1: { id: 1 }, t2: { id: 1 }, t3: { id: 1 }, t4: { id: 1 }, t5: { id: 1 }, t6: { id: 1 }, t7: { id: 1 }},
        { t1: { id: 1 }, t2: { id: 1 }, t3: { id: 1 }, t4: { id: 1 }, t5: { id: 1 }, t6: { id: 5 }, t7: { id: 1 }},
        { t1: { id: 1 }, t2: { id: 4 }, t3: { id: 1 }, t4: { id: 1 }, t5: { id: 1 }, t6: { id: 1 }, t7: { id: 1 }},
        { t1: { id: 1 }, t2: { id: 1 }, t3: { id: 1 }, t4: { id: 1 }, t5: { id: 1 }, t6: { id: 1 }, t7: { id: 1 }},
        { t1: { id: 1 }, t2: { id: 1 }, t3: { id: 1 }, t4: { id: 1 }, t5: { id: 1 }, t6: { id: 1 }, t7: { id: 1 }},
        { t1: { id: 1 }, t2: { id: 1 }, t3: { id: 1 }, t4: { id: 1 }, t5: { id: 1 }, t6: { id: 1 }, t7: { id: 1 }}
      ],
      fieldLists: [
        { prop: 'name', label: '' },
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

      // 合并标记相关
      arrObj: {
        'name': {
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
    this.getWillMergeRows()
  },
  methods: {
    getWillMergeRows() {
      this.list = this.list.map((item, index) => {
        item.name = '李艳'
        item['time'] = this.periodObj[index]
        return item
      })
      const keyList = Object.keys(this.arrObj)
      this.list.forEach((item, bindex) => {
        keyList.forEach((key, sindex) => {
          this.markIsMerge(item, key, sindex, bindex)
        })
      })
    },

    markIsMerge(data, key, index, bindex) {
      if (key == 'name') {
        this.collecMark(key, bindex, 'name')
      } else if (['t1', 't2', 't3', 't4', 't5', 't6', 't7'].includes(key)) {
        this.collecMark(key, bindex, 'id')
      }
    },

    collecMark(key, bindex, keyType) {
      if (bindex == 0) {
        this.arrObj[key].arrRow.push(1)
        this.arrObj[key].position = 0
      } else {
        const condition = key == 'name' ? this.list[bindex][keyType] == this.list[bindex - 1][keyType]
          : this.list[bindex][key][keyType] == this.list[bindex - 1][key][keyType]
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
        0: 'name',
        2: 't1',
        3: 't2',
        4: 't3',
        5: 't4',
        6: 't5',
        7: 't6',
        8: 't7'
      }[columnIndex]
      if (['name', 't1', 't2', 't3', 't4', 't5', 't6', 't7'].includes(key)) {
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

</style>
