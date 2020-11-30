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
    实际可赠送课次：<span class="red">{{ surplusPresenter }}</span>
    <combo
      :action="comboAction"
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
            <el-select v-model="scope.row.subject" placeholder="请选择" @change="selectSubjectHandle">
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
            <el-input v-model="scope.row.presentLesson" @change="changeLesson"/>
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
        <el-table-column prop="" label="操作" width="100" align="center">
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
        总金额：
        <el-input
          v-wk-number
          v-model="totalPrice"
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
      totalPrice: 0,
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
      drainage: false // 引流课
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
    // 获取科目
    QueryAdminSubject().then(res => {
      this.subjectList = res.data
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

        // const newSelects = []
        // data.data.forEach(element => {
        //   const obj = this.productList.find(item => {
        //     return item.productId == element.productId
        //   })
        //   if (obj) {
        //     newSelects.push(obj)
        //   } else {
        //     newSelects.push(this.getShowItem(element))
        //   }
        // })
        // this.productList = newSelects
        // this.calculateToal()
      }
      // if (data.data) {
      //   const newSelects = []
      //   data.data.forEach(element => {
      //     const obj = this.productList.find(item => {
      //       return item.productId == element.productId
      //     })
      //     if (obj) {
      //       newSelects.push(obj)
      //     } else {
      //       newSelects.push(this.getShowItem(element))
      //     }
      //   })
      //   this.productList = newSelects
      //   this.calculateToal()
      // }
    },
    getShowItem(data) {
      const item = {}
      item.name = data.name
      item.categoryName = data.categoryName
      item.unit = data.单位
      item.price = data.price
      item.salesPrice = data.price
      item.num = 1
      item.discount = 0
      item.subtotal = data.price
      item.productId = data.productId
      return item
    },
    // 单价
    salesPriceChange(data) {
      const item = data.row

      let discount = ((item.price - item.salesPrice || 0) / item.price) * 100.0
      discount = discount.toFixed(2)
      if (item.discount !== discount) {
        item.discount = discount
      }
      this.calculateSubTotal(item)
      this.calculateToal()
    },
    // 数量
    numChange(data) {
      const item = data.row
      this.calculateSubTotal(item)
      this.calculateToal()
    },
    // 折扣
    discountChange(data) {
      const item = data.row
      let salesPrice =
        (item.price * (100.0 - parseFloat(item.discount || 0))) / 100.0
      salesPrice = salesPrice.toFixed(2)
      if (item.salesPrice !== salesPrice) {
        item.salesPrice = salesPrice
      }
      this.calculateSubTotal(item)
      this.calculateToal()
    },
    // 计算单价
    calculateSubTotal(item) {
      item.subtotal = (item.salesPrice * parseFloat(item.num || 0)).toFixed(2)
    },
    // 计算总价
    calculateToal() {
      console.log('计算总价')
      let totalPrice = this.getProductTotal()
      totalPrice =
        (totalPrice * (100.0 - parseFloat(this.discountRate || 0))) / 100.0
      this.totalPrice = totalPrice.toFixed(2)
      this.updateValue() // 传递数据给父组件
    },
    /**
     * 获取产品总价(未折扣)
     */
    getProductTotal() {
      let totalPrice = 0.0
      for (let i = 0; i < this.productList.length; i++) {
        const item = this.productList[i]
        totalPrice += parseFloat(item.subtotal)
      }
      return totalPrice
    },

    /**
     * 总价更改 折扣更改
     */
    totalPriceChange() {
      // const totalPrice = this.getProductTotal()
      // if (totalPrice) {
      //   this.discountRate = (
      //     100.0 -
      //     (parseFloat(this.totalPrice) / totalPrice) * 100
      //   ).toFixed(2)
      // }
      // this.updateValue()
    },
    // 删除操作
    removeItem(index) {
      this.productList.splice(index, 1)
      this.calculateToal()
    },
    updateValue() {
      this.valueChange({
        product: this.productList,
        totalPrice: this.totalPrice,
        discountRate: this.discountRate
      })
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
    structureDataHandle(obj) {
      console.log('combo组件发送的数据', obj)
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
          totalPrice: this.totalPrice,
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
      console.log('生成累计赠送')
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
      this.present.forEach(item => {
        console.log('修改累计单价', obj)
        item.univalence = obj.univalence
      })
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
      // 把累计课次之和和大于1的数组发送给combo组件

      // this.sendData.value.product = [...this.sendData.value.product, ...arr]
      // this.sendData.value.presenterCount = this.comboComponentData.grooveLesson + lesson
      // this.$emit('value-change', this.sendData)
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
