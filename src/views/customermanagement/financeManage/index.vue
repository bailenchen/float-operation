<template>
  <keep-alive>
    <component :is="componentName" />
  </keep-alive>
</template>

<script>
/**
 * Create by yxk at 2020/7/27 0027
 */
import PayeeIndex from './payee/index'
import RefundIndex from './refund/index'

export default {
  name: 'FinanceManageIndex',
  components: {
    PayeeIndex,
    RefundIndex
  },
  data() {
    return {
    }
  },
  computed: {
    componentName() {
      const params = this.$route.params
      return params.type === 'payee' ? 'PayeeIndex' : 'RefundIndex'
    }
  },
  beforeRouteEnter(to, from, next) {
    if (!to.params || !['payee', 'refund'].includes(to.params.type)) {
      next({
        name: 'FinanceManageIndex',
        params: {
          type: 'payee'
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
