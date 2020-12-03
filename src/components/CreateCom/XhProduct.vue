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
    <p v-if="!value.products">实际可赠送课次：<span class="red">{{ surplusPresenter }}</span></p>
    <combo
      :action="comboAction"
      :value="comboValue"
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
            <el-select v-model="scope.row.subject" :disabled="!!value.products" placeholder="请选择" @change="selectSubjectHandle">
              <el-option
                v-for="(item, index) in subjectList"
                :key="index"
                :label="item.subjectName"
                :value="item.id"
              />
            </el-select>
          </template>
        </el-table-column>

        <el-table-column prop="presentLesson" label="累计赠送课次" width="" align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.presentLesson" :disabled="!!value.products" @change="changeLesson" />
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
          label="单节课价格"/>
        <el-table-column v-if="!value.products" prop="" label="操作" width="100" align="center">
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
        累计赠送规则：购买辅导方式为{{ presentRules.coachType }}的，购买{{ presentRules.classes }}节课，可赠送{{ presentRules.give }}节课。
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
      <!-- <div v-if="value.products" class="total-info">
        剩余金额：
        <el-input
          v-wk-number
          v-model="surplusPrice"
          style="width: 120px"
          placeholder="请输入"
          type="number"
          disabled/>&nbsp;元
      </div>
      <div v-else class="total-info">
        总金额：
        <el-input
          v-wk-number
          v-model="totalPrice"
          style="width: 120px"
          placeholder="请输入"
          type="number"
          disabled/>&nbsp;元
      </div> -->
    </flexbox>
  </div>
