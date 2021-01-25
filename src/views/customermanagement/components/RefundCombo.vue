<template>
  <div class="wrap">
    <el-table
      v-loading="loading"
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
        align="center"/>
    </el-table>

    <el-button v-if="tableData" :disabled="action.isInteriorRefund" :type="btnType" @click="isOfflineWithDraw = true">{{ btnText }}</el-button>

    <offline-with-draw
      :visible.sync="isOfflineWithDraw"
      :selection-list="selectionList"
      :money="money"
      :fill-data="fillData"
      :is-save="true"
      :money-type="moneyType"
      @save="handleCallBack"
    />
  </div>
</template>

<script>
import { filedGetInformation } from '@/api/customermanagement/common'
import { QueryAdminSubject } from '@/api/systemManagement/params'
import OfflineWithDraw from '@/views/customermanagement/components/selectionHandle/OfflineWithDraw'
import { mapGetters } from 'vuex'

export default {
  name: 'RefundCombo',
  components: {
    OfflineWithDraw
  },
  props: {
    /** 索引值 用于更新数据 */
    index: Number,
    action: {
      type: Object,
      default: () => {
        return {}
      }
    },
    oldValue: {
      type: Object,
      default: () => {
        return {}
      }
    },
    refundMoney: [Number, String],
    refundType: [Number, String],

    isInteriorRefund: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      fields: [
        {
          label: '课程套餐名称',
          prop: 'bigMealName',
          width: 100
        },
        {
          label: '套餐',
          prop: 'mealName',
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
          label: '累计赠送课次',
          prop: 'accumulativeLesson',
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
        },
        {
          label: '退课课次',
          prop: 'returnLesson',
          width: 100
        }
      ],
      tableData: null,
      OrderLeve1Arr: [], // 大套餐
      OrderLeve2Arr: [], // 小套餐
      OrderLeve3Arr: [], // 引流课
      loading: false,
      dialogVisible: false,
      isOfflineWithDraw: false,
      characterUser: null, // 收/退款人
      selectionList: [{
        leadsNumber: '',
        accountNumber: '',
        capitalId: ''
      }],
      money: '',
      product: null, // 表格数据
      capital: null, // 资金退款信息
      fillData: null,
      // fillData: {},
      disabled: false,
      moneyType: 'contractRefound',
      btnType: 'primary',
      btnText: '填写资金退款',
      contractData: null
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    action: {
      handler(val, oldValue) {
        // console.log(val, oldValue)
        // this.capital = this.action.isInteriorRefund ? null : this.capital
        // 没有合同
        if (!val.contracId) {
          this.tableData = null
          this.money = ''
          this.product = null
          this.capital = null
          this.fillData = null
          this.sendData(false)
          this.btnType = 'primary'
          this.btnText = '填写资金退款'
          return
        }

        // 有无资金信息
        if (this.capital) {
          this.btnType = 'success'
          this.btnText = '查看资金退款信息'
        }
        this.getData()
      },
      deep: true
      // immediate: true
    },
    oldValue: {
      handler(val) {
        if (Object.keys(val).length) {
          this.structureTableByVal(val)
        }
      },
      immediate: true
    },
    isInteriorRefund: {
      handler(val) {
        this.disabled = val
      },
      immediate: true
    },
    refundMoney: function(val) {
      // console.log('监听refundMoney', val)
      this.money = val

      if (!this.fillData) {
        this.fillData = {
          [this.moneyType]: {
            'payment': 6,
            'userAccount': '',
            'payeeName': '',
            'price': val,
            'transactionTime': '',
            'characterId': '',
            'characterName': '',
            'remark': ''
          }
        }
      } else {
        this.fillData[this.moneyType].price = val
        if (this.capital) this.capital.refundMoney = val
      }
      this.sendData()
    }
  },
  created() {
    QueryAdminSubject().then(res => {
      this.subjectList = res.data
    }).catch(() => {})
  },

  methods: {
    handleCallBack(val) {
      this.fillData = val
      const capital = {
        'payment': val[this.moneyType].payment,
        'account': val[this.moneyType].userAccount ? val[this.moneyType].userAccount : '',
        'payeeName': val[this.moneyType].payeeName ? val[this.moneyType].payeeName : '',
        'refundMoney': val[this.moneyType].price,
        'dealTime': val[this.moneyType].transactionTime,
        'refundUserId': val[this.moneyType].characterId,
        'remarks': val[this.moneyType].remark
      }
      this.btnText = '查看资金退款信息'
      this.btnType = 'success'
      console.log('capital', capital)
      this.capital = capital
      this.sendData()
      this.isOfflineWithDraw = false
    },
    sendData(del = false) {
      const obj = {
        index: this.index,
        value: {
          product: this.product,
          capital: this.action.isInteriorRefund ? null : this.capital,
          money: this.money
        }
      }

      // obj.value.money = this.money
      obj.value = del ? '' : obj.value
      console.log('obj', obj)
      this.$emit('value-change', obj)
    },
    getData() {
      // 没有tableData
      if (!this.tableData) {
        this.loading = true
        const params = { types: 6, id: this.action.contracId }
        filedGetInformation(params).then(res => {
          this.loading = false
          this.contractData = res.data.contract
          // debugger
          this.structureTable(this.contractData)
          this.calculateMoney(this.contractData)
          this.structureProduct(this.contractData.productList)
        }).catch(() => {})
      } else {
        const data = this.contractData ? this.contractData : this.oldValue
        this.calculateMoney(data)
        this.sendData()
      }
    },

    structureProduct(productList) {
      const arr = []
      productList.forEach(item => {
        const obj = {
          'rId': item.rId,
          'refundProductCount': item.surplusCount,
          'refundMoney': item.price * item.surplusCount
        }
        arr.push(obj)
      })
      this.product = arr
      // debugger
      this.sendData()
    },

    calculateMoney(dataObj) {
      let money = 0
      console.log('dataObj', dataObj)
      dataObj.productList.forEach(item => {
        money += (item.price * 100 * item.surplusCount) / 100
      })
      console.log('应退金额', money)
      this.money = money

      if (this.fillData) {
        this.fillData[this.moneyType].price = money
      }
      if (this.capital) {
        this.capital.refundMoney = money
      }
    },
    structureTableByVal(dataObj) {
      console.log('aa', dataObj)

      this.btnType = dataObj.capital ? 'success' : 'primary'
      this.btnText = dataObj.capital ? '查看资金退款信息' : '填写资金退款'

      QueryAdminSubject().then(res => {
        this.subjectList = res.data
        this.money = dataObj.money

        this.capital = dataObj.capital
        if (this.capital) {
          const _this = this
          this.fillData = {
            [_this.moneyType]: {
              'payment': Number(this.capital.payment),
              'userAccount': this.capital.account ? this.capital.account : '',
              'payeeName': this.capital.payeeName ? this.capital.payeeName : '',
              'price': this.capital.refundMoney,
              'transactionTime': this.capital.dealTime,
              'characterId': this.capital.refundUserId,
              'characterName': this.capital.refundUserName,
              'remark': this.capital.remarks
            }
          }
        }
        // console.log('调用structureTable', dataObj)
        this.structureTable(dataObj)
        // this.calculateMoney(dataObj)
        this.structureProduct(dataObj.productList)
      }).catch(() => {})
    },
    structureTable(dataObj) {
      console.log('saa', dataObj)
      var arr = []
      dataObj.productList.forEach(item => {
        console.log('name--', this.getAttrOfBigMeal(dataObj, item.mealProductId, 'name'))
        if (item.type === 1) {
          var obj = {
            bigMealName: this.getAttrOfBigMeal(dataObj, item.mealProductId, 'name'),
            mealName: this.getAttrOfMeal(dataObj, item.giftProductId, 'detailsName'),
            subject: this.getSubject(item.productId),
            comboNormLesson: this.getAttrOfMeal(dataObj, item.giftProductId, 'purchaseFrequency'), // 套餐标准课次
            normLesson: this.getAttrOfMeal(dataObj, item.giftProductId, 'giveFrequency'), // 套餐标准赠送课次
            purchaseLesson: item.courseSum, // 购买课次
            grooveLesson: item.presenterCourseSum, // 常规赠送课次
            accumulativeLesson: '/',
            planeLesson: item.alreadyCourse, // 已排课课次
            completeLesson: item.finishCourse, // 已完成课次
            price: item.subtotal, // 原价
            discount: this.getAttrOfBigMeal(dataObj, item.mealProductId, 'warningLine'), // 折扣比例
            salePrice: item.salesPrice, // 折后价格
            univalence: item.price, // 均价
            returnLesson: item.surplusCount, // 退课课次

            combo_number: item.mealProductId, // 大套餐ID
            detailsId: item.giftProductId // 小套餐ID
          }
          arr.push(obj)
        } else if (item.type === 2) {
          var obj = {
            bigMealName: this.getAttrOfBigMeal(dataObj, item.mealProductId, 'name'),
            mealName: this.getAttrOfMeal(dataObj, item.giftProductId, 'detailsName'),
            subject: this.getSubject(item.productId),
            comboNormLesson: '/', // 套餐标准课次
            normLesson: '/', // 套餐标准赠送课次
            purchaseLesson: '/', // 购买课次
            grooveLesson: '/', // 常规赠送课次
            accumulativeLesson: item.courseSum,
            planeLesson: item.alreadyCourse, // 已排课课次
            completeLesson: item.finishCourse, // 已完成课次
            price: '/', // 原价
            discount: '/', // 折扣比例
            salePrice: '/', // 折后价格
            univalence: item.price, // 均价
            returnLesson: item.surplusCount, // 退课课次

            combo_number: item.mealProductId, // 大套餐ID
            detailsId: item.giftProductId // 小套餐ID
          }
          arr.push(obj)
        }
      })
      this.tableData = arr
      this.getOrderNumber()
    },

    // 关联大套餐获取属性
    getAttrOfBigMeal(obj, id, attr) {
      var val = null
      obj.mealProducts.forEach(item => {
        if (item.productId == id) {
          val = item[attr]
        }
      })
      return val
    },
    // 关联小套餐获取属性
    getAttrOfMeal(obj, id, attr) {
      var val = null
      obj.giftProducts.forEach(item => {
        if (item.detailsId == id) {
          val = item[attr]
        }
      })
      return val
    },

    // 关联大套餐获取属性
    getSubject(id) {
      var subjectName = ''
      this.subjectList.forEach(item => {
        if (item.id == id) {
          subjectName = item.subjectName
        }
      })
      return subjectName
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
          if (OrderObj1[element.combo_number][element.detailsId]) {
            OrderObj1[element.combo_number][element.detailsId].push({
              index,
              item: element
            })
          } else {
            // 创建小套餐
            OrderObj1[element.combo_number][element.detailsId] = []
            OrderObj1[element.combo_number][element.detailsId].push({
              index,
              item: element
            })
          }
        } else {
          // 创建大套餐
          OrderObj1[element.combo_number] = {}
          // 创建小套餐
          OrderObj1[element.combo_number][element.detailsId] = []
          OrderObj1[element.combo_number][element.detailsId].push({
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
        columnIndex === 10
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
          columnIndex === 9 ||
          columnIndex === 11 ||
          columnIndex === 12
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
        // columnIndex === 3 ||
        // columnIndex === 4 ||
        columnIndex === 9 ||
        columnIndex === 11
        // columnIndex === 12
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

  /deep/ .el-form-item {
    margin-bottom: 22px!important;
    .el-form-item__label {
      float: left;
      line-height: 40px;
    }
  }
}
</style>
