<template>
  <div class="register">
    <div class="title">欢迎注册悟空CRM</div>
    <el-form ref="registerForm"
             :model="registerForm"
             :rules="registerRules"
             class="login-form"
             auto-complete="on"
             label-position="left">
      <el-form-item prop="telephone">
        <el-input ref="name"
                  v-model="registerForm.telephone"
                  autofocus="autofocus"
                  name="telephone"
                  type="text"
                  auto-complete="on"
                  placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item prop="img_verify">
        <el-input v-model="registerForm.img_verify"
                  name="img_verify"
                  auto-complete="on"
                  placeholder="请输入图片验证码">
          <img slot="suffix"
               alt=""
               class="image-verification"
               src="/api/cloud/authCode"
               @click="changeImageVerification" />
        </el-input>
      </el-form-item>
      <el-form-item prop="smscode">
        <el-input v-model="registerForm.smscode"
                  name="smscode"
                  auto-complete="on"
                  placeholder="请输入短信验证码">
          <el-button slot="suffix"
                     type="text"
                     :disabled="verificationDisabled"
                     @click="getSMSVerificationCode">{{verificationButtonName}}</el-button>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password"
                  v-model="registerForm.password"
                  name="password"
                  auto-complete="on"
                  placeholder="请输入密码（6-20位，同时包含字母、数字）" />
      </el-form-item>
      <el-form-item prop="confirm_password">
        <el-input type="password"
                  v-model="registerForm.confirm_password"
                  name="confirm_password"
                  auto-complete="on"
                  placeholder="请输入确认密码（6-20位，同时包含字母、数字）"
                  @keyup.enter.native="handleRegister" />
      </el-form-item>
      <el-form-item>
        <el-button :loading="loading"
                   @click.native.prevent="handleRegister"
                   class="submit-btn">
          注册
        </el-button>
      </el-form-item>
    </el-form>
    <el-button round
               @click="goLogin">立即登录</el-button>
  </div>
</template>

<script type="text/javascript">
import { sendSmsAPI, registerAPI } from '@/api/login'

export default {
  name: 'register', // 注册
  computed: {},
  watch: {},
  data() {
    const validatePassword = (rule, value, callback) => {
      if (this.registerForm.password != this.registerForm.confirm_password) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      // 动态登录信息
      registerForm: {
        telephone: '',
        img_verify: '',
        smscode: '',
        password: '',
        confirm_password: ''
      },
      registerRules: {
        telephone: [
          { required: true, message: '请输入手机号', trigger: 'blur' }
        ],
        img_verify: [
          { required: true, message: '请输入图片验证码', trigger: 'blur' }
        ],
        smscode: [
          { required: true, message: '请输入短信验证码', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        confirm_password: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      verificationDisabled: false, // 验证button是否可点击
      verificationButtonName: '获取验证码'
    }
  },
  props: {},
  mounted() {},
  methods: {
    handleRegister() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          console.log('loginForm-----', this.registerForm)
          registerAPI({
            types: 1,
            phone: this.registerForm.telephone,
            smscode: this.registerForm.smscode,
            password: this.registerForm.password
          }).then(response => {
              this.$message.success('注册成功')
              this.goLogin();
            })
            .catch(error => {})
        } else {
          return false
        }
      })
    },

    /**
     * 更新图片验证码
     */
    changeImageVerification(e) {
      e.target.src = '/api/cloud/authCode?t=' + Math.random();
        Math.random()
    },

    /**
     * 获取短信验证码
     */
    getSMSVerificationCode() {
      if (!this.registerForm.telephone) {
        this.$message.error('请输入手机号')
      } else if (!this.registerForm.img_verify) {
        this.$message.error('请输入图片验证码')
      } else {
        // 'type': type, // type 1注册，2忘记密码，3登录
        // 'telephone': phoneTextInput.value,
        // 'img_verify': codeImgInput.value
        sendSmsAPI({
          type: 1,
          telephone: this.registerForm.telephone,
          img_verify: this.registerForm.img_verify
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
    },

    /**
     * 去登录
     */
    goLogin() {
      this.$emit('login')
    }
  },

  beforeDestroy() {}
}
</script>
<style lang="scss" scoped>
$dark_gray: #ccc;
$light_gray: #333;
$login_theme: #00aaee;

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

.image-verification {
  width: 80px;
}

.register {
  padding: 0 15%;
  text-align: center;
}

.find-password {
  float: right;
  color: #999;
}
</style>
