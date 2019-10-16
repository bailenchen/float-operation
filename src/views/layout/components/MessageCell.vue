<template>
  <flexbox
    :class="{ 'is-unread' :data.isRead == 0 }"
    class="message-cell"
    align="stretch">
    <div class="message-cell__hd">
      <i
        :class="typeObj.icon"
      />
    </div>

    <div class="message-cell__bd">
      <span>{{ leftContent }}</span>
      <span class="click-content" @click="enterDetail">{{ centerCotent }}</span>
      <span>{{ rightContent }}</span>
    </div>

    <div class="message-cell__ft"><i class="el-icon-check" @click="messageReadClick" />{{ data.createTime | formatTime }} </div>
  </flexbox>
</template>

<script>

export default {
  // 消息cell
  name: 'MessageCell',
  components: {

  },
  props: {
    data: Object,
    dataIndex: Number
  },
  data() {
    return {}
  },
  computed: {
    typeObj() {
      const typesObj = {
        leads: {
          icon: 'wk wk-leads',
          color: '#6995FF',
          type: 'leads'
        },
        customer: {
          icon: 'wk wk-customer',
          color: '#6995FF',
          type: 'customer'
        },
        contacts: {
          icon: 'wk wk-contacts',
          color: '#6995FF',
          type: 'contacts'
        },
        business: {
          icon: 'wk wk-business',
          color: '#6995FF',
          type: 'business'
        },
        contract: {
          icon: 'wk wk-contract',
          color: '#6995FF',
          type: 'contract'
        },
        receivables: {
          icon: 'wk wk-receivables',
          color: '#6995FF',
          type: 'receivables'
        },
        product: {
          icon: 'wk wk-product',
          color: '#6995FF',
          type: 'product'
        },
        log: {
          icon: 'wk wk-log',
          color: '#6995FF',
          type: 'log'
        },
        examine: {
          icon: 'wk wk-approve',
          color: '#6995FF',
          type: 'examine'
        },
        task: {
          icon: 'wk wk-o-task',
          color: '#6995FF',
          type: 'task'
        },
        announcement: {
          icon: 'wk wk-announcement',
          color: '#6995FF',
          type: 'announcement'
        }
      }

      // 1 任务 2 日志 3 oa审批 4公告 5 日程 6 客户管理
      let key = ''
      if (this.data.label && this.data.label < 5) {
        key = ['task', 'log', 'examine', 'announcement'][this.data.label - 1]
      } else {
        if ([10, 11, 24].includes(this.data.type)) {
          key = 'contract'
        } else if ([12, 13].includes(this.data.type)) {
          key = 'receivables'
        } else if ([14, 15, 23].includes(this.data.type)) {
          key = 'customer'
        } else if ([16, 17].includes(this.data.type)) {
          key = 'contacts'
        } else if ([18, 19].includes(this.data.type)) {
          key = 'leads'
        } else if ([20, 21].includes(this.data.type)) {
          key = 'product'
        } else if ([22].includes(this.data.type)) {
          key = 'business'
        }
      }

      return typesObj[key]
    },

    leftContent() {
      return {
        1: `${this.data.realname}将`,
        2: `${this.data.realname}邀请您参与`,
        3: `${this.data.realname}将`,
        4: `${this.data.realname}回复了您的`,
        5: `${this.data.realname}将日志`,
        6: `${this.data.realname}拒绝您的`,
        7: `您的`,
        8: `您有一个新公告`,
        9: `${this.data.realname}邀请您参与`,
        10: `${this.data.realname}拒绝您的`,
        11: `${this.data.realname}您的`,
        12: `${this.data.realname}拒绝您的`,
        13: `${this.data.realname}您的`,
        14: `${this.data.realname}导入客户数据${this.data.title}条，失败${this.data.content}条。`,
        15: `${this.data.realname}取消导入客户数据，已导入${this.data.title}条，失败${this.data.content}条。`,
        16: `${this.data.realname}导入联系人数据${this.data.title}条，失败${this.data.content}条。`,
        17: `${this.data.realname}取消导入联系人数据，已导入${this.data.title}条，失败${this.data.content}条。`,
        18: `${this.data.realname}导入线索数据${this.data.title}条，失败${this.data.content}条。`,
        19: `${this.data.realname}取消导入线索数据，已导入${this.data.title}条，失败${this.data.content}条。`,
        20: `${this.data.realname}导入产品数据${this.data.title}条，失败${this.data.content}条。`,
        21: `${this.data.realname}取消导入产品数据，已导入${this.data.title}条，失败${this.data.content}条。`,
        22: `${this.data.realname}将您添加为商机`,
        23: `${this.data.realname}将您添加为客户`,
        24: `${this.data.realname}将您添加为合同`,
        25: `${this.data.realname}提交了`,
        26: `${this.data.realname}提交了`,
        27: `${this.data.realname}提交了`
      }[this.data.type]
    },

    centerCotent() {
      // 导入提示与其他不一样
      if (this.data.type >= 14 && this.data.type <= 21) {
        // title 是总数 content 是错误数据
        return this.data.content ? '点击下载错误数据' : ''
      } else {
        return `《${this.data.title}》`
      }
    },

    rightContent() {
      return {
        1: `任务分配给您，请及时查看`,
        2: `任务，请及时查看`,
        3: `任务标记结束`,
        4: `日志：“${this.data.content || '无'}”，请及时查看`,
        5: `发送给您，请及时查看`,
        6: `，拒绝理由：“${this.data.content || '无'}”，请及时处理`,
        7: `已经审核通过，请及时查看`,
        8: `，请及时查看`,
        9: `日程，请及时查看`,
        10: `合同审批，拒绝理由：“${this.data.content || '无'}”，请及时处理`,
        11: `合同已经审核通过，请及时查看`,
        12: `回款审批，拒绝理由：“${this.data.content || '无'}”，请及时处理`,
        13: `回款已经审核通过，请及时查看`,
        14: ``,
        15: ``,
        16: ``,
        17: ``,
        18: ``,
        19: ``,
        20: ``,
        21: ``,
        22: `的成员`,
        23: `的成员`,
        24: `的成员`,
        25: `，请及时处理`,
        26: `合同审批，请及时处理`,
        27: `回款审批，请及时处理`
      }[this.data.type]
    }
  },
  watch: {},
  mounted() {},

  beforeDestroy() {},
  methods: {
    enterDetail() {
      if (this.data.type >= 14 && this.data.type <= 21) {
        this.$emit('download', this.data.messageId, this.dataIndex)
      } else {
        this.$emit('read', this.data.messageId, this.dataIndex)
        this.$emit('detail', this.typeObj.type, this.data.typeId, this.dataIndex)
      }
    },

    /**
     * 标记已读
     */
    messageReadClick() {
      this.$emit('read', this.data.messageId, this.dataIndex)
    }
  }
}
</script>

