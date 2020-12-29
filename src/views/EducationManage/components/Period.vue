<template>
  <div class="">
    <el-time-select
      v-model="startTime"
      :picker-options="{
        start: '08:00',
        step: '00:60',
        end: '19:00'
      }"
      placeholder="起始时间"
      @change="changeTime"/>
    <el-time-select
      v-model="endTime"
      :picker-options="{
        start: '08:00',
        step: '00:60',
        end: maxEndTime,
        minTime: startTime,
      }"
      placeholder="结束时间"
      @change="overTime"/>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    value: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      // 时间段
      startTime: '08:00',
      endTime: '10:00'
    }
  },
  computed: {
    maxEndTime() {
      const maxt = parseInt(this.startTime) + 2
      const maxv = String(maxt).length == 2 ? `${maxt}:00` : `0${maxt}:00`
      return maxv
    }
  },
  created() {
    const { startTime, endTime } = this.value
    this.startTime = startTime
    this.endTime = endTime
  },
  methods: {
    changeTime() {
      this.endTime = ''
      this.$emit('update-time', { startTime: this.startTime, endTime: this.endTime })
    },
    overTime() {
      this.$emit('update-time', { startTime: this.startTime, endTime: this.endTime })
    }
  }
}
</script>
<style lang='scss' scoped>

</style>
