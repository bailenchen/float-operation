<!--
 * @Author: your name
 * @Date: 2020-08-20 10:07:15
 * @LastEditTime: 2020-08-27 16:38:44
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \dz-72crm-qiwen\src\views\customermanagement\studentManage\index.vue
-->
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
      console.log(params, 'mk')
      return params.type === 'capitalAccount' ? 'AccountIndex' : 'StudentIndex'
    }
  },
  beforeRouteEnter(to, from, next) {
    if (!to.params || !['customer', 'capitalAccount'].includes(to.params.type)) {
      next({
        name: 'StudentManageIndex',
        params: {
          type: 'customer'
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