<style lang="scss" scoped>
.message-cell {
  position: relative;
  font-size: 14px;
  color: #333;
  padding: 15px 20px 15px 15px;
  line-height: 1.5;

  &__hd {
    flex-shrink: 0;
    margin-right: 15px;
    background-color: $xr-color-primary;
    text-align: center;
    width: 28px;
    height: 28px;
    line-height: 28px;
    border-radius: 14px;

    .wk {
      color: white;
      font-size: 13px;
    }
  }

  &__bd {
    flex: 1;
  }

  &__ft {
    flex-shrink: 0;
    font-size: 12px;
    color: #999;
    width: 85px;
    margin-left: 35px;
    text-align: right;
    position: relative;

    .el-icon-check {
      visibility: hidden;
    }
  }

  &.is-unread::before {
    content: '';
    position: absolute;
    top: 20px;
    right: 8px;
    width: 6px;
    height: 6px;
    border-radius: 3px;
    background-color: #f94e4e;
  }

  &:hover {
    background-color: #f7f8fa;
  }

  &.is-unread:hover {
    .el-icon-check {
      visibility: visible;
    }
  }
}

// 标记
.el-icon-check {
  font-size: 20px;
  position: absolute;
  top: 50%;
  left: -20px;
  margin-top: -10px;
  color: $xr-color-primary;
  cursor: pointer;
}

.click-content {
  color: $xr-color-primary;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>
