<template>
  <el-container>
    <el-header class="nav-container">
      <navbar
        nav-index="/addressBook"
        @nav-items-click="navClick"/>
    </el-header>
    <el-container>
      <sidebar
        :items="addressBookRouters"
        class="sidebar-container" />

      <el-main
        id="addressBook-main-container"
        style="padding: 0;">
        <app-main/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { Navbar, AppMain, Sidebar } from './components'
import { mapGetters } from 'vuex'

export default {
  name: 'Layout',

  components: {
    Navbar,
    Sidebar,
    AppMain
  },

  data() {
    return {
      addDialog: false,
      list: [
        // {
        //   label: '日志',
        //   icon: 'log',
        //   img: require('@/assets/img/add_journal.png')
        // }
      ],
      // 新建
      showCategorySelect: false,
      isCreate: false, // 是创建
      createInfo: {} // 创建所需要的id 标题名信息
    }
  },

  computed: {
    ...mapGetters(['addressBookRouters'])
  },

  methods: {
    navClick(index) {},

    // 新增跳转
    addSkip(val) {
      // switch (val.label) {
      //   case '日志':
      //     this.$router.push({ path: 'journal', query: { routerKey: 1 }})
      //     break
    }
  }
}
</script>

<style lang="scss" scoped>
  @import './styles/common.scss';
  .el-container {
    min-height: 0;
  }
  .aside-container {
    position: relative;
    background-color: #2d3037;
    box-sizing: border-box;
    overflow: visible;
  }

  .nav-container {
    padding: 0;
    box-shadow: 0px 1px 2px #dbdbdb;
    z-index: 100;
    min-width: 1200px;
  }
  .quick-add {
    height: 178px;
  }
</style>
