<template>
  <div class="main">
    <el-input
      v-model="minDiscount"
      :maxlength="100"
      style="width:26%;"
      type="number"
      @input="valueChange"/>
    <span>-</span>
    <el-input
      v-model="maxDiscount"
      :maxlength="100"
      style="width:26%;"
      type="number"
      @input="valueChange"/>
  </div>
</template>
<script type="text/javascript">

export default {
  name: 'XhDiscount', // 折扣
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
      minDiscount: '',
      maxDiscount: ''
    }
  },
  computed: {

  },
  watch: {
    value: {
      handler(val) {
        this.minDiscount = val.minDiscount || ''
        this.maxDiscount = val.maxDiscount || ''
      },
      immediate: true
    }
  },

  mounted() {
    /** 如果有值以传入值为主 如果无值 已默认值为主 */
    this.minDiscount = this.value.minDiscount || ''
    this.maxDiscount = this.value.maxDiscount || ''
  },
  methods: {
    // 输入的值
    valueChange(val) {
      this.$emit('value-change', {
        index: this.index,
        value: { minDiscount: this.minDiscount, maxDiscount: this.maxDiscount }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
