import {
  mapGetters
} from 'vuex'

import { crmLeadsNumAPI } from '@/api/customermanagement/clue'
import { crmCustomerNumAPI } from '@/api/customermanagement/customer'
import { crmContactsNumAPI } from '@/api/customermanagement/contacts'
import { crmBusinessNumAPI } from '@/api/customermanagement/business'
import { crmContractNumAPI } from '@/api/customermanagement/contract'
import { crmProductNumAPI } from '@/api/customermanagement/product'
import { crmReceivablesNumAPI } from '@/api/customermanagement/money'


export default {
  data() {
    return {
      showFirstDetail: true,
      detailData: null,
      // tabs Number
      tabsNumber: {}
    }
  },
  props: {
    /** 是公海 默认是客户 */
    isSeas: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    ...mapGetters(['crm']),
    // 能否查看详情
    canShowDetail() {
      if (this.detailData && this.detailData.dataAuth === 0) {
        return false
      }

      return this.crm && this.crm[this.crmType] && this.crm[this.crmType].read
    },

    showTabsNumber() {
      return this.crmType !== 'marketing'
    }
  },

  watch: {
    id: function() {
      if (this.canShowDetail) {
        this.detailData = null
        this.tabsNumber = {}
        this.getDetial()
        this.getTabsNum()
      }
    }
  },

  created() {
    if (this.canShowDetail) {
      this.getDetial()
      this.getTabsNum()

      this.$bus.on('crm-tab-num-update', () => {
        this.getTabsNum()
      })
    }
  },

  beforeDestroy() {
    this.$bus.off('crm-tab-num-update', () => {
      this.getTabsNum()
    })
  },

  methods: {
    /**
     * 顶部头 操作
     * @param {*} data
     */
    detailHeadHandle(data) {
      if (data.type === 'edit') {
        this.isCreate = true
      } else if (data.type === 'cancel') {
        this.getDetial()
      } else if (data.type === 'delete') {
        this.hideView()
      } else if (data.type === 'state_start' || data.type === 'state_disable') {
        this.getDetial()
      }
      this.$emit('handle', data)
    },

    /**
     * 获取tab数量
     */
    getTabsNum() {
      if (!this.showTabsNumber) {
        return
      }
      const request = {
        leads: crmLeadsNumAPI,
        customer: crmCustomerNumAPI,
        contacts: crmContactsNumAPI,
        business: crmBusinessNumAPI,
        contract: crmContractNumAPI,
        product: crmProductNumAPI,
        receivables: crmReceivablesNumAPI
      }[this.crmType]

      const params = {}
      params[`${this.crmType}Id`] = this.id

      request(params)
        .then(res => {
          this.tabsNumber = res.data || {}
        })
        .catch(() => {
        })
    },

    /**
     * 获取tabs名字
     * @param {*} name
     * @param {*} num
     */
    getTabName(name, num) {
      return `${name}${num && num > 0 ? '（' + num + '）' : ''}`
    }
  },

  deactivated: function() { }

}
