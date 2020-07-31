<template>
  <el-cascader
    ref="elCascader"
    :options="options"
    :show-all-levels="false"
    :props="defaultProps"
    v-model="dataValue"
    :disabled="disabled"
    style="width: 100%;"
    change-on-select
    @change="valueChange"/>
</template>
<script type="text/javascript">
import arrayMixin from './arrayMixin'
import { QueryChannelCategory } from '@/api/systemManagement/params'

export default {
  name: 'XhChannelCategory', // 渠道
  components: {},
  mixins: [arrayMixin],
  props: {},
  data() {
    return {
      options: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      }
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getProductCategoryIndex()
  },
  methods: {
    /** 获取分类数据 */
    getProductCategoryIndex() {
      QueryChannelCategory({
        type: '1'
      })
        .then(res => {
          this.options = res.data
          this.getVal()
        })
        .catch(() => {})
    },

    getVal() {
      if (this.dataValue.length === 0) return
      const id = this.dataValue[this.dataValue.length - 1]
      let res = []
      function getCode(list, arr = []) {
        list.forEach(item => {
          if (item.id === id) {
            res = [...arr, item.id]
          } else if (item.hasOwnProperty('children') && item.children.length > 0) {
            const arr0 = getCode(item.children, [...arr, item.id])
            if (arr0.length === arr.length) {
              res.push(item.id)
            }
          }
        })
        return arr
      }
      getCode(this.options)
      this.dataValue = res
    },

    valueChange(val) {
      console.log('value-change', val)
      this.$emit('value-change', {
        index: this.index,
        item: this.item,
        value: val,
        valueContent: this.$refs.elCascader.getCheckedNodes()[0].label // 参考 https://segmentfault.com/q/1010000013063478
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
