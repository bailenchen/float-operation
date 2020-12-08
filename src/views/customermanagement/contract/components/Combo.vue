<template>
  <div class="wrap">
    <el-table
      v-if="tableData"
      ref="multipleTable"
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
            <el-select v-model="scope.row.subject" :disabled="isDisabled" placeholder="请选择">
              <el-option
                v-for="subjectItem in subjectList"
                :key="subjectItem.value"
                :label="subjectItem.subjectName"
                :value="subjectItem.id"
              />
            </el-select>
          </template>
          <template v-else-if="item.prop == 'price'">
            <el-input v-model="scope.row.price" :disabled="isDisabled" type="number" min="0" @change="changePrice(scope.row)"/>
          </template>
          <template v-else-if="item.prop == 'purchaseLesson'">
            <el-input v-model="scope.row.purchaseLesson" :disabled="isDisabled" min="0" type="number" @change="changePurchaseLesson(scope.row, `purchaseLesson`, `originalPurchaseLesson`)"/>
          </template>
          <template v-else-if="item.prop == 'grooveLesson'">
            <el-input v-model="scope.row.grooveLesson" :disabled="isDisabled || scope.row.normLesson===0" min="0" type="number" @change="changeGrooveLesson(scope.row, `grooveLesson`,`originalGrooveLesson`)"/>
          </template>
          <template v-else>
            {{ scope.row[item.prop] }}
          </template>
        </template>
      </el-table-column>

      <el-table-column v-if="!value" prop="" label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-plus" circle @click="plusSubjectHandle(scope.row.combo_number, scope.row.dataIndex)" />
          <el-button v-show="minusShow(scope.row.combo_number, scope.row.productName)" type="danger" icon="el-icon-minus" circle @click="minusSubjectHandle(scope.row.dataIndex)" />
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { QueryGiveAPI } from '@/api/customermanagement/contract'

