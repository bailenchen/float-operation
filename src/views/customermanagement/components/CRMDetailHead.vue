<template>
  <div class="container">
    <flexbox
      class="t-section"
      align="stretch">
      <img
        :src="crmIcon"
        class="t-section__hd">
      <div class="t-section__bd">
        <div class="type-name">{{ typeName }}</div>
        <p class="name"><el-tooltip
          :disabled="!name"
          :content="name"
          effect="dark"
          placement="top-start">
          <span>{{ name }}</span>
        </el-tooltip><slot name="name" /></p>
      </div>
      <time-piece v-if="showTimer && isCall"/>
      <div class="t-section__ft">
        <el-button
          v-if="showTransfer"
          class="head-handle-button"
          type="primary"
          icon="wk wk-transfer"
          @click.native="handleTypeClick('transfer')">转移</el-button>

        <el-button
          v-if="showEdit"
          class="head-handle-button xr-btn--green"
          icon="wk wk-circle-edit"
          type="primary"
          @click.native="handleTypeClick('edit')">编辑</el-button>

        <el-button
          v-if="showDealStatus"
          class="head-handle-button"
          type="primary"
          icon="wk wk-success"
          @click.native="handleTypeClick('deal_status')">更改成交状态</el-button>

        <el-button
          v-if="showChangeSeas"
          class="head-handle-button"
          type="primary"
          icon="wk wk-success"
          @click.native="handleTypeClick('change_seas')">转移到其他公海</el-button>

        <el-dropdown
          v-if="permissionMoreTypes && permissionMoreTypes.length > 0"
          trigger="click"
          @command="handleTypeClick">
          <el-button
            icon="el-icon-more"
            class="t-more" />
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, index) in permissionMoreTypes"
              :key="index"
              :icon="item.icon | wkIconPre"
              :command="item.type">{{ item.name }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </flexbox>
    <flexbox
      class="h-section"
      align="stretch">
      <flexbox-item
        v-for="(item, index) in headDetails"
        v-show="item.title"
        :key="index"
        class="h-item"
        span="200">
        <div class="h-title">{{ item.title }}</div>
        <div class="h-value text-one-line">
          <i
            v-if="item.showIcon"
            :style="item.style"
            :class="item.icon" />
          <el-tooltip :content="item.value" class="item" effect="dark" placement="top">
            <div>{{ item.value }}</div>
          </el-tooltip>
        </div>
      </flexbox-item>
    </flexbox>
    <slot />
    <transfer-handle
      :crm-type="crmType"
      :selection-list="[detail]"
      :dialog-visible.sync="transferDialogShow"
      @handle="handleCallBack" />
    <alloc-handle
      :crm-type="crmType"
      :pool-id="poolId"
      :selection-list="[detail]"
      :dialog-visible.sync="allocDialogShow"
      @handle="handleCallBack" />
    <deal-status-handle
      :value="detail.dealStatus"
      :crm-type="crmType"
      :selection-list="[detail]"
      :visible.sync="dealStatusShow"
      @handle="handleCallBack" />
    <put-pool-handle
      :visible.sync="putPoolShow"
      :selection-list="[detail]"
      @handle="handleCallBack" />
    <change-pool-handle
      :visible.sync="changePoolShow"
      :selection-list="[detail]"
      @handle="handleCallBack" />
    <change-dept-handle
      :visible.sync="changeDeptShow"
      :selection-list="[detail]"
      @handle="handleCallBack" />
  </div>
</template>
<script type="text/javascript">
import { mapGetters } from 'vuex'
import {
  crmLeadsTransform,
  crmLeadsDelete
} from '@/api/customermanagement/clue'
import {
  crmCustomerLock,
  crmCustomerDelete,
  crmCustomerPoolDeleteAPI,
  crmCustomerReceive
} from '@/api/customermanagement/customer'
import { crmContactsDelete } from '@/api/customermanagement/contacts'
import { crmBusinessDelete } from '@/api/customermanagement/business'
import {
  crmContractDelete,
  crmContractCancelAPI
} from '@/api/customermanagement/contract'
import { crmReceivablesDelete } from '@/api/customermanagement/money'
import {
  crmMarketingIsEnableAPI,
  crmMarketingDeleteAPI
} from '@/api/customermanagement/marketing'
import { crmReturnVisitDeleteAPI } from '@/api/customermanagement/visit'
import {
  crmProductStatus,
  crmProductDeleteAPI
} from '@/api/customermanagement/product'
import {
  crmProductSetMealDeleteAPI
} from '@/api/customermanagement/meal'
import { crmInvoiceDeleteIdsAPI } from '@/api/customermanagement/invoice'
import TransferHandle from './selectionHandle/TransferHandle' // 转移
import AllocHandle from './selectionHandle/AllocHandle' // 公海分配操作
import DealStatusHandle from './selectionHandle/DealStatusHandle' // 客户状态修改操作
import TimePiece from '../../../callCenter/TimePiece'
import PutPoolHandle from './selectionHandle/PutPoolHandle' // 放入公海
import ChangePoolHandle from './selectionHandle/ChangePoolHandle' // 变更公海
import ChangeDeptHandle from './selectionHandle/ChangeDeptHandle' // 变更中心

export default {
  name: 'CRMDetailHead',
  components: {
    TransferHandle,
    AllocHandle,
    TimePiece,
    DealStatusHandle,
    PutPoolHandle,
    ChangePoolHandle,
    ChangeDeptHandle
  },
  props: {
    /** 模块ID */
    id: [String, Number],
    poolId: [String, Number],
    /** 没有值就是全部类型 有值就是当个类型 */
    crmType: {
      type: String,
      default: ''
    },
    // 辅助 使用
    isSeas: {
      type: Boolean,
      default: false
    },
    isStudent: {
      type: Boolean,
      default: false
    },
    /** 联系人人下 新建商机 需要联系人里的客户信息  合同下需要客户和商机信息 合同作废需要合同状态*/
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    },
    headDetails: {
      type: Array,
      default: () => {
        return []
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
      moreTypes: [], // 更多操作
      transferDialogShow: false, // 转移操作
      allocDialogShow: false, // 公海分配操作提示框
      dealStatusShow: false, // 成交状态修改框
      putPoolShow: false, // 客户放入公海
      changePoolShow: false, // LEADS转移公海
      changeDeptShow: false // 学员变更中心
    }
  },
  computed: {
    ...mapGetters(['crm']),
    crmIcon() {
      if (this.crmType == 'productSetMeal') {
        return require(`@/assets/img/crm/product.png`)
      } else if (this.crmType == 'capitalAccount') {
        return require(`@/assets/img/crm/customer.png`)
      }
      return require(`@/assets/img/crm/${this.crmType}.png`)
    },
    showTimer() {
      return this.$store.state.customer.showTimer
    },
    // 只有正在通话的页面才能展示时间
    isCall() {
      if (this.modelData) {
        if (this.modelData.modelId == this.id && this.modelData.model === this.crmType) {
          return true
        } else {
          return false
        }
      } else {
        return true
      }
    },
    typeName() {
      if (this.isStudent) return '学员'
      return (
        {
          leads: '线索',
          customer: 'LEADS',
          capitalAccount: '资金账户',
          contacts: '联系人',
          product: '课程单品',
          productSetMeal: '课程套餐',
          business: '商机',
          contract: '合同',
          receivables: '回款',
          marketing: '活动',
          visit: '回访',
          invoice: '发票'
        }[this.crmType] || ''
      )
    },
    name() {
      if (this.crmType === 'receivables') {
        return this.detail.number
      } else if (this.crmType === 'customer') {
        return this.detail.customerName
      } else if (this.crmType === 'business') {
        return this.detail.businessName
      } else if (this.crmType === 'marketing') {
        return this.detail.marketingName
      } else if (this.crmType === 'visit') {
        return this.detail.visitNumber
      } else if (this.crmType === 'invoice') {
        return this.detail.invoiceApplyNumber
      }
      return this.detail.name
    },
    // 展示转移
    showTransfer() {
      if (
        this.crmType === 'receivables' ||
        this.crmType === 'product' ||
        this.crmType === 'customer' ||
         this.crmType === 'marketing' ||
         this.crmType === 'visit' ||
        this.isSeas
      ) {
        return false
      }

      if (this.crmType === 'contract') {
        return (
          this.detail &&
          this.detail.checkStatus != 8 &&
          this.crm[this.crmType].transfer
        )
      }

      return this.crm[this.crmType].transfer
    },
    showEdit() {
      if (this.crmType === 'contract') {
        //  8 已作废
        return (
          this.detail &&
          this.detail.checkStatus != 8 &&
          this.crm[this.crmType].update
        )
      }

      return this.isSeas ? false : this.crm[this.crmType].update
    },

    /**
     * 客户是否锁定
     */
    isLock() {
      if (this.detail) {
        return this.detail.status == 2 // 1是正常 2 是锁定
      }
      return false
    },

    /**
     * 展示成交按钮
     */
    showDealStatus() {
      return (
        !this.isSeas &&
        this.crmType == 'customer' &&
        this.crm[this.crmType].dealStatus
      )
    },

    /**
     * 转移到其他公海按钮
     */
    showChangeSeas() {
      return this.isSeas && this.crmType === 'customer'
    },

    /**
     * 权限内的更多按钮
     */
    permissionMoreTypes() {
      return this.moreTypes.filter(item => {
        return this.whetherTypeShowByPermision(item.type)
      })
    }
  },
  watch: {
    isSeas() {
      this.moreTypes = this.getSelectionHandleItemsInfo()
    }
  },
  mounted() {
    this.moreTypes = this.getSelectionHandleItemsInfo()
  },
  methods: {
    /** 更多操作 */
    handleTypeClick(type) {
      if (type == 'edit') {
        // 编辑
        this.$emit('handle', { type: 'edit' })
      } else if (type == 'transfer') {
        // 转移
        this.transferDialogShow = true
      } else if (type === 'change_seas') {
        this.changePoolShow = true
      } else if (
        type == 'transform' ||
        type == 'delete' ||
        type == 'lock' ||
        type == 'unlock' ||
        type == 'start' ||
        type == 'disable' ||
        type == 'state_start' ||
        type == 'state_disable' ||
        type == 'get' ||
        type == 'cancel'
      ) {
        var message = ''
        if (type == 'transform') {
          message = '确定将这些线索转换为客户吗?'
        } else if (type == 'delete') {
          message = '确定删除?'
        } else if (type == 'lock') {
          message = '确定要锁定该客户吗？锁定后将不会掉入公海。'
        } else if (type == 'unlock') {
          message = '确定要解锁该客户吗？'
        } else if (type == 'start') {
          message = '确定要上架该产品吗?'
        } else if (type == 'disable') {
          message = '确定要下架该产品吗?'
        } else if (type == 'state_start') {
          message = '确定要启用该活动吗?'
        } else if (type == 'state_disable') {
          message = '确定要停用该活动吗?'
        } else if (type == 'get') {
          message = '确定要领取该客户吗?'
        } else if (type == 'cancel') {
          message = '确定要作废此合同吗?'
          if (this.detail.receivablesCount) {
            message = '合同下有相关回款,确定要作废吗?'
          }
        }

        this.$confirm(message, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.confirmHandle(type)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
      } else if (type == 'alloc') {
        // 公海分配操作
        this.allocDialogShow = true
      } else if (type == 'deal_status') {
        // 客户成交状态操作
        this.dealStatusShow = true
      } else if (type == 'put_seas') {
        // 客户放入公海
        this.putPoolShow = true
      } else if (type === 'change_dept') {
        // 变更中心
        this.changeDeptShow = true
      }
    },
    confirmHandle(type) {
      if (type === 'lock' || type === 'unlock') {
        crmCustomerLock({
          status: type === 'lock' ? '2' : '1', // 1是正常 2 是锁定
          ids: this.id
        })
          .then(res => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.$emit('handle', { type: type })
          })
          .catch(() => {})
      } else if (type === 'transform') {
        crmLeadsTransform({
          leadsIds: this.id
        })
          .then(res => {
            this.$message({
              type: 'success',
              message: '转化成功'
            })
            // 刷新待办
            this.$store.dispatch('GetMessageNum')

            this.$emit('handle', { type: type })
          })
          .catch(() => {})
      } else if (type === 'start' || type === 'disable') {
        crmProductStatus({
          ids: this.id,
          status: type === 'start' ? '1' : '0'
        })
          .then(res => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.$emit('handle', { type: type })
          })
          .catch(() => {})
      } else if (type === 'state_start' || type === 'state_disable') {
        crmMarketingIsEnableAPI({
          marketingIds: this.id,
          status: type === 'state_start' ? 1 : 0
        })
          .then(res => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.$emit('handle', { type: type })
          })
          .catch(() => {})
      } else if (type === 'delete') {
        const request = {
          leads: crmLeadsDelete,
          customer: this.isSeas ? crmCustomerPoolDeleteAPI : crmCustomerDelete,
          contacts: crmContactsDelete,
          business: crmBusinessDelete,
          contract: crmContractDelete,
          receivables: crmReceivablesDelete,
          marketing: crmMarketingDeleteAPI,
          visit: crmReturnVisitDeleteAPI,
          product: crmProductDeleteAPI,
          productSetMeal: crmProductSetMealDeleteAPI,
          invoice: crmInvoiceDeleteIdsAPI
        }[this.crmType]
        let params = null
        if (this.crmType == 'productSetMeal') {
          params = {
            productIds: this.id
          }
        } else {
          params = {
            [this.crmType + 'Ids']: this.id
          }
        }
        if (this.isSeas) {
          params.poolId = this.poolId
        }
        request(params)
          .then(res => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.$emit('handle', { type: type })
          })
          .catch(() => {})
      } else if (type === 'get') {
        // 领取
        crmCustomerReceive({
          ids: this.id,
          poolId: this.poolId
        })
          .then(res => {
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            // 刷新待办
            this.$store.dispatch('GetMessageNum')

            this.$emit('handle', { type: type })
          })
          .catch(() => {})
      } else if (type === 'cancel') {
        crmContractCancelAPI({
          contractId: this.id
        })
          .then(res => {
            this.$message.success('操作成功')
            this.$emit('handle', { type })
          })
          .catch(() => {})
      }
    },
    // 子组件 回调的 结果
    handleCallBack(data) {
      this.$emit('handle', { type: data.type })
    },

    /** 更多操作 */
    /** 获取展示items */
    getSelectionHandleItemsInfo() {
      const handleInfos = {
        transfer: {
          name: '转移教育顾问',
          type: 'transfer',
          icon: 'transfer'
        },
        transform: {
          name: '转化为客户',
          type: 'transform',
          icon: 'transform'
        },
        export: {
          name: '导出选中',
          type: 'export',
          icon: 'export'
        },
        delete: {
          name: '删除',
          type: 'delete',
          icon: 'delete'
        },
        put_seas: {
          name: '放入公海',
          type: 'put_seas',
          icon: 'seas'
        },
        lock: {
          name: '锁定',
          type: 'lock',
          icon: 'lock'
        },
        unlock: {
          name: '解锁',
          type: 'unlock',
          icon: 'unlock'
        },
        add_user: {
          name: '添加团队成员',
          type: 'add_user',
          icon: 'add'
        },
        delete_user: {
          name: '移除团队成员',
          type: 'delete_user',
          icon: 'remove'
        },
        alloc: {
          name: '分配',
          type: 'alloc',
          icon: 'alloc'
        },
        get: {
          name: '领取',
          type: 'get',
          icon: 'receive'
        },
        start: {
          name: '上架',
          type: 'start',
          icon: 'shelves'
        },
        disable: {
          name: '下架',
          type: 'disable',
          icon: 'sold-out'
        },
        state_start: {
          name: '启用',
          type: 'state_start',
          icon: 'activation'
        },
        state_disable: {
          name: '停用',
          type: 'state_disable',
          icon: 'remove'

        },
        deal_status: {
          name: '更改成交状态',
          type: 'deal_status',
          icon: 's-status'
        },
        cancel: {
          name: '合同作废',
          type: 'cancel',
          icon: 'invalid'
        },
        change_dept: {
          name: '变更中心',
          type: 'change_dept',
          icon: 'transform'
        }
      }
      if (this.crmType == 'leads') {
        return this.forSelectionHandleItems(handleInfos, [
          'transform',
          'delete'
        ])
      } else if (this.crmType == 'customer') {
        if (this.isSeas) {
          return this.forSelectionHandleItems(handleInfos, [
            'alloc',
            'get',
            'delete'
          ])
        } else if (this.isStudent) {
          return this.forSelectionHandleItems(handleInfos, [
            'change_dept',
            'delete'
          ])
        } else {
          return this.forSelectionHandleItems(handleInfos, [
            'transfer',
            'put_seas',
            'lock',
            'unlock',
            'delete'
          ])
        }
      } else if (this.crmType == 'contacts') {
        return this.forSelectionHandleItems(handleInfos, ['transfer', 'delete'])
      } else if (this.crmType == 'business') {
        return this.forSelectionHandleItems(handleInfos, ['transfer', 'delete'])
      } else if (this.crmType == 'contract') {
        return this.forSelectionHandleItems(handleInfos, ['transfer', 'delete', 'cancel'])
      } else if (this.crmType == 'receivables') {
        return this.forSelectionHandleItems(handleInfos, ['transfer', 'delete'])
      } else if (this.crmType == 'product') {
        return this.forSelectionHandleItems(handleInfos, ['transfer', 'delete', 'start', 'disable'])
      } else if (this.crmType == 'productSetMeal') {
        return this.forSelectionHandleItems(handleInfos, ['delete'])
      } else if (this.crmType == 'marketing') {
        return this.forSelectionHandleItems(handleInfos, [
          'state_start',
          'state_disable',
          'delete'
        ])
      } else if (this.crmType == 'visit') {
        return this.forSelectionHandleItems(handleInfos, [
          'delete'
        ])
      } else if (this.crmType == 'invoice') {
        return this.forSelectionHandleItems(handleInfos, [
          'delete'
        ])
      }
      return []
    },
    forSelectionHandleItems(handleInfos, array) {
      var tempsHandles = []
      for (let index = 0; index < array.length; index++) {
        tempsHandles.push(handleInfos[array[index]])
      }
      return tempsHandles
    },
    // 判断是否展示
    whetherTypeShowByPermision: function(type) {
      if (type == 'transfer') {
        return this.crm[this.crmType].transfer
      } else if (type == 'transform') {
        return this.crm[this.crmType].transform
      } else if (type == 'export') {
        if (this.isSeas) {
          return this.crm.pool.excelexport
        }
        return this.crm[this.crmType].excelexport
      } else if (type == 'delete') {
        if (this.isSeas) {
          return this.crm.pool.delete && this.poolId
        }
        return this.crm[this.crmType].delete
      } else if (type == 'put_seas') {
        // 放入公海(客户)
        return this.crm[this.crmType].putinpool
      } else if (type == 'lock' || type == 'unlock') {
        // 锁定解锁(客户)
        return this.crm[this.crmType].lock
      } else if (type == 'add_user' || type == 'delete_user') {
        // 添加 移除团队成员
        return this.crm[this.crmType].teamsave
      } else if (type == 'alloc') {
        // 分配(公海)
        return this.crm.pool.distribute
      } else if (type == 'get') {
        // 领取(公海)
        return this.crm.pool.receive && this.poolId
      } else if (type == 'start' || type == 'disable') {
        // 上架 下架(产品)
        return this.crm[this.crmType].status
      } else if (type == 'deal_status') {
        // 客户状态修改
        return this.crm[this.crmType].dealStatus
      } else if (type == 'cancel') {
        // 合同作废
        if (this.crm[this.crmType].discard && this.detail.checkStatus === 1) {
          return true
        }
        return false
      } else if (type == 'state_start' || type == 'state_disable') {
        // 活动停用/启用
        return this.crm[this.crmType].updateStatus
      } else if (type === 'assignHeadTeacher') {
        return this.crm[this.crmType].assignHeadTeacher
      }

      return true
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  position: relative;
  background-color: white;
  border-bottom: 1px solid $xr-border-line-color;
}

.t-section {
  position: relative;
  padding: 30px 20px 5px;
  min-height: 60px;
  &__hd {
    display: block;
    width: 40px;
    height: 40px;
    margin-right: 15px;
  }
  &__bd {
    flex: 1;
    .type-name {
      color: #999;
      font-size: 12px;
      margin-bottom: 5px;
    }

    .name {
      color: #333;
      font-size: 16px;
      font-weight: 600;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  &__ft {
    flex-shrink: 0;
    margin-left: 20px;
  }

  .t-more {
    margin-left: 15px;
  }

  .t-close {
    display: block;
    width: 40px;
    height: 40px;
    margin-left: 20px;
    padding: 10px;
    cursor: pointer;
  }
}

.h-section {
  position: relative;
  padding: 8px 20px 15px;
  .h-item {
    .h-title {
      font-size: 12px;
      color: #666;
    }
    .h-value {
      min-height: 14px;
      margin-top: 8px;
      font-size: 13px;
      color: #333;
      padding-bottom: 2px;
    }
  }
}

.el-button + .el-button {
  margin-left: 15px;
}

.head-handle-button {
  /deep/ i {
    font-size: 13px;
    margin-right: 5px;
  }
}
</style>
