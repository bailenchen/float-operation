<template>
  <div class="email-set">
    <div :class="{ 'left-pic': isShow }" class="left-bg">
      <img src="~@/assets/img/email/email_set.png" alt="">
    </div>
    <div class="right-form">
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
      <div v-if="isShow" class="auto-config">
        <div class="form-item bottom-height">
          <div class="form-label">收件服务类型</div>
          <template>
            <el-select v-model="value" class="select-box" placeholder="">
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </template>
        </div>
        <div class="form-item bottom-height">
          <label class="form-label">收信服务器</label>
          <div class="input-check">
            <el-input v-model="receivingServer" class="server-input" placeholder=""/>
            <!-- <el-checkbox v-model="checked" class="port-box"> -->
            <div class="port-box">
              SLL端口
              <el-input v-model="receivingPort" class="port-input" placeholder=""/>
            </div>
            <!-- </el-checkbox> -->
          </div>
        </div>
        <div class="form-item bottom-height">
          <label class="form-label">SMTP服务器</label>
          <div class="input-check">
            <el-input v-model="smtpServer" class="server-input" placeholder=""/>
            <!-- <el-checkbox v-model="checked" class="port-box"> -->
            <div class="port-box">
              SLL端口
              <el-input v-model="smtpPort" class="port-input" placeholder=""/>
            </div>
            <!-- </el-checkbox> -->
          </div>
        </div>
      </div>
      <div class="form-item">
        <div class="form-label"/>
        <div class="tip btn-size">
          <el-button type="primary" class="valid-btn" @click="valid()">验证</el-button>
          <el-button plain @click="autoConfig">手动配置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { emailValidAPI } from '@/api/email/email'

export default {
  // 设置
  name: 'Set',
  components: {},
  props: {},
  data() {
    return {
      emailAccount: '',
      emailPassward: '',
      typeList: [],
      isShow: false,
      emailType: '',
      emailParamType: [],
      emailTypeList: ['qq', '163', '126', 'year', 'aliyun', '139', 'foxmail', 'yahoo', 'sina', 'sohu', 'outlook', 'gmail'],
      receivingServer: '',
      receivingPort: '',
      smtpServer: '',
      smtpPort: ''
    }
  },
  computed: {},
  watch: {},
  mounted() {},

  beforeDestroy() {},

  created() {
    console.log(this.emailParamType)
  },

  beforeRouteUpdate(to, from, next) {
    this.emailParamType.push(to)
    this.emailParamType.push(from)
    this.emailParamType.push(next)
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
    changeVal(e) {
      var eType = this.emailAccount.includes('@') && this.emailAccount.includes('.') ? String(this.emailAccount.split('@')[1].split('.')[0]).toLowerCase() : ''
      this.emailType = (this.emailTypeList.includes(eType) ? eType : '')
    },

    /**
     * 验证
     */
    valid() {
      // if (this.isShow) {
      //   var params = {
      //     email_account: this.emailAccount,
      //     email_password: this.emailPassward,
      //     receiving_server: this.receivingServer,
      //     receiving_ssl: this.receivingPort,
      //     smtp_server: this.smtpServer,
      //     smtp_ssl: this.smtpPort
      //   }
      // } else {
      //   var params = {
      //     email_account: this.emailAccount,
      //     email_password: this.emailPassward,
      //     receiving_server: `imap.${this.emailType}.com`,
      //     receiving_ssl: '993',
      //     smtp_server: `smtp.${this.emailType}.com`,
      //     smtp_ssl: 465
      //   }
      // }
      // emailValidAPI(params).then((res) => {
      //   console.log(res, '验证')
      // }).catch(() => {

      // })

      this.$router.push({
        path: '/email/index/receive'
      })
    },

    /**
     * 自动配置
     */
    autoConfig() {
      this.isShow = true
    }

  }
}
</script>

<style lang="scss" scoped>
.left-bg {
  margin-right: 100px;
  img {
    width: 100%;
  }
}
.email-set {
  width: 1150px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left-pic {
    position: relative;
    margin-top: -200px;
  }
  .right-form {
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
      .tip {
        font-size: 12px;
        line-height: 40px;
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

.form-item .select-box {
  width: 400px;
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
  margin-left: -35px;
}
</style>
