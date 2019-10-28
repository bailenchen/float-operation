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
        <div class="main-content">
          <div class="logo-box">
            {{ titleMap[activeCom] }}
          </div>

          <template v-if="activeCom !== 'MultipleCompany'">
            <component
              :is="activeCom"
              @toggle="handleToggleCom" />
          </template>
          <template v-else>
            <multiple-company
              :list="companyList"
              @toggle="handleToggleCom" />
          </template>
        </div>

        <div class="app-down">
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
        LoginByPwd: '用户登录',
        LoginByCode: '用户登录',
        CreateNewCompany: '创建新企业',
        MultipleCompany: '选择企业',
        ForgetPwd: '忘记密码'
      }
    }
  },
  methods: {
    handleToggleCom(com, list = []) {
      this.companyList = []
      this.activeCom = com
      if (com === 'MultipleCompany') {
        this.companyList = list
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
      .main-content {
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
      }
    }
  }
}
</style>
