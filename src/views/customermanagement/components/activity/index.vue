<template>
  <div class="mian">
    <div class="mian-handle">
      <el-button
        v-for="(item, index) in handle"
        :key="index"
        type="primary"
        icon="wk wk-add">
        {{ item.label }}
      </el-button>
    </div>
    <log-add
      :show-business="showRelate"
      :show-contacts="showRelate"
      :contacts="contacts"
      :follow-types="followTypes"
      class="log-add"
      @send="sendLog" />
  </div>
</template>

<script>
import LogAdd from './LogAdd'
import { crmCustomerQueryContacts } from '@/api/customermanagement/customer'
import { crmSettingRecordListAPI } from '@/api/customermanagement/common'
import { crmCustomerRecordSave } from '@/api/customermanagement/customer'

export default {
  name: 'Activity', // 活动
  components: {
    LogAdd
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
      contacts: [],
      followTypes: []
    }
  },
  computed: {
    showRelate() {
      return this.crmType == 'customer'
    }
  },
  watch: {},
  mounted() {
    this.getLogTypeList()
    if (this.showRelate) {
      this.getContactsList()
    }
  },
  methods: {
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
        .catch(() => {
        })
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
          this.$refs.mixadd.resetInfo()
          this.isEvent = false
          this.nextTime = ''
          // 刷新数据
          this.$bus.emit('follow-log-refresh', { type: 'record-log' })
        })
        .catch(() => {
          this.sendLoading = false
        })
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

.scroll-div {
  height: 200px;
  background-color: red;
  margin-top: 20px;
}

.log-add {
  margin-top: 15px;
}
</style>
