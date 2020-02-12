<template>
  <div>
    <el-form class="login-from">
      <el-form-item>
        <el-input
          ref="phone"
          v-model.trim="form.phone"
          :class="{error: !validateRes.phone}"
          placeholder="请输入手机号"
          type="text"
          @focus="focusKey = 'phone'"
          @blur="checkFromItem('phone', form.phone)">
          <!--<span
            slot="prefix"
            :class="{
              full: Boolean(form.phone),
              focus: focusKey === 'phone'
            }"
            class="form-icon wk wk-user" />-->
        </el-input>
      </el-form-item>

      <el-popover
        v-model="showSlideVerify"
        :disabled="isUser || !canVerify"
        placement="top-start"
        width="332"
        popper-class="no-padding-popover"
        trigger="click">
        <slide-verify
          :phone="form.phone"
          slider-text="向右滑动"
          @success="sliderSuccess"
          @fail="sliderFail"
          @refresh="sliderRefresh"
          @close="showSlideVerify = false" />
        <div
          slot="reference"
          :class="{success: isUser}"
          class="verify-picture"
          @click="imgVerifyClick">
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

    <slot />

    <div
      v-if="showTips"
      class="cell">
      <div class="cell-box">
        <div
          class="tips">
          没收到验证码？<span class="tips-special" @click="dialogVisible=true">查看帮助</span>
        </div>
      </div>
      <div class="empty">
        &nbsp;
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

    <el-dialog
      :visible.sync="dialogVisible"
      title="没有收到验证码怎么办？"
      width="31%">
      <div class="help-doc">
        悟空CRM用户您好，验证码短信正常情况下都会在数秒钟内发送，如果您未收到短信，你可以参考以下解决方案尝试解决：<br>
        1、由于您的手机进行了某些安全设置，短信验证码被拦截。请打开垃圾箱查看，并将悟空CRM号码添加为白名单。<br>
        2、由于运营商通道故障造成了短信发送时间延迟，如果一分钟内您还未获取，您可以尝试点击重新获取验证码。<br>
        3、目前支持移动、联通和电信的所有号码，暂不支持国际及港澳台地区号码。
        <p class="others">
          如果您尝试了上述方式后均未解决，请通过
          <span class="special">400-0812-558</span>
          热线电话获取人工支持。
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { SendSmsAPI } from '@/api/login'
import SlideVerify from '@/components/SlideVerify'
import mixins from './mixins'

export default {
  name: 'GetSmsCode',
  components: {
    SlideVerify
  },
  mixins: [mixins],
  props: {
    smsType: String,
    showTips: true
  },
  data() {
    return {
      form: {
        phone: sessionStorage.getItem('account') || ''
      },
      validateRes: {
        phone: true,
        smscode: true
      },
      canVerify: false, // 默认可以进行图片验证
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
      second: 60,

      dialogVisible: false
    }
  },
  computed: {
  },
  created() {
    if (this.phone) {
      this.form = {
        phone: this.phone || ''
      }
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.second = this.time
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.phone.focus()
    })
  },
  methods: {
    imgVerifyClick() {
      this.canVerify = this.checkFromItem('phone', this.form.phone)
    },

    getSmsCode() {
      const res = this.checkFromItem('phone', this.form.phone)
      if (!res) return

      if (!this.isUser) {
        this.errorInfo = '请先进行安全验证'
        return
      }

      let typeNumber = null
      switch (this.smsType) {
        case 'login':
          typeNumber = 2
          break
        case 'forget':
          typeNumber = 2
          break
        case 'register':
          typeNumber = 1
          break
      }
      SendSmsAPI({
        telephone: this.form.phone,
        type: typeNumber
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

.login-from {
  .el-form-item {
    margin-bottom: 15px;
  }
}

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
      height: 70px;
      font-size: 16px;
      @include center;
      .icon {
        font-size: 16px;
        margin-right: 5px;
      }
      @media screen and (max-width: 1500px) {
        height: 50px;
        font-size: 14px;
        .icon {
          font-size: 14px;
        }
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


.cell {
  width: 100%;
  overflow: hidden;
  .tips {
    font-size: 16px;
    color: #666;
    .tips-special {
      color: #3E6BEA;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
    @media screen and (max-width: 1500px) {
      font-size: 14px;
    }
  }

  .login-btn {
    color: #3E6BEA;
    cursor: pointer;
    font-size: 16px;
    &:hover {
      text-decoration: underline;
    }
  }
}


/deep/ .el-dialog {
  .el-dialog__close {
    font-size: 24px !important;
    color: #666;
  }
  .el-dialog__body {
    padding: 10px 20px 20px;
  }
}

.help-doc {
  font-size: 14px;
  line-height: 1.8;
  color: #333;
  .others {
    margin-top: 10px;
    .special {
      color: #3E6BEA;
    }
  }
}
</style>
