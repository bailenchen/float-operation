<!--
 * @Author: your name
 * @Date: 2020-08-20 14:24:07
 * @LastEditTime: 2020-08-21 16:53:12
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dz-72crm-qiwen\src\components\CreateCom\XhTerm.vue
-->
<template>
  <el-date-picker
    v-model="dataValue"
    :disabled="disabled"
    value-format="yyyy-MM-dd HH:mm:ss"
    type="datetimerange"
    style="width:100%"
    range-separator="-"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    @change="valueChange"/>
</template>

<script type="text/javascript">
import arrayMixin from './arrayMixin'
import { getDateFromTimestamp } from '@/utils'
import moment from 'moment'

export default {
  name: 'XhTerm',
  components: {},
  mixins: [arrayMixin],
  mounted() {
    if (this.value && this.value.toString().length == 10) {
      // 编辑的时候 值是时间戳
      this.dataValue = moment(getDateFromTimestamp(this.value)).format(
        'YYYY-MM-DD HH:mm:ss'
      )
    }
  },
  methods: {}
}
</script>
<style lang='scss' scoped>

</style>
