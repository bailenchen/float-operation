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
        <div slot="emailSynchronizes" style="margin-bottom: 25px;">
          <div class="modal"/>
          <div class="syn" @click="toSend">
            <el-tooltip v-if="showIcon" class="item" effect="dark" content="写信" placement="right">
              <span class="syn_span">
                <i class="wk wk-circle-edit"/>
              </span>
            </el-tooltip>
            <div v-if="!showIcon" class="hr hr-line">
              <i class="wk wk-circle-edit"/>
              <span class="nav-text" style="font-size: 14px;">写信</span>
            </div>

          </div>
          <div class="syn">
            <el-tooltip v-if="showIcon" class="item" effect="dark" content="收信（同步）" placement="right">
              <span class="syn_span">
                <i :class="isRotate ? 'rotate' : ''" class="el-icon-refresh" @click="synEmail"/>
              </span>
            </el-tooltip>
            <div v-if="!showIcon" class="hr">
              <i :class="isRotate ? 'rotate' : ''" class="el-icon-refresh" @click="synEmail"/>
              <span class="nav-text" style="font-size: 14px;" @click="synEmail">收信（同步）</span>
            </div>
          </div>
        </div>

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
      email: '',
      emailIndex: 0
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
