<template>
  <flexbox v-loading="loading" class="email-set" justify="flex-start">
    <div class="left-bg">
      <img src="@/assets/img/email/email_set.png" alt="">
    </div>
    <!-- <div class="right-form">
      <div class="form-title btitle">验证邮箱账号</div>
      <div class="form-item bottom-height">
        <div class="form-label">邮箱账号</div>
        <el-input v-model="emailAccount" class="same-width" type="text" @input="changeVal" @change="validDataFormat(emailAccount)"/>
      </div>
      <div class="form-item">
        <div class="form-label">邮箱密码</div>
        <el-input v-model="emailPassward" class="same-width" type="text"/>
      </div>
      <div class="form-item">
        <div class="form-label"/>
        <div class="tip">绑定{{ emailType }}邮箱需要使用【授权码】作为密码绑定。请参考帮助指导。</div>
      </div>
      <div v-if="isHand" class="auto-config">
        <div class="form-item bottom-height">
          <div class="form-label">收件服务类型</div>
          <template>
            <el-select v-model="serviceType" class="select-box" placeholder="">
              <el-option
                v-for="item in typeList"
                :key="item"
                :label="item"
                :value="item"/>
            </el-select>
          </template>
        </div>
        <div class="form-item bottom-height">
          <label class="form-label">收信服务器</label>
          <div class="input-check">
            <el-input v-model="receivingServer" class="server-input" placeholder=""/>
            <!-- <el-checkbox v-model="checked" class="port-box"> -->
    <!-- <div class="port-box">
              SLL端口
              <el-input v-model="receivingPort" class="port-input" placeholder=""/>
            </div>
            <!-- </el-checkbox> -->
    <!-- </div>
        </div>
        <div class="form-item bottom-height">
          <label class="form-label">SMTP服务器</label>
          <div class="input-check">
            <el-input v-model="smtpServer" class="server-input" placeholder=""/>
            <!-- <el-checkbox v-model="checked" class="port-box"> -->
    <!-- <div class="port-box">
              SLL端口
              <el-input v-model="smtpPort" class="port-input" placeholder=""/>
            </div>
            <!-- </el-checkbox> -->
    <!-- </div>
        </div>  -->
    <!-- </div>
      <div class="form-item">
        <div class="form-label"/>
        <div class="tip btn-size">
          <el-button type="primary" class="valid-btn" @click="valid()">验证</el-button>
          <el-button plain @click="autoConfig">{{ isHand ? '自动配置' : '手动配置' }}</el-button>
        </div>
      </div> -->
    <!-- </div> -->
    <div class="right-form">
      <div class="form-title btitle">验证邮箱账号</div>
      <el-form ref="ruleForm" :model="form" :rules="rules" label-width="100px" style="margin-left: 23px;" class="demo-ruleForm">
        <el-form-item label="邮箱账号" prop="emailAccount">
          <el-input v-model="form.emailAccount" placeholder="请输入您的邮箱帐号" @blur="emailValid(form.emailAccount)"/>
        </el-form-item>
        <el-form-item label="邮箱密码" prop="emailPassward" >
          <el-input v-model="form.emailPassward" type="password" placeholder="QQ、163等邮箱请使用授权码"/>
        </el-form-item>
        <div class="tip">授权码可在邮箱的【设置】-【账户】页面生成</div>

        <template v-if="isHand">

          <el-form-item label="收件服务类型" prop="serviceType">
            <el-select v-model="serviceType" class="select-box" placeholder="">
              <el-option
                v-for="item in typeList"
                :key="item"
                :label="item"
                :value="item"/>
            </el-select>
          </el-form-item>

          <el-form-item label="收信服务器" required>
            <el-col :span="12">
              <el-form-item prop="receivingServer">
                <el-input v-model="form.receivingServer" class="port-input" placeholder=""/>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item label="SLL端口" prop="receivingPort" class="form_init">
                <el-input v-model="form.receivingPort" placeholder=""/>
              </el-form-item>
            </el-col>
          </el-form-item>

          <el-form-item label="SMTP服务器" required>
            <el-col :span="12">
              <el-form-item prop="smtpServer">
                <el-input v-model="form.smtpServer" placeholder=""/>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="SLL端口" prop="smtpPort" class="form_init">
                <el-input v-model="form.smtpPort" class="port-input" placeholder=""/>
              </el-form-item>
            </el-col>

          </el-form-item>
        </template>
        <el-form-item>
          <el-button type="primary" class="valid-btn" @click="valid">验证</el-button>
          <el-button plain @click="autoConfig">{{ isHand ? '自动配置' : '手动配置' }}</el-button>
        </el-form-item>
      </el-form>
    </div>
  </flexbox>
</template>

<script>
import { emailValidAPI } from '@/api/email/email'

