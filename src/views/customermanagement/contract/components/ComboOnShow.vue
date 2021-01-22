<template>
  <div class="wrap">
    <el-table
      :span-method="objectSpanMethod"
      :data="tableData"
      border
      style="width: 100%; margin: 0 auto"
    >
      <el-table-column
        v-for="(item, index) in fields"
        :key="index"
        :prop="item.prop"
        :label="item.label"
        :width="item.width"
        align="center">
        <template slot-scope="scope">
          <template v-if="item.prop == 'subject'">
            <el-select v-model="scope.row.subject" disabled placeholder="请选择">
              <el-option
                v-for="subjectItem in subjectList"
                :key="subjectItem.value"
                :label="subjectItem.subjectName"
                :value="subjectItem.id"
              />
            </el-select>
          </template>
          <template v-else-if="item.prop == 'purchaseLesson'">
            <el-input v-model="scope.row.purchaseLesson" disabled min="0" type="number"/>
          </template>
          <template v-else-if="item.prop == 'grooveLesson'">
            <el-input v-model="scope.row.grooveLesson" disabled min="0" type="number"/>
          </template>
          <template v-else>
            {{ scope.row[item.prop] }}
          </template>
        </template>
      </el-table-column>
    </el-table>

    <!-- 累计赠送表 -->
    累计赠送课程
    <el-table
      :data="presentData"
      style="width: 100%">
      <el-table-column prop="subject" label="科目" width="" align="center">
        <template slot-scope="scope">
          <el-select v-model="scope.row.subject" disabled placeholder="请选择">
            <el-option
              v-for="(item, index) in subjectList"
              :key="index"
              :label="item.subjectName"
              :disabled="item.disabled"
              :value="item.id"
            />
          </el-select>
        </template>
      </el-table-column>

      <el-table-column prop="presentLesson" label="累计赠送课次" width="" align="center">
        <template slot-scope="scope">
          <el-input v-model="scope.row.presentLesson" disabled type="number"/>
        </template>
      </el-table-column>

      <el-table-column
        prop="planeLesson"
        label="已排课课次"/>
      <el-table-column
        prop="completeLesson"
        label="已完成课次"/>
      <el-table-column
        prop="univalence"
        label="均价"/>
    </el-table>
    <!-- <div v-if="presentRules">
      累计赠送规则：{{ presentRules }}
    </div> -->
  </div>
</template>
<script>

