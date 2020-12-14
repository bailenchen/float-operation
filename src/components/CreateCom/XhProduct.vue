<template>
  <div>
    <div class="handel-header">
      <el-popover
        v-if="isAddCombo"
        v-model="showPopover"
        placement="left-end"
        width="700"
        style="padding: 0 !important;"
        trigger="click">
        <crm-relative
          v-if="showSelectView"
          ref="crmrelative"
          :radio="false"
          :show="showPopover"
          :selected-data="selectedData"
          :action="action"
          crm-type="productSetMeal"
          @close="showPopover=false"
          @changeCheckout="selectInfos"/>
        <el-button
          slot="reference"
          type="primary"
          @click="addComboHandle">添加套餐</el-button>
      </el-popover>
    </div>
    <!-- 套餐名称按钮 -->
    <div class="combo-group">
      <el-button
        v-for="(item, index) in selectComobo"
        :class="{select: item.select}"
        :key="index"
        @click="selectComoboHandle(item, index)"
      >{{ item.data.name }}</el-button>
    </div>
    <p v-if="!value.products">当前可赠送课次：<span class="red">{{ currentGive }}</span></p>
    <combo
      :action="comboAction"
      :give-action="action"
      :value="comboValue"
      :is-disabled="isDisabled"
      :subject-list="subjectList"
      :accumulation="accumulation"
      @structure-data="structureDataHandle"
      @change-price="totalPriceHandle"/>
    <!-- 累计赠送课程 -->
    <div>
      累计赠送课程
      <el-table
        :data="present"
        style="width: 100%">
        <el-table-column prop="subject" label="科目" width="" align="center">
          <template slot-scope="scope">
            <el-select v-model="scope.row.subject" :disabled="isDisabled" placeholder="请选择" @change="selectSubjectHandle">
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
            <el-input v-model="scope.row.presentLesson" :disabled="isDisabled" @change="changeLesson(scope.row)" />
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
              v-show="minusShow"
              type="danger"
              icon="el-icon-minus"
              circle
              @click="minusPresentHandle(scope.row.dataIndex)"
            />
          </template>
        </el-table-column>
      </el-table>
      <div v-show="presentRules">
        累计赠送规则：购买辅导方式为{{ presentRules.coachType }}的，购买{{ presentRules.classes }}节课，可赠送{{ presentRules.give }}节课。累计可赠送课次：{{ surplusGive }}
      </div>
    </div>
    <flexbox class="handle-footer">
      <div class="total-info">
        {{ priceText }}：
        <el-input
          v-wk-number
          v-model="priceValue"
          style="width: 120px"
          placeholder="请输入"
          type="number"
          disabled/>&nbsp;元
      </div>
    </flexbox>
  </div>
</template>
<script type="text/javascript">
import objMixin from './objMixin'
import CrmRelative from '@/components/CreateCom/CrmRelative'
import Combo from '@/views/customermanagement/contract/components/Combo'
import { crmProductIndex } from '@/api/customermanagement/product'
import { QueryAdminSubject } from '@/api/systemManagement/params'
import { queryIsNewByCustomerIdAPI } from '@/api/customermanagement/contract'
import { objDeepCopy } from '../../utils'

