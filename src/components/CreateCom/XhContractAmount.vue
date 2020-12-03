<template>
  <div class="main">
    <el-input
      v-model="minPay"
      :maxlength="100"
      style="width:26%;"
      type="number"
      @input="valueChange"/>
    <span>-</span>
    <el-input
      v-model="maxPay"
      :maxlength="100"
      style="width:26%;"
      type="number"
      @input="valueChange"/>
  </div>
</template>
<script type="text/javascript">

export default {
  name: 'XhContractAmount', // 合同支付金额
  components: {},
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      }
    },
    /** 索引值 用于更新数据 */
    index: Number,
    /** 包含数据源 */
    item: Object,
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      minPay: '',
      maxPay: ''
    }
  },
  computed: {

  },
  watch: {
    value: {
      handler(val) {
        this.minPay = val.minPay || ''
        this.maxPay = val.maxPay || ''
      },
      immediate: true
    }
  },

  mounted() {
    /** 如果有值以传入值为主 如果无值 已默认值为主 */
    this.minPay = this.value.minPay || ''
    this.maxPay = this.value.maxPay || ''
  },
  methods: {
    // 输入的值
    valueChange(val) {
      this.$emit('value-change', {
        index: this.index,
        value: { minPay: this.minPay, maxPay: this.maxPay }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
