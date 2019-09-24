<template>
  <div
    v-loading="loading"
    class="mian">
    <div class="mian-handle">
      <el-button
        v-for="(item, index) in handle"
        :key="index"
        :class="{ 'is-select' : handleType === item.type }"
        type="primary"
        icon="wk wk-add"
        @click="handleClick(item.type)">
        {{ item.label }}
      </el-button>
    </div>
    <log-add
      ref="logAdd"
      :id="id"
      :show-business="showRelate"
      :show-contacts="showRelate"
      :contacts="contacts"
      :follow-types="followTypes"
      class="log-add"
      @send="sendLog"
      @focus="handleType = 'log'"
      @close="handleClick(handleType)" />
    <div class="log">
      <div class="log-section">
        <div class="log-section__title">
          <span class="section-title"><span class="section-title__time">2019-09-02</span></span>
        </div>
        <div
          v-if="list.length > 0"
          class="log-cells">
          <log-cell
            v-for="(item, index) in list"
            :item="item"
            :index="index"
            :crm-type="crmType"
            :key="index" />
          <i class="wk wk-message log-cells__mark" />
        </div>
        <div class="log-cells activity-cells">
          <div class="activity-cell"><span class="activity-cell__label">2019-09-13 09:30 张强创建了商机：</span><span class="activity-cell__content">采购100台电脑</span></div>
          <i
            class="wk wk-business log-cells__mark"
            style="background-color: #FB9323;" />
        </div>
      </div>
    </div>

    <!-- CRM相关新建 -->
    <c-r-m-create-view
      v-if="isCRMCreate"
      :crm-type="createCRMType"
      @save-success="createCRMSuccess"
      @hiden-view="createCRMClose" />
    <!-- 任务新建 -->
    <new-dialog
      :new-dialog-visible="isTaskCreate"
      :new-loading="taskLoading"
      @handleClose="createTaskClose"
      @dialogVisibleSubmit="createTaskClick"/>
  </div>
</template>

<script>
import LogAdd from './LogAdd'
import { crmCustomerQueryContacts } from '@/api/customermanagement/customer'
import { crmSettingRecordListAPI } from '@/api/customermanagement/common'
import { crmCustomerRecordSave } from '@/api/customermanagement/customer'
import { crmLeadsRecordIndex } from '@/api/customermanagement/clue'
import { crmCustomerRecordIndex } from '@/api/customermanagement/customer'
import { crmContactsRecordIndex } from '@/api/customermanagement/contacts'
import { crmBusinessRecordIndex } from '@/api/customermanagement/business'
import { crmContractRecordIndex } from '@/api/customermanagement/contract'
import LogCell from './LogCell'
import CRMCreateView from '@/views/customermanagement/components/CRMCreateView'
import NewDialog from '@/views/OAManagement/task/components/newDialog'
import { addTask } from '@/api/oamanagement/task'

