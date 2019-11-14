<template>
  <div class="time" style="display: flex" >
    <div v-if="showTime" class="time" style="display: flex">
      <div v-if="!showRing" style="display: flex" class="timePiece">
        <p class="timePieceP1">通话中 :</p>
        <p class="timePieceP2">{{ callinTime }}</p>
      </div>
      <div v-else-if="showRing" style="display: flex" class="timePiece1">
        <p class="timePieceP1">振铃中 :</p>
        <p class="timePieceP2">{{ callinTime }}</p>
      </div>
      <el-button v-if="isHandle" type="danger" style="padding: 5px 15px" class="handle" @click="handUp">挂断</el-button>
    </div>
    <el-tag v-else type="danger" effect="dark" class="e-tab">已挂断</el-tag>
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
      timepiece: {}
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
      this.startTimePiece(val)
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
  .timer{
    width: 200px;
    margin-left: 10px;
    font-size: 13px;
  }
  .timePiece{
    width: 115px;
    padding: 5px;
    margin: 0 7px;
    background-color: #3e84e9;
    border-radius: 3px;
    color: white;
    .timePieceP1{
      width: 60px;
      line-height: 16px;
    }
    .timePieceP2{
      line-height: 16px;
    }
  }
  .timePiece1{
    width: 115px;
    padding: 5px;
    margin: 0 7px;
    background-color: #E6A23C;
    border-radius: 3px;
    color: white;
    .timePieceP1{
      width: 60px;
      line-height: 16px;
    }
    .timePieceP2{
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
