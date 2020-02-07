<template>
  <div class="forget-pwd">
    <get-sms-code
      v-show="!showNext"
      ref="smsCode"
      :phone="phone"
      sms-type="forget" />

    <div
      v-if="showChooseList"
      class="multiple-company">
      <ul class="list">
        <li
          v-for="(item, index) in list"
          :key="index"
          :class="{active: selectedIndex === index}"
          class="list-item"
          @click="selectedIndex = index">
          <span class="icon wk wk-enterprise" />
          <span class="text">
            {{ item.companyName }}
          </span>
          <img
            v-if="selectedIndex === index"
            src="~@/assets/login/m_checked.png"
            alt=""
            class="icon-checked">
        </li>
      </ul>
    </div>

    <el-form v-show="showRestPwd" class="login-from">
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
                v-for="i in 4"
                :key="i"
                :class="{active: i <= rankIndex}"
                class="item" />
            </div>
            <div class="desc">
              <span class="text">密码由8~20位字母、数字、特殊字符组成</span>
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
              v-model="form.password"
              :maxlength="20"
              :class="{error: !validateRes.password}"
              placeholder="请输入密码"
              type="password"
              @input.native="calcRank"
              @focus="focusKey = 'password'"
              @blur="checkFromItem('password', form.password)">
              <span
                slot="prefix"
                :class="{focus: focusKey === 'password'}"
                class="form-icon wk wk-circle-password" />
            </el-input>
          </div>
        </el-popover>
      </el-form-item>

      <el-form-item>
        <el-input
          ref="re_password"
          v-model="form.re_password"
          :class="{error: !validateRes.re_password}"
          :maxlength="20"
          placeholder="请输入确认密码"
          type="password"
          @focus="focusKey = 're_password'"
          @blur="checkForm">
          <span
            slot="prefix"
            :class="{focus: focusKey === 're_password'}"
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
      <div
        v-if="!showNext && !showRestPwd"
        class="btn"
        @click="handleNext">
        下 一 步
      </div>
      <div
        v-else
        class="btn"
        @click="handleResetPwd">
        确&nbsp;&nbsp;&nbsp;定
      </div>
    </div>

    <div class="to-login">
      已有账号，<span
        class="special"
        @click="$emit('toggle', 'LoginByPwd', $refs.smsCode.form.phone)">去登录</span>
    </div>
  </div>
</template>

<script>
import { ForgetPwdAPI, ResetPwdAPI, VerfySmsAPI } from '@/api/login'

import GetSmsCode from './getSmsCode'

import mixins from './mixins'

export default {
  name: 'ForgetPwd',
  components: {
    GetSmsCode
  },
  mixins: [mixins],
  data() {
    const pwdReg = /^(?=.*[a-zA-Z])(?=.*\d).{8,20}$/
    return {
      form: {},
      validateRes: {
        phone: true,
        smscode: true,
        password: true,
        re_password: true
      },
      errorInfo: '',

      showNext: false,
      showRestPwd: false,

      list: [],
      selectedIndex: 0,
      showChooseList: false,
      selectedCompany: null,

      rules: {
        phone: [
          { required: true, msg: '手机号码不能为空' },
          { reg: /^1[1-9]\d{9}$/, msg: '请输入正确的手机号码' }
        ],
        smscode: [{ required: true, msg: '短信验证码不能为空' }],
        password: [
          { required: true, msg: '密码不能为空' },
          { reg: pwdReg, msg: '密码必须由8-20位字母、数字组成' }
        ]
      },

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
      if (!this.showRestPwd) {
        const data = this.$refs.smsCode.getData()
        if (!data) return false
        this.form = {
          ...this.form,
          ...data.form
        }
        VerfySmsAPI({
          phone: data.form.phone,
          smsCode: data.form.smscode
        }).then(res => {
          if (res.data === 1) {
            this.getCompany(data.form)
          } else {
            this.$message.error('短信验证码错误')
          }
        }).catch()
      } else {
        this.showRestPwd = true
      }
    },

    /**
     * 获取企业列表
     */
    getCompany(form) {
      // this.list = response.companyList
      // this.showChooseList = true

      ForgetPwdAPI(form).then(response => {
        if (response.hasOwnProperty('companyList')) {
          this.list = response.companyList
          this.showNext = true
          this.showChooseList = true
        } else {
          this.showNext = true
          this.selectedCompany = response.companyId
          this.showRestPwd = true
        }
      })
    },

    /**
     * 企业选择
     */
    handlerSelect() {
      this.selectedCompany = this.list[this.selectedIndex].companyId
      this.showChooseList = false
      this.showRestPwd = true
    },

    /**
     * 修改密码
     */
    handleResetPwd() {
      if (this.showChooseList) {
        this.handlerSelect()
        return
      }

      const flag = this.checkForm()
      if (!flag) return
      const params = Object.assign({}, this.form)
      if (params.hasOwnProperty('re_password')) {
        delete params.re_password
      }
      params.companyId = this.selectedCompany

      ResetPwdAPI(params)
        .then(() => {
          this.$message.success('修改成功')
          this.$emit('toggle', 'LoginByPwd', this.$refs.smsCode.form.phone)
        })
        .catch()
    },

    /**
     * 修改前表单校验
     * @return {boolean}
     */
    checkForm() {
      this.clearError()
      const arr = ['phone', 'smscode', 'password']
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

    /**
     * 密码强度计算
     */
    calcRank() {
      const pwd = this.form.password
      if (pwd.length < 8) {
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
    },

    clearError() {
      this.validateRes = {
        phone: true,
        smscode: true,
        password: true,
        re_password: true
      }
      this.errorInfo = null
    }
  }
}
</script>

<style scoped lang="scss">
@import '../index';

.forget-pwd {
  .sms-box {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: nowrap;
    .el-input {
      width: 200px;
    }
    .el-button {
      flex: 1;
      font-size: 12px;
      color: white;
      background-color: #3e6bea;
      border-radius: $xr-border-radius-base;
      border: 0 none;
      padding: 0;
      margin-left: 20px;
      .btn-content {
        width: 100%;
        height: 42px;
        @include center;
        .icon {
          font-size: 16px;
          margin-right: 5px;
        }
      }

      &:hover {
        color: white;
        border-color: #517aec;
        background-color: #517aec;
      }
    }
  }
}
</style>
