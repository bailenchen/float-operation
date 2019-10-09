<template>
  <div
    v-loading="loading"
    v-infinite-scroll="getLogList"
    infinite-scroll-disabled="scrollDisabled"
    class="main">
    <div>
      <div class="main-handle">
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
        v-if="!isTaskCreate"
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

      <task-quick-add
        v-else
        ref="taskAdd"
        :params="taskParams"
        class="task-quick-add"
        @send="refreshLogList" />

      <div class="log">
        <!-- 筛选 -->
        <el-dropdown
          v-if="typeList.length > 1"
          trigger="click"
          class="tabs-head-select"
          @command="handleSelectClick">
          <span class="el-dropdown-link">
            <i
              :class="['wk', 'dropdown-icon', 'wk-' + activityType.icon]"
              :style="{ backgroundColor: activityType.color }" />{{ activityType.label }}<i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="(item, index) in typeList"
              :key="index"
              :command="item"> <i
                :class="['wk', 'dropdown-icon', 'wk-' + item.icon]"
                :style="{ backgroundColor: item.color }" />{{ item.label }}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <div
          v-for="(seciton, secitonIndex) in list"
          :key="secitonIndex"
          class="log-section">
          <div class="log-section__title">
            <span class="section-title"><span class="section-title__time">{{ seciton.time }}</span></span>
          </div>

          <template v-for="(item, index) in seciton.list">
            <div
              v-if="item.type == 1"
              :key="index"
              :class="{ 'only-one': seciton.list.length == 1 }"
              class="log-cell">
              <log-cell
                :item="item"
                :section="secitonIndex"
                :index="index"
                :crm-type="crmType"
                @crm-detail="checkCRMDetail"
                @delete="logCellDelete" />
              <i class="wk wk-message log-cell__mark" />
            </div>
            <div
              v-else
              :key="index"
              :class="{ 'only-one': seciton.list.length == 1 }"
              class="log-cell activity-cell">
              <div
                v-if="item.type == 2"
                class="activity-cell">
                <span class="activity-cell__label">{{ item.createTime }} {{ item.realname }}创建了{{ item.activityType | getActivityTypeName }}：</span><span
                  class="activity-cell__content"
                  @click="checkCRMDetail(getActivityType(item.activityType), item.activityTypeId)">{{ item.activityTypeName || '查看详情' }}</span>
              </div>
              <div
                v-if="item.type == 3"
                class="activity-cell">
                <span class="activity-cell__label">{{ item.createTime }} {{ item.realname }}将商机：</span>
                <span
                  class="activity-cell__content"
                  @click="checkCRMDetail('business', item.activityTypeId)">{{ item.activityTypeName }}</span>
                <span>{{ ` 阶段变为 ${item.content}` }}</span>
              </div>
              <i
                :class="[item.type == 3 ? 'wk-business' : `wk-${getActivityIcon(item.activityType)}`]"
                :style="{ backgroundColor: getActivityTypeColor(item.activityType) }"
                class="wk log-cell__mark"
                style="background-color: #FB9323;" />
            </div>
          </template>
        </div>
        <p
          v-if="loading"
          class="scroll-bottom-tips">加载中...</p>
        <p
          v-if="noMore"
          class="scroll-bottom-tips">没有更多了</p>
      </div>
    </div>

    <!-- CRM相关新建 -->
    <c-r-m-create-view
      v-if="isCRMCreate"
      :crm-type="createCRMType"
      :action="createActionInfo"
      @save-success="createCRMSuccess"
      @hiden-view="createCRMClose" />

    <!-- CRM详情 -->
    <c-r-m-full-screen-detail
      :visible.sync="showFullDetail"
      :crm-type="relationCrmType"
      :id="relationID" />
  </div>
</template>

<script>
import LogAdd from './LogAdd'
import { crmCustomerQueryContacts } from '@/api/customermanagement/customer'
import {
  crmSettingRecordListAPI,
  crmActivityListAPI,
  crmActivityAddAPI
} from '@/api/customermanagement/common'
import LogCell from './LogCell'
import CRMCreateView from '@/views/customermanagement/components/CRMCreateView'
import TaskQuickAdd from '@/views/taskExamine/task/components/TaskQuickAdd'
import crmTypeModel from '@/views/customermanagement/model/crmTypeModel'
import { objDeepCopy } from '@/utils'

