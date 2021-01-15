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
          <span v-if="item.prop == 'name'">{{ scope.row.name }}</span>
          <span v-else>{{ scope.row[item.prop].id }}</span>


        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  // 按天显示--行合并
  name: 'DayTable',
  data() {
    return {
      border: true,
      loading: false,
      tableHeight: document.documentElement.clientHeight - 306, // 表的高度
      list: [
        { name: '李艳', t1: { id: 1 }, t2: { id: 2 }, t3: { id: 2 }, t4: { id: 3 }, t5: { id: 2 }, t6: { id: 4 }, t7: { id: 2 }, t8: { id: 2 }, t9: { id: 2 }, t10: { id: 2 }, t11: { id: 2 }, t12: { id: 2 }, t13: { id: 2 }, t14: { id: 2 }, t15: { id: 2 }}
      ],
      fieldLists: [
        { prop: 'name', label: ' ' },
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
      arrColumn: [],
      position: 0
    }
  },
  created() {
    this.getWillMergeColumns()
  },
  methods: {
    getWillMergeColumns() {
      // 源数据
      const list = this.list[0]
      // 对象所有的key集合
      const keyList = Object.keys(list)
      keyList.forEach((key, index) => {
        if (key == 'name') {
          this.arrColumn.push(1)
          this.position = 0
        } else {
          if (key == 't1') {
            this.arrColumn.push(1)
            this.position = 0
          } else {
            if (list[key].id == list[keyList[index - 1]].id) {
              this.arrColumn[this.position] += 1
              this.arrColumn.push(0)
            } else {
              this.arrColumn.push(1)
              this.position = index
            }
          }
        }
      })
    },
    mergeRow({ row, column, rowIndex, columnIndex }) {
      // 按天实行行合并
      if (rowIndex === 0) {
        const dcolumn = this.arrColumn[columnIndex]
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

</style>