export default {
  name: 'XhProduct', // 关联产品
  components: {
    CrmRelative,
    Combo
  },
  mixins: [objMixin],
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
      showPopover: false, // 展示产品框
      showSelectView: false, // 内容
      productList: [],
      priceValue: 0, // 总金额、剩余金额、最终价格
      totalPrice: 0, // 总金额
      surplusPrice: 0, // 剩余金额
      finalPrice: 0, // 最终价格
      discountRate: '',
      selectedData: { productSetMeal: [] },
      comboAction: null,
      univalence: 0, // 单价
      subjectListOfCombo: null, // 科目列表
      subjectList: null,
      // maxIndex: 0,
      selectComobo: null, // 套餐数组
      present: null, // 赠送table相关数据
      productData: null,
      accumulation: {
        data: [],
        lesson: 0
      }, // 累计赠送相关数据
      presentDataIndex: 0,
      purchaseLesson: 0, // 所有套餐总课次
      presentRules: '', // 赠送规则文案
      // presenterCount: 0, // 实际累计可赠送课次
      currentGive: 0, // 当前可赠送课次
      surplusGive: 0, // 剩余可赠送课次
      comboComponentData: null,
      isAddCombo: false,
      renew: 1, // 续签或新签
      isNew: 1, // 0:续签 1:新签 2:引流
      comboValue: null,
      priceText: '最终价格',
      giveObj: null, // 累计的信息
      completeLesson: 0, // 已完成课次
      surplusPriceObj: null
    }
  },
  computed: {
    minusShow() {
      return this.present.length > 1
    },
    isDisabled() {
      // 变更，且有值
      if (this.action.type && this.value.products) {
        return true
      }
      return false
    }
  },
  watch: {
    dataValue: function(value) {
      this.refreshProductList()
    },
    productList() {
      this.selectedData = { productSetMeal: this.productList || [] }
      if (this.selectedData.productSetMeal.length > 0) {
        var arr = []
        this.selectedData.productSetMeal.forEach(item => {
          arr.push({
            select: true,
            data: item
          })
        })
        this.selectComobo = arr
        if (this.univalence == '' || !this.subjectList) {
          console.log('没有价格或科目')
          return
        }
        this.jointData()
      }
      console.log('this.comboAction', this.comboAction)
    },
    action: {
      handler(val) {
        console.log('辅导方式、年级、学员变化1', val)
        if (val.customerId) {
          queryIsNewByCustomerIdAPI({ customerId: val.customerId }).then(res => {
            this.renew = res.data
          }).catch(() => {})
        }
        // 置空
        this.selectComobo = null
        if (this.comboAction) {
          this.comboAction.productSetMeal = []
        }
        this.present = null
        this.purchaseLesson = 0
        this.presentRules = ''
        this.surplusPresenter = 0
        this.totalPrice = 0
        this.isNew = 1
        if (val.searchJson.coachType && val.searchJson.gradeId) {
          this.getUnivalence()
        }
      },
      deep: true,
      immediate: true
    }

  },
  created() {
    console.log('传入的value1', this.value)
    // if (this.action.type && this.action.type == 'change') {
    //   this.priceText = '最终价格'
    // }
    // 获取科目
    QueryAdminSubject().then(res => {
      this.subjectList = res.data
      this.subjectListOfCombo = objDeepCopy(res.data)
      if (this.value.products) {
        this.structurePresentByValue()
      } else if (this.value.isEdit) {
        this.productList = this.value.meal
      }
    }).catch(() => {})
  },
  mounted() {
    // this.refreshProductList()
  },
  methods: {
    /**
     * 刷新数据
     */
    refreshProductList() {
      // this.productList = this.dataValue.product || []
      // this.totalPrice = this.dataValue.totalPrice || 0
      // this.discountRate = this.dataValue.discountRate || ''
    },
    /** 选中 */
    selectInfos(data) {
      console.log('选中的套餐', data)
      if (data.data) {
        this.productList = data.data
      }
    },
    addComboHandle() {
      this.showSelectView = true
    },
    getUnivalence() {
      const params = {
        type: 4,
        searchJson: this.action.searchJson
      }
      crmProductIndex(params).then(res => {
        // 获取课次单价
        this.univalence = res.data.list[0] ? res.data.list[0].price : ''
        if (!this.univalence) {
          this.$message.error('该年级与辅导方式没有对应单品')
        }
        if (this.action.customerId) {
          this.isAddCombo = true
        }
      })
    },
    jointData() {
      console.log('jointData')

      var arr = []
      var totalPrice = 0
      this.selectComobo.forEach(item => {
        if (item.select) {
          totalPrice = (totalPrice * 100 + Number(item.data.price) * 100) / 100
          console.log('jointDat中', item.data)
          arr.push(item.data)
        }
      })

      this.totalPrice = totalPrice
      this.priceValue = this.totalPrice

      console.log('新的数组', arr, totalPrice, this.totalPrice)

      this.comboAction = {
        univalence: this.univalence,
        // subjectList: this.subjectList,
        originalPresenter: this.originalPresenter,
        productSetMeal: arr
      }

      if (this.action.attr && this.action.attr == 'change') {
        console.log('计算最终价格')
        this.finalPrice = this.totalPrice - this.action.surplusPrice
        this.priceValue = this.finalPrice
        this.comboAction.type = 'change'
      }
    },
    selectComoboHandle(item, index) {
      console.log('选择', index, this.selectComobo[index])
      item.select = !item.select
      var arr = []
      var totalPrice = 0
      this.selectComobo.forEach(item => {
        if (item.select) {
          totalPrice = (totalPrice * 100 + Number(item.data.price) * 100) / 100
          arr.push(item.data)
        }
      })
      console.log('新的数组', arr, totalPrice)
      this.totalPrice = totalPrice

      this.comboAction = {
        univalence: this.univalence,
        // subjectList: this.subjectList,
        productSetMeal: arr
      }
    },
    plusPresentHandle(dataIndex) {
      console.log('增加赠送')
      // this.tableData.splice(index + 1, 0, obj)
      this.presentDataIndex++
      for (let index = 0; index < this.present.length; index++) {
        const element = this.present[index]
        if (element.dataIndex === dataIndex) {
          var obj = { ...element }
          obj.subject = ''
          obj.presentLesson = 0
          obj.univalence = ''
          obj.dataIndex = this.presentDataIndex
          this.present.splice(index + 1, 0, obj)
          break
        }
      }
    },
    minusPresentHandle(dataIndex) {
      console.log('减少赠送')
      for (let index = 0; index < this.present.length; index++) {
        const element = this.present[index]
        if (element.dataIndex === dataIndex) {
          this.present.splice(index, 1)
          break
        }
      }
    },
    getBigMealName(id) {
      var name = ''
      this.value.products.mealProducts.forEach(item => {
        if (item.productId === id) {
          name = item.name
        }
      })
      return name
    },
    getMealName(id) {
      var name = ''
      this.value.products.giftProducts.forEach(item => {
        if (item.detailsId === id) {
          name = item.detailsName
        }
      })
      return name
    },
    // 关联大套餐获取属性
    getAttrOfBigMeal(id, attr) {
      var val = null
      this.value.products.mealProducts.forEach(item => {
        if (item.productId == id) {
          val = item[attr]
        }
      })
      return val
    },
    // 关联小套餐获取属性
    getAttrOfMeal(id, attr) {
      var val = null
      this.value.products.giftProducts.forEach(item => {
        if (item.detailsId == id) {
          val = item[attr]
        }
      })
      return val
    },
    structurePresentByValue() {
      this.priceText = this.action.type && this.action.type == 'old-change' ? '剩余金额' : '最终价格'
      var arr = []
      var arr2 = []
      var expenditure = 0 // 已花费金额
      var dataIndex = 1
      var dataIndexofPresent = 0
      this.value.products.productList.forEach(item => {
        console.log('aaa--', item)
        // surplusPrice += item.finishCourse * item.univalence
        expenditure += 1 * item.price
        console.log('已消耗金额', expenditure)
        if (item.type === 1) {
          var obj = {
            productType: this.getBigMealName(item.mealProductId),
            productName: this.getMealName(item.giftProductId),
            subject: item.productId,
            comboNormLesson: this.getAttrOfMeal(item.giftProductId, 'purchaseFrequency'),
            normLesson: this.getAttrOfMeal(item.giftProductId, 'giveFrequency'),
            purchaseLesson: item.courseSum, // 购买课次
            grooveLesson: item.presenterCourseSum, // 常规赠送课次
            planeLesson: item.alreadyCourse, // 已排课课次
            completeLesson: item.finishCourse, // 已完成课次
            price: item.salesPrice, // 原价
            discount: this.getAttrOfBigMeal(item.mealProductId, 'warningLine'), // 折扣比例
            salePrice: item.salesPrice, // 折后价格
            univalence: item.price, // 均价

            combo_number: item.mealProductId, // 大套餐ID
            dataIndex, // 标识
            detailsId: item.giftProductId, // 小套餐ID
            originalPurchaseLesson: this.getAttrOfMeal(item.giftProductId, 'purchaseFrequency'), // 小套餐购买课次
            originalGrooveLesson: this.getAttrOfMeal(item.giftProductId, 'giveFrequency'), // 小套餐赠送课次
            mealType: this.getAttrOfBigMeal(item.mealProductId, 'courseType'), // 大套餐类型：引流、特价、正价
            isGive: this.getAttrOfMeal(item.giftProductId, 'isGive')
          }
          dataIndex++
          arr.push(obj)
        }

        if (item.type === 2) {
          var obj = {
            subject: item.productId,
            mealProductId: item.mealProductId,
            giftProductId: item.giftProductId,
            presentLesson: item.courseSum,
            planeLesson: item.alreadyCourse,
            completeLesson: item.finishCourse,
            univalence: item.price,
            dataIndex: dataIndexofPresent,
            type: 2,
            mealType: this.getAttrOfBigMeal(item.mealProductId, 'courseType') // 大套餐类型：引流、特价、正价
          }
          dataIndexofPresent++
          arr2.push(obj)
        }
      })

      this.present = arr2

      this.totalPrice = this.value.totalPrice
      this.priceValue = this.totalPrice

      // 合同变更-原合同
      if (this.action.type && this.action.type == 'old-change') {
        console.log('旧合同')
        // this.priceText = '剩余金额'
        this.surplusPriceObj = {
          issurplus: true,
          surplusPrice: (this.value.totalPrice * 100 - expenditure * 100) / 100
        }
      }


      this.type = 'change'

      this.comboValue = {
        productList: arr
      }
    },

    structureDataHandle(obj) {
      console.log('combo组件发送的数据1', obj)

      this.comboComponentData = obj
      this.purchaseLesson = obj.purchaseLesson
      this.isNew = obj.drainage ? 2 : this.renew
      this.totalPrice = obj.totalPrice
      this.priceValue = this.totalPrice

      this.currentGive = obj.currentGive // 当前可赠送课次
      this.surplusGive = obj.surplusGive
      this.presentRules = obj.presentRules
      this.giveObj = obj.giveObj

      // 限制累计的科目
      if (obj.giveObj.disableds) {
        console.log('限制累计的科目')
        // var arr = this.subjectList
        for (let index = 0; index < this.subjectList.length; index++) {
          const element = this.subjectList[index]
          var res = obj.giveObj.disableds.includes(element.id)
          console.log('结果1', res)
          element.disabled = !!res
          // if (res) {
          //   element.disabled = true
          //   this.$set(this.subjectList, index, element)
          // } else {
          //   element.disabled = false
          // }
          this.$set(this.subjectList, index, element)
        }
        // this.subjectList = arr
      }

      if (obj.tableData.length > 0 && !Object.keys(this.value).length) {
        this.present = null
        this.jointpresentData()
      }

      // var emitObj = {}

      if (this.present) {
        var lesson = 0
        this.present.forEach(item => {
          lesson += Number(item.presentLesson)
        })
        var emitObj = {
          product: [...this.comboComponentData.tableData, ...this.present],
          totalclassTime: this.comboComponentData.totalclassTime + lesson
        }
      }

      if (this.action.type && this.action.type == 'old-change') {
        emitObj = { ...emitObj, ...this.surplusPriceObj }
        this.priceValue = this.surplusPriceObj.surplusPrice
      }

      if (this.action.type && this.action.type == 'change') {
        emitObj.refundMonry = this.totalPrice - this.action.surplusPrice
      }

      this.sendData(emitObj)
    },
    jointpresentData() {
      if (!this.action.customerId) {
        return
      }

      this.present = [
        {
          subject: '',
          mealProductId: this.giveObj.mealProductId,
          giftProductId: this.giveObj.giftProductId,
          presentLesson: 0,
          planeLesson: 0,
          completeLesson: 0,
          univalence: '',
          dataIndex: this.presentDataIndex,
          type: 2,
          mealType: this.giveObj.mealType
        }
      ]
    },
    totalPriceHandle(obj) {
      this.totalPrice = obj.totalPrice
      this.priceValue = this.totalPrice
      if (this.action.attr && this.action.attr == 'change') {
        this.finalPrice = this.totalPrice - this.action.surplusPrice
        this.priceValue = this.finalPrice
      }

      // 购买课程变化了，发送接口，从新生成
      var emitObj = {
        surplusPrice: this.action.surplusPrice,
        buyCount: obj.buyCount,
        totalclassTime: obj.totalclassTime, // 套餐总课次(购买+赠送)+累计赠送
        product: this.comboComponentData.tableData
      }

      // 不是累计导致的计算单价
      if (!obj.isAccumulationChange) {
        this.surplusGive = obj.surplusGive
        // 清空present
        this.jointpresentData()
      } else {
        var lessons = 0 // 累计赠送课次和
        var arr = this.present.filter(item => {
          if (item.presentLesson > 0) {
            item.univalence = obj.univalence
            lessons += Number(item.presentLesson)
            return true
          }
        })
        emitObj.totalclassTime += lessons
        emitObj.product = [...this.comboComponentData.tableData, ...arr]
      }

      console.log('asa', emitObj)
      this.sendData(emitObj)
    },

    // 向父组件发送数据
    sendData(obj) {
      console.log('sendData中', obj)
      this.productData = {
        index: this.index,
        value: {
          product: this.comboComponentData.tableData, // 列表
          totalPrice: this.totalPrice, // 套餐价格
          // refundMonry: this.priceValue, // 充值返还金额
          refundMonry: 0, // 充值返还金额
          issurplus: false,
          surplusPrice: this.action.surplusPrice, // 剩余金额
          isNew: this.isNew, // 合同属性
          totalclassTime: this.comboComponentData.totalclassTime, // 总课次
          buyCount: this.comboComponentData.purchaseLesson, // 购买课次
          presenterCount: this.comboComponentData.grooveLesson // 赠送课次
        },
        data: {
          fieldName: 'productSetMeal'
        }
      }

      if (this.action.type && this.action.type == 'change') {
        this.productData.refundMonry = this.priceValue
      }


      if (obj) {
        for (const k in obj) {
          if (!obj.hasOwnProperty(k)) break
          console.log('key', k)
          this.productData.value[k] = obj[k]
        }
      }

      this.$emit('value-change', this.productData)
    },
    selectSubjectHandle(val) {
      // 如果赠送课次是0不处理
      console.log('赠送中选择了科目', val)
    },
    changeLesson(row) {
      if (row.presentLesson == 0) {
        row.univalence = ''
      }
      var lesson = 0
      for (let i = 0; i < this.present.length; i++) {
        const element = this.present[i]
        lesson += Number(element.presentLesson)
        var _lesson = Number(element.presentLesson)
        if (lesson > this.surplusGive) {
          element.presentLesson = 0
          lesson -= _lesson
          this.$message.warning('累计赠送课次不能大于剩余可赠送课次')
        }
      }
      var arr = this.present.filter(item => {
        if (item.presentLesson > 0) {
          return true
        }
      })
      console.log('大于1的数组', arr)
      this.accumulation = {
        data: arr,
        lesson
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.handel-header {
  overflow: hidden;
  button {
    float: right;
    margin-bottom: 10px;
  }
}

.el-table /deep/ thead th {
  font-size: 12px;
}

.el-table /deep/ tbody tr td {
  font-size: 12px;
}

.handle-footer {
  position: relative;
  font-size: 12px;
  padding: 5px;
  height: 50px;
  .discount-title {
    color: #666;
  }
  .total-info {
    position: absolute;
    right: 20px;
    top: 5px;
    .info-yellow {
      color: #fd715a;
    }
  }
}

.combo-group {
  .select {
    border: 1px solid #2362fb;
    color: #2362fb;
  }
}
.red {
  color: #f00;
}
</style>
