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
          :selected-data="{ productSetMeal: productList }"
          :action="{searchJson: {status: 1}}"
          crm-type="productSetMeal"
          @close="showPopover=false"
          @changeCheckout="selectInfos"/>
        <el-button
          slot="reference"
          type="primary"
          @click="showSelectView = true">添加套餐</el-button>
      </el-popover>
    </div>
    <!-- 套餐名称按钮 -->
    <div v-if="selectComobo" class="combo-group">
      <el-button
        v-for="(item, index) in selectComobo"
        :class="{select: item.select}"
        :key="index"
        @click="selectComoboHandle(item, index)"
      >{{ item.data.name }}</el-button>
    </div>
    <combo
      :action="comboAction"
      :give-action="action"
      :value="comboValue"
      :is-disabled="isDisabled"
      :subject-list="subjectList"
      @structure-data="structureSend"
    />
  </div>
</template>

<script>
import { queryIsNewByCustomerIdAPI } from '@/api/customermanagement/contract'
import { crmProductIndex } from '@/api/customermanagement/product'
import { QueryAdminSubject } from '@/api/systemManagement/params'


import CrmRelative from '@/components/CreateCom/CrmRelative'
import Combo from '@/views/customermanagement/contract/components/Combo'

export default {
  name: 'XhProduct', // 关联产品
  components: {
    CrmRelative,
    Combo
  },
  props: {
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
    value: {
      type: Object,
      default: () => {
        return {}
      }
    },
    /** 索引值 用于更新数据 */
    index: Number
  },
  data() {
    return {
      isAddCombo: false, // 是否展示添加按钮
      showPopover: false, // 展示产品框
      showSelectView: false, // 是否展示关联模块
      renew: 1, // 续签或新签
      isNew: 1, // 0:续签 1:新签 2:引流
      selectComobo: null, // 套餐数组
      comboAction: { // 传递给combo的数据
        univalence: '', // 单品单价
        productSetMeal: [] // 大套餐
      },
      comboValue: null, // 编辑时传递给combo
      subjectList: null, // 科目列表1
      productList: null // 关联套餐选中的值
    }
  },
  computed: {
    isDisabled() {
      // 变更，且有值
      // if (this.action.type && this.oldValue.products) {
      if (this.action.type && this.action.type == 'old-change') {
        return true
      }
      return false
    }
  },
  watch: {
    action: {
      handler(val) {
        // console.log('辅导方式、年级、学员变化', val)
        // 清空之前的数据
        this.init()

        // 有学员，查询新签还是续签
        if (val.customerId) {
          queryIsNewByCustomerIdAPI({ customerId: val.customerId }).then(res => {
            this.renew = res.data
          }).catch(() => {})
        }

        // 辅导方式、年级、学员都有才请求单品、展示添加套餐按钮
        if (val.customerId && val.searchJson.coachType && val.searchJson.gradeId) {
          this.getUnivalence()
        } else {
          this.isAddCombo = false
        }
      },
      deep: true,
      immediate: true
    },
    oldValue: {
      handler(val) {
        // console.log('编辑', val)
        if (this.action.type == 'old-change') {
          // console.log('合同变更-old-change', val)
          this.structureByValue()
        } else if (this.action.type == 'change') {
          // console.log('合同变更-change', val)
          return
        } else {
          // console.log('编辑123', val)
          // this.getUnivalence()
          // 辅导方式、年级、学员都有才请求单品、展示添加套餐按钮
          if (val.customerId && val.searchJson.coachType && val.searchJson.gradeId) {
            this.getUnivalence()
          }
        }
      },
      deep: true,
      immediate: true
    }

  },

  methods: {
    init() {
      this.isAddCombo = false // 是否展示添加按钮
      this.showPopover = false // 展示产品框
      this.showSelectView = false // 是否展示关联模块
      this.renew = 1 // 续签或新签
      this.isNew = 1 // 0:续签 1:新签 2:引流
      this.selectComobo = null // 套餐数组
      this.comboAction = { // 传递给combo的数据
        univalence: '', // 单品单价
        productSetMeal: [] // 大套餐
      }
      this.comboValue = null // 编辑时传递给combo
      this.subjectList = null // 科目列表1
      this.productList = null // 关联套餐选中的值
    },
    /** 选中 */
    selectInfos(data) {
      console.log('选中的套餐', data)
      if (data.data) {
        this.productList = data.data
        var arr = []
        data.data.forEach(item => {
          var obj = {
            data: item,
            select: true
          }
          arr.push(obj)
        })

        console.log('套餐按钮', arr)
        this.selectComobo = arr

        // 请求科目
        QueryAdminSubject().then(res => {
          this.subjectList = res.data

          // 生成combo
          this.comboAction.univalence = this.univalence
          this.comboAction.productSetMeal = data.data
        }).catch(() => {})
      }
    },

    getUnivalence() {
      const params = {
        type: 4,
        searchJson: this.action.searchJson
      }
      crmProductIndex(params).then(res => {
        // 获取课次单价
        this.univalence = res.data.list[0] ? res.data.list[0].price : ''
        // 有单品才能显示添加按钮
        if (this.univalence !== '') {
          this.isAddCombo = true
        } else {
          this.isAddCombo = false
          this.$message.error('该年级与辅导方式没有对应单品')
        }

        // 请求科目生成comboValue
        if (this.oldValue.products) {
          // console.log('编辑模式')
          this.structureByValue()
        }
      })
    },

    // 套餐按钮激活/禁用
    selectComoboHandle(item, index) {
      // console.log('选择', index, this.selectComobo[index])
      item.select = !item.select

      var arr = []
      this.selectComobo.forEach(item => {
        if (item.select) {
          arr.push(item.data)
        }
      })

      console.log('选择d', arr)


      this.comboAction = {
        univalence: this.univalence,
        productSetMeal: arr
      }
    },

    // 处理combo发送的数据
    structureSend(obj) {
      // console.log('处理combo发送的数据')
      this.comboComponentData = obj
      this.isNew = obj.drainage ? 2 : this.renew
      this.btnDisabled = !obj.tableData.length
      this.btnDisabled = false
      this.sendData()
    },

    // 向父组件发送数据
    sendData(obj) {
      // console.log('sendData中', obj)
      this.productData = {
        index: this.index,
        value: {
          product: this.comboComponentData.tableData, // 列表
          totalPrice: this.comboComponentData.totalPrice, // 套餐价格
          refundMonry: this.comboComponentData.refundMonry, // 充值返还金额
          issurplus: this.comboComponentData.issurplus,
          // surplusPrice: this.action.surplusPrice, // 剩余金额
          // surplusPrice: 0,
          surplusPrice: this.comboComponentData.surplusPrice,
          isNew: this.isNew, // 合同属性
          totalclassTime: this.comboComponentData.totalclassTime, // 总课次
          buyCount: this.comboComponentData.purchaseLesson, // 购买课次
          presenterCount: this.comboComponentData.presenterCount, // 赠送课次(常规赠送+累计赠送)
          ruleDetails: this.comboComponentData.presentRules //
        },
        data: {
          fieldName: 'productSetMeal'
        }
      }
      console.log('productData', this.productData)

      this.$emit('value-change', this.productData)
    },

    // 生成combo的value
    structureByValue() {
      var productList = []
      var presentList = []

      var dataIndex = 1
      var dataIndexofPresent = 0

      this.oldValue.products.productList.forEach(item => {
        if (item.type === 1) {
          var obj = {
            productType: this.getAttrOfBigMeal(item.mealProductId, 'name'),
            productName: this.getAttrOfMeal(item.giftProductId, 'detailsName'),
            subject: item.productId,
            comboNormLesson: this.getAttrOfMeal(item.giftProductId, 'purchaseFrequency'),
            normLesson: this.getAttrOfMeal(item.giftProductId, 'giveFrequency'),
            purchaseLesson: item.courseSum, // 购买课次
            grooveLesson: item.presenterCourseSum, // 常规赠送课次
            planeLesson: item.alreadyCourse, // 已排课课次
            completeLesson: item.finishCourse, // 已完成课次
            price: item.subtotal, // 原价
            discount: this.getAttrOfBigMeal(item.mealProductId, 'warningLine'), // 折扣比例
            salePrice: item.salesPrice, // 折后价格
            univalence: item.price, // 均价

            combo_number: item.mealProductId, // 大套餐ID
            dataIndex, // 标识
            detailsId: item.giftProductId, // 小套餐ID
            originalPurchaseLesson: this.getAttrOfMeal(item.giftProductId, 'purchaseFrequency'), // 小套餐购买课次
            originalGrooveLesson: this.getAttrOfMeal(item.giftProductId, 'giveFrequency'), // 小套餐赠送课次
            mealType: this.getAttrOfBigMeal(item.mealProductId, 'courseType'), // 大套餐类型：引流、特价、正价
            isGive: this.getAttrOfMeal(item.giftProductId, 'isGive'),
            drainage: this.getAttrOfBigMeal(item.mealProductId, 'courseType') == '引流课'
          }

          if (this.action.attr && this.action.attr == 'update') {
            obj.grooveLesson = 0
          }

          dataIndex++
          productList.push(obj)
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
          presentList.push(obj)
        }
      })

      // 请求科目
      QueryAdminSubject().then(res => {
        this.subjectList = res.data
        // 生成comboValue
        this.comboValue = {
          productList,
          presentList,
          totalPrice: this.oldValue.totalPrice,
          univalence: this.univalence
        }
      }).catch(() => {})

      // 合同变更-原合同
      if (this.action.type && this.action.type == 'old-change') {
        console.log(111)
      }
    },

    // 关联大套餐获取属性
    getAttrOfBigMeal(id, attr) {
      var val = null
      this.oldValue.products.mealProducts.forEach(item => {
        if (item.productId == id) {
          val = item[attr]
        }
      })
      return val
    },
    // 关联小套餐获取属性
    getAttrOfMeal(id, attr) {
      var val = null
      this.oldValue.products.giftProducts.forEach(item => {
        if (item.detailsId == id) {
          val = item[attr]
        }
      })
      return val
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

