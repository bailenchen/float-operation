<template>
  <div class="time" style="display: flex" >
    <div v-if="showTime" class="time" style="display: flex">
      <div v-if="!showRing" style="display: flex" class="time_piece">
        <p class="time_piece--p1">通话中 :</p>
        <p class="time_piece--p2">{{ callinTime }}</p>
      </div>
      <div v-else-if="showRing" style="display: flex" class="time_piece1">
        <p class="time_piece--p1">振铃中 :</p>
        <p class="time_piece--p2">{{ callinTime }}</p>
      </div>
      <el-button v-if="isHandle" type="danger" style="padding: 5px 15px" class="handle" @click="handUp">挂断</el-button>
    </div>
    <el-tag v-else type="danger" effect="dark" class="e-tab">空闲中</el-tag>
  </div>
</template>

<script>
import callCenter from './callWebSokets'
export default {
  name: 'TimePiece',
  props: {
    isHandle: {
      type: Boolean,
      default: true
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
