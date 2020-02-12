<template>
  <div class="register-box">
    <template v-if="!showNextStep">
      <div class="cell">
        <div class="cell-box">
          <el-input
            ref="realname"
            :class="{error: !validateRes.realname}"
            v-model="form.realname"
            placeholder="姓名" />
        </div>
        <div class="cell-box">
          <el-select
            ref="position"
            :class="{error: !validateRes.position}"
            v-model="form.position"
            placeholder="职位">
            <el-option
              v-for="item in positionList"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </div>
      </div>

      <div class="cell">
        <div class="cell-box">
          <el-input
            ref="company_name"
            :class="{error: !validateRes.company_name}"
            v-model="form.company_name"
            placeholder="公司" />
        </div>
        <div class="cell-box">
          <el-select
            ref="scale"
            :class="{error: !validateRes.scale}"
            v-model="form.scale"
            placeholder="使用人数">
            <el-option
              v-for="item in scaleList"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </div>
      </div>

      <div class="cell">
        <div class="cell-box">
          <el-select
            ref="trade"
            :class="{error: !validateRes.trade}"
            v-model="form.trade"
            placeholder="行业">
            <el-option
              v-for="item in tradeList"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </div>
        <div class="cell-box">
          <el-select
            ref="area"
            :class="{error: !validateRes.area}"
            v-model="form.area"
            placeholder="地区">
            <el-option
              v-for="item in areaList"
              :key="item.value"
              :label="item.label"
              :value="item.value" />
          </el-select>
        </div>
      </div>

      <div class="cell">
        <div class="cell-box">
          <el-input
            ref="phone"
            :class="{error: !validateRes.phone}"
            v-model="form.phone"
            placeholder="手机号"/>
        </div>
        <div class="empty">
          &nbsp;
        </div>
        <div class="cell-box">
          <el-input
            ref="discount"
            :class="{error: !validateRes.discount}"
            v-model="form.discount"
            placeholder="邀请码（选填）" />
        </div>
      </div>

      <el-popover
        v-model="showSlideVerify"
        :disabled="isUser || !canVerify"
        placement="top-start"
        width="350"
        popper-class="no-padding-popover"
        trigger="click">
        <slide-verify
          :phone="form.mobile"
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

      <div class="sms-box">
        <el-input
          ref="smscode"
          v-model.trim="form.smscode"
          :class="{error: !validateRes.smscode}"
          placeholder="请输入短信验证码" />
        <el-button
          :disabled="time !== second"
          @click="getSmsCode">
          <div class="btn-content">
            <template v-if="time === second">
              <span>获取验证码</span>
            </template>
            <template v-else>
              <span>重新发送({{ second }}s)</span>
            </template>
          </div>
        </el-button>
      </div>

      <div class="service-law">
        <el-checkbox v-model="agreeLaw">
          我同意
        </el-checkbox>
        <span class="special" @click.stop>《悟空CRM用户协议》</span>
      </div>
    </template>

    <template v-else>
      <div class="row">
        <!--<el-input
          ref="password"
          :class="{error: !validateRes.password}"
          v-model="form.password"
          type="password"
          placeholder="密码" />-->

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
              <span class="text">密码由8~20位字母、数字、特殊字符组成</span>
              <span
                v-if="rankIndex >= 2"
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
              @blur="checkFromItem('password', form.password)" />
          </div>
        </el-popover>
      </div>

      <div class="row">
        <el-input
          ref="re_password"
          :class="{error: !validateRes.re_password}"
          v-model="form.re_password"
          type="password"
          placeholder="确认密码" />
      </div>
    </template>

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

    <el-button
      :class="{special: showNextStep}"
      :disabled="disabledBtn || !agreeLaw"
      class="register-btn"
      @click="handleNextStep">
      {{ showNextStep ? '注册' : '下一步' }}
    </el-button>

    <div class="center-tips">
      <span>已有账号，</span>
      <span
        class="special" @click="$emit('toggle', 'LoginByPwd', form.phone)">去登录</span>
    </div>
  </div>
</template>

