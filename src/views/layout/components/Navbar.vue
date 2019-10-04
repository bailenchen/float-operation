<template>
  <div class="navbar">
    <img
      :src="logo"
      class="logo" >
    <div class="nav-items-container">
      <el-menu
        :default-active="navActiveIndex"
        mode="horizontal"
        active-text-color="#2362FB"
        router
        @select="navItemsClick">
        <el-menu-item
          v-for="(item, index) in items"
          :key="index"
          :index="item.path">
          {{ item.title }}
        </el-menu-item>
      </el-menu>
    </div>

    <el-popover
      :visible-arrow="false"
      placement="bottom"
      popper-class="no-padding-popover"
      width="200"
      trigger="click">
      <div class="handel-items">
        <div
          class="handel-item"
          @click="handleClick('person')"><i class="wukong wukong-personcenter"/>个人中心</div>
        <div
          class="handel-item"
          @click="handleClick('goout')"><i class="wukong wukong-goout"/>退出登录</div>
        <div
          :style="{'margin-bottom': manage ? '15px' : '0'}"
          class="handel-item hr-top"
          style="pointer-events: none;"><i class="wukong wukong-versions"/>版本 V9.2.1.190809</div>
        <div
          v-if="manage"
          class="handel-box">
          <el-button
            type="primary"
            class="handel-button"
            @click="enterSystemSet()">进入企业管理后台</el-button>
        </div>
      </div>
      <div
        slot="reference"
        class="user-container">
        <template v-if="userInfo && Object.keys(userInfo).length > 0">
          <div
            v-photo="userInfo"
            v-lazy:background-image="$options.filters.filterUserLazyImg(userInfo.img || '')"
            class="user-img div-photo"/>
        </template>
        <i class="el-icon-caret-bottom mark"/>
      </div>
    </el-popover>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { Loading } from 'element-ui'
import { adminGroupsTypeListAPI } from '@/api/systemManagement/RoleAuthorization'

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
  components: {},
  props: {
    navIndex: {
      type: [Number, String],
      default: 0,
      authRedirect: ''
    }
  },
  data() {
    return {}
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
      'navActiveIndex'
    ]),
    items() {
      var tempsItems = []
      if (this.oa) {
        tempsItems.push({
          title: '办公',
          type: 0,
          path: '/workbench',
          icon: 'workbench'
        })
      }
      if (this.crm) {
        tempsItems.push({
          title: '客户管理',
          type: 1,
          path: '/crm',
          icon: 'customer'
        })
      }
      tempsItems.push({
        title: '任务/审批',
        type: 4,
        path: '/taskExamine',
        icon: ''
      })

      tempsItems.push({
        title: '日志',
        type: 3,
        path: '/workLog',
        icon: ''
      })
      tempsItems.push({
        title: '通讯录',
        type: 6,
        path: '/addressBook',
        icon: ''
      })
      if (this.bi) {
        tempsItems.push({
          title: '商业智能',
          type: 5,
          path: '/bi',
          icon: 'statistics'
        })
      }
      if (this.project) {
        tempsItems.push({
          title: '项目管理',
          type: 2,
          path: '/project'
        })
      }
      return tempsItems
    }
  },
  mounted() {
    if (this.navIndex && this.navIndex !== this.navActiveIndex) {
      this.$store.commit('SET_NAVACTIVEINDEX', this.navIndex)
    }

    if (
      this.manage &&
      (!this.manage.system ||
        (this.manage.system && !this.manage.system.read)) &&
        (!this.manage.configSet ||
        (this.manage.configSet && !this.manage.configSet.read)) &&
        (!this.manage.users ||
        (this.manage.users && !this.manage.users.read))
    ) {
      this.getAuthPath()
    }
  },
  methods: {
    navItemsClick(path) {
      this.$store.commit('SET_NAVACTIVEINDEX', path)
      this.$emit('nav-items-click', path)
    },
    enterSystemSet() {
      this.$router.push({
        path: this.authRedirect || '/manager'
      })
    },
    handleClick(type) {
      if (type === 'goout') {
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
      } else if (type === 'person') {
        this.$router.push({
          name: 'person'
        })
      }
    },
    switchLang(item) {
      this.$store.commit('SET_LANG', item.lang)
      this.langName = item.name
    },
    getAuthPath() {
      adminGroupsTypeListAPI()
        .then(res => {
          if (res.data && res.data.length) {
            const item = res.data[0]
            this.authRedirect = `/manager/role-auth/${item.roleType}/${encodeURI(
              item.name
            )}`
          }
        })
        .catch(() => {})
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
      display: block;
      width: 32px;
      min-width: 32px;
      min-height: 32px;
      height: 32px;
      margin-right: 8px;
      border-radius: 50%;
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
.el-menu.el-menu--horizontal {
  border-bottom: none;
}

.el-menu-item {
  padding: 0;
  margin: 0 20px;
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
  color: $xr-color-primary;
}

.el-menu--horizontal > .el-menu-item.is-active {
  border-width: 3px;
}

// 右侧操作
.handel-items {
  padding: 10px 0 18px 0;
  .handel-item {
    padding: 5px 20px;
    font-size: 14px;
    color: #aaa;
    cursor: pointer;
    i {
      margin-right: 8px;
      font-size: 15px;
    }
  }
  .handel-item:hover {
    background-color: #f7f8fa;
    color: #2362fb;
  }
  .handel-box {
    padding: 0 15px;
    .handel-button {
      width: 100%;
      border-radius: 4px;
      border-color: #2362fb;
      background-color: #2362fb;
    }
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
</style>

