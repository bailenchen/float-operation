<template>
  <div class="detail-head">
    <el-button type="primary" icon="el-icon-chat-dot-round" @click="reply">回复</el-button>
    <el-button type="success" icon="el-icon-share" @click="share">转发</el-button>
    <el-button type="danger" icon="el-icon-delete" @click="delItemEmail">删除</el-button>
    <el-select v-model="value" placeholder="请选择" @change="changeval">
      <el-option
        v-for="item in moveList"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>
  </div>
</template>

<script>

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
    }
  },
  data() {
    return {
      value: '',
      moveList: [
        { label: '移动到收件箱', value: 0 },
        { label: '移动到已发送', value: 1 }
      ],
      detailTypeConfig: {
        receive: 'INBOX',
        sent: 'Sent Messages'
      }
    }
  },
  mounted() {
    // if () {}
    console.log(this.detailData, 'jjk', this.emailType)
  },
  methods: {
    /**
     * 回复
     */
    reply() {
      this.$router.push({
        path: '/email/index/writeLetter',
        query: {
          reply: true,
          ...this.detailData
        }
      })
      console.log('huifu')
    },

    /**
     * 转发
     */
    share() {
      this.$router.push({
        path: '/email/index/writeLetter',
        query: {
          share: true,
          ...this.detailData
        }
      })
      console.log('zhuangfa')
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
      console.log(val, 'jj')
    }

  }
}
</script>

<style lang="scss" scoped>
.el-select {
  width: 80px;
  margin-left: 10px;
}
</style>