export default {
  props: {
    value: Object,
    subjectList: Array,
    presentRules: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      fields: [
        {
          label: '课程套餐名称',
          prop: 'productType',
          width: 100
        },
        {
          label: '套餐',
          prop: 'productName',
          width: 100
        },
        {
          label: '科目',
          prop: 'subject',
          width: 100
        },
        // {
        //   label: '套餐标准课次',
        //   prop: 'comboNormLesson',
        //   width: 100
        // },
        // {
        //   label: '套餐标准赠送课次',
        //   prop: 'normLesson',
        //   width: 100
        // },
        {
          label: '购买课次',
          prop: 'purchaseLesson',
          width: 100
        },
        {
          label: '常规赠送课次',
          prop: 'grooveLesson',
          width: 100
        },
        {
          label: '已排课课次',
          prop: 'planeLesson',
          width: 100
        },
        {
          label: '已完成课次',
          prop: 'completeLesson',
          width: 100
        },
        {
          label: '购买原价',
          prop: 'price',
          width: 100
        },
        {
          label: '折扣比例',
          prop: 'discount',
          width: 100
        },
        {
          label: '折后价格',
          prop: 'salePrice',
          width: 100
        },
        {
          label: '均价',
          prop: 'univalence',
          width: 100
        }
      ],
      tableData: null,
      OrderLeve1Arr: [], // 大套餐
      OrderLeve2Arr: [], // 小套餐
      OrderLeve3Arr: [], // 引流课
      presentDataIndex: 0,
      presentData: null
      // presentRules: ''
    }
  },
  watch: {
    value: {
      handler(val, oldVal) {
        console.log('新旧val', val, oldVal)
        // if (isEqual(val, oldVal)) {
        if (val) {
          this.structureDataByValue()
        }

        // }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    structureDataByValue() {
      console.log('根据值拼接表格数据')
      this.tableData = this.value.productList
      this.presentData = this.value.presentList
      this.getOrderNumber()
    },

    // 获取相同编号的数组
    getOrderNumber() {
      if (!this.tableData) {
        console.log('没有表格数据')
        return
      }
      this.OrderLeve1Arr = []
      this.OrderLeve3Arr = []
      const OrderObj = {}
      const OrderObj2 = {}
      this.tableData.forEach((element, index) => {
        element.rowIndex = index
        // 引流套餐
        if (element.drainage) {
          if (OrderObj2[element.combo_number]) {
            OrderObj2[element.combo_number].push({
              index: index,
              combo_number: element.combo_number
            })
          } else {
            OrderObj2[element.combo_number] = []
            OrderObj2[element.combo_number].push({
              index: index,
              combo_number: element.combo_number
            })
          }
        }

        if (OrderObj[element.combo_number]) {
          OrderObj[element.combo_number].push({
            index: index,
            combo_number: element.combo_number
          })
        } else {
          OrderObj[element.combo_number] = []
          OrderObj[element.combo_number].push({
            index: index,
            combo_number: element.combo_number
          })
        }
      })

      // 将数组长度大于1的值 存储到this.OrderLeve1Arr（也就是需要合并的项）
      for (const k in OrderObj) {
        if (OrderObj[k].length > 1) {
          this.OrderLeve1Arr.push(OrderObj[k])
        }
      }

      for (const k in OrderObj2) {
        if (OrderObj2[k].length > 1) {
          this.OrderLeve3Arr.push(OrderObj2[k])
        }
      }

      this.OrderLeve2Arr = []
      const OrderObj1 = {}
      // const OrderObj3 = {}
      this.tableData.forEach((element, index) => {
        // 把小套餐相同的放在一个数组

        // 先判断有没有大套餐
        if (OrderObj1[element.combo_number]) {
          // 判断有没有小套餐
          if (OrderObj1[element.combo_number][element.giftProductId]) {
            OrderObj1[element.combo_number][element.giftProductId].push({
              index,
              item: element
            })
          } else {
            // 创建小套餐
            OrderObj1[element.combo_number][element.giftProductId] = []
            OrderObj1[element.combo_number][element.giftProductId].push({
              index,
              item: element
            })
          }
        } else {
          // 创建大套餐
          OrderObj1[element.combo_number] = {}
          // 创建小套餐
          OrderObj1[element.combo_number][element.giftProductId] = []
          OrderObj1[element.combo_number][element.giftProductId].push({
            index,
            item: element
          })
        }
      })

      for (const key in OrderObj1) {
        // if (Object.keys(OrderObj1[key]).length > 1) {
        for (const k in OrderObj1[key]) {
          this.OrderLeve2Arr.push(OrderObj1[key][k])
        }
        // }
      }
    },
    // 合并单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 第0、9列，按照本类的第一行中的数据显示，剩余行为0
      if (
        columnIndex === 0 ||
        columnIndex === 8
      ) {
        for (let i = 0; i < this.OrderLeve1Arr.length; i++) {
          const element = this.OrderLeve1Arr[i]
          for (let j = 0; j < element.length; j++) {
            const item = element[j]
            if (rowIndex == item.index) {
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

      if (this.OrderLeve3Arr.length) {
        if (
          columnIndex === 7 ||
          columnIndex === 9 ||
          columnIndex === 10
        ) {
          for (let i = 0; i < this.OrderLeve3Arr.length; i++) {
            const element = this.OrderLeve3Arr[i]
            for (let j = 0; j < element.length; j++) {
              const item = element[j]
              if (rowIndex == item.index) {
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
      }


      if (
        columnIndex === 1 ||
        columnIndex === 7 ||
        columnIndex === 9 ||
        columnIndex === 10
      ) {
        for (let i = 0; i < this.OrderLeve2Arr.length; i++) {
          const element = this.OrderLeve2Arr[i]
          for (let j = 0; j < element.length; j++) {
            const item = element[j]
            if (rowIndex == item.index) {
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
    }
  }
}
</script>


<style lang="scss" scoped>
.wrap {
  width: 800px;
  margin: 0 auto;
  /deep/ .el-table__body {
    .el-table__row{
      td {
       border-color: #e6e6e6;
       &:first-child .cell {
         padding-left: 10px !important;
       }
      }
    }
  }
  /deep/ .el-button {
    width: 30px;
    height: 30px;
    padding: 0;
    text-align: center;
  }

  .total-info {
    margin-top: 20px;
    float: right;
  }
}
</style>
