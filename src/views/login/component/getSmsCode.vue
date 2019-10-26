<template>
  <div>
    <el-form>
      <el-form-item>
        <el-input
          ref="telephone"
          v-model.trim="form.phone"
          :class="{error: !validateRes.phone}"
          placeholder="请输入手机号"
          type="text"
          @focus="focusKey = 'phone'"
          @blur="checkFromItem('phone', form.phone)">
          <span
            slot="prefix"
            :class="{
              full: Boolean(form.phone),
              focus: focusKey === 'phone'
            }"
            class="form-icon wk wk-user" />
        </el-input>
      </el-form-item>

      <el-popover
        :disabled="isUser"
        placement="top-start"
        width="332"
        popper-class="no-padding-popover"
        trigger="click">
        <slide-verify
          slider-text="向右滑动"
          @success="sliderSuccess"
          @fail="sliderFail"
          @refresh="sliderRefresh" />
        <div
          slot="reference"
          :class="{success: isUser}"
          class="verify-picture">
          <template v-if="!isUser">
            <img
              src="~@/assets/login/verify_picture.png"
              alt=""
              class="icon">
            <span class="text">点击完成验证</span>
          </template>
          <template v-else>
            <img
              src="~@/assets/login/verify_success.png"
              alt=""
              class="icon">
            <span class="text">验证成功</span>
          </template>
        </div>
      </el-popover>

      <el-form-item>
        <div class="sms-box">
          <el-input
            ref="smscode"
            v-model.trim="form.smscode"
            :class="{error: !validateRes.smscode}"
            placeholder="请输入短信验证码"
            @blur="checkFromItem('smscode', form.smscode)" />
          <el-button
            :disabled="time !== second"
            @click="getSmsCode">
            <div class="btn-content">
              <template v-if="time === second">
                <!--<span class="icon wk wk-shouji" />-->
                <span>获取验证码</span>
              </template>
              <template v-else>
                <span>重新发送({{ second }}s)</span>
              </template>
            </div>
          </el-button>
        </div>
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
  </div>
</template>

<script>
import { SendSmsAPI } from '@/api/login'
import SlideVerify from './slideVerify'
import mixins from './mixins'

export default {
  name: 'GetSmsCode',
  components: {
    SlideVerify
  },
  mixins: [mixins],
  data() {
    return {
      form: {},
      validateRes: {
        phone: true,
        smscode: true
      },
      isUser: false,

      showSlideVerify: false,
      errorInfo: null,

      rules: {
        phone: [
          { required: true, msg: '手机号码不能为空' },
          { reg: /^1[1-9]\d{9}$/, msg: '请输入正确的手机号码' }
        ],
        smscode: [{ required: true, msg: '短信验证码不能为空' }]
      },

      timer: null,
      time: 60,
      second: 60
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.second = this.time
    }
  },
  methods: {
    getSmsCode() {
      const res = this.checkFromItem('phone', this.form.phone)
      if (!res) return

      if (!this.isUser) {
        this.errorInfo = '请先进行安全验证'
        return
      }

      SendSmsAPI({
        telephone: this.form.phone
      })
        .then(() => {
          this.startTimer()
        })
        .catch()
    },

    sliderSuccess() {
      setTimeout(() => {
        this.isUser = true
        this.showSlideVerify = false
      }, 500)
    },

    sliderFail() {},
    sliderRefresh() {},

    clearError() {
      this.errorInfo = null
      this.validateRes = {
        phone: true,
        smscode: true
      }
    },

    getData() {
      this.clearError()
      if (!this.isUser) {
        this.errorInfo = '请先进行安全验证'
        return null
      }

      const arr = ['phone', 'smscode']
      for (let i = 0; i < arr.length; i++) {
        const res = this.checkFromItem(arr[i], this.form[arr[i]] || null)
        if (!res) return null
      }

      return {
        form: this.form,
        isUser: this.isUser
      }
    },

    /**
     * 发送短信倒计时
     */
    startTimer() {
      if (this.second === this.time) {
        this.second--
      }
      this.timer = setTimeout(() => {
        this.second--
        if (this.second >= 0) {
          this.startTimer()
        } else {
          clearTimeout(this.timer)
          this.timer = null
          this.second = this.time
        }
      }, 1000)
    }
  }
}
</script>

<style scoped lang="scss">
@import '../index';
.sms-box {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: nowrap;
  .el-input {
    width: 210px;
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
    &:hover,
    &.is-disabled,
    &.is-disabled:hover {
      color: white;
      border-color: #517aec;
      background-color: #517aec;
    }
  }
}
</style>