export default {
  name: 'Activity', // 活动
  components: {
    LogAdd,
    LogCell,
    CRMCreateView,
    NewDialog
  },
  props: {
    // 操作按钮
    handle: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 模块ID
    id: [String, Number],
    // 没有值就是全部类型 有值就是当个类型
    crmType: {
      type: String,
      default: ''
    },
    // 是公海 默认是客户
    isSeas: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      contacts: [],
      followTypes: [],
      handleType: '',
      // 活动列表
      list: [],
      // 相关新建
      isCRMCreate: false,
      createCRMType: '',
      isTaskCreate: false,
      taskLoading: false
    }
  },
  computed: {
    showRelate() {
      return this.crmType == 'customer'
    }
  },
  watch: {
    id() {
      this.initInfo()
    }
  },
  mounted() {
    this.initInfo()
  },
  methods: {
    /**
     * 初始化信息
     */
    initInfo() {
      this.$refs.logAdd.resetInfo()
      this.getLogTypeList()
      if (this.showRelate) {
        this.getContactsList()
      }

      this.getLogList()
    },

    /**
     * 获取详情
     */
    getLogTypeList() {
      crmSettingRecordListAPI()
        .then(res => {
          this.followTypes = res.data.map(item => {
            return {
              value: item,
              label: item
            }
          })
        })
        .catch(() => {})
    },

    /**
     * 获取联系人
     */
    getContactsList() {
      crmCustomerQueryContacts({
        customerId: this.id
      })
        .then(res => {
          this.contacts = res.data.list
        })
        .catch(() => {})
    },

    /**
     * 发布日志
     */
    sendLog(data) {
      if (!data.content) {
        this.$message.error('请输入跟进内容')
        return
      }

      const params = {}
      params.typesId = data.id
      params.content = data.content
      params.category = data.followType
      const businessIds = data.business.map(function(element, index, array) {
        return element.businessId
      })

      params.batchId = data.batchId
      params.businessIds = businessIds.join(',')
      params.contactsIds = data.contactsId

      params.nextTime = data.nextTime || ''
      params.isEvent = 0
      this.sendLoading = true
      crmCustomerRecordSave(params)
        .then(res => {
          this.sendLoading = false
          this.$message.success('发布成功')
          // 重置页面
          this.$refs.logAdd.resetInfo()
          this.getLogList()
        })
        .catch(() => {
          this.sendLoading = false
        })
    },

    /**
     * 操作点击
     */
    handleClick(type) {
      if (this.handleType == type) {
        this.handleType = ''
      } else {
        this.handleType = type
      }

      if (type == 'log') {
        this.$refs.logAdd.isUnfold = this.handleType == type
      } else if (type == 'task') {
        this.isTaskCreate = true
      } else if (type == 'email') {
      } else {
        this.createCRMType = type
        this.isCRMCreate = true
      }
    },

    /**
     * 活动日志
     */
    getLogList() {
      this.loading = true
      const request = {
        customer: crmCustomerRecordIndex,
        leads: crmLeadsRecordIndex,
        contacts: crmContactsRecordIndex,
        business: crmBusinessRecordIndex,
        contract: crmContractRecordIndex
      }[this.crmType]

      const params = {
        page: this.page,
        limit: 10
      }
      params[this.crmType + 'Id'] = this.id
      request(params)
        .then(res => {
          this.list = this.list.concat(res.data)
          // if (res.data.length < 10) {
          //   this.loadMoreLoading = false
          // } else {
          //   this.loadMoreLoading = true
          // }
          this.loading = false
          // this.isPost = false
        })
        .catch(() => {
          this.isPost = false
          // this.loading = false
        })
    },

    /**
     * CRM新建成功
     */
    createCRMSuccess() {
      this.handleType = ''
    },

    createCRMClose() {
      this.isCRMCreate = false
      this.handleType = ''
    },

    /**
     * 提交任务
     */
    createTaskClick(val) {
      this.taskLoading = true
      addTask(val)
        .then(res => {
          this.$message.success('新建成功')
          this.taskLoading = false
          this.isTaskCreate = false
        })
        .catch(() => {
          this.taskLoading = false
          this.isTaskCreate = false
        })
    },

    createTaskClose() {
      this.isTaskCreate = false
      this.handleType = ''
    }
  }
}
</script>

<style scoped lang="scss">
.main {
  position: relative;
  overflow: auto;
}

.el-button {
  padding: 3px 4px;
  font-size: 12px;
  color: #666;
  background-color: #f1f5fd;
  border-color: #f1f5fd;
  /deep/ i {
    font-size: 13px;
  }
}

.el-button--primary:hover {
  background: $xr-color-primary;
  border-color: $xr-color-primary;
  color: #ffffff;
}

.el-button.is-select {
  background: $xr-color-primary;
  border-color: $xr-color-primary;
  color: #ffffff;
}

.scroll-div {
  height: 200px;
  background-color: red;
  margin-top: 20px;
}

.log-add {
  margin-top: 15px;
}

.log {
  margin-top: 20px;
  &-section {
    &__title {
      padding: 8px 0;
      .section-title {
        background-color: $xr-color-primary;
        color: white;
        font-size: 12px;
        padding: 1px 5px;
        height: 20px;
        border-radius: 10px;
        &__time::before {
          content: ' ';
          position: relative;
          width: 6px;
          height: 6px;
          border-radius: 3px;
          background-color: white;
          margin-right: 5px;
          bottom: 2px;
          display: inline-block;
        }
      }
    }
  }

  &-cells {
    margin-left: 30px;
    padding: 8px;
    position: relative;

    &__mark {
      position: absolute;
      left: -10px;
      top: 24px;
      background-color: #487dff;
      color: white;
      border-radius: 4px;
      padding: 4px;
      font-size: 12px;
      z-index: 1;
    }
  }

  // 活动cell
  &-cells.activity-cells {
    .log-cells__mark {
      top: 9px;
    }
  }

  &-cells::before {
    position: absolute;
    content: ' ';
    width: 1px;
    top: 0;
    left: 0;
    bottom: 0;
    background-color: $xr-border-line-color;
  }
  &-cells:nth-child(2)::before {
    top: 24px;
  }

  &-cells:last-child::before {
    bottom: 10px;
  }

  &-cell {
    height: 300px;
  }
}

.activity-cell {
  font-size: 12px;
  padding: 5px 10px;
  &__label {
    color: #666666;
  }
  &__content {
    cursor: pointer;
    color: $xr-color-primary;
  }
  &__content:hover {
    text-decoration: underline;
  }
}
</style>