import { regexIsCRMEmail } from '@/utils'
import { mapGetters } from 'vuex'
export default {
  // 设置
  name: 'Set',
  components: {},
  props: {},
  data() {
    return {
      loading: false,
      emailAccount: '',
      emailPassward: '',
      serviceType: 'SMTP',
      typeList: ['SMTP', 'POP3', 'IMAP'],
      isHand: false,
      emailType: '',
      form: {},
      rules: {
        emailAccount: [
          { required: true, message: '邮箱号码不能为空', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱号码', trigger: ['blur', 'change'] }
        ],
        emailPassward: [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ],
        serviceType: [
          { required: true, message: '收件服务类型不能为空', trigger: 'change' }
        ],
        receivingServer: [
          { required: 'true', message: '收信服务器不能为空', trigger: 'blur' }
        ],
        receivingPort: [
          { required: 'true', message: '端口不能为空', trigger: 'blur' }
        ],
        smtpServer: [
          { required: 'true', message: 'SMTP服务器不能为空', trigger: 'blur' }
        ],
        smtpPort: [
          { required: 'true', message: '端口不能为空', trigger: 'blur' }
        ]
      },
      emailParamType: [],
      emailTypeList: ['qq', '163', '126', 'year', 'aliyun', '139', 'foxmail', 'yahoo', 'sina', 'sohu', 'outlook', 'gmail'],
      receivingServer: '',
      receivingPort: '',
      checked: true,
      smtpServer: '',
      smtpPort: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  watch: {},
  mounted() {},

  beforeDestroy() {},

  created() {
    if (this.userInfo.emailId) {
      this.$router.push({ name: 'email_index' })
    }
  },

  beforeRouteUpdate(to, from, next) {
    this.emailParamType.push(to)
    this.emailParamType.push(from)
    this.emailParamType.push(next)
    next()
  },

  methods: {
    /**
     * 验证数据格式
     */
    validDataFormat(data) {
      if (this.emailType) {
        console.log('格式正确')
        // emailValidAPI(this.emailAccount).then((res) => {
        //   console.log(res, '122')
        // }).catch(() => {

        // })
      } else {
        console.log('格式不正确')
      }
    },

    /**
     * 判断邮箱类型
     */
    emailValid(data) {
      var eType = data.includes('@') && data.includes('.') ? String(data.split('@')[1].split('.')[0]).toLowerCase() : ''
      this.emailType = (this.emailTypeList.includes(eType) ? eType : '')
    },

    /**
     * 验证
     */
    valid() {
      if (this.isHand) {
        var params = {
          email_account: this.form.emailAccount,
          email_password: this.form.emailPassward,
          receiving_server: this.form.receivingServer,
          receiving_ssl: this.form.receivingPort,
          smtp_server: this.form.smtpServer,
          configuration_mode: 2,
          smtp_ssl: this.smtpPort
        }
      } else {
        var params = {
          email_account: this.form.emailAccount,
          email_password: this.form.emailPassward,
          receiving_server: `imap.${this.emailType}.com`,
          receiving_ssl: '993',
          smtp_server: `smtp.${this.emailType}.com`,
          configuration_mode: 1,
          smtp_ssl: 465
        }
        if (!this.emailType) {
          params.receiving_server = ''
          params.smtp_server = ''
        }
      }
      this.loading = true
      emailValidAPI(params).then((res) => {
        if (res.msg === 105) {
          this.$confirm('账号或密码错误，腾讯、网易等邮箱等服务商需要在网页端设置中开启POP3/IMAP/SMPT服务，且对于第三方邮箱服务要求使用“授权码”登录。没有开启相关服务或使用原邮箱密码登录均可能导致密码错误问题。', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            closeOnClickModal: false,
            type: 'warning'
          }).then(() => {
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
          this.loading = false
          this.$router.push({ name: 'email_set' })
        } else {
          this.$store.dispatch('GetUserInfo').then(res => {
            this.$router.push({
              path: '/email/index/receive'
            })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        }
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * 自动配置
     */
    autoConfig() {
      this.isHand = !this.isHand
    }

  }
}
</script>

<style lang="scss" scoped>
.left-bg {
  width: 45%;
  flex-shrink: 1;
  text-align: center;
  img {
    width: 50%;
  }
}
.tip {
   font-size: 12px;
   line-height: 20px;
   position: relative;
   top: -8px;
   left: 100px;
   }
.email-set {
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  .left-pic {
    position: relative;
  }
  .right-form {
    width: 500px;
    flex-shrink: 0;
    line-height: 50px;
    .form-title {
      font-size: 18px;
    }
    .form-item {
      font-size: 16px;
      color: #333;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .form-label {
        font-size: 16px;
        width: 100px !important;
        text-align: left;
        margin-right: 16px;
      }
    }
  }
}

.form-item /deep/ .el-input .el-input__inner {
  height: 50px;
  border-radius: 4px;
}

.bottom-height {
  margin-bottom: 30px;
}

.form-item /deep/ .el-select {
  width: 100%
}

.select-box {
  width: 100%;
}

.input-check {
  width: 400px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .server-input {
    width: 240px;
  }
  .port-box {
    .port-input {
      width: 60px;
      margin-left: 10px;
    }
  }
}

.btn-size {
  font-size: 14px !important;
}

.same-width {
  width: 450px;
}

.valid-btn {
  margin-right: 28px;
}

.btitle {
  margin-left: 20px;
  margin-bottom: 20px;
  position: relative;
}
/deep/ .el-form-item__label {
  text-align: left;
}
.form_init {
  /deep/.el-form-item__label {
  text-align: right;
}
}
</style>
