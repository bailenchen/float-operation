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
    }
  },
  watch: {},
  mounted() {},
  methods: {}
}
</script>
<style lang="scss" scoped>
</style>