export default {
  name: 'Activity', // 活动
  components: {
    LogAdd,
    LogCell,
    CRMCreateView,
    TaskQuickAdd,
    CRMFullScreenDetail: () =>
      import('@/views/customermanagement/components/CRMFullScreenDetail.vue')
  },
  filters: {
    getActivityTypeName(activityType) {
      // 1 线索 2 客户 3 联系人 4 产品 5 商机 6 合同 7 回款 8 日志 9 审批 10 日程 11 任务 12 发邮件
      return {
        1: '线索',
        2: '客户',
        3: '联系人',
        4: '产品',
        5: '商机',
        6: '合同',
        7: '回款',
        8: '日志',
        9: '审批',
        10: '日程',
        11: '任务',
        12: '发邮件'
      }[activityType]
    }
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
    },
    // 筛选数据源
    typeList: {
      type: Array,
      default: () => {
        return []
      }
    },
    // 详情
    detail: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      loading: false,
      contacts: [],
      followTypes: [],
      handleType: '',
      activityType: {
        icon: 'all',
        color: '#2362FB',
        command: '',
        label: '全部活动'
      },
      // 活动列表
      list: [],
      noMore: false,
      page: 1,
      // 相关新建
      isCRMCreate: false,
      createActionInfo: { type: 'relative', crmType: this.crmType, data: {}},
      createCRMType: '',
      // 任务创建
      isTaskCreate: false,
      // CRM详情
      showFullDetail: false, // 查看相关客户管理详情
      relationID: '', // 相关ID参数
      relationCrmType: '' // 相关类型
    }
  },
  computed: {
    showRelate() {
      return this.crmType == 'customer'
    },

    scrollDisabled() {
      return this.loading || this.noMore
    },

    taskParams() {
      const params = {}
      params[`${this.crmType}Ids`] = this.id
      return params
    }
  },
  watch: {
    id() {
      this.initInfo()
      this.refreshLogList()
    }
  },
  mounted() {
    this.initInfo()
  },
  methods: {
    /**
     * 获取跟进类型详情
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
      params.activityType = crmTypeModel[this.crmType]
      params.activityTypeId = data.id
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
      crmActivityAddAPI(params)
        .then(res => {
          this.sendLoading = false
          this.$message.success('发布成功')
          // 重置页面
          this.$refs.logAdd.resetInfo()
          this.refreshLogList()
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
        this.isTaskCreate = false
        this.$nextTick(() => {
          this.$refs.logAdd.isUnfold = this.handleType == type
        })
      } else if (type == 'task') {
        this.isTaskCreate = true
        this.$nextTick(() => {
          this.$refs.taskAdd.inputFocus()
        })
      } else {
        this.isTaskCreate = false
        const aciton = { type: 'relative', crmType: this.crmType, data: {}}
        if (this.crmType == 'contacts') {
          aciton.data['customer'] = objDeepCopy(this.detail)
          // 联系人下新建商机直接关联
          if (type == 'business') {
            aciton.relativeData = {
              contactsId: this.detail.contactsId
            }
          }
        } else if (this.crmType == 'customer') {
          aciton.data['customer'] = objDeepCopy(this.detail)
        } else if (this.crmType == 'business') {
          aciton.data['customer'] = objDeepCopy(this.detail)
          aciton.data['business'] = objDeepCopy(this.detail)
          // 商机下新建联系人直接关联
          if (type == 'contacts') {
            aciton.relativeData = {
              businessId: this.detail.businessId
            }
          }
        } else if (this.crmType == 'contract') {
          aciton.data['customer'] = objDeepCopy(this.detail)
          aciton.data['contract'] = objDeepCopy(this.detail)
        }

        this.createActionInfo = aciton
        this.createCRMType = type
        this.isCRMCreate = true
      }
    },

    /**
     * 初始化信息
     */
    initInfo() {
      this.$refs.logAdd.resetInfo()
      this.getLogTypeList()
      if (this.showRelate) {
        this.getContactsList()
      }
    },

    /**
     * 初始化日志
     */
    refreshLogList() {
      this.page = 1
      this.list = []
      this.noMore = false
    },

    /**
     * 活动筛选
     */
    handleSelectClick(value) {
      this.activityType = value
      this.refreshLogList()
    },

    /**
     * 活动日志
     */
    getLogList() {
      // this.loading = true
      const params = {
        page: this.page,
        crmType: crmTypeModel[this.crmType], // 9是公海
        activityType: this.activityType.command,
        activityTypeId: this.id
      }

      crmActivityListAPI(params)
        .then(res => {
          // this.loading = false
          if (!this.noMore) {
            this.page++

            if (this.list.length) {
              const lastLog = this.list[this.list.length - 1]
              if (res.data.time && res.data.list.length && lastLog.time != res.data.time) {
                this.list.push(res.data)
              }
            } else {
              if (res.data.time && res.data.list.length) {
                this.list.push(res.data)
              }
            }
          }
          this.noMore = res.lastPage
        })
        .catch(() => {
          this.noMore = true
          // this.loading = false
        })
    },

    /**
     * CRM新建成功
     */
    createCRMSuccess() {
      this.handleType = ''
      this.refreshLogList()
    },

    createCRMClose() {
      this.isCRMCreate = false
      this.handleType = ''
    },

    /**
     * 跟进日志查看详情
     */
    checkCRMDetail(type, id) {
      console.log('checkCRMDetail---', type, id)
      if (type == 'log') {
      } else {
        this.relationID = id
        this.relationCrmType = type
        this.showFullDetail = true
      }
    },

    /**
     * 获取CRM关键字
     */
    getActivityType(activityType) {
      // 1 线索 2 客户 3 联系人 4 产品 5 商机 6 合同 7 回款 8 日志 9 审批 10 日程 11 任务 12 发邮件
      return {
        1: 'leads',
        2: 'customer',
        3: 'contacts',
        4: 'product',
        5: 'business',
        6: 'contract',
        7: 'receivables',
        8: 'log',
        9: 'examine',
        11: 'task'
      }[activityType]
    },

    getActivityIcon(activityType) {
      // 1 线索 2 客户 3 联系人 4 产品 5 商机 6 合同 7 回款 8 日志 9 审批 10 日程 11 任务 12 发邮件
      return {
        1: 'leads',
        2: 'customer',
        3: 'contacts',
        4: 'product',
        5: 'business',
        6: 'contract',
        7: 'receivables',
        8: 'log',
        9: 'approve',
        11: 'o-task'
      }[activityType]
    },

    getActivityTypeColor(activityType) {
      // 1 线索 2 客户 3 联系人 4 产品 5 商机 6 合同 7 回款 8 日志 9 审批 10 日程 11 任务 12 发邮件
      return {
        2: '#487DFF',
        3: '#27BA4A',
        5: '#FB9323',
        6: '#FD5B4A',
        7: '#FFB940',
        8: '#5864FF',
        9: '#9376FF',
        11: '#D376FF'
      }[activityType]
    },

    /**
     * 跟进日志删除
     */
    logCellDelete(data, index, seciton) {
      this.list[seciton].list.splice(index, 1)
    }
  }
}
</script>

