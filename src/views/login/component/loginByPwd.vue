<template>
  <div class="login-by-pwd">
    <el-form class="login-from">
      <el-form-item>
        <el-input
          ref="username"
          v-model.trim="form.username"
          :class="{error: !validateRes.username}"
          placeholder="请输入用户名"
          type="text"
          @focus="focusKey = 'username'"
          @blur="checkFromItem('username', form.username)"
          @keyup.enter.native="handleLogin">
          <span
            slot="prefix"
            :class="{
              full: Boolean(form.username),
              focus: focusKey === 'username'
            }"
            class="form-icon wk wk-user" />
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
          <span
            slot="prefix"
            :class="{
              full: Boolean(form.password),
              focus: focusKey === 'password'
            }"
            class="form-icon wk wk-circle-password" />
          <span
            v-if="focusKey !== 'password'"
            slot="suffix"
            class="forget-pwd"
            @click="$emit('toggle', 'ForgetPwd')">
            忘记密码
          </span>
        </el-input>
      </el-form-item>
    </el-form>

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
        登&nbsp;&nbsp;&nbsp;录
      </div>
      <div class="others">
        <div
          class="box"
          @click="$emit('toggle', 'LoginByCode')">
          <span class="icon wk wk-mobile" />
          <span class="text">验证码登录</span>
        </div>
      </div>
    </div>

    <div
      class="active-btn"
      @click="$emit('toggle', 'CreateNewCompany')">
      创建新企业
    </div>
  </div>
</template>

<script>
import { Loading } from 'element-ui'

import mixins from './mixins'

export default {
  name: 'LoginByPwd',
  mixins: [mixins],
  data() {
    const pwdReg = /^(?=.*[a-zA-Z])(?=.*\d).{6,20}$/
    return {
      redirect: undefined,
      form: {},
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
      }
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
            this.$router.push({ path: this.redirect || '/' })
          }
        })
        .catch(() => {
          loading.close()
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
    padding: 0 5px;
    cursor: pointer;
    &:hover {
      color: #3e6bea;
    }
  }
}
</style>
