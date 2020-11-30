<template>
  <component
    v-if="id&&visible"
    :is="tabName"
    :crm-type="crmType"
    :model-data="modelData"
    :id="id"
    :listener-ids="listenerIDs"
    :no-listener-ids="noListenerIDs"
    :no-listener-class="noListenerClass"
    :click-field="clickField"
    class="d-view"
    @handle="detailHandle"
    @hide-view="hiddenView"
    @refresh-list="refreshList"/>
</template>

<script type="text/javascript">
import { getMaxIndex } from '@/utils/index'
import ClueDetail from '../clue/ClueDetail'
import CustomerDetail from '../customer/CustomerDetail'
import AccountDetail from '../studentManage/account/detail'
import ContactsDetail from '../contacts/ContactsDetail'
import BusinessDetail from '../business/BusinessDetail'
import ContractDetail from '../contract/ContractDetail'
import WaterDetail from '../studentManage/account/WaterDetail'
import ProductDetail from '../product/ProductDetail'
import MoneyDetail from '../money/MoneyDetail'
import VisitDetail from '../visit/VisitDetail'
import InvoiceDetail from '../invoice/InvoiceDetail'
import StudentDetail from '../studentManage/student/detail'

export default {
  name: 'CRMAllDetail', // 详情
  components: {
    ClueDetail,
    CustomerDetail,
    AccountDetail,
    ContactsDetail,
    BusinessDetail,
    ContractDetail,
    ProductDetail,
    MoneyDetail,
    VisitDetail,
    InvoiceDetail,
    StudentDetail,
    WaterDetail
  },
  inheritAttrs: false,
  props: {
    /** 模块ID */
    id: [String, Number],
    /** 没有值就是全部类型 有值就是当个类型 */
    crmType: {
      type: String,
      default: ''
    },
    clickField: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    },
    // 监听的dom 进行隐藏详情
    listenerIDs: {
      type: Array,
      default: () => {
        return ['crm-main-container']
      }
    },
    // 不监听
    noListenerIDs: {
      type: Array,
      default: () => {
        return []
      }
    },
    noListenerClass: {
      type: Array,
      default: () => {
        return ['el-table__body']
      }
    },
    /** 呼出信息 */
    modelData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      tabName: '' // 组件名
    }
  },
  computed: {},
  watch: {
    crmType: function(type) {
      console.log('监听到', type)
      console.log(this.crmType)

      if (this.crmType == 'leads') {
        this.tabName = 'clue-detail'
      } else if (this.crmType == 'customer') {
        this.tabName = 'customer-detail'
      } else if (this.crmType == 'student') {
        this.tabName = 'StudentDetail'
      } else if (this.crmType == 'capitalAccount') {
        this.tabName = 'account-detail'
      } else if (this.crmType == 'contacts') {
        this.tabName = 'contacts-detail'
      } else if (this.crmType == 'business') {
        this.tabName = 'business-detail'
      } else if (this.crmType == 'contract') {
        this.tabName = 'contract-detail'
      } else if (this.crmType == 'product') {
        this.tabName = 'product-detail'
      } else if (this.crmType == 'receivables') {
        this.tabName = 'money-detail'
      } else if (this.crmType == 'visit') {
        this.tabName = 'visit-detail'
      } else if (this.crmType == 'invoice') {
        this.tabName = 'invoice-detail'
      } else if (this.crmType == 'moneyType') {
        this.tabName = 'water-detail'
      }
    }
  },
  mounted() {
    if (this.visible) {
      document.body.appendChild(this.$el)
      this.$el.style.zIndex = getMaxIndex()
    }
  },
  destroyed() {
    // remove DOM node after destroy
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },
  methods: {
    hiddenView() {
      this.$emit('update:visible', false)
    },

    refreshList() {
      this.$emit('refresh-list')
    },

    /**
     * 详情操作
     */
    detailHandle(data) {
      console.log('详情操作')
      console.log(data)


      if (data.type === 'alloc' || data.type === 'get' || data.type === 'transfer' || data.type === 'transform' || data.type === 'delete' || data.type === 'put_seas') {
        this.hiddenView()
      }
      this.$emit('handle', data)
    }
  }
}
</script>
<style lang="scss" scoped>
.full-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
  margin: 0;
  background-color: rgba(0, 0, 0, 0.3);
}

.d-view {
  position: fixed;
  min-width: 926px;
  width: 75%;
  top: 0px;
  bottom: 0px;
  right: 0px;
}
</style>