<style scoped lang="scss">
.main {
  height: 100%;
  position: relative;
  overflow: auto;
  padding: 15px;

  &-handle {
    // 新建按钮
    .el-button {
      margin-bottom: 5px;
      padding: 3px 4px;
      font-size: 12px;
      color: #666;
      background-color: #f1f5fd;
      border-color: #f1f5fd;
      /deep/ i {
        font-size: 13px;
      }
    }

    .el-button:first-child {
      margin-right: 10px;
    }

    .el-button + .el-button {
      margin-left: 0;
      margin-right: 10px;
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
  }
}

.scroll-div {
  height: 200px;
  background-color: red;
  margin-top: 20px;
}

.task-quick-add,
.log-add {
  margin-top: 15px;
}

.log {
  margin-top: 20px;
  position: relative;
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

  &-cell {
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

  // 仅仅一个
  &-cell.only-one::before {
    display: none;
  }

  // 活动cell
  &-cell.activity-cell {
    .log-cell__mark {
      top: 6px;
    }
  }

  &-cell::before {
    position: absolute;
    content: ' ';
    width: 1px;
    top: 0;
    left: 0;
    bottom: 0;
    background-color: $xr-border-line-color;
  }
  &-cell:nth-child(2)::before {
    top: 24px;
  }

  &-cell:last-child::before {
    height: 40px;
  }
  &-cell.activity-cell:last-child::before {
    height: 20px;
  }
}

.activity-cell {
  font-size: 12px;
  padding: 5px 13px;
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

// 下拉筛选效果
.tabs-head-select {
  position: absolute;
  top: 0;
  right: 15px;
}

.el-dropdown-link {
  cursor: pointer;
  color: #333333;
  .el-icon--right {
    color: #666666;
  }
}

.dropdown-icon {
  color: white;
  margin-right: 5px;
  padding: 3px;
  font-size: 12px;
  border-radius: 4px;
}
</style>
