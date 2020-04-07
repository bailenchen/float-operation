<template>
  <div class="navbar">
    <img
      v-src="logo"
      :key="logo"
      class="logo"
      @click="enterCustoemBoard" >
    <div class="nav-items-container">
      <el-menu
        :default-active="navActiveIndex"
        mode="horizontal"
        active-text-color="#2362FB"
        router
        @select="navItemsClick">
        <el-menu-item
          v-for="(item, index) in showItems"
          :key="index"
          :index="item.path">
          <i :style="{ fontSize: item.fontSize }" :class="item.icon" />
          <span>{{ item.title }}</span>
        </el-menu-item>
        <el-submenu
          v-if="hiddenItems.length"
          popper-class="el-submenu-more"
          index="other">
          <template slot="title">
            <i class="wk wk-grid" />
          </template>
          <el-menu-item
            v-for="(mItem, mIndex) in hiddenItems"
            :key="mIndex"
            :index="`${mItem.path}`"
          >
            <i :style="{ fontSize: mItem.fontSize }" :class="mItem.icon" />
            <span>{{ mItem.title }}</span>
          </el-menu-item>
        </el-submenu>
      </el-menu>
    </div>

    <el-badge
      :value="unreadNums.allCount"
      :hidden="!unreadNums.allCount || unreadNums.allCount == 0"
      :max="99">
      <i
        class="wk wk-bell"
        @click="sysMessageShow = true"/>
    </el-badge>

    <system-message
      :visible.sync="sysMessageShow"
      :unread-nums="unreadNums"
      @update-count="sendSystemUnreadNum"/>

    <el-dropdown
      trigger="click"
      @command="moreMenuClick">
      <div
        class="user-container">
        <template v-if="userInfo && Object.keys(userInfo).length > 0">
          <xr-avatar
            :name="userInfo.realname"
            :size="32"
            :src="userInfo.img"
            class="user-img" />
        </template>
        <i class="el-icon-caret-bottom mark"/>
      </div>
      <el-dropdown-menu
        slot="dropdown"
        class="el-dropdown-unarrow" >
        <el-dropdown-item
          v-for="(item, index) in moreMenu"
          :key="index"
          :command="item.command"
          :divided="item.divided"
          :icon="item.icon"
          :disabled="item.disabled"
        >{{ item.label }}</el-dropdown-item>
        <div
          v-if="manage"
          class="handel-box">
          <el-button
            type="primary"
            class="handel-button"
            @click="enterSystemSet()">企业管理后台</el-button>
        </div>
      </el-dropdown-menu>
    </el-dropdown>

    <download-dialog :visible.sync="downloadVisible" />
  </div>
</template>

<script>
// import { adminGroupsTypeListAPI } from '@/api/systemManagement/RoleAuthorization'
import { systemMessageUnreadCountAPI } from '@/api/common'

import SystemMessage from './SystemMessage'
import DownloadDialog from '@/components/download-dialog'

import { mapGetters } from 'vuex'
import { Loading } from 'element-ui'

