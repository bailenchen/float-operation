<template>
  <div
    v-empty="nopermission"
    class="rc-cont"
    xs-empty-icon="nopermission"
    xs-empty-text="暂无权限">
    <flexbox
      v-if="!detail.capitalId"
      class="rc-head"
      direction="row-reverse">
      <el-button
        class="xr-btn--orange rc-head-item"
        icon="el-icon-plus"
        type="primary"
        @click="createClick">新建资金账户</el-button>
    </flexbox>
    <c-r-m-edit-base-info
      v-if="detail.capitalId"
      :detail="detail"
      :id="detail.capitalId"
      crm-type="capitalAccount"/>

    <c-r-m-create-view
      v-if="isCreate"
      :action="createActionInfo"
      crm-type="capitalAccount"
      @save-success="createSaveSuccess"
      @hiden-view="isCreate=false"/>
  </div>
</template>

<script type="text/javascript">
import loading from '../mixins/loading'
import CRMCreateView from './CRMCreateView'
import CRMEditBaseInfo from './CRMEditBaseInfo' // 基本信息
import { crmCustomerQueryContract } from '@/api/customermanagement/customer'
import { crmBusinessQueryContract } from '@/api/customermanagement/business'
import CheckStatusMixin from '@/mixins/CheckStatusMixin'
import { separator } from '@/filters/vue-numeral-filter/filters'

export default {
  name: 'RelativeContract', // 相关联系人  可能再很多地方展示 放到客户管理目录下
  components: {
    CRMFullScreenDetail: () => import('./CRMFullScreenDetail.vue'),
    CRMCreateView,
    CRMEditBaseInfo
  },
  mixins: [loading, CheckStatusMixin],
  props: {
    /** 模块ID */
    id: [String, Number],
    /** 没有值就是全部类型 有值就是当个类型 */
    crmType: {
      type: String,
      default: ''
    },
    /** 是公海 默认是客户 */
    isSeas: {
      type: Boolean,
      default: false
    },
    /** 联系人人下 新建商机 需要联系人里的客户信息  合同下需要客户和商机信息 */
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      nopermission: false,
      list: [],
      fieldList: [],
      tableHeight: '400px',
      showFullDetail: false,
      isCreate: false, // 控制新建
      contractId: '', // 查看全屏联系人详情的 ID
      // 创建的相关信息
      createActionInfo: { type: 'relative', crmType: this.crmType, data: {}}
    }
  },
  computed: {},
  watch: {
    id: function(val) {
      // this.list = []
      // this.getDetail()
    }
  },
  mounted() {
    // this.getDetail()
  },
  activated: function() {},
  deactivated: function() {},
  methods: {
    getFieldList() {
      this.fieldList = [
        { prop: 'money', width: '200', label: '交易流水号' },
        { prop: 'money', width: '200', label: '交易类型' },
        { prop: 'money', width: '200', label: '用途' },
        { prop: 'money', width: '200', label: '交易渠道' },
        { prop: 'money', width: '200', label: '退款编号' },
        { prop: 'money', width: '200', label: '金额' },
        { prop: 'money', width: '200', label: '交易时间' }
      ]
    },

    getDetail() {
      this.loading = true
      const keytype = this.crmType === 'student' ? 'customer' : this.crmType
      const request = {
        customer: crmCustomerQueryContract,
        business: crmBusinessQueryContract
      }[keytype]
      const params = { pageType: 0 }
      params[keytype + 'Id'] = this.id
      request(params)
        .then(res => {
          if (this.fieldList.length == 0) {
            this.getFieldList()
          }
          this.nopermission = false
          this.loading = false
          this.list = res.data
        })
        .catch(data => {
          if (data.code == 102) {
            this.nopermission = true
          }
          this.loading = false
        })
    },

    /**
     * 格式化字段
     */
    fieldFormatter(row, column) {
      // 如果需要格式化
      if (column.property === 'checkStatus') {
        return this.getStatusName(row.checkStatus)
      } else if (column.property == 'money') {
        return separator(row[column.property] || 0)
      }
      return row[column.property]
    },

    /**
     * 当某一行被点击时会触发该事件
     */
    handleRowClick(row, column, event) {
      if (column.property == 'contractName') {
        this.contractId = row.contractId
        this.showFullDetail = true
      }
    },

    /**
     * 通过回调控制class
     */
    cellClassName({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'contractName') {
        return 'can-visit--underline'
      } else {
        return ''
      }
    },

    /**
     * 新建
     */
    createClick() {
      // leads 和 学员 下新建资金账户
      if (this.crmType == 'customer') {
        this.createActionInfo.data['customer'] = this.detail
      } else if (this.crmType == 'student') {
        this.createActionInfo.data['customer'] = this.detail
      }
      this.isCreate = true
    },
    createSaveSuccess() {
      this.$bus.emit('crm-tab-num-update')
      this.getDetail()
    },

    /**
     * 详情操作
     */
    detailHandle(data) {
      if (data.type === 'delete') {
        this.$bus.emit('crm-tab-num-update')
        this.getDetail()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/relativecrm.scss';
</style>
