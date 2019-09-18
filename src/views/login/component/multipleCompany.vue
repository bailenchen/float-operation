<template>
  <div class="multiple-company">
    <ul class="list">
      <li v-for="(item, index) in list"
          :key="index"
          :class="{active: selectedIndex === index}"
          class="list-item"
          @click="selectedIndex = index">
        <!--<img src="~@/assets/login/m_company.png" alt="" class="icon">-->
        <span class="icon wk wk-home" />
        <span class="text">
          {{ item.companyName }}
        </span>
        <img v-if="selectedIndex === index"
             src="~@/assets/login/m_checked.png"
             alt=""
             class="icon-checked">
      </li>
    </ul>

    <div class="control">
      <div class="btn"
           @click="handlerSelect">
        进 入 企 业
      </div>
    </div>

    <div class="active-btn"
         @click="$emit('toggle', 'LoginByPwd')">
      返回上一步
    </div>
  </div>
</template>

<script>
import { ChooseLoginAPI } from '@/api/login'

export default {
  name: 'MultipleCompany',
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      redirect: undefined,
      selectedIndex: 0
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    handlerSelect() {
      let item = this.list[this.selectedIndex]
      ChooseLoginAPI({
        companyId: item.companyId
      })
        .then(res => {
          this.$store.commit('SET_AUTH', res)
          this.$router.push({ path: this.redirect || '/' })
          // if (res) this.$router.push('/')
          alert('choose login')
        })
        .catch()
    }
  }
}
</script>

<style scoped lang="scss">
@import '../index';

.control {
  margin-top: 50px;
}
</style>
