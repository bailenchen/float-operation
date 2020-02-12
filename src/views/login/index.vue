<template>
  <div
    :class="{'create-wrapper': activeCom === 'CreateNewCompany'}"
    class="login-wrapper">
    <div class="top-nav">
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
        <div
          v-if="activeCom !== 'CreateNewCompany'"
          class="register-btn"
          @click="activeCom = 'CreateNewCompany'">
          免费注册
        </div>
        <img
          src="~@/assets/login/main_pic.png"
          alt=""
          class="main-pic">
        <ul class="download-group">
          <el-popover
            width="150"
            popper-class="download-popover"
            trigger="hover">
            <div class="popover-box">
              <img
                src="~@/assets/android_10.png"
                alt=""
                class="qrcode">
              <span class="down-text">
                扫描二维码<br>下载客户端
              </span>
            </div>
            <li
              slot="reference"
              class="download-item">
              <img
                src="~@/assets/login/android.png"
                alt="android"
                class="icon">
              <span class="text">Android下载</span>
            </li>
          </el-popover>
          <el-popover
            width="150"
            popper-class="download-popover"
            trigger="hover">
            <div class="popover-box">
              <img
                src="~@/assets/ios_10.png"
                alt=""
                class="qrcode">
              <span class="down-text">
                扫描二维码<br>下载客户端
              </span>
            </div>
            <li
              slot="reference"
              class="download-item">
              <img
                src="~@/assets/login/ios.png"
                alt="ios"
                class="icon">
              <span class="text">IOS下载</span>
            </li>
          </el-popover>
          <li class="download-item" @click="handleDownload('windows')">
            <img
              src="~@/assets/login/windows.png"
              alt="windows"
              class="icon">
            <span class="text">Windows下载</span>
          </li>
          <li class="download-item" @click="handleDownload('mac')">
            <img
              src="~@/assets/login/mac.png"
              alt="mac"
              class="icon">
            <span class="text">Mac下载</span>
          </li>
        </ul>

        <ul
          v-if="activeCom === 'CreateNewCompany'"
          class="activity-list">
          <li class="activity-list-item">
            <div class="icon wk wk-crm" />
            <div class="box">
              <div class="activity-title">
                CRM
              </div>
              <div class="text">
                全景呈现客户生命周期管理
              </div>
            </div>
          </li>
          <li class="activity-list-item">
            <div class="icon wk wk-phone-radio" />
            <div class="box">
              <div class="activity-title">
                项目管理
              </div>
              <div class="text">
                有序管理项目的整个生命周期
              </div>
            </div>
          </li>
          <li class="activity-list-item">
            <div class="icon wk wk-phone-radio" />
            <div class="box">
              <div class="activity-title">
                呼叫中心
              </div>
              <div class="text">
                支持一键外呼来电弹屏
              </div>
            </div>
          </li>
          <li class="activity-list-item">
            <div class="icon wk wk-share" />
            <div class="box">
              <div class="activity-title">
                商业智能
              </div>
              <div class="text">
                可视化历史数据的综合分析
              </div>
            </div>
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
            <span class="text">Chrome、</span>
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
      console.log('cccc', com, value)
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
     * 下载客户端
     * @param platform
     */
    handleDownload(platform) {
      const map = {
        windows: 'https://www.5kcrm.com/download/desktop/win/10/%E6%82%9F%E7%A9%BACRM%20Setup%2010.0.1.exe',
        mac: 'https://www.5kcrm.com/download/desktop/mac/10/%E6%82%9F%E7%A9%BACRM-10.0.1.dmg'
      }
      window.open(map[platform], 'self')
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
  background-size: cover;
  display: flex;
  flex-direction: column;
  overflow: auto;

  .top-nav {
    width: 100%;
    padding: 1.2% 2.8%;
    display: flex;
    img {
      width: 164px;
    }
    @media screen and (max-width: 1600px) {
      padding: 1.5% 2.8%;
      margin-bottom: 10px;
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
      .title {
        font-size: 46px;
        font-weight: normal;
        color: white;
        letter-spacing: 3px;
        margin-top: 10px;
        margin-left: 50px;
        @media screen and (max-width: 1600px) {
          font-size: 32px;
        }
      }
      .mini-title {
        font-size: 32px;
        font-weight: normal;
        color: white;
        margin-bottom: 12px;
        margin-left: 50px;
        @media screen and (max-width: 1600px) {
          font-size: 20px;
        }
      }
      .desc {
        font-size: 18px;
        color: white;
        line-height: 1.5;
        margin-left: 50px;
        @media screen and (max-width: 1600px) {
          font-size: 14px;
        }
      }
      .register-btn {
        width: 150px;
        height: 56px;
        font-size: 20px;
        text-align: center;
        line-height: 56px;
        color: #394af3;
        background-color: white;
        border-radius: 10px;
        cursor: pointer;
        margin: 20px 0 38px 50px;
        @media screen and (max-width: 1600px) {
          width: 100px;
          height: 40px;
          font-size: 16px;
          line-height: 40px;
          border-radius: 4px;
          margin: 25px 0 25px 50px;
        }
      }
      .main-pic {
        width: 560px;
        margin-bottom: 30px;
        margin-top: 38px;
        @media screen and (max-width: 1600px) {
          width: 500px;
          margin-top: 16px;
          margin-left: -20px;
          margin-bottom: 45px;
        }
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
          @media screen and (max-width: 1600px) {
            border-radius: 18px;
            margin-right: 15px;
            padding: 7px 12px;
            .icon {
              width: 22px;
              height: 22px;
              vertical-align: middle;
              margin-right: 8px;
            }
            .text {
              font-size: 14px;
              color: white;
              vertical-align: middle;
            }
          }
        }
      }
    }
    .right {
      width: 650px;
      height: 100%;
      margin-left: 150px;
      padding-top: 36px;
      .login-main-content {
        position: relative;
        width: 100%;
        height: 620px;
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
          padding: 0 55px;
          margin: 30px 0 35px;
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

      @media screen and (max-width: 1600px) {
        width: 480px;
        margin-left: 80px;
        padding-top: 15px;
        .login-main-content {
          height: 520px;
          .logo-box {
            font-size: 20px;
            padding: 0 40px;
            margin: 25px 0 30px;
            &:before {
              height: 16px;
              left: 24px;
            }
          }
          .use-tip {
            font-size: 12px;
            .icon {
              width: 15px;
            }
          }
        }
      }
    }
  }
}

