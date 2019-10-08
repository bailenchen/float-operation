<template>
  <div class="container">
    <flexbox class="t-section">
      <flexbox class="t-section-name">
        <img
          :src="crmIcon"
          class="t-section-name__hd">
        <div class="t-section-name__bd">
          <span>{{ typeName }}</span>
          <p v-if="!$slots.name">{{ name }}</p>
          <slot name="name" />
        </div>
      </flexbox>

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

      <el-dropdown
        trigger="click"
        @command="handleTypeClick">
        <el-button
          icon="el-icon-more"
          class="t-more" />
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            v-for="(item, index) in moreTypes"
            v-if="whetherTypeShowByPermision(item.type)"
            :key="index"
            :icon="item.icon | wkIconPre"
            :command="item.type">{{ item.name }}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </flexbox>
    <flexbox
      class="h-section"
      align="stretch">
      <flexbox-item
        v-for="(item, index) in headDetails"
        :key="index"
        class="h-item"
        span="200">
        <div class="h-title">{{ item.title }}</div>
        <div class="h-value text-one-line"><i
          v-if="item.showIcon"
          :style="item.style"
          :class="item.icon" />{{ item.value }}</div>
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
      :selection-list="[detail]"
      :dialog-visible.sync="allocDialogShow"
      @handle="handleCallBack" />
    <deal-status-handle
      :crm-type="crmType"
      :selection-list="[detail]"
      :visible.sync="dealStatusShow"
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
  crmCustomerPutInPool,
  crmCustomerDelete,
  crmCustomerReceive
} from '@/api/customermanagement/customer'
import { crmContactsDelete } from '@/api/customermanagement/contacts'
import { crmBusinessDelete } from '@/api/customermanagement/business'
import { crmContractDelete } from '@/api/customermanagement/contract'
import { crmReceivablesDelete } from '@/api/customermanagement/money'
import { crmProductStatus } from '@/api/customermanagement/product'
import TransferHandle from './selectionHandle/TransferHandle' // 转移
import AllocHandle from './selectionHandle/AllocHandle' // 公海分配操作
import DealStatusHandle from './selectionHandle/DealStatusHandle' // 客户状态修改操作

export default {
  name: 'CRMDetailHead',
  components: {
    TransferHandle,
    AllocHandle,
    DealStatusHandle
  },
  props: {
    /** 模块ID */
    id: [String, Number],
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
    /** 联系人人下 新建商机 需要联系人里的客户信息  合同下需要客户和商机信息 */
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
    }
  },
  data() {
    return {
      moreTypes: [], // 更多操作
      transferDialogShow: false, // 转移操作
      allocDialogShow: false, // 公海分配操作提示框
      dealStatusShow: false // 成交状态修改框
    }
  },
  computed: {
    ...mapGetters(['crm', 'CRMConfig']),
    crmIcon() {
      return require(`@/assets/img/crm/${this.crmType}.png`)
    },
    typeName() {
      return (
        {
          leads: '线索',
          customer: '客户',
          contacts: '联系人',
          product: '产品',
          business: '商机',
          contract: '合同',
          receivables: '回款'
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
      }
      return this.detail.name
    },
    // 展示转移
    showTransfer() {
      if (
        this.crmType === 'receivables' ||
        this.crmType === 'product' ||
        this.crmType === 'customer' ||
        this.isSeas
      ) {
        return false
      }
      return this.crm[this.crmType].transfer
    },
    showEdit() {
      return this.isSeas ? false : this.crm[this.crmType].update
    },

    /**
     * 客户是否锁定
     */
    isLock() {
      if (this.detail) {
        return this.detail.isLock == 1
      }
      return false
    },

    /**
     * 展示成交按钮
     */
    showDealStatus() {
      return this.crmType == 'customer'
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
      } else if (
        type == 'transform' ||
        type == 'put_seas' ||
        type == 'delete' ||
        type == 'lock' ||
        type == 'unlock' ||
        type == 'start' ||
        type == 'disable' ||
        type == 'get'
      ) {
        var message = ''
        if (type == 'transform') {
          message = '确定将这些线索转换为客户吗?'
        } else if (type == 'put_seas') {
          message = '确定转移到公海吗?'
        } else if (type == 'delete') {
          message = '确定要删除这些数据吗?'
        } else if (type == 'lock') {
          message = '确定要锁定这些客户吗？锁定后将不会掉入公海。'
        } else if (type == 'unlock') {
          message = '确定要解锁这些客户吗？'
        } else if (type == 'start') {
          message = '确定要上架这些产品吗?'
        } else if (type == 'disable') {
          message = '确定要下架这些产品吗?'
        } else if (type == 'get') {
          message = '确定要领取该客户吗?'
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
      }
    },
    confirmHandle(type) {
      if (type === 'lock' || type === 'unlock') {
        crmCustomerLock({
          isLock: type === 'lock' ? '1' : '0', // 1锁0不锁
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
      } else if (type === 'put_seas') {
        crmCustomerPutInPool({
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
      } else if (type === 'delete') {
        const request = {
          leads: crmLeadsDelete,
          customer: crmCustomerDelete,
          contacts: crmContactsDelete,
          business: crmBusinessDelete,
          contract: crmContractDelete,
          receivables: crmReceivablesDelete
        }[this.crmType]
        request({
          [this.crmType + 'Ids']: this.id
        })
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
          ids: this.id
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
          name: '转移',
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
        deal_status: {
          name: '更改成交状态',
          type: 'deal_status',
          icon: 's-status'
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
        } else {
          return this.forSelectionHandleItems(handleInfos, [
            'transfer',
            'put_seas',
            'deal_status',
            'lock',
            'unlock',
            'delete'
          ])
        }
      } else if (this.crmType == 'contacts') {
        return this.forSelectionHandleItems(handleInfos, ['delete'])
      } else if (this.crmType == 'business') {
        return this.forSelectionHandleItems(handleInfos, ['delete'])
      } else if (this.crmType == 'contract') {
        return this.forSelectionHandleItems(handleInfos, ['delete'])
      } else if (this.crmType == 'receivables') {
        return this.forSelectionHandleItems(handleInfos, ['delete'])
      } else if (this.crmType == 'product') {
        return this.forSelectionHandleItems(handleInfos, ['start', 'disable'])
      }
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
        return this.crm[this.crmType].delete
      } else if (type == 'put_seas') {
        // 放入公海(客户)
        return this.crm[this.crmType].putinpool
      } else if (type == 'lock' || type == 'unlock') {
        // 锁定解锁(客户)
        return this.crm[this.crmType].lock && this.CRMConfig.customerConfig == 1
      } else if (type == 'add_user' || type == 'delete_user') {
        // 添加 移除团队成员
        return this.crm[this.crmType].teamsave
      } else if (type == 'alloc') {
        // 分配(公海)
        return this.crm.pool.distribute
      } else if (type == 'get') {
        // 领取(公海)
        return this.crm.pool.receive
      } else if (type == 'start' || type == 'disable') {
        // 上架 下架(产品)
        return this.crm[this.crmType].status
      } else if (type == 'deal_status') {
        // 客户状态修改
        return this.crm[this.crmType].dealStatus
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
  &-name {
    &__hd {
      display: block;
      width: 40px;
      height: 40px;
      margin-right: 5px;
    }
    &__bd {
      span {
        color: #999;
        font-size: 12px;
      }

      p {
        color: #333;
        font-size: 16px;
        font-weight: 600;
      }
    }
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
