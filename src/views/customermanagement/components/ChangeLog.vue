<template>
  <div
    v-empty="nopermission"
    class="rc-cont"
    xs-empty-icon="nopermission"
    xs-empty-text="暂无权限">
    <el-table
      :data="list"
      :height="tableHeight"
      stripe
      style="width: 100%;border: 1px solid #E6E6E6;">
      <el-table-column
        v-for="(item, index) in fieldList"
        :key="index"
        :prop="item.prop"
        :width="item.width"
        :formatter="fieldFormatter"
        :label="item.label"
        show-overflow-tooltip/>
    </el-table>
  </div>
</template>

<script type="text/javascript">
import loading from '../mixins/loading'
import { queryRechargeListAPI } from '@/api/customermanagement/contract'
// import { crmBusinessQueryContract } from '@/api/customermanagement/business'
import CheckStatusMixin from '@/mixins/CheckStatusMixin'

export default {
  name: 'ChangeLog', // 校区班主任变更记录
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
      fieldList: [
        { prop: 'number', label: '所属中心' },
        { prop: 'number', label: '变更前校区班主任' },
        { prop: 'number', label: '变更后校区班主任' },
        { prop: 'number', label: '分配时间' }
      ],
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
    //   this.getDetail()
    }
  },
  mounted() {
    // this.getDetail()
  },
  activated: function() {},
  deactivated: function() {},
  methods: {
    getDetail() {
      this.loading = true
      const request = {
        contract: queryRechargeListAPI
      }[this.crmType]
      const params = {}
      params[this.crmType + 'Id'] = this.id
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
      // 如果需要格式化
      if (column.property === 'checkStatus') {
        return {
          0: '待审核',
          1: '通过',
          2: '拒绝',
          3: '审核中',
          4: '撤回',
          5: '未提交',
          6: '创建',
          7: '已删除',
          8: '作废'
        }[row.checkStatus]
      }
      return row[column.property]
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/relativecrm.scss';
</style>
