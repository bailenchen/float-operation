<template>
  <el-container>
    <el-header class="nav-container">
      <navbar
        :nav-index="navIndex"
        @nav-items-click="navClick"/>
    </el-header>
    <el-container>
      <sidebar
        v-if="showMenu"
        :items="emailRouters"
        class="sidebar-container"
        padding-bottom="84px"
        @select="siderbarSelect" >
        <flexbox slot="bottom" class="person" @click.native="toPerson">
          <el-tooltip :disabled="!showIcon" :content="email" class="item" effect="dark" placement="right">
            <i class="el-icon-user-solid"/>
          </el-tooltip>
          <div v-if="!showIcon" class="text-one-line">{{ email }}</div>
        </flexbox>
      </sidebar>

      <el-main
        v-loading="loading"
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
import { mapGetters } from 'vuex'
import { emailRecordReceivingEmailAPI, emailQueryAccountByIdAPI } from '@/api/email/email'
export default {
  name: 'Layout',

  components: {
    Navbar,
    Sidebar,
    AppMain
  },

  data() {
    return {
      emailRouters: emailRouter,
      isRotate: false,
      showIcon: false,
      loading: false,
      email: '',
      emailIndex: 0,
      navIndex: '/email/set'
    }
  },

  computed: {
    ...mapGetters([
      'userInfo',
      'collapse',
      'emailNum'
    ]),
    // 设置页面不展示左侧菜单
    showMenu() {
      const path = this.$route.path
      return path != '/email/set'
    }
  },

  watch: {
    collapse: {
      handler(val) {
        if (val) {
          this.showIcon = val
        } else {
          setTimeout(() => {
            this.showIcon = val
          }, 300)
        }
      },
      immediate: true
    },
    userInfo: {
      handler(val) {
        if (val) {
          this.navIndex = val.emailId ? '/email/index/receive' : '/email/set'
          this.getEmailMsg()
        }
      },
      deep: true,
      immediate: true
    },
    emailNum: {
      handler(val) {
        this.getEmailNumber()
      },
      deep: true
    }
  },

  created() {
  },
  methods: {
    navClick(index) {},

    siderbarSelect(key, keyPath) {
      if (key == '/email/sync') {
        this.synEmail()
      }
    },

    /**
     * 同步邮箱
     */
    synEmail() {
      this.isRotate = true
      this.loading = true
      emailRecordReceivingEmailAPI().then(res => {
        this.$bus.emit('synEmail')
        this.$message.success('数据同步成功')
        this.$store.dispatch('GetEmailCount')
        this.isRotate = false
        this.loading = false
      }).catch(() => {
        this.isRotate = false
        this.loading = false
      })
    },

    /**
     * 跳转个人中心
     */
    toPerson() {
      this.$router.push({ path: '/email/person' })
    },

    /**
     * 写信
     */
    toSend() {
      this.$router.push({ path: '/email/index/writeLetter' })
    },

    /**
     * 查询邮箱基本信息
     */
    getEmailMsg() {
      if (!this.userInfo.emailId) {
        this.$router.push({ path: '/email/set' })
        return
      }
      emailQueryAccountByIdAPI({ id: this.userInfo.emailId }).then(res => {
        this.$store.dispatch('GetEmailCount')

        this.email = res.data.sendNick || res.data.emailAccount
        this.$store.commit('SET_EMAIL_MSG', res.data)
      }).catch(() => {})
    },

    /**
     * 查询邮件数量
     */

    getEmailNumber() {
      this.emailRouters.forEach(item => {
        const ele = item.children[0]
        if (ele.path === 'index/receive') {
          ele.count = this.emailNum.inBoxUnreadCount
        } else if (ele.path === 'index/star') {
          ele.count = this.emailNum.starUnreadCount
        } else if (ele.path === 'index/draft') {
          ele.count = 0
        } else if (ele.path === 'index/sent') {
          ele.count = this.emailNum.sendUnreadCount
        } else if (ele.path === 'index/deleted') {
          ele.count = this.emailNum.deleteUnreadCount
        } else if (ele.path === 'index/spam') {
          ele.count = this.emailNum.ljUnreadCount
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './components/Sidebar/variables.scss';
  .el-container {
    min-height: 0;
    height: 100%;
  }
  .modal {
    background-color: #fff;
    width: 165px;
    height: 90px;
    border-radius: 4px;
    position: absolute;
    z-index: 2;
    top: 0px;
    left: 20px;
    opacity: .1;
  }
  .nav-text {
    cursor: pointer;
  }
  .nav-container {
    padding: 0;
    box-shadow: 0px 1px 2px #dbdbdb;
    z-index: 100;
    min-width: 1200px;
  }

  .wk-circle-edit {
    display: inline-block;
    margin-right: 10px;
  }

 .white {
   color: #fff !important;
 }

  .syn {
    color: #fff;
    width: 100%;
    position: relative;
    z-index: 3;
    cursor: pointer;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    padding-left: 30px;
    display: flex;
    white-space: nowrap;
    flex-wrap: nowrap;
    .syn_span {
      width: 100%;
      display: inline-block;
    }

    .el-icon-refresh {
      cursor: pointer;
      height: 16px;
      margin-right: 10px;
    }
    .right_refresh {
      margin-left: 70px;
    }
    .suspended {
    animation-play-state: paused;
    }
    .rotate {
      animation: rotate 6s linear infinite;
    }
  }
  @keyframes rotate{
	0%{
		transform: rotateZ(0deg);/*从0度开始*/
	}
	100%{
		transform: rotateZ(360deg);/*360度结束*/
	}
}
.person:hover {
  background-color: #011C36;
}
.person {
  color: #fff;
  width: 100%;
  position: absolute;
  background-color: $menuBg;
  padding: 10px 10px 10px 25px;
  bottom: 45px;
  cursor: pointer;
  white-space: nowrap;
  .el-icon-user-solid {
    cursor: pointer;
    font-size: 16px;
    margin-right: 8px;
  }
}
/deep/ .el-menu-item {
  .wk-inbox {
    font-size: 14px;
  }
}
</style>