</template>
<script type="text/javascript">
import objMixin from './objMixin'
import CrmRelative from '@/components/CreateCom/CrmRelative'
import Combo from '@/views/customermanagement/contract/components/Combo'
import { crmProductIndex } from '@/api/customermanagement/product'
import { QueryAdminSubject } from '@/api/systemManagement/params'
import { QueryGiveAPI } from '@/api/customermanagement/contract'

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
      subjectList: null, // 科目列表
      // maxIndex: 0,
      selectComobo: null, // 套餐数组
      present: null, // 赠送table相关数据
      sendData: null,
      accumulation: {
        data: [],
        lesson: 0
      }, // 累计赠送相关数据
      presentDataIndex: 0,
      purchaseLesson: 0, // 所有套餐总课次
      presentRules: '', // 赠送规则文案
      // presenterCount: 0, // 实际累计可赠送课次
      surplusPresenter: 0, // 剩余可赠送课次
      comboComponentData: null,
      isAddCombo: false,
      drainage: false, // 引流课
      comboValue: null,
      priceText: '总金额'
      // originalPresenter: 0// 真实累计课次
    }
  },
  computed: {
    showPresent() {
      if (this.subjectList && this.univalence) {
        return true
      }
    },
    minusShow() {
      return this.present.length > 1
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
        console.log('辅导方式、年级、学员变化', val)
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
        this.drainage = false
        if (val.searchJson.coachType && val.searchJson.gradeId) {
          this.getUnivalence()
        }
      },
      deep: true
    }

  },
  created() {
    console.log('传入的value1', this.value)
    if (this.action.attr && this.action.attr == 'change') {
      this.priceText = '最终价格'
    }
    // 获取科目
    QueryAdminSubject().then(res => {
      this.subjectList = res.data
      // this.comboValue = {
      //   productList: this.value.productList
      // }
      if (this.value.products) {
        this.structurePresentByValue()
      }
    }).catch(() => {})
  },
  mounted() {
    this.refreshProductList()
  },
  methods: {
    /**
     * 刷新数据
     */
    refreshProductList() {
      this.productList = this.dataValue.product || []
      this.totalPrice = this.dataValue.totalPrice || 0
      this.discountRate = this.dataValue.discountRate || ''
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
      if (this.action.attr && this.action.attr == 'change') {
        this.finalPrice = this.totalPrice - this.action.surplusPrice
        this.priceValue = this.finalPrice
      }
      console.log('新的数组', arr, totalPrice, this.totalPrice)

      this.comboAction = {
        univalence: this.univalence,
        subjectList: this.subjectList,
        originalPresenter: this.originalPresenter,
        productSetMeal: arr
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
        subjectList: this.subjectList,
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
    structurePresentByValue() {
      this.priceText = '剩余金额'
      var arr = []
      var arr2 = []
      var completeLesson = 0
      this.value.products.productList.forEach(item => {
        console.log('aaa--', item)
        completeLesson += item.finishCourse
        if (item.type === 1) {
          var obj = {
            productType: this.getBigMealName(item.mealProductId),
            productName: this.getMealName(item.giftProductId),
            subject: item.productId,
            comboNormLesson: 0, // 计算出来
            normLesson: 0, // 计算出来
            purchaseLesson: item.courseSum, // 购买课次
            grooveLesson: 0, // 常规赠送课次
            planeLesson: item.alreadyCourse, // 已排课课次
            completeLesson: item.finishCourse, // 已完成课次
            price: item.salesPrice, // 大套餐价格
            univalence: item.price, // 单价
            combo_number: item.mealProductId
          }
          arr.push(obj)
        }

        if (item.type === 2) {
          var obj = {
            subject: item.productId,
            presentLesson: item.courseSum,
            planeLesson: item.alreadyCourse,
            completeLesson: item.finishCourse,
            univalence: item.price
          }
          arr2.push(obj)
        }
      })
      console.log('过滤的', arr)
      console.log('已完成', completeLesson)
      this.comboValue = {
        productList: arr
      }
      this.present = arr2
      // this.totalPrice = this.value.totalPrice
      // 计算剩余金额
      // completeLesson = 10
      this.surplusPrice = this.value.totalPrice - completeLesson * arr[0].univalence
      this.priceValue = this.surplusPrice

      this.sendData = {
        index: this.index,
        value: {
          issurplus: true,
          surplusPrice: this.surplusPrice
        },
        data: {
          fieldName: 'productSetMeal'
        }
      }

      this.$emit('value-change', this.sendData)

      this.value.products.productList.forEach(item => {})
    },
    structureDataHandle(obj) {
      console.log('combo组件发送的数据1', obj)
      this.present = null
      this.comboComponentData = obj
      this.purchaseLesson = obj.purchaseLesson
      this.drainage = obj.drainage
      if (obj.tableData.length > 0) {
        this.jointpresentData()
      }

      this.sendData = {
        index: this.index,
        value: {
          product: this.comboComponentData.tableData,
          totalPrice: this.totalPrice, // 套餐价格
          refundMonry: this.priceValue, // 充值返还金额
          surplusPrice: this.action.surplusPrice,
          drainage: this.drainage,
          totalclassTime: this.comboComponentData.totalclassTime,
          buyCount: this.comboComponentData.purchaseLesson,
          presenterCount: this.comboComponentData.grooveLesson
        },
        data: {
          fieldName: 'productSetMeal'
        }
      }

      this.$emit('value-change', this.sendData)
    },
    jointpresentData() {
      console.log('生成累计赠送1')
      if (!this.action.customerId) {
        return
      }
      QueryGiveAPI({
        customerId: this.action.customerId,
        buyCount: this.purchaseLesson,
        coachType: this.action.searchJson.coachType
      }).then(res => {
        this.present = [
          {
            subject: '',
            presentLesson: 0,
            planeLesson: 0,
            completeLesson: 0,
            univalence: this.univalence,
            dataIndex: this.presentDataIndex,
            type: 2
          }
        ]
        this.surplusPresenter = (res.data.presenterCount - this.comboComponentData.grooveLesson) > 0 ? res.data.presenterCount - this.comboComponentData.grooveLesson : 0
        this.presentRules = {
          coachType: this.action.searchJson.coachType,
          classes: res.data.classes,
          give: res.data.give
        }
      }).catch(() => {})
    },
    totalPriceHandle(obj) {
      this.totalPrice = obj.totalPrice
      this.priceValue = this.totalPrice
      if (this.action.attr && this.action.attr == 'change') {
        console.log('改变了大套餐价格')
        this.finalPrice = this.totalPrice - this.action.surplusPrice
        this.priceValue = this.finalPrice
      }

      var lessons = 0
      var arr = this.present.filter(item => {
        if (item.presentLesson > 0) {
          item.univalence = obj.univalence
          lessons += Number(item.presentLesson)
          return true
        }
      })
      this.sendData.value.surplusPrice = this.action.surplusPrice
      this.sendData.value.buyCount = lessons + obj.totalclassTime
      this.sendData.value.product = [...this.comboComponentData.tableData, ...arr]
      this.$emit('value-change', this.sendData)
    },
    selectSubjectHandle(val) {
      // 如果赠送课次是0不处理
      console.log('赠送中选择了科目', val)
    },
    changeLesson(row) {
      var lesson = 0
      for (let i = 0; i < this.present.length; i++) {
        const element = this.present[i]
        lesson += Number(element.presentLesson)
        var _lesson = Number(element.presentLesson)
        if (lesson > this.surplusPresenter) {
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
