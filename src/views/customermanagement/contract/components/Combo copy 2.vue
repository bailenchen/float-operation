<template>
  <div class="wrap">
    <el-table
      v-if="tableData"
      ref="multipleTable"
      :span-method="objectSpanMethod"
      :cell-class-name="tableRowClassName"
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
            <el-select v-model="scope.row.subject" placeholder="请选择">
              <el-option
                v-for="subjectItem in subjectList"
                :key="subjectItem.value"
                :label="subjectItem.subjectName"
                :value="subjectItem.id"
              />
            </el-select>
          </template>
          <template v-else-if="item.prop == 'purchaseLesson'">
            <el-input v-model="scope.row.purchaseLesson" :min="1" :max="10" size="small" label="描述文字" />
          </template>
          <template v-else-if="item.prop == 'grooveLesson'">
            <el-input v-model="scope.row.grooveLesson" :disabled="scope.row.grooveLesson==0" :min="1" :max="10" size="small" label="描述文字" />
          </template>
          <template v-else>
            {{ scope.row[item.prop] }}
          </template>
        </template>
      </el-table-column>

      <el-table-column prop="" label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-plus" circle @click="plusSubjectHandle(scope.row.combo_number, scope.row.dataIndex)" />
          <el-button v-show="minusShow(scope.row.combo_number, scope.row.productName)" type="danger" icon="el-icon-minus" circle @click="minusSubjectHandle(scope.row.dataIndex)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { crmProductIndex } from '@/api/customermanagement/product'
import { QueryAdminSubject } from '@/api/systemManagement/params'

