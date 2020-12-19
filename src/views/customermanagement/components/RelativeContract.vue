<template>
  <div
    v-empty="nopermission"
    class="rc-cont"
    xs-empty-icon="nopermission"
    xs-empty-text="暂无权限">
    <flexbox
      v-if="!isSeas"
      class="rc-head"
      direction="row-reverse">
      <el-button
        class="xr-btn--orange rc-head-item"
        icon="el-icon-plus"
        type="primary"

        @click="createClick">新建合同</el-button>
      <el-button
        v-if="crmType == 'student'"
        class="xr-btn--orange rc-head-item"
        icon="el-icon-plus"
        type="primary">新建额外赠送合同</el-button>
    </flexbox>
    <el-table
      :data="list"
      :height="tableHeight"
      :cell-class-name="cellClassName"
      stripe
      style="width: 100%;border: 1px solid #E6E6E6;"
      @row-click="handleRowClick">
      <el-table-column
        v-for="(item, index) in fieldList"
        :key="index"
        :prop="item.prop"
        :formatter="fieldFormatter"
        :label="item.label"
        show-overflow-tooltip/>
    </el-table>
    <c-r-m-full-screen-detail
      :visible.sync="showFullDetail"
      :id="contractId"
      crm-type="contract"
      @handle="detailHandle"/>
    <c-r-m-create-view
      v-if="isCreate"
      :action="createActionInfo"
      crm-type="contract"
      @save-success="createSaveSuccess"
      @hiden-view="isCreate=false"/>
  </div>
</template>

<script type="text/javascript">
import loading from '../mixins/loading'
import CRMCreateView from './CRMCreateView'
import { crmCustomerQueryContract } from '@/api/customermanagement/customer'
import { crmBusinessQueryContract } from '@/api/customermanagement/business'
import CheckStatusMixin from '@/mixins/CheckStatusMixin'
import { separator } from '@/filters/vue-numeral-filter/filters'

export default {
  name: 'RelativeContract', // 相关联系人  可能再很多地方展示 放到客户管理目录下
  components: {
    CRMFullScreenDetail: () => import('./CRMFullScreenDetail.vue'),
    CRMCreateView
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
      this.list = []
      this.getDetail()
    }
  },
  mounted() {
    console.log(this.crmType, 'kkkkkkkkkkkk')

    this.getDetail()
  },
  activated: function() {},
  deactivated: function() {},
  methods: {
    getFieldList() {
      this.fieldList.push({ prop: 'num', width: '200', label: '合同编号' })
      this.fieldList.push({ prop: 'isnew', width: '200', label: '合同属性' })
      this.fieldList.push({ prop: 'coachType', width: '200', label: '辅导方式' })
      this.fieldList.push({ prop: 'orderDate', width: '200', label: '签约时间' })
      this.fieldList.push({
        prop: 'customerName',
        width: '200',
        label: '学员姓名'
      })
      this.fieldList.push({ prop: 'channelName', width: '200', label: 'LEADS来源' })
      this.fieldList.push({ prop: 'deptIdName', width: '200', label: '所属中心' })
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
      // 客户 和 商机 下新建合同
      if (this.crmType == 'business') {
        this.createActionInfo.data['customer'] = this.detail
        this.createActionInfo.data['business'] = this.detail
      } else if (this.crmType == 'customer') {
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
