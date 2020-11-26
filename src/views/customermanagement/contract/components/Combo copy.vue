<template>
  <div>
    <el-table
      ref="multipleTable"
      :span-method="objectSpanMethod"
      :cell-class-name="tableRowClassName"
      :data="tableData"
      border

    >
      <el-table-column label="课程套餐名称" align="center">
        <template slot-scope="scope" width="160">
          <div>{{ scope.row.productType }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="购买价格" align="center" />
      <el-table-column label="套餐" align="center">
        <template slot-scope="scope" width="180px">
          <p>{{ scope.row.productName }}</p>
        </template>
      </el-table-column>
      <el-table-column label="科目" align="center">
        <template slot-scope="scope">
          <el-select v-model="scope.row.subject" placeholder="请选择">
            <el-option
              v-for="item in subjectOptions[scope.row.subjectOptions]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="套餐标准课次" align="center">
        <template slot-scope="scope">
          <p>{{ scope.row.comboNormLesson }}</p>
        </template>
      </el-table-column>
      <el-table-column
        prop="normLesson"
        label="套餐标准赠送课次"
        align="center"
      />
      <el-table-column prop="purchaseLesson" label="购买课次" align="center">
        <template slot-scope="scope">
          <el-input-number v-model="scope.row.purchaseLesson" :min="1" :max="10" size="small" label="描述文字" />
        </template>
      </el-table-column>

      <el-table-column
        prop="grooveLesson"
        label="常规赠送课次"
        align="center"
      />
      <el-table-column prop="planeLesson" label="已排课课次" align="center" />
      <el-table-column
        prop="completeLesson"
        label="已完成课次"
        align="center"
      />
      <el-table-column prop="univalence" label="单节课价格" align="center" />
      <el-table-column prop="" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-plus" circle @click="plusSubjectHandle(scope.row.combo_number, scope.row.dataIndex)" />
          <el-button v-show="minusShow(scope.row.combo_number)" type="danger" icon="el-icon-minus" circle @click="minusSubjectHandle(scope.row.dataIndex)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [
        {
          productType: '寒暑假礼包',
          // price: 123,
          productName: '寒假课',
          subjectOptions: 'winter',
          // subject: '语文',
          subject: 1,
          comboNormLesson: 10, // 套餐标准课次
          normLesson: 1, // 套餐标准赠送课次
          purchaseLesson: 10, // 购买课次
          grooveLesson: 1, // 常规赠送课次
          planeLesson: 0, // 已排课课次
          completeLesson: 0, // 已完成课次
          price: 2000,
          univalence: 30, // 单价
          combo_number: '000', // 套餐编号
          dataIndex: 1 // 标识
        },
        {
          productType: '寒暑假礼包',
          // price: 123,
          productName: '暑假课',
          subjectOptions: 'summer',
          subject: 5,
          comboNormLesson: 47, // 套餐标准课次
          normLesson: 1, // 套餐标准赠送课次
          purchaseLesson: 30, // 购买课次
          grooveLesson: 0, // 常规赠送课次
          planeLesson: 0, // 已排课课次
          completeLesson: 0, // 已完成课次
          price: 2000,
          univalence: 30, // 单价
          combo_number: '001',
          dataIndex: 2 // 标识
        },
        {
          productType: '寒暑假礼包',
          // price: 123,
          productName: '暑假课',
          subjectOptions: 'summer',
          subject: 6,
          comboNormLesson: 12, // 套餐标准课次
          normLesson: 1, // 套餐标准赠送课次
          purchaseLesson: 17, // 购买课次
          grooveLesson: 0, // 常规赠送课次
          planeLesson: 0, // 已排课课次
          completeLesson: 0, // 已完成课次
          price: 2000,
          univalence: 30, // 单价
          combo_number: '001',
          dataIndex: 3 // 标识
        }
      ],
      rowIndex: '-1',
      OrderIndexArr: [],
      hoverOrderArr: [],
      subjectOptions: {
        winter: [
          {
            label: '寒假-语文',
            value: 1
          },
          {
            label: '寒假-数学',
            value: 2
          },
          {
            label: '寒假-英语',
            value: 3
          }
        ],
        summer: [
          {
            label: '暑假-语文',
            value: 4
          },
          {
            label: '暑假-数学',
            value: 5
          },
          {
            label: '暑假-英语',
            value: 6
          }
        ]
      }
    }
  },
  mounted() {
    this.getOrderNumber()
  },
  methods: {
    // 获取相同编号的数组
    getOrderNumber() {
      this.OrderIndexArr = []
      const OrderObj = {}
      this.tableData.forEach((element, index) => {
        console.log('为元素添加rowIndex，表示是哪一行')
        element.rowIndex = index
        if (OrderObj[element.combo_number]) {
          OrderObj[element.combo_number].push(index)
        } else {
          OrderObj[element.combo_number] = []
          OrderObj[element.combo_number].push(index)
          console.log('元素序号', index)
        }
      })

      console.log('排序', OrderObj)
      // 将数组长度大于1的值 存储到this.OrderIndexArr（也就是需要合并的项）
      for (const k in OrderObj) {
        if (OrderObj[k].length > 1) {
          this.OrderIndexArr.push(OrderObj[k])
        }
      }
    },
    // 合并单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 第一行第一列
      if ((rowIndex == 0 && columnIndex === 0) || (rowIndex == 0 && columnIndex === 1)) {
        console.log('第一行第一列')
        return {
          rowspan: this.tableData.length,
          colspan: 1
        }
      }
      // 第一列第二列为0
      if (columnIndex == 0 || columnIndex === 1) {
        return {
          rowspan: 0,
          colspan: 0
        }
      }

      // 第2、4、5列，按照本类的第一行中的数据显示，剩余行为0
      if (columnIndex === 2 || columnIndex === 4 || columnIndex === 5) {
        for (let i = 0; i < this.OrderIndexArr.length; i++) {
          const element = this.OrderIndexArr[i]
          for (let j = 0; j < element.length; j++) {
            const item = element[j]
            // 如果行索引等于当前元素
            console.log('当前行', rowIndex)
            console.log('元素', item)
            if (rowIndex == item) {
              if (j == 0) {
                return {
                  rowspan: element.length,
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
    },
    plusSubjectHandle(combo_number, dataIndex) {
      console.log('添加', combo_number)
      // this.tableData.forEach(item=> {
      //   if(item.combo_number === combo_number) {

      //   }
      // })
      for (let index = 0; index < this.tableData.length; index++) {
        const element = this.tableData[index]
        if (element.combo_number === combo_number && element.dataIndex === dataIndex) {
          console.log('要复制的', element)
          var obj = { ...element }
          ++obj.dataIndex
          this.tableData.splice(index + 1, 0, obj)
          break
        }
      }
      this.getOrderNumber()
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
    },
    minusShow(combo_number) {
      var arr = []
      this.tableData.forEach(item => {
        if (item.combo_number == combo_number) {
          arr.push(item)
        }
      })
      return arr.length > 1
    },

    // 单元格样式
    tableRowClassName({ row, rowIndex }) {
      // console.log(row)
      const arr = this.hoverOrderArr
      for (let i = 0; i < arr.length; i++) {
        if (rowIndex == arr[i]) {
          return 'hovered-row'
        }
      }
    },

    // 鼠标划入，划出效果
    cellMouseEnter(row, column, cell, event) {
      // console.log(column, cell, event)
      this.rowIndex = row.rowIndex
      this.hoverOrderArr = []
      this.OrderIndexArr.forEach((element) => {
        if (element.indexOf(this.rowIndex) >= 0) {
          this.hoverOrderArr = element
        }
      })
    },
    cellMouseLeave(row, column, cell, event) {
      // console.log(row, column, cell, event)
      this.rowIndex = '-1'
      this.hoverOrderArr = []
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
