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
        @click="createClick">新建家长会登记</el-button>
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
      <el-table-column
        label="操作"
        align="center"
        fixed="right"
        width="150">
        <template slot-scope="scope">
          <span class="handle-btn" @click="handleRow('add', scope.row)">添加内容</span>
          <span class="handle-btn" @click="handleRow('edit', scope.row)">编辑</span>
          <span class="handle-btn" @click="handleRow('del', scope.row)">删除</span>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="contentVisible" append-to-body title="添加内容">
      <el-form :model="form">
        <el-form-item v-for="(item, index) in formList" :key="index" :label="item.label">
          <el-input v-if="item.type == 'txt'" v-model="form[item.prop]" type="textarea"/>
          <el-date-picker
            v-if="item.type == 'date'"
            v-model="form[item.prop]"
            type="datetime"
            placeholder="选择日期时间"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="contentVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmBtn">确 定</el-button>
      </div>
    </el-dialog>

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
import { queryRechargeListAPI } from '@/api/customermanagement/contract'
// import { crmBusinessQueryContract } from '@/api/customermanagement/business'
import CheckStatusMixin from '@/mixins/CheckStatusMixin'
import { separator } from '@/filters/vue-numeral-filter/filters'

export default {
  name: 'RelativeParentRegistration', // 家长会登记
  components: {
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
      list: [
        { number: '123' }
      ],
      fieldList: [
        { prop: 'number', label: '家长会类型' },
        { prop: 'number', label: '计划时间' },
        { prop: 'number', label: '备注' },
        { prop: 'number', label: '家长会召开时间' },
        { prop: 'number', label: '参加人员' },
        { prop: 'number', label: '主要内容' },
        { prop: 'number', label: '更新时间' },
        { prop: 'number', label: '创建时间' },
        { prop: 'number', label: '创建人' }
      ],
      tableHeight: '400px',
      isCreate: false, // 控制新建
      contractId: '', // 查看全屏联系人详情的 ID
      // 创建的相关信息
      createActionInfo: { type: 'relative', crmType: this.crmType, data: {}},

      contentVisible: false,
      formList: [
        { label: '家长会召开时间：', type: 'date', prop: 'time1' },
        { label: '参加时间：', type: 'date', prop: 'time2' },
        { label: '主要内容：', type: 'txt', prop: 'content' }
      ],
      form: {}
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

    handleRow(way, row) {
      console.log(row)
      if (way == 'add') {
        this.contentVisible = true
      } else if (way == 'edit') {
        console.log('edit')
      } else if (way == 'del') {
        console.log('del')
      }
    },

    confirmBtn() {
      // this.contentVisible = false
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
    //   if (this.crmType == 'business') {
    //     this.createActionInfo.data['customer'] = this.detail
    //     this.createActionInfo.data['business'] = this.detail
    //   } else if (this.crmType == 'customer') {
    //     this.createActionInfo.data['customer'] = this.detail
    //   }
    //   this.isCreate = true
    },
    createSaveSuccess() {
      this.$bus.emit('crm-tab-num-update')
      this.getDetail()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '../styles/relativecrm.scss';

.handle-btn {
    color: #2362FB;
    cursor: pointer;
    margin-right: 5px;
}

/deep/ .el-dialog {
    width: 444px;
}

/deep/ .el-form-item__label {
    width: 120px;
}

/deep/ .el-date-editor.el-input, /deep/ .el-textarea {
    width: calc(100% - 150px);
}
</style>