.download-popover {
  .popover-box {
    width: 126px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .qrcode {
      width: 126px;
      height: 126px;
    }
    .down-text {
      width: 126px;
      font-size: 12px;
      text-align: center;
      color: #666;
      margin-top: 5px;
    }
  }
}

.create-wrapper {
  .container {
    .left {
      .activity-list {
        width: 700px;
        display: flex;
        flex-wrap: wrap;
        margin-left: 50px;
        margin-top: 26px;
        .activity-list-item {
          width: 350px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          margin: 15px 0;
          .icon {
            font-size: 26px;
            color: white;
            margin-right: 10px;
            display: flex;
          }
          .box {
            .activity-title {
              font-size: 18px;
              color: white;
              margin-bottom: 5px;
            }
            .text {
              color: white;
              font-size: 14px;
            }
          }
        }
      }
      @media screen and (max-width: 1600px) {
        .activity-list {
          width: 500px;
          margin-top: 15px;
          margin-left: 40px;
          .activity-list-item {
            width: 250px;
            margin: 10px 0;
            .icon {
              font-size: 22px;
            }
            .box {
              .activity-title {
                font-size: 16px;
              }
              .text {
                font-size: 12px;
              }
            }
          }
        }
      }
    }
    .right {
      .login-main-content {
        height: 730px;
        @media screen and (max-width: 1600px) {
          height: 600px;
        }
      }
    }
  }
}
</style>
