<template>
  <keep-alive>
    <component :is="componentName" />
  </keep-alive>
</template>

<script>
/**
 * Create by yxk at 2020/7/27 0027
 */
import StudentIndex from './student/index'
import AccountIndex from './account/index'

export default {
  name: 'StudentManageIndex',
  components: {
    StudentIndex,
    AccountIndex
  },
  data() {
    return {
    }
  },
  computed: {
    componentName() {
      const params = this.$route.params
      return params.type === 'account' ? 'AccountIndex' : 'StudentIndex'
    }
  },
  beforeRouteEnter(to, from, next) {
    if (!to.params || !['student', 'account'].includes(to.params.type)) {
      next({
        name: 'StudentManageIndex',
        params: {
          type: 'student'
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