<script>
import { SendSmsAPI, RegisterAPI, VerfySmsAPI } from '@/api/login'
import SlideVerify from '@/components/SlideVerify'
import mixins from './mixins'
import { Loading } from 'element-ui'

export default {
  name: 'RegisterAccount',
  components: {
    SlideVerify
  },
  mixins: [mixins],
  data() {
    return {
      form: {},
      positionList: [
        { label: '销售经理', value: '1' },
        { label: '市场/人事经理', value: '2' },
        { label: '客服经理', value: '3' },
        { label: '总经理', value: '4' },
        { label: 'IT经理', value: '5' },
        { label: '运营经理', value: '6' },
        { label: '个人爱好', value: '7' },
        { label: '其他', value: '8' }
      ],
      scaleList: [
        { label: '少于15名员工', value: 1 },
        { label: '16-100名员工', value: 2 },
        { label: '101-500名员工', value: 3 },
        { label: '501-1,000名员工', value: 4 },
        { label: '超过1,000名员工', value: 5 }
      ],
      tradeList: [
        { label: '教育培训行业', value: 1 },
        { label: '金融业', value: 2 },
        { label: '房地产业', value: 3 },
        { label: '批发零售业', value: 4 },
        { label: '物流运输业', value: 5 },
        { label: '租赁和商务服务业', value: 6 },
        { label: '软件和IT信息技术业', value: 7 },
        { label: '文化、体育和娱乐业', value: 8 },
        { label: '制造业', value: 9 },
        { label: '科学研究和技术服务业', value: 10 }
      ],
      areaList: [
        { label: '北京市', value: 1 },
        { label: '天津市', value: 2 },
        { label: '上海市', value: 3 },
        { label: '重庆市', value: 4 },
        { label: '河北省', value: 5 },
        { label: '山西省', value: 6 },
        { label: '辽宁省', value: 7 },
        { label: '吉林省', value: 8 },
        { label: '黑龙江省', value: 9 },
        { label: '江苏省', value: 10 },
        { label: '浙江省', value: 11 },
        { label: '安徽省', value: 12 },
        { label: '福建省', value: 13 },
        { label: '江西省', value: 14 },
        { label: '山东省', value: 15 },
        { label: '河南省', value: 16 },
        { label: '湖北省', value: 17 },
        { label: '湖南省', value: 18 },
        { label: '广东省', value: 19 },
        { label: '海南省', value: 20 },
        { label: '四川省', value: 21 },
        { label: '贵州省', value: 22 },
        { label: '云南省', value: 23 },
        { label: '陕西省', value: 24 },
        { label: '甘肃省', value: 25 },
        { label: '青海省', value: 26 },
        { label: '台湾省', value: 27 },
        { label: '内蒙古自治区', value: 28 },
        { label: '广西壮族自治区', value: 29 },
        { label: '西藏自治区', value: 30 },
        { label: '宁夏回族自治区', value: 31 },
        { label: '新疆维吾尔自治区', value: 32 },
        { label: '香港特别行政区', value: 33 },
        { label: '澳门特别行政区', value: 34 }
      ],

      showSlideVerify: false,
      isUser: false,
      canVerify: true,

      timer: null,
      time: 60,
      second: 60,

      agreeLaw: true,
      showNextStep: false,
      disabledBtn: false,

      validateRes: {
        realname: true,
        company_name: true,
        scale: true,
        trade: true,
        area: true,
        discount: true,
        smscode: true,
        phone: true,
        position: true,
        password: true,
        re_password: true
      },
      errorInfo: '',
      rules: {
        realname: [{ required: true, msg: '姓名不能为空' }],
        company_name: [{ required: true, msg: '企业名称不能为空' }],
        position: [{ required: true, msg: '请选择职位' }],
        scale: [{ required: true, msg: '请选择使用人数' }],
        trade: [{ required: true, msg: '请选择行业' }],
        area: [{ required: true, msg: '请选择地区' }],
        discount: [
          { required: false, reg: /^[0-9]{7}$/, msg: '邀请码格式错误' }
        ],
        phone: [
          { required: true, msg: '手机号码不能为空' },
          { reg: /^1[1-9]\d{9}$/, msg: '请输入正确的手机号码' }
        ],
        smscode: [{ required: true, msg: '短信验证码不能为空' }]
      },

      pwdPopover: false,
      rankIndex: 0,
      width: 0
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.second = this.time
    }
  },
  created() {
    this.$nextTick(() => {
      this.getWidth()
      if (this.$route.query) {
        this.$set(this.form, 'realname', this.$route.query.name || '')
        this.$set(this.form, 'phone', this.$route.query.mobile || '')
      }
    })
  },
  methods: {
    getWidth() {
      this.width = document.getElementsByClassName(
        'register-box'
      )[0].clientWidth - 120
    },

    sliderSuccess() {
      this.isUser = true
      this.showSlideVerify = false
      this.canVerify = false
    },
    sliderFail() {},
    sliderRefresh() {},
    imgVerifyClick() {
      this.canVerify = this.checkFromItem('phone', this.form.phone)
    },

    getSmsCode() {
      const res = this.checkFromItem('phone', this.form.phone)
      console.log('res-----', res)
      if (!res) return

      if (!this.isUser) {
        this.errorInfo = '请先进行安全验证'
        return
      }

      SendSmsAPI({
        telephone: this.form.phone,
        type: 1
      }).then(() => {
        this.startTimer()
      }).catch()
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
    },

    clearError() {
      this.validateRes = {
        realname: true,
        position: true,
        company_name: true,
        scale: true,
        trade: true,
        area: true,
        discount: true,
        smscode: true,
        phone: true,
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

    handleNextStep() {
      const arr = [
        'realname',
        'position',
        'company_name',
        'scale',
        'trade',
        'area',
        'discount',
        'phone',
        'smscode'
      ]
      for (let i = 0; i < arr.length; i++) {
        const res = this.checkFromItem(arr[i], this.form[arr[i]])
        if (!res) return
      }
      if (!this.showNextStep) {
        const loading = Loading.service({
          target: document.querySelector('.login-main-content')
        })
        this.disabledBtn = true
        VerfySmsAPI({
          phone: this.form.phone,
          smsCode: this.form.smscode
        }).then(res => {
          this.disabledBtn = false
          loading.close()
          if (res.data === 1) {
            this.showNextStep = true
          } else {
            this.disabledBtn = false
            this.$message.error('短信验证码错误')
          }
        }).catch(() => {
          loading.close()
        })
      } else {
        this.clearError()
        const pwdReg = /^(?=.*[a-zA-Z])(?=.*\d).{8,20}$/
        if (!this.form.password) {
          this.validateRes.password = false
          this.setError('password', '密码不能为空')
          return
        }
        if (!pwdReg.test(this.form.password)) {
          this.validateRes.password = false
          this.setError('password', '密码必须由8-20位字母、数字组成')
          return
        }
        if (this.form.password !== this.form.re_password) {
          this.validateRes.re_password = false
          this.setError('re_password', '两次密码输入不一致')
          return
        }
        this.createAccount()
      }
    },
    createAccount() {
      const loading = Loading.service({
        target: document.querySelector('.login-main-content')
      })
      const params = Object.assign({}, this.form)
      delete params.re_password
      if (this.$route.query && this.$route.query.source) {
        params.source = this.$route.query.source
      }
      console.log('register account: ', params)
      this.disabledBtn = true
      RegisterAPI(params).then(() => {
        this.$message.success('注册成功')
        this.disabledBtn = false
        this.$emit('toggle', 'LoginByPwd', this.$refs.smsCode.form.phone)
        loading.close()
      }).catch(() => {
        this.disabledBtn = false
        loading.close()
      })
    }
  }
}
</script>

<style scoped lang="scss">
// error message
.error-info {
  width: 100%;
  height: 52px;
  padding: 0 60px;
  margin-bottom: 14px;
  margin-top: 20px;
  &.ok {
    margin: 0;
  }

  .box {
    height: 100%;
    font-size: 14px;
    color: #F54848;
    line-height: 16px;
    border: 1px solid #EA3E4A;
    border-radius: $xr-border-radius-base;
    background-color: #FFF2F2;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .icon {
      width: 16px;
      margin-right: 10px;
    }
  }
}

.register-box {
  width: 100%;
  padding: 0 60px;

  /deep/ .el-input {
    height: 46px;
    .el-input__inner {
      height: 46px;
      background-color: #F6F6F6;
    }
    &.error .el-input__inner {
      border: 1px solid red;
    }
  }
  /deep/ .el-select {
    width: 100%;
    &:hover .el-input__inner {
      border-color: #f6f6f6;
    }
    &:hover .el-input__inner:focus {
      border-color: #3e6bea;
    }
    &.error {
      border: 1px solid red;
    }
  }

  .cell {
    width: 100%;
    display: flex;
    margin-bottom: 15px;
    .cell-box {
      flex: 1;
      &:first-child {
        margin-right: 38px;
      }
    }
  }

  .row {
    margin-bottom: 30px;
    /deep/ .el-input {
      height: 70px;
      .el-input__inner {
        height: 70px;
      }
    }
  }

  // 图片验证码
  .verify-picture {
    position: relative;
    width: 100%;
    height: 52px;
    font-size: 14px;
    line-height: 52px;
    background-color: #EEF7FF;
    border-radius: $xr-border-radius-base;
    cursor: pointer;
    margin-top: 15px;
    display: flex;
    align-content: center;
    justify-content: center;
    .icon {
      width: 40px;
      height: 40px;
      margin-left: -10px;
      margin-top: 6px;
    }

    /*.slide-verify {
      position: absolute;
      top: -200px;
      left: 0;
      z-index: 100;
    }*/
  }

  .sms-box {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: nowrap;
    margin-top: 15px;
    .el-input {
      width: 300px;
    }
    .el-button {
      flex: 1;
      font-size: 12px;
      color: white;
      background-color: #3e6bea;
      border-radius: 6px;
      border: 0 none;
      padding: 0;
      margin-left: 20px;

      .btn-content {
        width: 100%;
        height: 46px;
        line-height: 46px;
        font-size: 14px;
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

  .service-law {
    margin-top: 10px;
    font-size: 14px;
    .special {
      color: #3255E6;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .register-btn {
    width: 100%;
    height: 50px;
    font-size: 20px;
    color: white;
    text-align: center;
    line-height: 50px;
    background-color: #3E6BEA;
    border-radius: 6px;
    padding: 0;
    cursor: pointer;
    margin-top: 10px;
    &:hover {
      background-color: #517aec;
    }
    &.is-disabled {
      cursor: not-allowed;
    }
    &.special {
      height: 70px;
      line-height: 70px;
      font-size: 22px;
      margin-top: 80px;
    }
  }

  .center-tips {
    width: 100%;
    font-size: 16px;
    text-align: center;
    margin-top: 15px;
    .special {
      color: #3255E6;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .error-info {
    padding: 0;
  }
}

.pwd-popover-content {
  width: 100%;
  color: #C5C5C5;
  font-size: 14px;
  padding: 14px;

  .box {
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .text {
      margin-right: 10px;
    }

    .item {
      width: 30px;
      height: 5px;
      background-color: #EBEBEB;
      margin-right: 5px;

      &.active {
        background-color: #3E6BEA;
      }
    }
  }

  .desc {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .text {
      flex: 1;
    }

    .icon {
      font-size: 14px;
      color: #33cc45;

      &.error {
        color: #F54848;
      }
    }
  }
}

/deep/ input {
  border: 1px solid #F6F6F6;
  background-color: #F6F6F6;
  box-sizing: border-box;
  -webkit-appearance: none;

  &:-webkit-autofill {
    background-image: none;
    -webkit-box-shadow: 0 0 0 1000px #F6F6F6 inset !important;
    -webkit-text-fill-color: #333 !important;
  }

  &:hover {
    border: 1px solid #F6F6F6;
  }

  &:focus,
  &:hover:focus {
    background-color: white !important;
    border: 1px solid #3e6bea;
  }

  &:focus:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px #fff inset !important;
  }

  &::-webkit-input-placeholder {
    color: #C5C5C5;
  }
}
</style>
