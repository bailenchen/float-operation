<template>
  <div class="login-by-pwd">
    <el-form class="login-from">
      <el-form-item>
        <el-input
          ref="username"
          v-model.trim="form.username"
          :class="{error: !validateRes.username}"
          placeholder="请输入用户名"
          autofocus
          type="text"
          @focus="focusKey = 'username'"
          @blur="checkFromItem('username', form.username)"
          @keyup.enter.native="handleLogin">
          <!--<span
            slot="prefix"
            :class="{
              full: Boolean(form.username),
              focus: focusKey === 'username'
            }"
            class="form-icon wk wk-user" />-->
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          ref="password"
          v-model.trim="form.password"
          :maxlength="20"
          :class="{error: !validateRes.password}"
          placeholder="请输入密码"
          type="password"
          @focus="focusKey = 'password'"
          @keyup.enter.native="handleLogin"
          @blur="checkForm">
          <!--<span
            slot="prefix"
            :class="{
              full: Boolean(form.password),
              focus: focusKey === 'password'
            }"
            class="form-icon wk wk-circle-password" />-->
          <span
            v-if="focusKey !== 'password'"
            slot="suffix"
            class="forget-pwd"
            @click="$emit('toggle', 'ForgetPwd', form.username)">
            忘记密码
          </span>
        </el-input>
      </el-form-item>
    </el-form>

    <div class="cell login-action">
      <div class="cell-box">
        <el-checkbox
          v-model="rememberMe">
          记住我
        </el-checkbox>
      </div>
      <div class="empty">
        &nbsp;
      </div>
      <div
        class="cell-box login-by-code"
        @click="$emit('toggle', 'LoginByCode', form.username)">
        <span class="text">验证码登录</span>
      </div>
    </div>

    <div
      :class="{ok: !Boolean(errorInfo)}"
      class="error-info">
      <div
        v-if="errorInfo"
        class="box">
        <img
          src="~@/assets/login/error.png"
          alt=""
          class="icon">
        <span>{{ errorInfo }}</span>
      </div>
    </div>

    <div class="control">
      <div
        class="btn"
        @click="handleLogin">
        登&nbsp;录
      </div>

      <div class="others">
        <el-dropdown
          trigger="click"
          @command="handleToggle">
          <span class="el-dropdown-link">
            默认登录方式：
            <span class="dropdown">
              {{ loginType === 1 ? '云平台' : '个人中心' }}
              <i class="el-icon-arrow-down el-icon--right" />
            </span>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="1">云平台</el-dropdown-item>
            <el-dropdown-item :command="2">个人中心</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <div class="empty">
          &nbsp;
        </div>
        <div
          class="register"
          @click="$emit('toggle', 'CreateNewCompany', form.username)">
          免费注册
        </div>
      </div>

      <div
        v-if="loginType === 2"
        class="center-tips">
        <span class="el-icon-warning" />
        <span>个人中心仅管理员可登录</span>
      </div>
    </div>
  </div>
</template>

<script>
import { Loading } from 'element-ui'
import request from '@/utils/request'

import mixins from './mixins'

export default {
  name: 'LoginByPwd',
  mixins: [mixins],
  data() {
    const pwdReg = /^(?=.*[a-zA-Z])(?=.*\d).{6,20}$/
    return {
      redirect: undefined,
      rememberMe: false,
      form: {
        username: sessionStorage.getItem('account') || ''
      },
      errorInfo: null,
      validateRes: {
        username: true,
        password: true
      },
      rules: {
        username: [{ required: true, msg: '用户名不能为空' }],
        password: [
          { required: true, msg: '密码不能为空' },
          { reg: pwdReg, msg: '密码由6-20位字母、数字组成' }
        ]
      },

      loginType: 1
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
  mounted() {
    this.$nextTick(() => {
      this.$refs.username.focus()
    })
  },
  created() {
    if (this.phone) {
      this.form = {
        username: this.phone
      }
    }
  },
  methods: {
    /**
     * 登录
     */
    handleLogin() {
      const flag = this.checkForm()
      if (!flag) return
      const loading = Loading.service({
        target: document.querySelector('.login-main-content')
      })
      this.$store
        .dispatch('Login', this.form)
        .then(res => {
          if (res.hasOwnProperty('companyList')) {
            loading.close()
            this.$emit('toggle', 'MultipleCompany', res.companyList)
          } else {
            if (this.loginType === 2) {
              if (res.isAdmin) {
                this.loginCenter({
                  admin_token: res['Admin-Token'],
                  loginUserInfo: res.user
                })
              } else {
                this.$message.error('个人中心仅管理员可登录')
                localStorage.clear()
                loading.close()
              }
            } else {
              this.$router.push({ path: this.redirect || '/' })
            }
          }
        })
        .catch(() => {
          loading.close()
        })
    },

    handleToggle(command) {
      console.log('command', command)
      this.loginType = command
    },
    /**
     * 个人中心登录操作
     */
    loginCenter(data) {
      const loading = Loading.service({
        target: document.querySelector('.login-main-content')
      })
      const url = process.env.NODE_ENV === 'development' ? '/centerIndex/get_data' : '/get_data'
      request({
        url: window.location.origin + url,
        method: 'post',
        data: data
      }).then(res => {
        loading.close()
        console.log(res)
        // if (res.code === 200) {
        // } else {
        //   this.$message.error('登录失败')
        //   loading.close()
        // }
        const origin = process.env.NODE_ENV === 'development' ? 'https://www.72crm.com' : window.location.origin
        window.location.href = origin + '/center'
      }).catch(() => {
        this.$message.error('登录失败')
        loading.close()
        console.log('error')
      })
    },

    /**
     * 校验登录表单
     */
    checkForm() {
      this.clearError()
      const arr = ['username', 'password']
      for (let i = 0; i < arr.length; i++) {
        const res = this.checkFromItem(arr[i], this.form[arr[i]] || null)
        if (!res) return false
      }
      return true
    },

    clearError() {
      this.errorInfo = null
      this.validateRes = {
        username: true,
        password: true
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '../index';

.login-by-pwd {
  .forget-pwd {
    height: 62px;
    color: #999;
    line-height: 62px;
    cursor: pointer;
    padding: 0 10px 0 5px;
    display: block;
    &:hover {
      color: #3e6bea;
    }
    @media screen and (max-width: 1550px) {
      height: 50px;
      font-size: 14px;
      line-height: 50px;
      padding: 0 5px;
    }
  }
}

.login-action {
  margin-top: -10px;
  .login-by-code {
    font-size: 16px;
    color: #3e6bea;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

  @media screen and (min-width: 1550px) {
    /deep/ .el-checkbox {
      .el-checkbox__inner {
        width: 16px;
        height: 16px;
        &::after {
          top: 2px;
          left: 5px;
        }
      }
      .el-checkbox__label {
        font-size: 16px;
      }
    }
  }
  @media screen and (max-width: 1550px) {
    margin-top: -5px;
    .login-by-code {
      font-size: 14px;
    }
  }
}

.control {
  .others {
    font-size: 16px;
    .el-dropdown {
      font-size: 16px;
    }
    .register {
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  @media screen and (max-width: 1550px) {
    .others {
      font-size: 14px;
      .el-dropdown {
        font-size: 14px;
      }
    }
  }
}

.center-tips {
  font-size: 12px;
  color: #999;
  margin-top: 10px;
  .el-icon-warning {
    color: #f9a74e;
    font-size: 14px;
  }
}
</style>
