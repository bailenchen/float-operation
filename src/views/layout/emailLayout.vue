<template>
  <el-container>
    <el-header class="nav-container">
      <navbar
        nav-index="/email/set"
        @nav-items-click="navClick"/>
    </el-header>
    <el-container>
      <sidebar
        v-if="showMenu"
        :items="emailRouters"
        class="sidebar-container" />

      <el-main
        id="workLog-main-container"
        style="padding:0;">
        <app-main/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
// import { mapGetters } from 'vuex'
import emailRouter from '@/router/modules/email'

export default {
  name: 'Layout',

  components: {
    Navbar,
    Sidebar,
    AppMain
  },

  data() {
    return {
      emailRouters: emailRouter
    }
  },

  computed: {
    // 设置页面不展示左侧菜单
    showMenu() {
      const path = this.$route.path
      return path != '/email/set'
    }
  },

  created() {
  },

  methods: {
    navClick(index) {}
  }
}
</script>

<style lang="scss" scoped>
  .el-container {
    min-height: 0;
    height: 100%;
  }

  .nav-container {
    padding: 0;
    box-shadow: 0px 1px 2px #dbdbdb;
    z-index: 100;
    min-width: 1200px;
  }
</style>
