<template>
  <div class="time" style="display: flex" >
    <div v-if="showTime" class="time" style="display: flex">
      <!-- <div v-if="!showTime" class="time" style="display: flex"> -->
      <div v-if="!showRing" style="display: flex" class="time_piece">
        <p class="time_piece--p1">通话中 :</p>
        <p class="time_piece--p2">{{ callinTime }}</p>
      </div>
      <div v-else-if="showRing" style="display: flex" class="time_piece1">
        <p class="time_piece--p1">振铃中 :</p>
        <p class="time_piece--p2">{{ callinTime }}</p>
      </div>
      <el-button v-if="!showRing && isRefer" type="warning" style="padding: 5px 15px" class="handle" @click="refer">转接</el-button>
      <el-button v-if="isHandle" type="danger" style="padding: 5px 15px" class="handle" @click="handUp">挂断</el-button>
    </div>
    <el-tag v-if=" !showTime &&!showBusy" type="warning" effect="dark" class="e-tab" @click="Busy(1)">开启置忙</el-tag>
    <el-tag v-if="!showTime && showBusy" type="warning" effect="dark" class="e-tab" @click="Busy(2)">关闭置忙</el-tag>
    <el-tag v-if=" !showTime && showBusy" type="danger" effect="dark" class="e-tab">置忙</el-tag>
    <el-tag v-if="!showTime && !showBusy" type="danger" effect="dark" class="e-tab">空闲中</el-tag>
  </div>
</template>

<script>
import callCenter from './callWebSokets'
export default {
  name: 'TimePiece',
  props: {
    isHandle: {
      type: Boolean,
      default: false
    },
    isRefer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      phones: '',
      webSocketData: {},
      timer: null,
      timePiece: {}
    }
  },
  computed: {
    // 接通再计时
    callinTime() {
      return this.$store.state.customer.callinTime
    },
    // 展示振铃
    showRing() {
      return this.$store.state.customer.showRing
    },
    // 展示通话
    showTime() {
      return this.$store.state.customer.showTimer
    },
    // 置忙
    showBusy() {
      return this.$store.state.customer.showBusy
    }
  },
  watch: {
    phone(val) {
    },
    timerStatus(val) {
      this.starttimePiece(val)
    }
  },
  mounted() {
  },
  methods: {
    // 置忙
    Busy(i) {
      if (i == 1) { // 开启置忙
        callCenter.setPhoneStatus('pause')
        this.$store.commit('SHOW_BUSY', true)
      } else { // 关闭置忙
        callCenter.setPhoneStatus('work')
        this.$store.commit('SHOW_BUSY', false)
      }
    },
    /**
     * 转接
     */
    refer() {
      this.$bus.emit('showRefer', true)
    },
    /**
       * 挂断
       */
    handUp() {
      callCenter.OnHungUp()
      // callCenter.clearWebSoketsInterval()
    }
  }
}
</script>

<style lang="scss" scoped>
  .time{
    width: 200px;
    height: 30px;
    font-size: 13px;
  }
  .time_piece{
    width: 120px;
    padding: 5px;
    margin: 0 7px;
    background-color: #3e84e9;
    border-radius: 3px;
    color: white;
    .time_piece--p1{
      width: 60px;
      line-height: 16px;
    }
    .time_piece--p2{
      line-height: 16px;
    }
  }
  .time_piece1{
    width: 120px;
    padding: 5px;
    margin: 0 7px;
    background-color: #E6A23C;
    border-radius: 3px;
    color: white;
    .time_piece--p1{
      width: 60px;
      line-height: 16px;
    }
    .time_piece--p2{
      line-height: 16px;
    }
  }
  .handle {
      margin-right: 10px;
  }
  .e-tab {
      width: 108px;
      margin-left: 10px;
  }
</style>