export default {
  props: {
    action: {
      type: Object,
      default: () => {
        return {}
      }
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
        {
          label: '套餐标准课次',
          prop: 'comboNormLesson',
          width: 100
        },
        {
          label: '套餐标准赠送课次',
          prop: 'normLesson',
          width: 100
        },
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
          label: '购买价格',
          prop: 'price',
          width: 100
        },
        {
          label: '单节课价格',
          prop: 'univalence',
          width: 100
        }
      ],
      maxIndex: 0,
      abc: 0,
      univalence: 0,
      tableData: null,
      tableData1: [
        {
          productType: '寒暑假礼包',
          // price: 123,
          productName: '寒假课',
          // productId:''
          // subjectOptions: 'winter',
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
          combo_number: '001', // 套餐编号
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
        },
        {
          productType: '速度发多少',
          // price: 123,
          productName: '套餐A',
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
          combo_number: '002',
          dataIndex: 4 // 标识
        },
        {
          productType: '速度发多少',
          // price: 123,
          productName: '套餐B',
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
          combo_number: '002',
          dataIndex: 5 // 标识
        }
      ],
      rowIndex: '-1',
      OrderLeve1Arr: [], // 大套餐
      OrderLeve2Arr: [], // 小套餐
      hoverOrderArr: [],
      subjectList: [],
      subjectOptions: {
        winter: [
          {
            label: '语文',
            id: 1
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
  watch: {
    action: {
      handler(val) {
        if (val.searchJson.gradeId && val.searchJson.coachType && val.productSetMeal.length) { this.structureData() }
      },
      deep: true
    }
  },
  created() {
    // 获取科目
    QueryAdminSubject().then(res => {
      this.subjectList = res.data
    }).catch(() => {})
  },
  mounted() {
    // this.getOrderNumber()
    // this.maxIndex = this.tableData.length
  },
  methods: {
    structureData() {
      const params = {
        type: 4,
        searchJson: this.action.searchJson
      }
      console.log('请求参数AA1', params)
      crmProductIndex(params).then(res => {
        // 获取课次单价
        this.univalence = res.data.list[0].price
        console.log('产品', this.action.productSetMeal, this.action.productSetMeal.length)
        var arr = []
        for (let i = 0; i < this.action.productSetMeal.length; i++) {
          const productSetMeal = this.action.productSetMeal[i]
          console.log('大套餐', productSetMeal)
          for (let j = 0; j < productSetMeal.details.length; j++) {
            const product = productSetMeal.details[j]
            console.log('小套餐', product)
            this.maxIndex++
            var obj = {
              productType: productSetMeal.name,
              productName: product.detailsName,
              subject: '',
              comboNormLesson: product.purchaseFrequency, // 套餐标准课次
              normLesson: product.giveFrequency, // 套餐标准赠送课次
              purchaseLesson: 0, // 购买课次
              grooveLesson: product.giveFrequency, // 常规赠送课次
              planeLesson: 0, // 已排课课次
              completeLesson: 0, // 已完成课次
              price: productSetMeal.price,
              univalence: this.univalence, // 单价
              combo_number: productSetMeal.productId, // 大套餐编号
              dataIndex: this.maxIndex// 标识
            }
            arr.push(obj)
          }
        }
        this.tableData = arr
      }).catch(() => {})
    },
    // 获取相同编号的数组
    getOrderNumber() {
      this.OrderLeve1Arr = []
      const OrderObj = {}
      this.tableData.forEach((element, index) => {
        element.rowIndex = index
        if (OrderObj[element.combo_number]) {
          // OrderObj[element.combo_number].push(index)
          OrderObj[element.combo_number].push({
            index: index,
            combo_number: element.combo_number
          })
          // if(OrderObj[element.combo_number][element.productName]) {
          //   OrderObj[element.combo_number][element.productName].push()
          // }
        } else {
          OrderObj[element.combo_number] = []
          // OrderObj[element.combo_number].push(index)
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

      this.OrderLeve2Arr = []
      const OrderObj1 = {}
      this.tableData.forEach((element, index) => {
        // 把小套餐相同的放在一个数组
        // 先判断有没有大套餐
        if (OrderObj1[element.combo_number]) {
          // 判断有没有小套餐
          if (OrderObj1[element.combo_number][element.productName]) {
            OrderObj1[element.combo_number][element.productName].push({
              index,
              item: element
            })
          } else {
            // 创建小套餐
            OrderObj1[element.combo_number][element.productName] = []
            OrderObj1[element.combo_number][element.productName].push({
              index,
              item: element
            })
          }
        } else {
          // 创建大套餐
          OrderObj1[element.combo_number] = {}
          // 创建小套餐
          OrderObj1[element.combo_number][element.productName] = []
          OrderObj1[element.combo_number][element.productName].push({
            index,
            item: element
          })
        }
      })

      for (const key in OrderObj1) {
        if (Object.keys(OrderObj1[key]).length > 1) {
          for (const k in OrderObj1[key]) {
          // if (!OrderObj1[key].hasOwnProperty(k)) break
            this.OrderLeve2Arr.push(OrderObj1[key][k])
          }
        }
      }
    },
    // 合并单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 第0、9列，按照本类的第一行中的数据显示，剩余行为0
      if (
        columnIndex === 0 ||
        columnIndex === 9
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

      if (
        columnIndex === 1 ||
        columnIndex === 3 ||
        columnIndex === 4
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
    },
    plusSubjectHandle(combo_number, dataIndex) {
      this.maxIndex++
      for (let index = 0; index < this.tableData.length; index++) {
        const element = this.tableData[index]
        if (element.combo_number === combo_number && element.dataIndex === dataIndex) {
          var obj = { ...element }
          obj.dataIndex = this.maxIndex
          this.tableData.splice(index + 1, 0, obj)
          break
        }
      }
      this.getOrderNumber()
    },
    minusSubjectHandle(dataIndex) {
      for (let index = 0; index < this.tableData.length; index++) {
        const element = this.tableData[index]
        if (element.dataIndex === dataIndex) {
          this.tableData.splice(index, 1)
          break
        }
      }
    },
    minusShow(combo_number, productName) {
      var arr = []
      this.tableData.forEach(item => {
        if (item.combo_number == combo_number && item.productName == productName) {
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
      this.OrderLeve1Arr.forEach((element) => {
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
.wrap {
  width: 800px;
  margin: 0 auto;
  /deep/ .el-table__body {
    td {
      border-color: #e6e6e6;
    }
  }
  /deep/ .el-button {
    width: 30px;
    height: 30px;
    padding: 0;
    text-align: center;
  }
}
</style>
