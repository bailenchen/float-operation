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
        v-if="showCreate"
        class="xr-btn--orange rc-head-item"
        icon="el-icon-plus"
        type="primary"
        @click="createClick">新建合同充值返还</el-button>
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
        :width="item.width"
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
      crm-type="refund"
      @save-success="createSaveSuccess"
      @hiden-view="isCreate=false"/>
  </div>
</template>

<script type="text/javascript">
import loading from '../mixins/loading'
import CRMCreateView from './CRMCreateView'
import { crmRefundQueryPageListAPI } from '@/api/customermanagement/refund'
import { filedGetTableField } from '@/api/customermanagement/common'

import CheckStatusMixin from '@/mixins/CheckStatusMixin'
import { separator } from '@/filters/vue-numeral-filter/filters'

export default {
  name: 'ReturnRechargeMoney', // 合同充值返还
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
    showCreate() {
      if (this.crmType == 'contract') {
        return false
      }
      return true
    }
  },
  watch: {
    id: function(val) {
      this.list = []
      this.getDetail()
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    getFieldList() {
      filedGetTableField({ label: 29 }).then(res => {
        // this.fieldList = res.data
        console.log('res.data', res.data)

        const arr = []
        res.data.forEach(item => {
          const obj = {
            prop: item.fieldName,
            width: item.width,
            label: item.name
          }
          // arr.push({
          //   prop: item.fieldName,
          //   width: item.width,
          //   label: item.name
          // })
          if ([
            'money',
            'leadsNumber',
            'createTime'].includes(item.fieldName)) {
            obj.width = {
              money: 120,
              leadsNumber: 130,
              createTime: 150
            }[item.fieldName]
          }
          arr.push(obj)
        })
        console.log('arr', arr)
        this.fieldList = arr
      }).catch(() => {})

      // this.fieldList.push({ prop: 'num', width: '400', label: '合同充值返还编号' })
      // this.fieldList.push({ prop: 'capitalNumber', width: '400', label: '合同充值编号' })
      // this.fieldList.push({ prop: 'leadsNumber', width: '200', label: '学员编号' })
      // this.fieldList.push({ prop: 'customerName', width: '350', label: '学员姓名' })
      // this.fieldList.push({ prop: 'refundTime', width: '400', label: '合同充值返还日期' })
      // this.fieldList.push({ prop: 'money', width: '300', label: '合同充值返还金额（元）' })
      // this.fieldList.push({ prop: 'refundWayName', width: '200', label: '合同充值返还方式' })
      // this.fieldList.push({ prop: 'remarks', width: '200', label: '备注' })
      // this.fieldList.push({ prop: 'deptIdName', width: '200', label: '所属中心' })
      // this.fieldList.push({ prop: 'ownerUserName', width: '200', label: '课程顾问' })
      // this.fieldList.push({ prop: 'checkStatus', width: '200', label: '审核状态' })
      // this.fieldList.push({ prop: 'updateTime', width: '200', label: '更新时间' })
      // this.fieldList.push({ prop: 'createUserName', width: '200', label: '创建人' })
      // this.fieldList.push({ prop: 'createTime', width: '200', label: '创建时间' })
    },

    getDetail() {
      this.loading = true
      console.log(this.crmType, '*----')
      const request = {
        contract: crmRefundQueryPageListAPI,
        student: crmRefundQueryPageListAPI
      }[this.crmType]
      const params = {
        searchJson: {}
      }

      if (this.crmType == 'student') {
        params.searchJson.customerId = this.id
      } else {
        params.searchJson[this.crmType + 'Id'] = this.id
      }

      request(params)
        .then(res => {
          if (this.fieldList.length == 0) {
            this.getFieldList()
          }
          this.nopermission = false
          this.loading = false
          this.list = res.data.list
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
      } else if (column.property === 'capitalNumber') {
        return row[column.property][0] ? row[column.property][0].number : ''
      } else if (column.property === 'refundWayId') {
        return row.refundWayName
      } else if (column.property === 'refundType') {
        return {
          1: '常规充值返还',
          2: '特殊充值返还'
        }[row[column.property]]
      } else if (column.property === 'refundTime') {
        return row[column.property].replace(/(\d{4})-(\d{2})-(\d{2}) .*/, '$1-$2-$3')
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