export default {
  props: {
    action: {
      type: Object,
      default: () => {
        return {}
      }
    },
    giveAction: Object, // 获取可赠送课次接口所需的参数
    isDisabled: {
      type: Boolean,
      default: false
    },
    value: Object,
    subjectList: Array,
    accumulation: Object
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
      univalence: 0,
      tableData: null,
      rowIndex: '-1',
      OrderLeve1Arr: [], // 大套餐
      OrderLeve2Arr: [], // 小套餐
      hoverOrderArr: [],
      purchaseLesson: 0, // 全部套餐标准课次之和
      grooveLesson: 0, // 全部套餐常规赠送课次之和
      totalPrice: 0, // 总价
      maxGive: 0, // 最大赠送课次
      surplusGive: 0, // 剩余可赠送课次，用于限制累计赠送课次
      drainage: false,
      setMeal: [] // 累计赠送请求参数
    }
  },
  watch: {
    value: {
      handler(val) {
        console.log('val', val)
        if (val && val.productList) {
          console.log('使用value的值代替table', val)
          this.structureDataByValue()
        }
      },
      deep: true,
      immediate: true
    },
    action: {
      handler(val) {
        // if (val.searchJson.gradeId && val.searchJson.coachType && val.productSetMeal.length) { this.structureData() }
        this.structureData()
      },
      deep: true

    },
    accumulation: {
      handler(val) {
        console.log('累计赠送', val)
        this.calculateUnivalence(true)
      }
    }
  },
  methods: {
    structureDataByValue() {
      this.tableData = this.value.productList
      console.log('想产品组件发送数据111')
      this.sendData()
      this.getOrderNumber()
    },
    // 获取最大赠送课次(常规赠送与累计赠送都受此限制)

    getMealId() {
      var arr = []
      this.OrderLeve1Arr.forEach(item => {
        console.log('大套餐ID', item[0].combo_number)
        arr.push(item[0].combo_number)
      })
      return arr
    },

    getMaxGive() {
      console.log('获取最大可赠送课次')

      var parms = {
        customerId: this.giveAction.customerId,
        buyCount: this.purchaseLesson,
        coachType: this.giveAction.searchJson.coachType,
        setMeal: this.setMeal
      }
      QueryGiveAPI(parms).then(res => {
        if (res.data) {
          this.maxGive = res.data.give
          // 重置maxGive时也需要重置surplusGive
          this.surplusGive = this.maxGive
          this.presentRules = {
            coachType: this.giveAction.searchJson.coachType,
            classes: res.data.classes,
            give: res.data.give
          }
        } else {
          this.maxGive = 0
          this.surplusGive = this.maxGive
          this.presentRules = ''
        }

        console.log('最大次数', this.maxGive)
        this.sendData()
      }).catch(() => {
        console.log('模拟数据，异常了继续向下走')
        this.presentRules = {
          coachType: '一对一',
          classes: 10,
          give: 4
        }
        this.sendData()
      })
    },
    // 拼接表格数据
    structureData() {
      console.log('拼接数据')
      this.purchaseLesson = 0
      this.grooveLesson = 0
      this.drainage = false
      this.univalence = this.action.univalence
      var totalPrice = 0
      var arr = []
      for (let i = 0; i < this.action.productSetMeal.length; i++) {
        const productSetMeal = this.action.productSetMeal[i]
        console.log('大套餐', productSetMeal)
        this.setMeal.push({
          setMealId: productSetMeal.productId,
          buyCount: productSetMeal.purchaseFrequency
        })
        this.purchaseLesson += Number(productSetMeal.purchaseFrequency)
        if (productSetMeal.courseType == '引流课') {
          this.drainage = true
        }

        for (let j = 0; j < productSetMeal.details.length; j++) {
          const product = productSetMeal.details[j]
          console.log('小套餐', product)
          // grooveLesson += Number(product.purchaseFrequency)
          this.maxIndex++
          var obj = {
            productType: productSetMeal.name,
            productName: product.detailsName,
            subject: '',
            comboNormLesson: product.purchaseFrequency, // 套餐标准课次
            normLesson: product.giveFrequency, // 套餐标准赠送课次
            purchaseLesson: product.purchaseFrequency, // 购买课次
            grooveLesson: 0, // 常规赠送课次
            planeLesson: 0, // 已排课课次
            completeLesson: 0, // 已完成课次
            price: productSetMeal.purchaseFrequency * this.action.univalence, // 大套餐价格
            univalence: this.action.univalence, // 单价

            combo_number: productSetMeal.productId, // 大套餐ID
            dataIndex: this.maxIndex, // 标识
            detailsId: product.detailsId, // 小套餐ID
            originalPurchaseLesson: product.purchaseFrequency, // 小套餐购买课次
            originalGrooveLesson: product.giveFrequency, // 小套餐赠送课次
            mealType: productSetMeal.courseType// 大套餐类型：引流、特价、正价
          }
          totalPrice += this.action.univalence * obj.purchaseLesson
          arr.push(obj)
        }
        this.totalPrice = totalPrice
      }
      this.tableData = arr
      this.getOrderNumber()
      this.getMaxGive()
      // this.sendData()
    },
    // 计算单价
    calculateUnivalence(isAccumulationChange = false) {
      var totalLesson = isAccumulationChange ? this.purchaseLesson + this.grooveLesson + this.accumulation.lesson : this.purchaseLesson + this.grooveLesson
      // 常规赠送与累计赠送都为0，使用父级传递的单价
      if (this.grooveLesson + this.accumulation.lesson == 0) {
        this.univalence = this.action.univalence
      } else {
        this.univalence = (this.totalPrice / totalLesson).toFixed(2)
      }

      console.log('总课次', this.totalPrice, totalLesson, this.univalence)
      this.tableData.forEach(item => {
        item.univalence = this.univalence
      })
      // return univalence
      // var isAccumulationChange = !!this.accumulation.lesson
      console.log('修改单价，发送事件')
      var obj = {
        totalPrice: this.totalPrice,
        univalence: this.univalence,
        buyCount: this.purchaseLesson,
        totalclassTime: Number(this.purchaseLesson) + Number(this.grooveLesson),
        isAccumulationChange, // 累计导致的计算单价为true
        surplusGive: this.surplusGive
      }
      console.log(obj)
      this.$emit('change-price', obj)
      // this.$emit('change-price', {
      //   totalPrice: this.totalPrice,
      //   univalence: this.univalence,
      //   buyCount: this.purchaseLesson,
      //   totalclassTime: Number(this.purchaseLesson) + Number(this.grooveLesson),
      //   isAccumulationChange, // 累计导致的计算单价为true
      //   surplusGive: this.surplusGive
      // })
      // this.sendData()
    },

    // 向父组件发送数据
    sendData() {
      console.log('combo向父组件发送数据')
      var obj = {
        tableData: this.tableData,
        purchaseLesson: this.purchaseLesson, // 套餐购买课次和
        grooveLesson: this.grooveLesson, // 套餐赠送课次和
        totalclassTime: Number(this.purchaseLesson) + Number(this.grooveLesson), // 总课次
        drainage: this.drainage, // 是否为引流
        totalPrice: this.totalPrice, // 总价
        currentGive: this.maxGive, // 当前可赠送课次
        surplusGive: this.surplusGive, // 剩余可赠送课次
        presentRules: this.presentRules // 赠送规则
      }
      console.log(obj)
      this.$emit('structure-data', obj)
    },

    // 获取相同编号的数组
    getOrderNumber() {
      if (!this.tableData) {
        console.log('没有表格数据')
        return
      }
      this.OrderLeve1Arr = []
      const OrderObj = {}
      this.tableData.forEach((element, index) => {
        element.rowIndex = index
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
    // 增加一行数据
    plusSubjectHandle(combo_number, dataIndex) {
      this.maxIndex++
      for (let index = 0; index < this.tableData.length; index++) {
        const element = this.tableData[index]
        if (element.combo_number === combo_number && element.dataIndex === dataIndex) {
          var obj = { ...element }
          obj.dataIndex = this.maxIndex
          obj.purchaseLesson = 0
          obj.grooveLesson = 0
          obj.univalence = 0
          this.tableData.splice(index + 1, 0, obj)
          break
        }
      }
      this.getOrderNumber()
    },
    // 减少一行数据
    minusSubjectHandle(dataIndex) {
      for (let index = 0; index < this.tableData.length; index++) {
        const element = this.tableData[index]
        if (element.dataIndex === dataIndex) {
          this.tableData.splice(index, 1)
          break
        }
      }
    },
    // 计算减号显隐
    minusShow(combo_number, productName) {
      var arr = []
      this.tableData.forEach(item => {
        if (item.combo_number == combo_number && item.productName == productName) {
          arr.push(item)
        }
      })
      return arr.length > 1
    },
    // 改变购买价格
    changePrice(row, calculateUnivalence = true) {
      var totalPrice = 0
      var obj = {}

      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i]
        if (element.combo_number === row.combo_number) {
          element.price = row.price
        }
        obj[element.combo_number ] = element.price
      }

      for (const k in obj) {
        if (!obj.hasOwnProperty(k)) break
        totalPrice += Number(obj[k])
      }
      obj = null
      this.totalPrice = totalPrice
      console.log('总价', totalPrice)

      // 购买价格是用父组件传递的单价计算的，因此需要重新计算单价
      this.calculateUnivalence()
      // 改变购买课次导致的计算购买价格是不需要计算单价的
      // if (calculateUnivalence) {
      //   this.calculateUnivalence()
      // }
    },

    // 改变购买课次
    changePurchaseLesson(row) {
      if (!(/(^[1-9]\d*$)/.test(row.purchaseLesson))) {
        this.$message.warning('只能输入正整数！')
        row.purchaseLesson = 0
      }

      var lesson = 0 // 小套餐购买课次和
      var buyCounts = 0 // 合同购买课次和
      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i]
        console.log('tableData:', element)
        if (element.detailsId === row.detailsId) {
          lesson += Number(element.purchaseLesson)
          console.log('该小套餐的课次和', lesson)
          var _lesson = Number(element.purchaseLesson)
          if (lesson > element.originalPurchaseLesson) {
            element.purchaseLesson = 0
            lesson -= _lesson
            element.purchaseLesson = 0

            this.$message.warning('购买课次不能大于套餐标准课次')
          }
        }
        buyCounts += Number(element.purchaseLesson)
      }
      this.purchaseLesson = buyCounts
      console.log('购买课次之和', buyCounts, this.purchaseLesson)

      // 计算大套餐购买价格
      var mealLessons = 0 // 大套餐课次
      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i]
        if (element.combo_number === row.combo_number) {
          mealLessons += Number(element.purchaseLesson)
        }
      }
      console.log('该大套餐的课次和', mealLessons)

      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i]
        if (element.combo_number === row.combo_number) {
          var mealPrice = this.action.univalence * mealLessons
          element.price = mealPrice
        }
      }
      this.changePrice(row, false)
      this.getMaxGive()
    },

    // 改变赠送课次
    changeGrooveLesson(row) {
      if (!(/(^[1-9]\d*$)/.test(row.grooveLesson))) {
        this.$message.warning('只能输入正整数！')
        row.grooveLesson = 0
      }
      var lesson = 0 // 小套餐赠送课次和
      var grooveCount = 0 // 全部套餐赠送课次和
      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i]
        console.log('tableData:', element)
        if (element.detailsId === row.detailsId) {
          lesson += Number(element.grooveLesson)
          console.log('该小套餐的赠送课次和', lesson)
          var _lesson = Number(element.grooveLesson)
          if (lesson > element.originalGrooveLesson) {
            element.grooveLesson = 0
            lesson -= _lesson
            element.grooveLesson = 0
            this.$message.warning('常规赠送课次不能大于套餐标准赠送课次')
          }
        }
        grooveCount += Number(element.grooveLesson)
        // 赠送课次大于大于最大赠送课次
        if (grooveCount > this.maxGive) {
          row.grooveLesson = 0
          console.log('grooveCount:', grooveCount)
          this.$message.warning(`赠送课次之和不能大于实际可赠与课次`)
          break
        }
      }
      this.grooveLesson = grooveCount
      this.surplusGive = this.maxGive - this.grooveLesson
      console.log('全部套餐赠送课次和', grooveCount, this.grooveLesson)
      this.calculateUnivalence()
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
}
</style>
