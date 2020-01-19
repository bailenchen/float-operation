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
    <div class="new-email">
      <create-email class="left"/>
      <high-filter class="right"/>
    </div>
  </div>
</template>

<script>
import createEmail from './components/CreateEmail'
import HighFilter from './components/HighFilter'

export default {
  name: 'CreateEmail',
  components: {
    createEmail,
    HighFilter
  },
  data() {
    return {
    }
  }
}
</script>

<style lang="scss" scoped>
.new {
  height: calc(100% - 60px);
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
  height: 100%;
  min-width: 1200px;
  padding: 0 0 0 28px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  background: #fff;
  .left {
    width: 80%
  }
  .right {
    width: 20%;
    height: 100%;
    border-left: 1px solid #F0F0F0;
  }
}

.no-border {
  border: 0;
}
</style>


