<template>
  <div class="wrap">
    <p v-if="showOperation">当前可赠送课次：<span class="red">{{ maxGive }}</span></p>

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
            <el-select v-model="scope.row.subject" :disabled="isDisabled" placeholder="请选择" @change="changeSubject(scope.row)">
              <el-option
                v-for="subjectItem in subjectList"
                :key="subjectItem.value"
                :label="subjectItem.subjectName"
                :value="subjectItem.id"
              />
            </el-select>
          </template>
          <template v-else-if="item.prop == 'purchaseLesson'">
            <el-input v-model="scope.row.purchaseLesson" :disabled="isDisabled" min="0" type="number" @change="changePurchaseLesson(scope.row, `purchaseLesson`, `originalPurchaseLesson`)"/>
          </template>
          <template v-else-if="item.prop == 'grooveLesson'">
            <el-input v-model="scope.row.grooveLesson" :disabled="grooveLessonDisabled(scope.row)" min="0" type="number" @change="changeGrooveLesson(scope.row, `grooveLesson`,`originalGrooveLesson`)"/>
          </template>
          <template v-else>
            {{ scope.row[item.prop] }}
          </template>
        </template>
      </el-table-column>

      <el-table-column v-if="showOperation" prop="" label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-plus" circle @click="plusSubjectHandle(scope.row.combo_number, scope.row.dataIndex)" />
          <el-button v-show="minusShow(scope.row.combo_number, scope.row.productName)" type="danger" icon="el-icon-minus" circle @click="minusSubjectHandle(scope.row.dataIndex)" />
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
          <el-select v-model="scope.row.subject" :disabled="isDisabled" placeholder="请选择">
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
          <el-input v-model="scope.row.presentLesson" :disabled="isDisabled" type="number" @change="changeLesson(scope.row)" />
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
      <el-table-column v-if="!isDisabled" prop="" label="操作" width="100" align="center">
        <template slot-scope="scope">
          <el-button
            type="primary"
            icon="el-icon-plus"
            circle
            @click="plusPresentHandle(scope.row.dataIndex)"
          />
          <el-button
            v-show="minusShowOfPresent"
            type="danger"
            icon="el-icon-minus"
            circle
            @click="minusPresentHandle(scope.row.dataIndex)"
          />
        </template>
      </el-table-column>
    </el-table>
    <div v-if="presentRules">
      累计赠送规则：购买辅导方式为{{ presentRules.coachType }}的，购买{{ presentRules.classes }}节课，可赠送{{ presentRules.give }}节课。累计可赠送课次：{{ surplusGive }}
    </div>
    <div v-if="!isDetail" class="total-info">
      {{ priceText }}：
      <el-input
        v-wk-number
        v-model="priceValue"
        style="width: 120px"
        placeholder="请输入"
        type="number"
        disabled/>&nbsp;元
    </div>

  </div>
</template>

