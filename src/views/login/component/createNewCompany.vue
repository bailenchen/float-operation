<template>
  <div class="register-new-company">
    <get-sms-code
      v-show="!showNext"
      ref="smsCode"
      sms-type="register" />

    <el-form v-show="showNext">
      <el-form-item>
        <el-input
          ref="company_name"
          v-model.trim="form.company_name"
          :class="{error: !validateRes.company_name}"
          :maxlength="50"
          placeholder="请输入企业名称(必填)"
          type="text"
          @focus="focusKey = 'company_name'"
          @blur="checkFromItem('company_name', form.company_name)">
          <span
            slot="prefix"
            :class="{
              full: Boolean(form.company_name),
              focus: focusKey === 'company_name'
            }"
            class="form-icon wk wk-enterprise"
            style="font-size: 13px" />
        </el-input>
      </el-form-item>

      <!--<el-form-item>
        <el-input
          ref="company_credit_number"
          v-model.trim="form.company_credit_number"
          :class="{error: !validateRes.company_credit_number}"
          placeholder="请输入企业信用号(必填)"
          type="text"
          @focus="focusKey = 'company_credit_number'"
          @blur="checkFromItem('company_credit_number', form.company_credit_number)">
          <span
            slot="prefix"
            :class="{
              full: Boolean(form.company_credit_number),
              focus: focusKey === 'company_credit_number'
            }"
            class="form-icon wk wk-credit"
            style="font-size: 16px" />
        </el-input>
      </el-form-item>-->

      <el-form-item>
        <el-popover
          v-model="pwdPopover"
          :width="width"
          placement="bottom-start"
          popper-class="no-padding-popover"
          trigger="focus">
          <div class="pwd-popover-content">
            <div class="box">
              <span class="text">密码强度</span>
              <i
                v-for="i in 3"
                :key="i"
                :class="{active: i <= rankIndex}"
                class="item" />
            </div>
            <div class="desc">
              <span class="text">密码由6-20位字母、数字组成</span>
              <span
                v-if="rankIndex >= 3"
                class="icon wk wk-success" />
              <span
                v-else
                class="icon error wk wk-close" />
            </div>
          </div>
          <div
            slot="reference"
            class="pwd-popover-control">
            <el-input
              ref="password"
              v-model.trim="form.password"
              :maxlength="20"
              :class="{error: !validateRes.password}"
              placeholder="请输入密码"
              type="password"
              @input.native="calcRank"
              @focus="focusKey = 'password'"
              @blur="checkFromItem('password', form.password)">
              <span
                slot="prefix"
                :class="{
                  full: Boolean(form.password),
                  focus: focusKey === 'password'
                }"
                class="form-icon wk wk-circle-password" />
            </el-input>
          </div>
        </el-popover>
      </el-form-item>

      <el-form-item>
        <el-input
          ref="re_password"
          v-model.trim="form.re_password"
          :maxlength="20"
          :class="{error: !validateRes.re_password}"
          placeholder="请输入确认密码"
          type="password"
          @focus="focusKey = 're_password'"
          @blur="checkForm">
          <span
            slot="prefix"
            :class="{
              full: Boolean(form.re_password),
              focus: focusKey === 're_password'
            }"
            class="form-icon wk wk-circle-password" />
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
      <el-button
        v-if="!showNext"
        class="btn"
        @click="handleNext">
        下 一 步
      </el-button>
      <el-button
        v-else
        :disabled="disabledBtn"
        class="btn"
        @click="handleRegister">
        立&nbsp;即&nbsp;创&nbsp;建
      </el-button>
    </div>

    <div class="to-login">
      已有账号，<span
        class="special"
        @click="$emit('toggle', 'LoginByPwd')">去登录</span>
    </div>
  </div>
</template>

<script>
import { RegisterAPI, VerfySmsAPI } from '@/api/login'

import GetSmsCode from './getSmsCode'
import mixins from './mixins'

export default {
  name: 'LoginByCode',
  components: {
    GetSmsCode
  },
  mixins: [mixins],
  data() {
    const pwdReg = /^(?=.*[a-zA-Z])(?=.*\d).{6,20}$/
    return {
      form: {
        password: null
      },
      validateRes: {
        company_name: true,
        // company_credit_number: true,
        password: true,
        re_password: true
      },
      errorInfo: '',

      showNext: false,

      rules: {
        company_name: [{ required: true, msg: '企业名称不能为空' }],
        // company_credit_number: [{ required: true, msg: '企业信用号不能为空' }],
        password: [
          { required: true, msg: '密码不能为空' },
          { reg: pwdReg, msg: '密码由6-20位字母、数字组成' }
        ]
      },

      disabledBtn: false,
      pwdPopover: false, // 密码强度 popover
      width: 0, // 密码强度 popover 宽度
      rankIndex: 0 // 密码强度等级
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getWidth()
    })
  },
  methods: {
    getWidth() {
      this.width = document.getElementsByClassName(
        'el-form-item'
      )[0].clientWidth
    },
    /**
     * 下一步
     */
    handleNext() {
      this.clearError()
      const data = this.$refs.smsCode.getData()
      if (!data) return
      this.form = {
        ...this.form,
        ...data.form
      }
      VerfySmsAPI({
        phone: data.form.phone,
        smsCode: data.form.smscode
      }).then(res => {
        if (res.data === 1) {
          this.showNext = true
        } else {
          this.$message.error('短信验证码错误')
        }
      }).catch()
    },

    /**
     * 注册
     */
    handleRegister() {
      if (this.disabledBtn) return
      this.disabledBtn = true
      const flag = this.checkForm()
      if (!flag) {
        this.disabledBtn = false
        return
      }
      const params = Object.assign({}, this.form)
      if (params.hasOwnProperty('re_password')) {
        delete params.re_password
      }

      RegisterAPI(params)
        .then(() => {
          this.$message.success('注册成功')
          this.disabledBtn = false
          this.$emit('toggle', 'LoginByPwd')
        })
        .catch(() => {
          this.disabledBtn = false
        })
    },

    /**
     * 注册前表单校验
     * @return {boolean}
     */
    checkForm() {
      this.clearError()
      // const arr = ['company_name', 'company_credit_number', 'password']
      const arr = ['company_name', 'password']
      for (let i = 0; i < arr.length; i++) {
        const res = this.checkFromItem(arr[i], this.form[arr[i]] || null)
        if (!res) return false
      }
      if (this.form.password !== this.form.re_password) {
        this.setError('re_password', '两次密码输入不一致')
        return false
      }
      return true
    },

    clearError() {
      this.validateRes = {
        company_name: true,
        // company_credit_number: true,
        password: true,
        re_password: true
      }
      this.errorInfo = null
    },

    /**
     * 密码强度计算
     */
    calcRank() {
      const pwd = this.form.password
      if (pwd.length < 6) {
        this.rankIndex = 0
        return
      }
      // let reg1 = /[A-Z]/; // 至少一个大写字母
      // let reg2 = /[a-z]/; // 至少一个小写字母
      // let reg3 = /[0-9]/; // 至少一个数字
      // let reg4 = /[~!@#$%^&*()_+`\-={}:";'<>?,.\/]/; // 至少一个特殊字符

      const regArr = [
        /[A-Z]/,
        /[a-z]/,
        /[0-9]/
      ]
      const resArr = []
      regArr.forEach(reg => {
        resArr.push(reg.test(pwd))
      })
      this.rankIndex = resArr.filter(o => o).length
    }
  }
}
</script>

<style scoped lang="scss">
@import '../index';
</style>