export default {
  filters: {
    langName: function(value) {
      if (value) {
        return { cn: '中文', en: 'English' }[value]
      } else {
        return '中文'
      }
    }
  },
  components: {
    SystemMessage,
    DownloadDialog
  },
  props: {
    navIndex: {
      type: [Number, String],
      default: 0
      // authRedirect: ''
    }
  },
  data() {
    return {
      unreadNums: {
        allCount: 0,
        announceCount: 0,
        crmCount: 0,
        examineCount: 0,
        eventCount: 0,
        logCount: 0,
        taskCount: 0
      },
      sysMessageShow: false,
      intervalId: null,
      type: 0,
      moreMenu: [{
        command: 'baseInfo',
        divided: false,
        label: '基本信息',
        icon: 'wk wk-user'
      }, {
        command: 'userPerson',
        divided: false,
        label: '用户中心',
        icon: 'wk wk-s-seas'
      }, {
        command: 'download',
        divided: true,
        label: '客户端下载',
        icon: 'wk wk-data-import'
      }, {
        command: 'upgradeLog',
        divided: false,
        label: '升级日志',
        icon: 'wk wk-airplane'
      }, {
        command: 'help',
        divided: true,
        label: '帮助中心',
        icon: 'wk wk-help'
      }, {
        command: 'logOut',
        divided: false,
        label: '退出登录',
        icon: 'wk wk-logout'
      }, {
        command: 'version',
        divided: false,
        label: `版本 ${WKConfig.version}`,
        icon: 'wk wk-version',
        disabled: true
      }],
      downloadVisible: false,
      showItems: [],
      hiddenItems: []
    }
  },
  computed: {
    ...mapGetters([
      'userInfo',
      'lang',
      'logo',
      'crm',
      'bi',
      'manage',
      'oa',
      'project',
      'email',
      'navActiveIndex',
      'biRouters'
    ]),
    items() {
      var tempsItems = []
      // if (this.oa) {
      //   tempsItems.push({
      //     title: '办公',
      //     type: 0,
      //     path: '/workbench',
      //     icon: 'workbench'
      //   })
      // }

      if (this.crm) {
        tempsItems.push({
          title: '客户管理',
          type: 1,
          path: '/crm',
          icon: 'wk wk-customer',
          fontSize: '17px'
        })
      }

      if (this.oa && this.oa.taskExamine) {
        tempsItems.push({
          title: '任务/审批',
          type: 4,
          path: '/taskExamine',
          icon: 'wk wk-office',
          fontSize: '16px'
        })
      }

      if (this.oa && this.oa.log) {
        tempsItems.push({
          title: '日志',
          type: 3,
          path: '/workLog',
          icon: 'wk wk-log',
          fontSize: '17px'
        })
      }

      if (this.oa && this.oa.book) {
        tempsItems.push({
          title: '通讯录',
          type: 6,
          path: '/addressBook',
          icon: 'wk wk-address-book',
          fontSize: '17px'
        })
      }

      if (this.project) {
        tempsItems.push({
          title: '项目管理',
          type: 2,
          path: '/project',
          icon: 'wk wk-project',
          fontSize: '15px'
        })
      }

      if (this.bi) {
        tempsItems.push({
          title: '商业智能',
          type: 5,
          path: '/bi',
          icon: 'wk wk-business-intelligence',
          fontSize: '18px'
        })
      }

      if (this.email) {
        tempsItems.push({
          title: '邮箱',
          type: 7,
          path: this.userInfo && this.userInfo.emailId ? '/email/index/receive' : '/email/set',
          icon: 'wk wk-inbox',
          fontSize: '17px'
        })
      }
      if (this.oa && this.oa.calendar) {
        tempsItems.push({
          title: '日历',
          type: 8,
          path: '/calendar/index',
          icon: 'wk wk-calendar',
          fontSize: '20px'
        })
      }
      return tempsItems
    }
  },
  mounted() {
    if (this.navIndex && this.navIndex !== this.navActiveIndex) {
      this.$store.commit('SET_NAVACTIVEINDEX', this.navIndex)
    }

    window.onresize = () => {
      this.changeMenu(document.documentElement.clientWidth)
    }

    this.changeMenu(document.documentElement.clientWidth)

    // 消息数
    this.getSystemUnreadNum('visible')

    this.$bus.on('document-visibility', (state) => {
      this.getSystemUnreadNum(state)
    })
  },
  beforeDestroy() {
    this.$bus.off('document-visibility')
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  },
  methods: {
    changeMenu(clintWidth) {
      const showItems = []
      const hiddenItems = []
      for (let index = 0; index < this.items.length; index++) {
        const element = this.items[index]
        if (clintWidth - 450 - (index + 1) * 130 > 0) {
          showItems.push(element)
        } else {
          hiddenItems.push(element)
        }
      }
      this.showItems = showItems
      this.hiddenItems = hiddenItems
    },

    navItemsClick(path) {
      this.$store.commit('SET_NAVACTIVEINDEX', path)
      this.$emit('nav-items-click', path)
    },
    enterSystemSet() {
      this.$router.push({
        name: 'manage'
      })
    },
    switchLang(item) {
      this.$store.commit('SET_LANG', item.lang)
      this.langName = item.name
    },

    /**
     * 获取系统未读消息数
     */
    getSystemUnreadNum(state) {
      if (this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = null
      }
      if (state == 'visible') {
        this.sendSystemUnreadNum()
        this.intervalId = setInterval(() => {
          this.sendSystemUnreadNum()
        }, 600000)
      }
    },

    sendSystemUnreadNum() {
      systemMessageUnreadCountAPI()
        .then(res => {
          this.unreadNums = res.data
        })
        .catch(() => {
          if (this.intervalId) {
            clearInterval(this.intervalId)
            this.intervalId = null
          }
        })
    },

    /**
     * 有客户权限点击logo 进入仪表盘
     */
    enterCustoemBoard() {
      if (this.crm) {
        this.$router.push('/crm/workbench')
      }
    },

    moreMenuClick(command) {
      if (command == 'baseInfo') {
        this.$router.push({
          name: 'person'
        })
      } else if (command == 'userPerson') {
        window.open('https://www.72crm.com/center')
      } else if (command == 'download') {
        this.downloadVisible = true
      } else if (command == 'upgradeLog') {
        window.open('https://www.72crm.com/upgrade_log')
      } else if (command == 'help') {
        window.open('https://www.72crm.com/help')
      } else if (command == 'logOut') {
        this.$confirm('退出登录？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            var loading = Loading.service({
              target: document.getElementById('#app')
            })
            this.$store
              .dispatch('LogOut')
              .then(() => {
                location.reload()
                loading.close()
              })
              .catch(() => {
                location.reload()
                loading.close()
              })
          })
          .catch(() => {})
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 60px;
  min-height: 60px;
  background-color: white;
  display: flex;
  align-items: center;
  position: relative;
  padding: 0 30px;
  .logo {
    width: 150px;
    height: 40px;
    display: block;
    flex-shrink: 0;
    margin-right: 15px;
    background-color: white;
    cursor: pointer;
  }
  .nav-items-container {
    flex: 1;
    display: flex;
    min-width: 500px;
    height: 100%;
    overflow-x: auto;
    line-height: 60px;
    font-size: 15px;
  }

  .user-container {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    cursor: pointer;
    .user-img {
      margin-right: 8px;
    }
    .mark {
      font-size: 15px;
      color: #aaaaaa;
    }
  }

  .user-container:hover {
    .mark {
      color: #2486e4;
    }
  }
}

