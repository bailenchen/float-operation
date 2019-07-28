<template>
  <div class="wrapper">
    <div class="left">
      <div class="left-pic" />
    </div>
    <div class="right">
      <div v-if="showType == 'login'"
           class="login">
        <div class="title">{{name}}</div>
        <el-tabs v-model="activeLoginTab"
                 style="">
          <el-tab-pane label="密码登录"
                       name="password">
            <el-form ref="loginForm"
                     :model="loginForm"
                     :rules="loginRules"
                     class="login-form"
                     auto-complete="on"
                     label-position="left">
              <el-form-item prop="username">
                <el-input ref="name"
                          v-model="loginForm.username"
                          autofocus="autofocus"
                          name="username"
                          type="text"
                          auto-complete="on"
                          placeholder="请输入用户名"
                          @keyup.enter.native="handleLogin" />
              </el-form-item>
              <el-form-item prop="password">
                <el-input type="password"
                          v-model="loginForm.password"
                          name="password"
                          auto-complete="on"
                          placeholder="请输入密码"
                          @keyup.enter.native="handleLogin" />
              </el-form-item>
              <el-form-item>
                <el-button type="text"
                           class="find-password"
                           @click="showType = 'findPassword'">忘记密码</el-button>
                <el-button :loading="loading"
                           @click.native.prevent="handleLogin"
                           class="submit-btn">
                  登录
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="动态密码登录"
                       name="dynamic">
            <el-form ref="dyLoginForm"
                     :model="dyLoginForm"
                     :rules="dyLoginRules"
                     class="login-form"
                     auto-complete="on"
                     label-position="left">
              <el-form-item prop="telephone">
                <el-input ref="name"
                          v-model="dyLoginForm.telephone"
                          autofocus="autofocus"
                          name="telephone"
                          type="text"
                          auto-complete="on"
                          placeholder="请输入手机号" />
              </el-form-item>
              <el-form-item prop="img_verify">
                <el-input v-model="dyLoginForm.img_verify"
                          name="img_verify"
                          auto-complete="on"
                          placeholder="请输入图片验证码">
                  <img slot="suffix"
                       alt=""
                       class="image-verification"
                       src="http://crm.72crm.com/crm9/index.php/index/index/getVerify"
                       @click="changeImageVerification" />
                </el-input>
              </el-form-item>
              <el-form-item prop="smscode">
                <el-input v-model="dyLoginForm.smscode"
                          name="smscode"
                          auto-complete="on"
                          placeholder="请输入短信验证码"
                          @click.native.prevent="handleLogin">
                  <el-button slot="suffix"
                             type="text"
                             :disabled="verificationDisabled"
                             @click="getSMSVerificationCode">{{verificationButtonName}}</el-button>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="text"
                           class="find-password"
                           @click="showType = 'findPassword'">忘记密码</el-button>
                <el-button :loading="loading"
                           @click.native.prevent="handleLogin"
                           class="submit-btn">
                  登录
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
        <el-button round
                   @click="showType = 'register'">创建新企业</el-button>
      </div>

      <register v-if="showType == 'register'"
                @login="showType = 'login'" />
      <forget-password v-if="showType == 'findPassword'"
                       @login="showType = 'login'" />
      <div class="copyright">
        悟空CRM受国家计算机软件著作权保护，未经授权不得进行商业行为，违者必究。<br>
        ©2019 悟空软件<a target="_blank"
           href="http://www.5kcrm.com">www.5kcrm.com</a>
      </div>
    </div>

    <img class="logo"
         :src="logo" />
  </div>
</template>

<script>
import Register from './components/register'
import ForgetPassword from './components/forgetPassword'
import { sendSmsAPI, passwordLoginAPI, dynamicLoginAPI } from '@/api/login'
import { isvalidUsername } from '@/utils/validate'
import { mapGetters } from 'vuex'
import Lockr from 'lockr'
import {
  addAuth
} from '@/utils/auth'

