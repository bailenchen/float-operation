<template>
  <div class="accredit-box">
    <div class="accredit-title">
      <img src="@/assets/img/weixin.png" alt="">
    </div>
    <flexbox class="accredit-content" justify="space-between">
      <flexbox-item :span="6" class="content-step">
        <div class="step-box">
          <div class="step-title">第一步</div>
          <div class="step-img">
            <img src="@/assets/img/weixin.png" alt="">
          </div>
          <div class="step-text">
            您需要登录微信公众平台 <br> <br>（<a style="color: #245DFF" href="https://mp.weixin.qq.com/">https://mp.weixin.qq.com/</a>）申请微信小程序
          </div>
        </div>
      </flexbox-item>
      <div class="line"/>
      <flexbox-item :span="6" class="content-step">
        <div class="step-box">
          <div class="step-title">第二步</div>
          <div class="step-img step-img--top">
            <img src="@/assets/img/weixin_two.png" alt="">
          </div>
          <div class="step-text" style="line-height: 20px;">
            点击下方【去授权】按钮，<br>
            进入微信授权页面，扫码点击已授权即可使用绑定 <br>
            智慧名片
          </div>
          <div class="auth-bar">
            <el-button
              type="primary"
              @click="showAuth">去授权</el-button>
          </div>
        </div>
      </flexbox-item>
    </flexbox>
  </div>
</template>

<script>

export default {
  name: 'Explain',
  components: {
  },
  data() {
    return {
    }
  },
  computed: {},
  mounted() {
  },
  methods: {
    /**
     * 授权
     */
    showAuth() {
      this.$emit('showAuth', true)
    }
  }
}
</script>

<style lang="scss" scoped>
.accredit-box {
  width: 100%;
  height: 100%;
  min-width: 900px;
  position: relative;
  .line {
    position: absolute;
    width: 40%;
    border: 1px dashed #e6e6e6;
    height: 1px;
    left: 30%;
    top: 252px;
  }
  .accredit-title {
    width: 100%;
    height: 90px;
    margin-top: 26px;
    line-height: 90px;
    background-color: #fff;
    img {
      vertical-align: middle;
      margin-left: 14px;
      height: 40px;
    }
  }
  .accredit-content {
    width: 100%;
    margin-top: 20px;
    height: calc(100% - 145px);
    background-color: #fff;
    .content-step {
      text-align: center;
      height: 100%;
      width: 100%;
      padding-top: 135px;
      .step-box {
        width: 100%;
        .step-title {
          width: 100%;
          color: rgb(128,128,128);
          font-size: 16px;
          padding-bottom: 77px;
        }
        .step-img {
          padding-bottom: 50px;

          img {
            height: 40px;
          }
        }
        .step-img--top {
          padding-bottom: 44px;
        }
        .step-text {
          color: #656565;
          font-size: 14px;
        }
        .auth-bar {
          margin-top: 40px;
        }
      }
    }
  }
}
</style>