<script>
import { QueryGiveAPI } from '@/api/customermanagement/contract'
import { objDeepCopy } from '@/utils'

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
    // accumulation: Object,
    isDetail: { // 详情中使用
      type: Boolean,
      default: false
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
      maxIndex: 0,
      tableData: null,
      OrderLeve1Arr: [], // 大套餐
      OrderLeve2Arr: [], // 小套餐
      OrderLeve3Arr: [], // 引流课
      presentDataIndex: 0,
      presentData: null,
      subjectListOfGive: [], // 累计赠送的科目
      maxGive: 0, // 最大赠送课次
      surplusGive: 0, // 剩余可赠送课次，用于限制累计赠送课次
      presentRules: null,
      priceText: '最终价格',
      priceValue: 0, // 总金额、剩余金额、最终价格
      totalPrice: 0, // 总金额
      issurplus: false,
      surplusPrice: 0, // 剩余金额
      refundMonry: 0, // 充值返回金额
      drainage: false, // 是否选择了引流套餐
      purchaseLesson: 0, // 全部购买课次之和
      purchaseInGive: 0, // 参与累计的购买课次之和
      allGiveLesson: 0, // 全部常规赠送课次之和
      grooveLesson: 0, // 参与累积赠送的常规赠送课次之和
      accumulativeLesson: 0, // 累积赠送课次之和
      giveObj: null
    }
  },
  computed: {
    showOperation() {
      if (this.action && this.action.type && this.action.type == 'old-change') {
        return false
      } else if (this.isDisabled) {
        return false
      }
      return true
    },
    // 计算减号显隐
    minusShowOfPresent() {
      return this.presentData.length > 1
    }
  },
  watch: {
    action: {
      handler(val) {
        this.structureData()
      },
      deep: true
    },
    value: {
      handler(val, oldVal) {
        // console.log('新旧val', val, oldVal)
        this.structureDataByValue()
      }
    }
  },
  methods: {
    // 初始化公共值
    init() {
      this.maxIndex = 0
      this.tableData = null
      this.OrderLeve1Arr = [] // 大套餐
      this.OrderLeve2Arr = [] // 小套餐
      this.OrderLeve3Arr = [] // 引流课
      this.presentDataIndex = 0
      this.presentData = null
      this.subjectListOfGive = [] // 累计赠送的科目
      this.maxGive = 0 // 最大赠送课次
      this.surplusGive = 0 // 剩余可赠送课次，用于限制累计赠送课次
      this.presentRules = null

      this.priceValue = 0 // 总金额、剩余金额、最终价格
      this.totalPrice = 0 // 总金额
      this.issurplus = false
      this.surplusPrice = 0 // 剩余金额
      this.refundMonry = 0 // 充值返回金额
      this.drainage = false // 是否选择了引流套餐
      this.purchaseLesson = 0 // 全部购买课次之和
      this.purchaseInGive = 0 // 参与累计的购买课次之和
      this.allGiveLesson = 0 // 全部常规赠送课次之和
      this.grooveLesson = 0 // 参与累积赠送的常规赠送课次之和
      this.accumulativeLesson = 0 // 累积赠送课次之和
      this.giveObj = null
    },
    // 拼接表格数据
    // async structureData() {
    structureData() {
      console.log('拼接数据')
      this.init()

      var arr = []
      for (let i = 0; i < this.action.productSetMeal.length; i++) {
        const productSetMeal = this.action.productSetMeal[i]
        console.log('大套餐', productSetMeal)

        this.purchaseLesson += Number(productSetMeal.purchaseFrequency)


        for (let j = 0; j < productSetMeal.details.length; j++) {
          const product = productSetMeal.details[j]
          // console.log('小套餐', product)
          if (product.isGive) {
            this.purchaseInGive += Number(product.purchaseFrequency)
          }

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
            price: product.purchaseFrequency * this.action.univalence, // 小套餐原价
            discount: productSetMeal.warningLine,
            salePrice: product.purchaseFrequency * this.action.univalence * productSetMeal.warningLine / 100,
            univalence: (product.purchaseFrequency * this.action.univalence * productSetMeal.warningLine / 100 / product.purchaseFrequency).toFixed(2), // 均价

            combo_number: productSetMeal.productId, // 大套餐ID
            dataIndex: this.maxIndex, // 标识
            detailsId: product.detailsId, // 小套餐ID
            originalPurchaseLesson: product.purchaseFrequency, // 小套餐购买课次
            originalGrooveLesson: product.giveFrequency, // 小套餐赠送课次
            mealType: productSetMeal.courseType, // 大套餐类型：引流、特价、正价
            isGive: product.isGive
          }
          if (productSetMeal.courseType == '引流课') {
            this.drainage = true
            obj.drainage = true
            obj.price = productSetMeal.price
            obj.salePrice = productSetMeal.price * productSetMeal.warningLine / 100
            obj.univalence = (productSetMeal.price * productSetMeal.warningLine / 100 / productSetMeal.purchaseFrequency).toFixed(2) // 均价
          }
          arr.push(obj)
        }
      }
      this.tableData = arr

      if (!arr.length) {
        this.presentData = null
        this.sendData()
        return
      }

      this.getOrderNumber()
      // 计算套餐总价
      this.calculateTotalPrice()
      this.priceValue = this.totalPrice

      if (this.giveAction && this.giveAction.type && this.giveAction.type == 'change') {
        // console.log('chang，计算两份合同的差价', this.totalPrice, this.giveAction.surplusPrice)
        this.refundMonry = this.totalPrice - this.giveAction.surplusPrice
        console.log('不显示差价')
        this.priceValue = this.totalPrice
      }
      this.havePresent()
    },

    structureDataByValue() {
      this.init()
      this.tableData = this.value.productList

      this.tableData.forEach(item => {
        if (item.courseType == '引流课') {
          this.drainage = true
        }
        this.purchaseLesson += item.purchaseLesson
        this.allGiveLesson += item.grooveLesson

        // 参与累计赠送的常规赠和
        if (item.isGive == 1) {
          this.grooveLesson += Number(item.grooveLesson)
          this.purchaseInGive += Number(item.purchaseLesson)
        }
      })

      this.getOrderNumber()
      // 计算套餐总价
      this.calculateTotalPrice()
      this.priceValue = this.totalPrice

      if (this.giveAction && this.giveAction.type && this.giveAction.type == 'old-change') {
        this.priceText = '剩余金额'
        // 计算剩余金额
        var expenditure = 0 // 已花费金额
        var arr = [...this.value.productList, ...this.value.presentList]
        arr.forEach(item => {
          expenditure += item.completeLesson * item.univalence
        })

        this.surplusPrice = this.value.totalPrice - expenditure
        this.priceValue = this.surplusPrice
        this.subjectListOfGive = this.subjectList

        this.presentData = this.value.presentList
        return
      }

      if (this.giveAction && this.giveAction.type && this.giveAction.type == 'change') {
        // console.log('chang，计算两份合同的差价', this.totalPrice, this.giveAction.surplusPrice)
        this.refundMonry = this.totalPrice - this.giveAction.surplusPrice
        this.priceValue = this.totalPrice
      }
      this.havePresent()
    },

    // 有累积赠送，生成presentData，向父组件发送数据
    async havePresent() {
      var obj = await this.getMaxGive(this.purchaseInGive)

      // 判断后端有没有返回值
      // 两种情况：1 后端没有返回值，2 后端返回值，但是选择的都是不参加累计的
      this.giveObj = obj ? obj.lastPresent : null
      this.presentRules = null
      this.maxGive = 0
      this.surplusGive = 0

      if (this.giveObj) {
        this.presentRules = obj.presentRules
        this.presentRules.coachType = this.giveAction.searchJson.coachType

        // this.createSubject()
        this.jointpresentData(this.giveObj)
        this.maxGive = this.presentRules.presenterCount
        this.surplusGive = this.maxGive
      }
      this.sendData()
    },

    // 有累积赠送，生成presentData，向父组件发送数据
    // async havePresent() {
    //   var obj = await this.getMaxGive(this.purchaseInGive)
    //   this.giveObj = obj.lastPresent
    //   this.presentRules = obj.presentRules

    //   console.log('giveObj1', this.giveObj)
    //   console.log('presentRules1', this.presentRules)

    //   if (this.giveObj) {
    //     this.createSubject()
    //     this.jointpresentData(this.giveObj)
    //     this.maxGive = giveObj.presentRules.presenterCount
    //     this.presentRules = {
    //       coachType: this.giveAction.searchJson.coachType,
    //       classes: giveObj.presentRules.classes,
    //       give: giveObj.presentRules.give
    //     }
    //     this.surplusGive = this.maxGive
    //   }
    //   this.sendData()
    // },

    async getMaxGive(purchaseInGive) {
      var parms = {
        customerId: this.giveAction.customerId,
        buyCount: purchaseInGive,
        coachType: this.giveAction.searchJson.coachType
      }
      return await QueryGiveAPI(parms).then(res => {
        if (res.data) {
          return {
            lastPresent: this.getLastPresentProduct(),
            presentRules: {
              'classes': res.data.classes, // 课数（购买数）
              'give': res.data.give, // 课数（赠送数）
              'presenterCount': res.data.presenterCount // 实际可赠送课节数
            }
          }
        }
        return null
      })
    },

    // 获取参与赠送的最后一个小套餐
    getLastPresentProduct() {
      var arr = this.tableData.filter(item => {
        return item.isGive == 1
      })
      if (arr.length) {
        return {
          mealProductId: arr[arr.length - 1].combo_number, // 大套餐Id
          giftProductId: arr[arr.length - 1].detailsId, // 小套餐Id
          mealType: arr[arr.length - 1].mealType, // 课程类型
          name: arr[arr.length - 1].productType + '--' + arr[arr.length - 1].productName
        }
      }
    },

    jointpresentData(giveObj) {
      // console.log('生成累计赠送', giveObj)
      this.presentData = [
        {
          subject: '', // 科目
          mealProductId: giveObj.mealProductId, // 大套餐
          giftProductId: giveObj.giftProductId, // 小套餐
          presentLesson: 0, // 赠送
          planeLesson: 0, // 排课
          completeLesson: 0, // 已完成
          univalence: '', // 均价
          dataIndex: this.presentDataIndex, // 标识
          type: 2, // 类型。标识累计赠送
          mealType: giveObj.mealType // 对应大套餐类型
        }
      ]
    },

    // 区分引流和其他课程，计算总价
    calculateTotalPrice() {
      var priceObject = {}

      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i]

        if (element.mealType == '引流课') {
          if (!priceObject[`mealId_${element.combo_number}`]) {
            priceObject[`mealId_${element.combo_number}`] = element.salePrice
          }
        } else {
          if (!priceObject[`detailsId_${element.detailsId}`]) {
            priceObject[`detailsId${element.detailsId}`] = element.salePrice
          }
        }
      }

      // console.log('价格对象', priceObject)
      var totalPrice = 0
      for (const k in priceObject) {
        totalPrice += Number(priceObject[k])
      }
      this.totalPrice = totalPrice
      // console.log('价格', this.totalPrice, totalPrice)
    },

    grooveLessonDisabled(row) {
      // console.log('常规禁用行数据', row)
      return this.isDisabled || row.disabled || row.normLesson === 0
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

    async changePurchaseLesson(row) {
      if (!(/(^[0-9]\d*$)/.test(row.purchaseLesson))) {
        this.$message.warning('只能输入正整数！')
        row.purchaseLesson = 0
      }
      // 循环小套餐，达到标准课次，常规赠送可以编辑
      var lesson = 0 // 小套餐购买课次和
      for (let i = 0; i < this.OrderLeve2Arr.length; i++) {
        const item = this.OrderLeve2Arr[i]
        for (let j = 0; j < item.length; j++) {
          const element = item[j].item
          if (element.detailsId === row.detailsId) {
            lesson += Number(element.purchaseLesson)
            var _lesson = Number(element.purchaseLesson)
            if (lesson > element.comboNormLesson) {
              element.purchaseLesson = 0
              lesson -= _lesson
              this.$message.warning('购买课次不能大于套餐标准课次')
            }
          }
        }
      }
      console.log('该小套餐购买和', lesson)

      // 判断是否达到标准课次，常规赠送可以编辑
      var buyCounts = 0 // 合同购买课次和
      var inGiveBuyCounts = 0 // 合同购买课次和

      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i]
        console.log('tableData:', element)
        if (element.detailsId === row.detailsId) {
          element.grooveLesson = 0
          // 小套餐的购买和==套餐标准课次，且标准赠送不为0，可编辑，否则禁用
          element.disabled = !(lesson === row.comboNormLesson && row.normLesson)
          this.$set(this.tableData, i, element)

          // this.changeGrooveLesson(row)
        }
        buyCounts += Number(element.purchaseLesson)
        if (element.isGive) {
          inGiveBuyCounts += Number(element.purchaseLesson)
        }
      }

      this.purchaseLesson = buyCounts
      this.purchaseInGive = inGiveBuyCounts
      this.presentData = null

      // 改变总价
      this.changePrice(row, lesson)

      var obj = await this.getMaxGive(this.purchaseInGive)
      this.giveObj = obj ? obj.lastPresent : null
      this.presentRules = null
      this.maxGive = 0
      this.surplusGive = 0

      if (this.giveObj) {
        // this.createSubject()
        this.presentRules = obj.presentRules
        this.presentRules.coachType = this.giveAction.searchJson.coachType

        this.jointpresentData(this.giveObj)
        this.maxGive = this.presentRules.presenterCount
        this.surplusGive = this.maxGive
      }
      this.sendData()
    },

    // 改变价格
    changePrice(row, lesson, calculateUnivalence = true) {
      console.log('改变价格row信息', row)
      if (row.mealType != '引流课') {
        var totalPrice = 0
        var obj = {}

        for (let i = 0; i < this.tableData.length; i++) {
          const element = this.tableData[i]
          // 修改原价、折后价
          if (element.detailsId === row.detailsId) {
            // var univalence = this.action ? this.action.univalence : this.value.univalence
            var univalence = this.action.univalence !== '' ? this.action.univalence : this.value.univalence
            element.price = lesson * univalence
            element.salePrice = element.price * element.discount / 100
          }
          // 保存全部的折后价
          obj[element.detailsId ] = element.salePrice
        }

        for (const k in obj) {
          if (!obj.hasOwnProperty(k)) break
          totalPrice += Number(obj[k])
        }
        obj = null
        this.totalPrice = totalPrice
        console.log('总价', totalPrice)
      }
      this.calculateTotalPrice()
      this.priceValue = this.totalPrice
      if (this.giveAction && this.giveAction.type == 'change') {
        // this.priceValue = this.totalPrice - this.giveAction.surplusPrice
        this.refundMonry = this.totalPrice - this.giveAction.surplusPrice
      }
      // this.calculateUnivalence({ row, lesson })
    },

    // 改变赠送课次
    changeGrooveLesson(row) {
      if (!(/(^[0-9]\d*$)/.test(row.grooveLesson))) {
        this.$message.warning('只能输入正整数！')
        row.grooveLesson = 0
      }
      var giveLesson = 0 // 小套餐赠送课次和
      var purchaseLesson = 0 // 小套餐购买课次和
      // 常规赠送限制
      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i]
        console.log('tableData:', element)
        if (element.detailsId === row.detailsId) {
          giveLesson += Number(element.grooveLesson)
          purchaseLesson += Number(element.purchaseLesson)
          console.log('该小套餐的赠送课次和', giveLesson, '该小套餐的购买课次和', purchaseLesson)
          var _lesson = Number(element.grooveLesson)
          if (giveLesson > element.normLesson) {
            element.grooveLesson = 0
            giveLesson -= _lesson
            this.$message.warning('常规赠送课次不能大于套餐标准赠送课次')
          }
        }
      }

      var grooveCount = 0 // 参与累积赠送的常规赠送课次之和
      var allGiveLesson = 0 // 全部常规赠送课次之和
      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i]
        console.log('tableData:', element)
        if (element.isGive == 1) {
          grooveCount += Number(element.grooveLesson)
          var _lesson = Number(element.grooveLesson)
          // 赠送课次大于大于最大赠送课次
          if (grooveCount > this.maxGive) {
            row.grooveLesson = 0
            grooveCount -= _lesson
            console.log('grooveCount:', grooveCount)
            this.$message.warning(`赠送课次之和不能大于实际可赠与课次`)
          }
        }
        allGiveLesson += Number(element.grooveLesson)
      }
      this.grooveLesson = grooveCount
      this.allGiveLesson = allGiveLesson
      this.surplusGive = this.maxGive - grooveCount < 0 ? 0 : this.maxGive - grooveCount
      this.presentData = null
      if (this.giveObj) {
        this.jointpresentData(this.giveObj)
      }

      // 该小套餐的购买课次+常规课次
      var lesson = purchaseLesson + giveLesson
      console.log('该小套餐的购买课次+常规课次', lesson)
      this.calculateUnivalence({ row, lesson })
      this.sendData()
    },

    // 计算均价
    calculateUnivalence(options) {
      console.log('修改的哪一行', options.row)
      if (options.row.type && options.row.type == 2) {
        var obj = objDeepCopy(options.row)
        obj.combo_number = obj.mealProductId
        obj.detailsId = obj.giftProductId
        options.row = obj
      }

      if (options.isAccumulationChange) {
        options.lesson += this.mealLesson(options.row)
        console.log('包含累计赠送的课次', options)
        var avgPrice = this.calculateMealUnivalence(options)
        this.presentData.forEach(item => {
          item.univalence = item.presentLesson == 0 ? '' : avgPrice
        })
        return
      }
      // 只计算套餐价格
      this.calculateMealUnivalence(options)
    },

    // 通过累计找到小套餐，计算小套餐的课次和(购买+常规赠)
    mealLesson(obj) {
      var lesson = 0
      this.tableData.forEach(item => {
        if (item.detailsId == obj.detailsId) {
          lesson += Number(item.purchaseLesson) + Number(item.grooveLesson)
        }
      })
      console.log('小套餐的课次和(购买+常规赠)', lesson)
      return lesson
    },

    // 套餐计算均价
    calculateMealUnivalence(options) {
      var avgPrice = ''
      if (options.row.mealType == '引流课') {
        // this.getDrainageMealInfo(options.row.combo_number)
        avgPrice = this.drainageUnivalence(options.row.combo_number)
      } else {
        // 正价套餐计算
        for (let i = 0; i < this.tableData.length; i++) {
          const element = this.tableData[i]
          console.log('正价套餐计算均价', options.row, options.lesson)
          // 修改均价
          if (element.detailsId === options.row.detailsId) {
            avgPrice = element.univalence = options.lesson ? (element.salePrice / options.lesson).toFixed(2) : 0
          }
        }
      }
      return avgPrice
    },

    // 计算引流套餐均价
    drainageUnivalence(id, isAccumulationChange = false) {
      console.log('修改id', id)
      var lesson = 0
      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i]
        if (element.combo_number == id) {
          lesson += Number(element.purchaseLesson) + Number(element.grooveLesson)

          console.log('aaa1-', Number(element.purchaseLesson) + Number(element.grooveLesson))
        }
      }
      if (isAccumulationChange) {
        // console.log('!!!')
        // lesson += this.accumulation.lesson
      }
      console.log('引流大套餐', lesson)

      // 修改均价
      var avgPrice = ''
      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i]
        if (element.combo_number === id) {
          // console.log('adada111', element)
          avgPrice = element.univalence = lesson ? (element.salePrice / lesson).toFixed(2) : 0
        }
      }
      return avgPrice
    },

    // 改变累计赠送课次
    changeLesson(row) {
      if (!(/(^[0-9]\d*$)/.test(row.presentLesson))) {
        this.$message.warning('只能输入正整数！')
        row.presentLesson = 0
      }
      if (row.presentLesson == 0) {
        row.univalence = ''
      }

      // 计算累积赠送
      var lesson = 0
      for (let i = 0; i < this.presentData.length; i++) {
        const element = this.presentData[i]
        lesson += Number(element.presentLesson)
        var _lesson = Number(element.presentLesson)
        if (lesson > this.surplusGive) {
          element.presentLesson = 0
          lesson -= _lesson
          this.$message.warning('累计赠送课次不能大于剩余可赠送课次')
        }
      }
      this.accumulativeLesson = lesson

      // 计算均价
      this.calculateUnivalence({
        row: this.presentData[0], //
        lesson,
        isAccumulationChange: true
      })

      this.sendData()
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
          this.tableData.splice(index + 1, 0, obj)
          break
        }
      }
      this.getOrderNumber()
    },

    // 减少一行数据
    minusSubjectHandle(dataIndex) {
      var deleInfo = null
      for (let index = 0; index < this.tableData.length; index++) {
        const element = this.tableData[index]
        if (element.dataIndex === dataIndex) {
          deleInfo = element
          this.tableData.splice(index, 1)
          break
        }
      }
      this.getOrderNumber()
      /*
        找到删除科目的小套，如果小套购买课次和=标准课次，则不处理
        否则重新计算原价，常规赠送禁用
       */
      for (let index = 0; index < this.tableData.length; index++) {
        const element = this.tableData[index]
        var lesson = 0
        if (deleInfo.detailsId == element.detailsId) {
          lesson += Number(element.purchaseLesson)
        }
      }

      if (lesson != deleInfo.comboNormLesson) {
        for (let index = 0; index < this.tableData.length; index++) {
          this.changePurchaseLesson(deleInfo)
        }
      }
    },

    plusPresentHandle(dataIndex) {
      console.log('增加赠送')
      this.presentDataIndex++
      for (let index = 0; index < this.presentData.length; index++) {
        const element = this.presentData[index]
        if (element.dataIndex === dataIndex) {
          var obj = { ...element }
          obj.subject = ''
          obj.presentLesson = 0
          obj.univalence = ''
          obj.dataIndex = this.presentDataIndex
          this.presentData.splice(index + 1, 0, obj)
          break
        }
      }
    },

    minusPresentHandle(dataIndex) {
      console.log('减少赠送')
      for (let index = 0; index < this.presentData.length; index++) {
        const element = this.presentData[index]
        if (element.dataIndex === dataIndex) {
          this.presentData.splice(index, 1)
          break
        }
      }

      var lesson = 0
      this.presentData.filter(item => {
        if (item.presentLesson > 0) {
          lesson += Number(item.presentLesson)
          return true
        }
      })

      // 计算均价
      this.calculateUnivalence({
        row: this.presentData[0], //
        lesson,
        isAccumulationChange: true
      })

      this.sendData()
    },

    // 改变科目
    changeSubject(row) {
      console.log('row信息1', row)
      if (!this.giveObj) return

      if (this.giveObj.giftProductId != row.detailsId) {
        return
      }

      this.presentData.forEach(item => {
        item.subject = ''
      })
      // this.restrictSubject()

      // old-change使用sublistList
      // if (this.giveAction && this.giveAction.type && this.giveAction.type == 'old-change') {
      //   this.subjectListOfGive = this.subjectList
      // } else {
      //   this.createSubject()
      // }

      this.sendData()
    },

    // 生成累计赠送的科目
    createSubject() {
      var arr = []
      for (let i = 0; i < this.tableData.length; i++) {
        const element = this.tableData[i]
        // console.log('element', element)
        // console.log(this.giveObj)

        if (this.giveObj.giftProductId === element.detailsId && element.subject != '') {
          // console.log('kem', this.subjectList)
          for (let j = 0; j < this.subjectList.length; j++) {
            const item = this.subjectList[j]
            if (item.id == element.subject) {
              arr.push(item)
            }
          }
        }
      }
      // console.log('累计赠送的科目', arr)
      this.subjectListOfGive = arr
    },



    // 向父组件发送数据
    sendData() {
      // console.log('combo向父组件发送数据')
      if (this.giveAction && this.giveAction.type && this.giveAction.type == 'old-change') {
        this.issurplus = true
      }
      var obj = {
        // tableData: this.tableData,
        totalclassTime: this.purchaseLesson + this.allGiveLesson + this.accumulativeLesson, // 总课次
        purchaseLesson: this.purchaseLesson, // 套餐购买课次和
        presenterCount: this.grooveLesson + this.accumulativeLesson, // 全部赠送

        drainage: this.drainage, // 是否为引流
        totalPrice: this.totalPrice, // 总价
        presentRules: this.presentRules ? `购买辅导方式为${this.presentRules.coachType}的，购买${this.presentRules.classes}节课，可赠送${this.presentRules.give}节课。` : '', // 赠送规则
        issurplus: this.issurplus,
        surplusPrice: this.surplusPrice,
        refundMonry: this.refundMonry
      }


      var filterTableData = this.tableData.filter(item => {
        if (item.purchaseLesson > 0) {
          return true
        }
      })

      // console.log('guolv', filterTableData)
      obj.tableData = filterTableData

      if (this.presentData) {
        var filterPresentData = this.presentData.filter(item => {
          if (item.presentLesson > 0) {
            return true
          }
        })
        // console.log('guolv后的', filterPresentData)
        obj.tableData = [...filterTableData, ...filterPresentData]
      }
      // console.log(obj)
      // 变更增加充值返回金额
      this.$emit('structure-data', obj)
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
        columnIndex === 3 ||
        columnIndex === 4 ||
        columnIndex === 9 ||
        columnIndex === 11 ||
        columnIndex === 12
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
