<template>
  <div class="login-by-code">
    <get-sms-code ref="smsCode" :phone="phone" sms-type="login" />

    <div class="control">
      <div
        class="btn"
        @click="handleLogin">
        登&nbsp;&nbsp;&nbsp;录
      </div>
      <div class="others">
        <div
          class="box"
          @click="$emit('toggle', 'LoginByPwd', $refs.smsCode.form.phone)">
          <span
            class="icon wk wk-password"
            style="font-size: 14px" />
          <span class="text">密码登录</span>
        </div>
      </div>
    </div>

    <div
      class="active-btn"
      @click="$emit('toggle', 'CreateNewCompany', $refs.smsCode.form.phone)">
      创建新企业
    </div>
  </div>
</template>

<script>
import GetSmsCode from './getSmsCode'
import { VerfySmsAPI } from '@/api/login'

export default {
  name: 'LoginByCode',
  components: {
    GetSmsCode
  },
  props: {
    phone: [String, Number]
  },
  data() {
    return {
      redirect: undefined
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
    handleLogin() {
      const data = this.$refs.smsCode.getData()
      if (!data) return
      VerfySmsAPI({
        phone: data.form.phone,
        smsCode: data.form.smscode
      }).then(res => {
        if (res.data === 1) {
          this.$store
            .dispatch('Login', {
              username: data.form.phone,
              smscode: data.form.smscode
            })
            .then(res => {
              if (res.hasOwnProperty('companyList')) {
                this.$emit('toggle', 'MultipleCompany', res.companyList)
              } else {
                this.$router.push({ path: this.redirect || '/' })
              }
            })
            .catch(() => {})
        } else {
          this.$message.error('短信验证码错误')
        }
      }).catch()
    }
  }
}
</script>

<style scoped lang="scss">
@import '../index';
</style>
