<template>
  <keep-alive>
    <component :is="componentName" />
  </keep-alive>
</template>

<script>
/**
 * Create by yxk at 2020/7/27 0027
 */
import ReceiveIndex from './receive/index'
import RefundIndex from './refund/index'

export default {
  name: 'FinanceManageIndex',
  components: {
    ReceiveIndex,
    RefundIndex
  },
  data() {
    return {
    }
  },
  computed: {
    componentName() {
      /* const params = this.$route.params
      return params.type === 'receive' ? 'ReceiveIndex' : 'RefundIndex' */
      return ReceiveIndex
    }
  },
  beforeRouteEnter(to, from, next) {
    if (!to.params || !['receive', 'refund'].includes(to.params.type)) {
      next({
        name: 'FinanceManageIndex',
        params: {
          type: 'receive'
        },
        replace: true
      })
    } else {
      next()
    }
  }
}
</script>

<style scoped lang="scss">

</style>