export default {
  name: 'clogin',
  components: {
    Register,
    ForgetPassword
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error('请输入账号'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      showType: 'login', // login register findPassword
      activeLoginTab: 'password', // password dynamic
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      // 动态登录信息
      dyLoginForm: {
        telephone: '',
        img_verify: '',
        smscode: ''
      },
      dyLoginRules: {
        telephone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        img_verify: [
          { required: true, message: '请输入图片验证码', trigger: 'blur' }
        ],
        smscode: [
          { required: true, message: '请输入短信验证码', trigger: 'blur' }
        ]
      },
      loading: false,
      redirect: undefined,
      remember: false,
      verificationDisabled: false, // 验证button是否可点击
      verificationButtonName: '获取验证码'
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  computed: {
    ...mapGetters(['logo', 'name'])
  },
  mounted() {},
  methods: {
    handleLogin() {
      if (this.activeLoginTab == 'password') {
        // 密码登录
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            console.log('loginForm-----', this.loginForm)
            // this.$router.push({ path: this.redirect || '/workbench/index' })
            passwordLoginAPI({
              types: 1,
              telephone: this.loginForm.telephone,
              password: this.loginForm.password
            })
              .then(response => {
                console.log(response.data)

                this.handleLoginSuccess(response.data)
              })
              .catch(error => {})
          } else {
            return false
          }
        })
      } else {
        this.$refs.dyLoginForm.validate(valid => {
          if (valid) {
            console.log('dyLoginForm-----', this.dyLoginForm)

            dynamicLoginAPI({
              types: 2,
              telephone: this.loginForm.telephone,
              smscode: this.loginForm.smscode
            })
              .then(response => {
                console.log(response.data)

                this.handleLoginSuccess(response.data)
              })
              .catch(error => {})
          } else {
            return false
          }
        })
      }
    },

    /**
     * 登录成功 处理这些数据之后  再跳转
     */
    handleLoginSuccess(data) {
      Lockr.set('Admin-Token', data['Admin-Token'])
      Lockr.set('loginUserInfo', data.user)

      Lockr.set('authList', data.auth)

      addAuth(data['Admin-Token'])
      this.$store.commit('SET_USERINFO', data.user)
      // 权限

      this.$store.commit('SET_CRM', data.auth.crm)
      this.$store.commit('SET_BI', data.auth.bi)
      this.$store.commit('SET_MANAGE', data.auth.manage)
    },

    /**
     * 更新图片验证码
     */
    changeImageVerification(e) {
      e.target.src =
        'http://crm.72crm.com/crm9/index.php/index/index/getVerify?t=' +
        Math.random()
    },

    /**
     * 获取短信验证码
     */
    getSMSVerificationCode() {
      if (!this.dyLoginForm.telephone) {
        this.$message.error('请输入手机号')
      } else if (!this.dyLoginForm.img_verify) {
        this.$message.error('请输入图片验证码')
      } else {
        // 'type': type, // type 1注册，2忘记密码，3登录
        // 'telephone': phoneTextInput.value,
        // 'img_verify': codeImgInput.value
        sendSmsAPI({
          type: 3,
          telephone: this.dyLoginForm.telephone,
          img_verify: this.dyLoginForm.img_verify
        })
          .then(response => {
            console.log(response.data)

            // 倒计时逻辑
            this.verificationDisabled = true
            this.verificationButtonName = '60s后重新发送'
            let num = 60
            let times = setInterval(() => {
              num--
              this.verificationButtonName = num + 's后重新发送'
              if (num <= 0) {
                clearInterval(times)
                this.verificationDisabled = false
                this.verificationButtonName = '获取验证码'
              }
            }, 1000)
          })
          .catch(error => {})
      }
    }
  }
}
</script>

<style lang="scss" scoped>
$dark_gray: #ccc;
$light_gray: #333;
$login_theme: #00aaee;

/deep/ input {
  border: 0 none;
  background-color: white;
  -webkit-appearance: none;
  &:-webkit-autofill {
    background-image: none;
    -webkit-box-shadow: 0 0 0 1000px white inset !important;
    -webkit-text-fill-color: $light_gray !important;
  }
}
/deep/ .el-input__inner {
  height: 40px;
  padding: 0 12px;
  background-color: white;
  border: 0 none;
  border-bottom: 1px solid #e6e6e6 !important;
}
/deep/ .el-form-item__error {
  left: 12px;
}
.wrapper {
  position: relative;
  width: 100%;
  min-width: 1300px;
  display: flex;
  .left {
    width: 68%;
    .left-pic {
      width: 100%;
      height: 100%;
      background: url('../../assets/img/login/login.png') no-repeat center;
      background-size: cover;
    }
  }
  .right {
    position: relative;
    width: 32%;
    background-color: #fff;
    padding-top: 6%;
    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0 auto 50px;
      text-align: center;
    }
    .el-form {
      .submit-btn {
        margin-top: 20px;
        width: 100%;
        line-height: 2;
        font-size: 16px;
        color: white;
        border-radius: 3px;
        background-color: $login_theme;
        display: block;
      }
      .el-button {
        border: 0 none;
      }
      .action-control {
        color: #999;
        /deep/ .el-checkbox {
          .el-checkbox__label {
            color: #999;
          }
          .el-checkbox__input.is-checked .el-checkbox__inner {
            background-color: $login_theme;
            border-color: $login_theme;
          }
        }

        .forget {
          cursor: pointer;
          float: right;
        }
      }
    }

    .copyright {
      width: 92%;
      position: absolute;
      bottom: 2%;
      color: #d0d0d0;
      font-size: 12px;
      text-align: center;
      line-height: 1.5;
    }
  }

  .logo {
    position: absolute;
    left: 60px;
    top: 50px;
    width: 180px;
    height: 48px;
    z-index: 200;
  }
}

.el-tabs /deep/ .el-tabs__nav-wrap::after {
  display: none;
}

.image-verification {
  width: 80px;
}

.login {
  padding: 0 15%;
  text-align: center;
}

.find-password {
  float: right;
  color: #999;
}
</style>
