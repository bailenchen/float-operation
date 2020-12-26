<template>
  <div>
    <el-select v-model="value" placeholder="请选择" style="width: 100%;" @change="handleChange">
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
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      options: [],
      value: ''
    }
  },
  created() {
    const params = {
      // dictionaryField: 'refund_way_id'
      dictionaryField: this.dictionaryField
    }
    queryDictionaryField(params).then(res => {
      console.log('res', res)
      this.options = res.data
    }).catch(() => {})
  },
  methods: {
    handleChange(value) {
      this.value = value
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
