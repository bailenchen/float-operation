<template>
  <el-container>
    <el-header class="nav-container">
      <manager-navbar></manager-navbar>
    </el-header>
    <el-container>
      <el-aside width="auto"
                class="aside-container">
        <sidebar :items="routerItems"
                 createButtonTitle=""
                 mainRouter="manager"></sidebar>
      </el-aside>
      <el-main id="manager-main-container">
        <app-main></app-main>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { ManagerNavbar, Sidebar, AppMain } from './components'
import { managerRouterMenu } from '@/router/modules/manager'
import { adminRroupsTypeListAPI } from '@/api/systemManagement/RoleAuthorization'

export default {
  name: 'Layout',
  components: {
    ManagerNavbar,
    Sidebar,
    AppMain
  },
  computed: {
    ...mapGetters(['admin'])
  },
  data() {
    return {
      routerItems: []
    }
  },

  mounted() {
    for (let index = 0; index < managerRouterMenu.length; index++) {
      const menuItem = managerRouterMenu[index]
      menuItem.hidden = this.admin[menuItem.meta.subType] ? false : true
    }
    this.routerItems = managerRouterMenu
    this.getAuthMenu()
  },

  methods: {
    navClick(index) {},

    getAuthMenu() {
      adminRroupsTypeListAPI()
        .then(res => {
          for (let index = 0; index < this.routerItems.length; index++) {
            const menuItem = this.routerItems[index]
            if (menuItem.meta.icon == 'contacts' && !menuItem.hidden) {
              menuItem.children = res.data.map(item => {
                return {
                  name: 'role-auth',
                  path: `role-auth/${item.pid}/${encodeURI(
                    item.name
                  )}`,
                  meta: {
                    title: item.name
                  }
                }
              })
            }
          }
        })
        .catch(err => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.aside-container {
  position: relative;
  background-color: #2d3037;
  box-sizing: border-box;
  border-right: solid 1px #e6e6e6;
}

.nav-container {
  padding: 0;
  box-shadow: 0px 1px 2px #dbdbdb;
  z-index: 100;
  min-width: 1200px;
}

#manager-main-container {
  max-height: 100%;
}

.el-container {
  overflow: hidden;
}
</style>
