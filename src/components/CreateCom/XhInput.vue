<template>
  <el-input
    v-wk-number="inputLimitType"
    v-if="type == 'number'"
    v-model="dataValue"
    :type="type"
    :disabled="disabled"
    :maxlength="100"
    @input="valueChange"/>
  <el-input
    v-else
    v-model="dataValue"
    :type="type"
    :disabled="disabled"
    :maxlength="100"
    :placeholder="placeholder"
    @input="valueChange"/>
</template>
<script type="text/javascript">
import stringMixin from './stringMixin'

export default {
  name: 'XhInput', // 新建 input
  components: {},
  mixins: [stringMixin],
  props: {},
  data() {
    return {}
  },
  computed: {
    type() {
      if (this.item && this.item.data && this.item.data.formType == 'password') {
        return this.item.data.formType
      } else if (this.item && this.item.data && (this.item.data.formType == 'floatnumber' || this.item.data.formType == 'number')) {
        return 'number'
      } else {
        return 'text'
      }
    },

    inputLimitType() {
      if (this.item && this.item.data && this.item.data.formType == 'number') {
        return 'number'
      }

      return null
    },

    isAutoNumber() {
      if (this.item && this.item.data && this.item.data.autoGeneNumber) {
        return this.item.data.autoGeneNumber == 1
      }
      return false
    },

    placeholder() {
      return this.isAutoNumber ? '根据编号规则自动生成，支持手动输入' : ''
    }
  },
  watch: {},
  mounted() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
</style>