// 菜单
.el-menu {
  overflow: hidden;

  /deep/ .el-submenu__icon-arrow {
    display: none;
  }

  /deep/ .el-submenu {
    .el-submenu__title {
      i {
        color: #5c6075;
      }
    }
  }

  /deep/ .el-submenu.is-active {
    .el-submenu__title {
      i {
        color: $xr-color-primary;
      }
    }
  }
}

.el-menu.el-menu--horizontal {
  border-bottom: none;
}

.el-menu-item {
  padding: 0;
  margin: 0 20px;
  font-size: 16px;
  font-weight: 500;
  color: #2a304d;
  i {
    color: #5c6075;
  }
}

.el-menu-item:hover {
  i {
    color: $xr-color-primary;
  }
}

.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
  color: $xr-color-primary;
}

.el-menu-item.is-active {
  border-width: 3px;
  i {
    color: $xr-color-primary;
  }
}

// 右侧操作
.handel-box {
  padding: 0 15px;
  border-top: 1px solid #EBEEF5;
  padding-top: 10px;
  .handel-button {
    width: 100%;
    border-radius: $xr-border-radius-base;
    border-color: #2362fb;
    background-color: #2362fb;
  }
}

.hr-top {
  margin-top: 8px;
  border-top: 1px solid #f4f4f4;
  padding-top: 3px;
}

.nav-lang {
  cursor: pointer;
  color: #888;
  padding: 20px;
  &:hover {
    color: #2362fb;
  }
  &.active {
    font-weight: bold;
    color: #2362fb;
  }
}

// 系统消息
.wk-bell {
  color: #9DA9C2;
  cursor: pointer;
  font-size: 20px;
}

.el-badge {
  margin-right: 30px;
}

.wk-bell:hover {
  color: $xr-color-primary;
}

.el-dropdown-menu {
  /deep/ .popper__arrow {
    display: none;
  }
}
</style>

