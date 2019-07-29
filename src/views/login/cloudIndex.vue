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
                       :src="imgCode"
                       @click="changeImageVerification" />
                </el-input>
              </el-form-item>
              <el-form-item prop="smscode">
                <el-input v-model="dyLoginForm.smscode"
                          name="smscode"
                          auto-complete="on"
                          placeholder="请输入短信验证码">
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

      <div v-else-if="showType == 'company'" style="padding: 0 15%;">
        <div class="title">选择企业</div>
        <div>
          <flexbox class="company"
                   v-for="(item, index) in companyList"
                   :key="index">
            <div class="company-title" @click="selectCompanyClick(item)">{{item}}</div>
          </flexbox>
        </div>
        <el-button @click.native.prevent="showType = 'login'"
                   class="submit-btn">
          返回上一步
        </el-button>
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
import { sendSmsAPI, LoginAPI } from '@/api/login'
import { isvalidUsername } from '@/utils/validate'
import { mapGetters } from 'vuex'
import Lockr from 'lockr'
import { addAuth } from '@/utils/auth'

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
      showType: 'login', // login (company) register findPassword
      activeLoginTab: 'password', // password dynamic
      // 图片验证码
      imgCode: '/api/cloud/authCode?t=' + Math.random(),

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

      // 选择公司
      companyList: [
        '测试公司',
        '测试公司',
        '测试公司',
        '测试公司',
        '测试公司',
        '测试公司',
        '测试公司',
        '测试公司',
        '测试公司'
      ],

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
    /**
     * 选择公司 重置密码
     */
    selectCompanyClick(item) {},

    handleLogin() {
      this.showType = 'company'
      if (this.activeLoginTab == 'password') {
        // 密码登录
        this.$refs.loginForm.validate(valid => {
          if (valid) {
            LoginAPI({
              username: this.loginForm.username,
              password: this.loginForm.password
            })
              .then(response => {
                console.log(response)
                this.handleLoginSuccess(response)
              })
              .catch(error => {})
          } else {
            return false
          }
        })
      } else {
        this.$refs.dyLoginForm.validate(valid => {
          if (valid) {
            LoginAPI({
              username: this.dyLoginForm.telephone,
              smscode: this.dyLoginForm.smscode
            })
              .then(response => {
                this.handleLoginSuccess(response)
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
      this.$router.push({ path: this.redirect || '/workbench/index' })
    },

    /**
     * 更新图片验证码
     */
    changeImageVerification(e) {
      this.imgCode = '/api/cloud/authCode?t=' + Math.random()
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
$login_theme: #3E84E9;

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

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0 auto 50px;
      text-align: center;
    }
    .el-form {
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

.company {
  position: relative;
  &-title {
    padding: 10px 0;
    font-size: 16px;
    flex: 1;
    cursor: pointer;
  }
  &-title:hover {
    color: #3E84E9;
  }
  .el-button {
    font-size: 15px;
    margin-left: 8px;
  }
}
.company:after {
  content: ' ';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #e5e5e5;
  color: #e5e5e5;
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  z-index: 2;
}
</style>
