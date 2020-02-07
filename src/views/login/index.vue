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
          企业销售+管理全流程
        </h1>
        <h2 class="mini-title">
          客户关系管理的前沿创新
        </h2>
        <div class="desc">
          悟空CRM已涉及教育业、制造业、服务业、金融业、政府机构等10多种<br>
          行业解决方案，全面帮助企业进行信息化建设
        </div>
        <div class="register-btn">
          免费注册
        </div>
        <img
          src="~@/assets/login/main_pic.png"
          alt=""
          class="main-pic">
        <ul class="download-group">
          <li class="download-item">
            <img
              src="~@/assets/login/android.png"
              alt="android"
              class="icon">
            <span class="text">Android下载</span>
          </li>
          <li class="download-item">
            <img
              src="~@/assets/login/ios.png"
              alt="ios"
              class="icon">
            <span class="text">IOS下载</span>
          </li>
          <li class="download-item">
            <img
              src="~@/assets/login/windows.png"
              alt="windows"
              class="icon">
            <span class="text">Windows下载</span>
          </li>
          <li class="download-item">
            <img
              src="~@/assets/login/mac.png"
              alt="mac"
              class="icon">
            <span class="text">Mac下载</span>
          </li>
        </ul>
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

          <div class="use-tip">
            <span class="text">建议使用</span>
            <img src="~@/assets/login/chrome.png" alt="" class="icon">
            <span class="text">Chorme、</span>
            <img src="~@/assets/login/firefox.png" alt="" class="icon">
            <span class="text">火狐以及第三方浏览器</span>
            <img src="~@/assets/login/fast.png" alt="" class="icon">
            <span class="text">极速模式</span>
          </div>
        </div>

        <!--<div class="app-down">
          <span class="text">
            APP下载
          </span>
          <div class="icon wk wk-android" />
          <div class="icon wk wk-ios" />
          <div class="popover">
            <img
              src="~@/assets/login/qrcode.png"
              alt=""
              class="qrcode">
            <span class="down-text">
              扫描二维码<br>下载客户端
            </span>
          </div>
        </div>-->
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
        LoginByPwd: '欢迎登录悟空CRM',
        LoginByCode: '欢迎登录悟空CRM',
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
    if (this.$route.query && this.$route.query.mobile) {
      sessionStorage.setItem('account', this.$route.query.mobile)
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
  background: url('~@/assets/login/bg.png') center no-repeat;
  display: flex;
  flex-direction: column;
  overflow: auto;

  .top-nav {
    width: 100%;
    padding: 1.5% 2.8%;
    display: flex;
    img {
      width: 164px;
      height: 50px;
    }
  }

  .container {
    width: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    .left {
      height: 100%;
      margin-left: 30px;
      .title {
        font-size: 46px;
        font-weight: normal;
        color: white;
        letter-spacing: 3px;
      }
      .mini-title {
        font-size: 32px;
        font-weight: normal;
        color: white;
        margin-top: 24px;
        margin-bottom: 24px;
      }
      .desc {
        font-size: 18px;
        color: white;
        line-height: 1.5;
      }
      .register-btn {
        width: 150px;
        height: 60px;
        font-size: 22px;
        text-align: center;
        line-height: 60px;
        color: #394af3;
        background-color: white;
        border-radius: 10px;
        cursor: pointer;
        margin: 24px 0 52px;
      }
      .main-pic {
        width: 560px;
        margin-bottom: 30px;
      }
      .download-group {
        width: 100%;
        overflow: hidden;
        .download-item {
          float: left;
          border-radius: 24px;
          background-color: #2b5db9;
          text-align: center;
          cursor: pointer;
          margin-right: 20px;
          padding: 8px 16px;
          &:last-child {
            margin-right: 0;
          }
          .icon {
            width: 34px;
            height: 34px;
            vertical-align: middle;
            margin-right: 10px;
          }
          .text {
            font-size: 16px;
            color: white;
            vertical-align: middle;
          }
        }
      }
    }
    .right {
      width: 650px;
      height: 100%;
      margin-left: 120px;
      padding-top: 56px;
      .login-main-content {
        position: relative;
        width: 100%;
        height: 570px;
        // height: 510px;
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
        }
        .use-tip {
          position: absolute;
          left: 0;
          bottom: 15px;
          width: 100%;
          text-align: center;
          color: #999;
          font-size: 14px;
          .text {
            vertical-align: middle;
          }
          .icon {
            width: 18px;
            display: inline-block;
            vertical-align: middle;
          }
        }
      }
      /*.app-down {
        position: relative;
        width: 176px;
        height: 38px;
        font-size: 14px;
        color: #dadada;
        background-color: #3545d8;
        border-radius: 38px;
        margin: 30px auto 0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        .text {
          line-height: 18px;
          margin-right: 12px;
        }
        .icon {
          font-size: 16px;
          margin: 0 6px;
        }

        .popover {
          position: absolute;
          top: -138px;
          right: -150px;
          z-index: 200;
          width: 136px;
          height: 174px;
          background-color: white;
          border-radius: 10px;
          box-shadow: 0 13px 23px 4px rgba(0, 0, 0, 0.09);
          flex-direction: column;
          display: none;
          .qrcode {
            width: 90px;
            height: 90px;
          }
          .down-text {
            font-size: 12px;
            color: #666;
            margin-top: 15px;
          }
        }

        &:hover {
          color: white;
          background-color: #2c3ab8;
          .popover {
            @include center;
          }
        }
      }*/
    }
  }
}


</style>
