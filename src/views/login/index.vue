<template>
  <div class="login-wrapper">
    <div class="top-nav">
      <!--<a target="_blank" class="box" href="http://www.5kcrm.com">
        <span class="icon wk wk-enterprise"></span>
        <span class="text">官网首页</span>
      </a>-->
      <!--<div class="box">
        <span class="icon wk wk-help" />
        <span class="text">帮助中心</span>
      </div>-->

      <img
        src="~@/assets/logo_white.png"
        alt="">
    </div>
    <div class="container">
      <div class="left">
        <h1 class="title">
          数字管家
        </h1>
        <div class="text">
          客户关系管理的前沿创新
          <br>
          帮助企业实现销售过程的全流程管理
        </div>
        <img
          src="~@/assets/login/bg.png"
          alt=""
          class="bg">
      </div>
      <div class="right">
        <div class="login-main-content">
          <div class="logo-box">
            {{ titleMap[activeCom] }}
          </div>

          <template v-if="activeCom !== 'MultipleCompany'">
            <component
              :is="activeCom"
              :phone="phone"
              :sms-type="smsType"
              @toggle="handleToggleCom" />
          </template>
          <template v-else>
            <multiple-company
              :list="companyList"
              @toggle="handleToggleCom" />
          </template>
        </div>

        <div class="app-down">
          <el-popover
            placement="top"
            width="100"
            trigger="hover">
            <div style="text-align: center;">
              <img
                style="width: 90px;"
                src="~@/assets/login/qrcode.png"
                alt=""
                class="qrcode">
              <div class="down-text">
                扫描二维码<br>下载客户端
              </div>
            </div>
            <div slot="reference" class="app">
              <i class="wk wk-mobile" />
              <span>APP端下载</span>
            </div>
          </el-popover>

          <div class="app destop" @click="downloadDestop">
            <i class="wk wk-workbench" />
            <span>Windows/Mac下载</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LoginByPwd from './component/loginByPwd'
import LoginByCode from './component/loginByCode'
import CreateNewCompany from './component/createNewCompany'
import MultipleCompany from './component/multipleCompany'
import ForgetPwd from './component/forgetPwd'

export default {
  name: 'Login',
  components: {
    LoginByPwd,
    LoginByCode,
    CreateNewCompany,
    MultipleCompany,
    ForgetPwd
  },
  data() {
    return {
      usePwd: true,
      activeCom: 'LoginByPwd',
      companyList: [],
      titleMap: {
        LoginByPwd: '使用数字账户登录',
        LoginByCode: '使用数字账户登录',
        CreateNewCompany: '创建新企业',
        MultipleCompany: '选择企业',
        ForgetPwd: '忘记密码'
      },

      smsType: null,
      phone: '' // 串联 密码登录 验证码登录 创建 页面的 手机号
    }
  },
  created() {
    if (this.$route.query && this.$route.query.type === 'register') {
      this.activeCom = 'CreateNewCompany'
    }
  },
  methods: {
    /**
     * MultipleCompany  返回多个公司数组
     * 其他返回 手机号
     */
    handleToggleCom(com, value) {
      this.companyList = []
      const typeMap = {
        LoginByPwd: 'login',
        LoginByCode: 'login',
        CreateNewCompany: 'forget',
        ForgetPwd: 'register'
      }
      if (typeMap.hasOwnProperty(com)) {
        this.smsType = typeMap[com]
      } else {
        this.smsType = null
      }
      this.activeCom = com
      if (com === 'MultipleCompany') {
        this.companyList = value || []
      } else {
        this.phone = value || ''
      }
    },

    /**
     * 下载桌面软件
     */
    downloadDestop() {
      const isMac = /macintosh|mac os x/i.test(navigator.userAgent)
      if (isMac) {
        window.open('https://www.5kcrm.com/download/desktop/mac/10/%E6%82%9F%E7%A9%BACRM-10.0.1.dmg')
      }

      const isWindows = /windows|win32/i.test(navigator.userAgent)
      if (isWindows) {
        window.open('https://www.5kcrm.com/download/desktop/win/10/%E6%82%9F%E7%A9%BACRM%20Setup%2010.0.1.exe')
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import 'index';

.login-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #3e4fea;
  display: flex;
  flex-direction: column;
  overflow: auto;

  .top-nav {
    width: 100%;
    padding: 2.5% 2.8%;
    display: flex;
    img {
      width: 164px;
      height: 50px;
    }
  }

  .container {
    width: 100%;
    flex: 1;
    padding-top: 1.5%;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    .left {
      height: 100%;
      .title {
        position: relative;
        font-size: 30px;
        color: white;
        letter-spacing: 3px;
        padding-left: 30px;
        &:after {
          position: relative;
          top: 10px;
          left: 0;
          content: '';
          width: 80px;
          height: 4px;
          background-color: white;
          display: block;
        }
      }
      .text {
        font-size: 20px;
        line-height: 30px;
        letter-spacing: 2px;
        color: white;
        padding-left: 30px;
        margin-top: 30px;
        margin-bottom: 80px;
      }
      .bg {
        width: 80%;
      }
    }
    .right {
      width: 400px;
      height: 100%;
      margin-left: 250px;
      .login-main-content {
        position: relative;
        width: 100%;
        height: 510px;
        background-color: white;
        border-radius: 6px;
        overflow: hidden;
        .logo-box {
          position: relative;
          width: 100%;
          font-weight: bold;
          font-size: 24px;
          color: #4c4c4c;
          letter-spacing: 2px;
          padding: 0 50px;
          margin: 35px 0 40px;
          &:before {
            position: absolute;
            top: 50%;
            left: 36px;
            transform: translateY(-50%);
            content: '';
            width: 4px;
            height: 20px;
            background-color: #3e6bea;
            border-radius: 2px;
            display: block;
          }
          // @include center;
          // .logo {
          //    width: 40%;
          //    margin: 0 auto;
          //  }
        }
      }
      .app-down {
        position: relative;
        margin: 25px 0 15px;
        font-size: 14px;
        color: #dadada;
        text-align: center;

        .app {
          display: inline-block;
          padding: 0 20px;
          background-color: #3545d8;
          border-radius: 20px;
          height: 40px;
          line-height: 40px;
          cursor: pointer;

          &:hover {
            color: white;
            background-color: #2c3ab8;
          }

          &.destop {
            margin-left: 15px;
          }
        }
      }
    }
  }
}
</style>
