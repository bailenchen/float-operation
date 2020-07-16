<template>
  <flexbox class="detail-head" justify="space-between">
    <div class="detail-header">
      <flexbox class="title">
        <span class="font-title">{{ detailData.theme }}</span>
        <i v-if="!detailData.isStart" class="el-icon-star-off"/>
        <i v-else class="el-icon-star-on" style="color: #FAC23D;"/>
      </flexbox>
      <div class="main-info">发件人：&nbsp;&nbsp;{{ detailData.sender }}</div>
      <flexbox>
        <div class="main-title">收件人：&nbsp;</div>
        <div class="over">
          {{ handleDetailReceiptName(detailData) }}
        </div>
      </flexbox>
      <div class="main-info">时&nbsp;&nbsp;&nbsp;间：&nbsp;&nbsp;{{ fifterTime(detailData.showTime) }}</div>
      <div class="main-info">
        附&nbsp;&nbsp;&nbsp;件: &nbsp;&nbsp;&nbsp;&nbsp;<span style="font-weight: bolder;">{{ fileCount }} 个</span>&nbsp;
        <span v-if="fileCount">
          (<span>
            <img :src="src" style="vertical-align: sub;" width="12px" alt="">
          {{ fileNames }}</span>)
        </span>

      </div>
    </div>
    <div class="button_group">
      <el-button type="plain" size="mini" icon="el-icon-chat-dot-round" @click="reply">回复</el-button>
      <el-button type="plain" size="mini" icon="el-icon-share" @click="share">转发</el-button>
      <el-button type="plain" size="mini" icon="el-icon-delete" @click="delItemEmail">删除</el-button>
      <el-select v-model="value" size="mini" placeholder="移动到" @change="changeval">
        <el-option
          v-for="item in moveList"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
    </div>
  </flexbox>
</template>

<script>
import { formatTime } from '@/utils'
export default {
  name: 'DetailHead',
  props: {
    detailData: {
      type: Object,
      default() {
        return {}
      }
    },
    emailType: {
      type: String,
      default: ''
    },
    fileCount: {
      type: [String, Number],
      default: ''
    },
    fileNames: {
      type: [String, Number],
      default: ''
    },
    src: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      value: '',
      detailTypeConfig: {
        receive: 'INBOX',
        sent: 'Sent Messages'
      }
    }
  },
  computed: {
    moveList() {
      const list = []
      if (this.emailType === 'receive') {
        list.push({ label: '已发送', value: 1 })
      } else if (this.emailType === 'sent') {
        list.push({ label: '收件箱', value: 0 })
      } else {
        list.push({ label: '收件箱', value: 0 })
        list.push({ label: '已发送', value: 1 })
      }
      return list
    }
  },
  mounted() {
  },
  methods: {
    /**
     * 回复
     */
    reply() {
      // localStorage.setItem('crm-emailContent', this.detailData)
      this.$router.push({
        path: '/email/index/writeLetter',
        query: {
          reply: true
        }
      })
    },

    /**
     * 转发
     */
    share() {
      this.$router.push({
        path: '/email/index/writeLetter',
        query: {
          share: true
        }
      })
    },

    /**
     * 删除邮件
     */
    delItemEmail() {
      this.$emit('on-del')
    },

    /**
     * 选择移动项
     */
    changeval(val) {
      if (this.emailType == 'receive' && val == 0 || this.emailType == 'sent' && val == 1) {
        this.$message.error('不能移动到相同的类别里')
      } else {
        this.$emit('move', val)
      }
    },

    /**
     * 格式化时间
     */
    fifterTime(time) {
      return formatTime(new Date(time))
    },

    /**
     * 拼接展示数据
     */
    handleDetailReceiptName(data) {
      const receiptNameList = data.receiptName.split(',')
      const receiptEmailsList = data.receiptEmails.split(',')
      const list = []
      receiptNameList.forEach((item, index) => {
        // 名称跟邮箱相同时，展示一个就可以了
        if (item === receiptEmailsList[index]) {
          const showItem = item.replace(/\\/g, '').replace(/\"/g, '')
          list.push(showItem)
        } else {
          list.push(item + ' ' + receiptEmailsList[index])
        }
      })
      return list.join('; ')
    }

  }
}
</script>

<style lang="scss" scoped>
.detail-head {
  background-color: #F5F5F5;
  align-items: flex-start;
  .title {
    padding: 15px;
    font-size: 16px;
    font-weight: bolder;
    .font-title {
      margin-right: 10px;
    }
  }
  .main-info {
    padding: 5px 20px;
    color: #333;
    font-size: 13px;
    text-align: left;
  }
  .over {
    width: 100%;
    word-break: break-word;
    margin: 10px 0;
    padding-right: 30px;
  }
  .main-title {
    width: 78px;
    flex-shrink: 0;
    text-align: right;
  }
  .button_group {
    padding: 10px 15px;
    position: absolute;
    right: 20px;
  }
}
.el-select {
  width: 80px;
  margin-left: 10px;
}
.el-icon-star-on {
  position: relative;
  top: 0px;
}
</style>

