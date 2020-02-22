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
        class="sidebar-container" >
        <div slot="emailSynchronizes" class="syn">
          <el-tooltip v-if="showIcon" class="item" effect="dark" content="同步数据" placement="right">
            <span class="syn_span">
              <i :class="isRotate ? 'rotate' : ''" class="el-icon-refresh" @click="synEmail"/>
            </span>
          </el-tooltip>
          <span v-if="!showIcon">同步邮箱</span>
        <i v-if="!showIcon" :class="isRotate ? 'rotate' : ''" class="el-icon-refresh right_refresh" @click="synEmail"/></div>
        <div slot="person" class="person" @click="toPerson">
          <el-tooltip v-if="showIcon" :content="email" class="item" effect="dark" placement="right">
            <span class="person_span">
              <i class="el-icon-user-solid"/>
            </span>
          </el-tooltip>
          <i v-else class="el-icon-user-solid"/>
          <span v-if="!showIcon" class="person_email">{{ email }}</span>

        </div>
      </sidebar>

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
      email: ''
    }
  },

  computed: {
    ...mapGetters([
      'userInfo',
      'collapse'
    ]),
    // 设置页面不展示左侧菜单
    showMenu() {
      const path = this.$route.path
      return path != '/email/set'
    },
    navIndex() {
      return this.userInfo.emailId ? '/email/index/receive' : '/email/set'
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
        this.getEmailMsg()
      },
      deep: true
    }
  },

  created() {
    this.getEmailMsg()
  },
  methods: {
    navClick(index) {},

    /**
     * 同步邮箱
     */
    synEmail() {
      this.isRotate = true
      emailRecordReceivingEmailAPI().then(res => {
        this.$bus.emit('synEmail')
        this.$message.success('数据同步成功')
        this.isRotate = false
      }).catch(() => {
        this.isRotate = false
      })
    },

    /**
     * 跳转个人中心
     */
    toPerson() {
      this.$router.push({ path: '/email/person' })
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
        this.email = res.data.sendNick || res.data.emailAccount
        this.$store.commit('SET_EMAIL', res.data)
      }).catch(() => {})
    }
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
  .syn {
    color: white;
    width: 100%;
    height: 40px;
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
      display: block;
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
  padding: 10px 10px 10px 25px;
  bottom: 50px;
  cursor: pointer;
  white-space: nowrap;
  .person_span {
    display: inline-block;
    width: 36px;
  }
  .person_email {
    display: inline-block;
    max-width: 120px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  .el-icon-user-solid {
    cursor: pointer;
    font-size: 16px;
  }
}
</style>
