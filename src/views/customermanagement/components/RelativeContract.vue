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
        type="primary"
        @click="createClick">新建额外赠送合同</el-button>
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
        :prop="item.fieldName"
        :formatter="fieldFormatter"
        :label="item.name"
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
import {
  filedGetTableField
} from '@/api/customermanagement/common'
import { crmCustomerQueryContract, crmCustomerIndex } from '@/api/customermanagement/customer'
import { crmBusinessQueryContract } from '@/api/customermanagement/business'
import CheckStatusMixin from '@/mixins/CheckStatusMixin'
import { mapGetters } from 'vuex'

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
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {
    id: function(val) {
      this.list = []
      this.getDetail()
    }
  },
  created() {
    this.getFieldList()
  },
  mounted() {
    this.getDetail()
  },
  activated: function() {},
  deactivated: function() {},
  methods: {
    getFieldList() {
      filedGetTableField({ label: 6 }).then(res => {
        this.fieldList = res.data
      }).catch((err) => {
        console.log(err)
      })
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
      if (column.property === 'contractType') {
        return {
          1: '购买',
          2: '赠送'
        }[row[column.property]]
      } else if (column.property === 'isEarlyRetirement') {
        return {
          0: '否',
          1: '是',
          null: ''
        }[row[column.property]]
      } else if (column.property === 'contractStatus') {
        return {
          1: '申请中',
          2: '放弃',
          3: '合同完成',
          4: '合同变更中',
          5: '执行中',
          6: '草稿',
          7: '合同充值返还',
          8: '确认放弃',
          9: '家长审核中',
          10: '家长拒绝'
        }[row[column.property]]
      } else if (column.property === 'checkStatus') {
        return this.getStatusName(row.checkStatus)
      }
      if (column.property === 'orderDate') {
        return row[column.property].slice(0, 10)
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
      // leads判断是否已到访
      if (this.crmType == 'customer' && this.detail.followUpResults != '已到访') {
        this.$message.warning('请先跟进至已到访')
        return
      }
      // 客户 和 商机 下新建合同
      if (this.crmType == 'business') {
        this.createActionInfo.data['customer'] = this.detail
        this.createActionInfo.data['business'] = this.detail
      } else if (this.crmType == 'customer' || this.crmType == 'student') {
        this.createActionInfo.data['customer'] = this.detail
        this.createActionInfo.userInfo = {
          userId: this.userInfo.userId,
          realname: this.userInfo.realname
        }
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
