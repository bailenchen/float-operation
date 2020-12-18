<template>
  <div class="present-wrap">
    <el-table
      :data="tableData"
      :span-method="objectSpanMethod"
      style="width: 100%; margin: 0 auto">
      <el-table-column
        v-for="(item, index) in fields"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        align="center">
        <template slot-scope="scope">
          <template v-if="item.prop == 'subject'">
            <el-select v-model="scope.row.subject" placeholder="请选择">
              <el-option
                v-for="subjectItem in subjectList"
                :key="subjectItem.value"
                :label="subjectItem.subjectName"
                :value="subjectItem.id"
              />
            </el-select>
          </template>
          <template v-else-if="item.prop == 'grooveLesson'">
            <el-input v-model="scope.row.grooveLesson" type="number" @change="changeLesson(scope.row, `purchaseLesson`, `originalPurchaseLesson`)"/>
          </template>
          <template v-else>
            {{ scope.row[item.prop] }}
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="" label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-plus" circle @click="plusSubjectHandle(scope.row.dataIndex)" />
          <el-button v-show="tableData.length>1" type="danger" icon="el-icon-minus" circle @click="minusSubjectHandle(scope.row.dataIndex)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { QueryAdminSubject } from '@/api/systemManagement/params'

export default {
  props: {
    index: Number,
    action: {
      type: Object,
      default: () => {
        return {}
      }
    },
    value: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      fields: [
        {
          label: '科目',
          prop: 'subject'
          // width: 100
        },
        {
          label: '赠送课次',
          prop: 'grooveLesson'
          // width: 100
        },
        {
          label: '已排课课次',
          prop: 'planeLesson'
          // width: 100
        },
        {
          label: '已完成课次',
          prop: 'completeLesson'
          // width: 100
        },
        {
          label: '折扣（%）',
          prop: 'discount'
          // width: 100
        }
      ],
      dataIndex: 0,
      tableData: [
        {
          subject: '',
          grooveLesson: 0,
          planeLesson: 0,
          completeLesson: 0,
          discount: 0,
          dataIndex: 0
        }
      ],
      subjectList: null,
      lessons: 0, // 该额外赠送合同总课次
      OrderLeve1Arr: []
    }
  },
  watch: {
    value: {
      handler(val) {
        console.log('val', val)
        if (val) {
          console.log('使用value的值代替table', val)
          this.structureDataByValue()
        }
      },
      deep: true,
      immediate: true
    }

  },
  created() {
    // 获取科目
    QueryAdminSubject().then(res => {
      this.subjectList = res.data
    }).catch(() => {})
    this.dataIndex = this.tableData.length
  },
  methods: {
    structureDataByValue() {
      var arr = []
      var dataIndex = 0
      this.value.forEach(item => {
        var obj = {
          subject: item.productId,
          grooveLesson: item.courseSum,
          planeLesson: item.alreadyCourse,
          completeLesson: item.finishCourse,
          discount: item.discountRate,
          dataIndex
        }
        dataIndex++
        arr.push(obj)
      })

      this.dataIndex = dataIndex

      this.tableData = arr
    },
    plusSubjectHandle(dataIndex) {
      console.log('添加', dataIndex)
      this.dataIndex++
      for (let index = 0; index < this.tableData.length; index++) {
        const element = this.tableData[index]
        if (element.dataIndex === dataIndex) {
          var obj = { ...element }
          obj.dataIndex = this.dataIndex
          obj.subject = ''
          obj.grooveLesson = 0
          this.tableData.splice(index + 1, 0, obj)
          break
        }
      }
    },
    minusSubjectHandle(dataIndex) {
      console.log('减少')
      for (let index = 0; index < this.tableData.length; index++) {
        const element = this.tableData[index]
        if (element.dataIndex === dataIndex) {
          this.tableData.splice(index, 1)
          break
        }
      }
      this.sendData()
    },

    changeLesson(row, name1, name2) {
      if (this.action.countCourseSum === '') {
        row.grooveLesson = 0
        this.$message.warning('请先关联主合同')
        return
      }

      if (row.subject === '') {
        row.grooveLesson = 0
        this.$message.warning('请先选择科目')
        return
      }

      this.lessons = 0
      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i]
        this.lessons += Number(element.grooveLesson)
      }



      // 计算折扣
      var discount = (this.action.buyCount / (this.action.countCourseSum + this.lessons) * 100).toFixed(2)
      console.log('折扣', discount)
      this.tableData.forEach(item => {
        item.discount = discount
      })
      this.sendData()
      console.log('改变课程')
    },

    sendData() {
      // 只发送课次大于0的
      var arr = this.tableData.filter(item => {
        return item.grooveLesson > 0
      })
      console.log('过滤好的', arr)
      this.$emit('value-change', {
        index: this.index,
        value: {
          product: arr,
          lessons: this.lessons
        },
        data: {
          fieldName: 'present'
        }
      })
    },

    // 合并单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 4) {
        if (rowIndex === 0) {
          return {
            rowspan: this.tableData.length,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.present-wrap {
  width: 800px;
  margin: 0 auto;
  /deep/ .el-table__body {
    .el-table__row{
      td {
        padding: 10px 0;
        border-right: 1px solid #e6e6e6;
        // border-color: #e6e6e6;
        &:first-child {
          border-left: 1px solid #e6e6e6;
        .cell {

          padding-left: 10px !important;
        }
       }
      }
    }
  }
}
</style>
