<template>
  <div class="email-set">
    <div :class="{ 'left-pic': isShow }">
      <img src="~@/assets/img/email/email_set.png" alt="">
    </div>
    <div class="right-form">
      <div class="form-title btitle">验证邮箱账号</div>
      <div class="form-item bottom-height">
        <div class="form-label">邮箱账号</div>
        <el-input v-model="emailAccount" class="same-width" type="text" @input="changeVal" />
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
            <el-input v-model="server" class="server-input" placeholder=""/>
            <el-checkbox v-model="checked" class="port-box">
              SLL端口
              <el-input v-model="port" class="port-input" placeholder=""/>
            </el-checkbox>
          </div>
        </div>
        <div class="form-item bottom-height">
          <label class="form-label">SMTP服务器</label>
          <div class="input-check">
            <el-input v-model="server" class="server-input" placeholder=""/>
            <el-checkbox v-model="checked" class="port-box">
              SLL端口
              <el-input v-model="port" class="port-input" placeholder=""/>
            </el-checkbox>
          </div>
        </div>
      </div>
      <div class="form-item">
        <div class="form-label"/>
        <div class="tip btn-size">
          <el-button type="primary" class="valid-btn" @click="valid">验证</el-button>
          <el-button plain @click="autoConfig">自动配置</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

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
      server: null,
      port: null,
      isShow: false,
      emailType: '',
      emailParamType: []
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
     * 判断邮箱类型
     */
    changeVal(e) {
      var eType = this.emailAccount.includes('@') && this.emailAccount.includes('.') ? String(this.emailAccount.split('@')[1].split('.')[0]).toLowerCase() : ''
      this.emailType = eType == ('qq' || '163' || '126' || 'yahoo' || 'sina' || 'shouhu' || 'outlook' || 'gmail') ? eType : ''
    },

    /**
     * 验证
     */
    valid() {
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
  border-radius: 0;
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
