<template>
  <flexbox class="detail-head" justify="space-between">
    <div class="detail-header">
      <flexbox class="title">
        <span class="font-title">{{ detailData.theme }}</span>
        <i v-if="!detailData.isStart" class="el-icon-star-off"/>
        <i v-else class="el-icon-star-on" style="color: #FAC23D;"/>
      </flexbox>
      <div class="main-info">发件人：&nbsp;&nbsp;{{ detailData.sender }}</div>
      <div class="main-info">收件人：&nbsp;&nbsp;{{ detailData.receiptName }}</div>
      <div class="main-info">时&nbsp;&nbsp;&nbsp;间：&nbsp;&nbsp;{{ fifterTime(detailData.createTime) }}</div>
      <div class="main-info">
        附&nbsp;&nbsp;&nbsp;件: &nbsp;&nbsp;<span style="font-weight: bolder;">{{ fileCount }} 个</span>&nbsp;
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
import moment from 'moment'
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
      moveList: [
        { label: '收件箱', value: 0 },
        { label: '已发送', value: 1 }
      ],
      detailTypeConfig: {
        receive: 'INBOX',
        sent: 'Sent Messages'
      }
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
      const template = new Date(time).getTime()
      return moment(template).format('YYYY年MM月DD日 HH:MM')
    }

  }
}
</script>

<style lang="scss" scoped>
.detail-head {
  background-color: #F5F5F5;
  align-items: flex-start;
  height: 160px;
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
  }
  .button_group {
    padding: 10px 15px;
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

