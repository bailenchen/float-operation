<template>
  <!-- 新建邮件 -->
  <div
    class="new" >
    <div class="top-title">
      <img class="new-icon" src="../../assets/img/email/writeLetter.png" alt="">
      <div class="new-txt">
        新建邮件
      </div>
    </div>
    <flexbox class="new-email">
      <create-email ref="createEmail" :handle-list="handleList" class="left"/>
      <high-filter class="right" @handle="handleHigh"/>
    </flexbox>
  </div>
</template>

<script>
import createEmail from './components/CreateEmail'
import HighFilter from './components/HighFilter'
import { mapGetters } from 'vuex'
export default {
  name: 'CreateEmail',
  components: {
    createEmail,
    HighFilter
  },
  data() {
    return {
      handleList: []
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  beforeRouteLeave(to, form, next) {
    // 有收件人或者分别发送人或者分别发送人才有提示
    if (this.$refs.createEmail.receiverLists.length || this.$refs.createEmail.deffientList.length) {
      this.$confirm('内容已被修改, 是否要将此邮件存为草稿?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$refs.createEmail.saveDraft('savebtn')
        localStorage.removeItem('crm-emailContent')
        next()
      }).catch(() => {
        localStorage.removeItem('crm-emailContent')
        next()
      })
    } else {
      localStorage.removeItem('crm-emailContent')
      next()
    }
  },
  methods: {
    /**
   * 勾选右侧的人员
   */
    handleHigh(data) {
      this.handleList = data
    }
  }

}
</script>

<style lang="scss" scoped>
.new {
  height: calc(100% - 60px);
  width: 100%;
}
.top-title {
  line-height: 60px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .new-icon {
    width: 30px;
    height: 30px;
    margin-left: 28px;
    margin-right: 10px;
  }
  .new-txt {
    font-size: 16px;
    font-weight: 600;
  }
}
.new-email {
  width: 100%;
  height: 100%;
  padding: 0 0 0 20px;
  background: #fafafa;
  .right {
    flex-shrink: 0;
    width: 240px;
    height: 100%;
  }
}

.no-border {
  border: 0;
}
</style>


