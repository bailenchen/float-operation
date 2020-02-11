<template>
  <div class="login-by-code">
    <get-sms-code
      ref="smsCode"
      :show-tips="false"
      :phone="phone"
      sms-type="login">
      <div class="cell">
        <div class="cell-box tips">
          没收到验证码？<span class="tips-special" @click="dialogVisible=true">查看帮助</span>
        </div>
        <div class="empty">
          &nbsp;
        </div>
        <div
          class="cell-box login-by-pwd"
          @click="$emit('toggle', 'LoginByPwd', $refs.smsCode.form.phone)">
          密码登录
        </div>
      </div>
    </get-sms-code>

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
          @click="$emit('toggle', 'CreateNewCompany', phone)">
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
import GetSmsCode from './getSmsCode'
import { VerfySmsAPI } from '@/api/login'
import { Loading } from 'element-ui'
import request from '@/utils/request'

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
      redirect: undefined,

      loginType: 1,
      dialogVisible: false
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
                if (this.loginType === 2) {
                  if (res.isAdmin) {
                    this.loginCenter({
                      admin_token: res['Admin-Token'],
                      loginUserInfo: res.user
                    })
                  } else {
                    this.$message.error('个人中心仅管理员可登录')
                    localStorage.clear()
                  }
                } else {
                  this.$router.push({ path: this.redirect || '/' })
                }
              }
            })
            .catch(() => {})
        } else {
          this.$message.error('短信验证码错误')
        }
      }).catch()
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
    }
  }
}
</script>

<style scoped lang="scss">
@import '../index';

.login-by-code {
  margin-bottom: 20px;
  .tips {
    font-size: 16px;
    color: #666;
    margin-left: 0;
    .tips-special {
      color: #3E6BEA;
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .login-by-pwd {
    color: #3E6BEA;
    font-size: 16px;
    cursor: pointer;
    &:hover {
      text-decoration: underline;
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

.active-btn {
  bottom: 40px;
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
