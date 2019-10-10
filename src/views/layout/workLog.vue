<template>
  <el-container>
    <el-header class="nav-container">
      <navbar
        nav-index="/workLog"
        @nav-items-click="navClick"/>
    </el-header>
    <el-container>
      <el-aside
        width="auto"
        class="aside-container">
        <sidebar
          :items="sidebarItems"
          create-button-title=""
          main-router="workLog">
          <div
            slot="add"
            class="quick-add">
            <div class="quick-add-content">
              <p
                v-for="(item, index) in list"
                :key="index"
                @click="addSkip(item)">
                <i
                  :class="'wk-' + item.icon"
                  class="wk" />
                <span>{{ item.label }}</span>
              </p>
            </div>
          </div>
        </sidebar>
      </el-aside>
      <el-main
        id="workLog-main-container"
        style="padding:15px;">
        <app-main/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components'
import WorkLogRouter from '@/router/modules/workLog'

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
    sidebarItems() {
      return WorkLogRouter.children
    }
  },

  created() {
    this.getOAMessagNum()
  },

  methods: {
    navClick(index) {},

    // 新增跳转
    addSkip(val) {
      // switch (val.label) {
      //   case '日志':
      //     this.$router.push({ path: 'journal', query: { routerKey: 1 }})
      //     break
      //   case '审批':
      //     this.showCategorySelect = true
      //     break
      //   case '任务':
      //     this.$router.push({ path: 'task', query: { routerKey: 1 }})
      //     break
      //   case '日程':
      //     this.$router.push({ path: 'schedule-new', query: { routerKey: 1 }})
      //     break
      //   case '公告':
      //     this.$router.push({ path: 'notice-new', query: { routerKey: 1 }})
      //     break
      // }
    },

    // 审批类型选择
    selcetExamineCategory(item) {
      this.createInfo = item
      this.isCreate = true
    },

    /**
       * 获取消息数
       */
    getOAMessagNum() {
      this.$store
        .dispatch('GetOAMessageNum')
        .then(res => {})
        .catch(() => {})
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
