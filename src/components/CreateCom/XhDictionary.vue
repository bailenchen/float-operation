<template>
  <div>
    <el-select v-model="dataValue" :multiple="multiple" placeholder="请选择" style="width: 100%;" @change="handleChange">
      <el-option
        v-for="(item,index) in options"
        :key="index"
        :label="item.dictionaryName"
        :value="item.dictionaryId"
      />
    </el-select>
  </div>
</template>

<script>
import { queryDictionaryField } from '@/api/common'
export default {
  name: 'XhDictionary',
  props: {
    /** 索引值 用于更新数据 */
    index: Number,
    /** 包含数据源 */
    item: Object,
    dictionaryField: String,
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number, Array],
      default: ''
    }
  },
  data() {
    return {
      options: [],
      dataValue: ''
    }
  },
  watch: {
    value: {
      handler(val) {
        this.dataValue = val
      },
      immediate: true
    }
  },
  created() {
    if (this.multiple && !this.value) {
      this.dataValue = [] // 把v-model绑定的值改为数组
      // if (this.value) this.dataValue = this.value
    }

    const params = {
      dictionaryField: this.dictionaryField
    }
    queryDictionaryField(params).then(res => {
      this.options = res.data
    }).catch(() => {})
  },
  methods: {
    handleChange(value) {
      // this.value = value
      this.$emit('value-change', {
        index: this.index,
        value
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
