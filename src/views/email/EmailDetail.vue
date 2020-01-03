<template>
  <slide-view
    v-if="visible"
    @close="hideView">
    <!-- <div class="email-detail"> -->
    <div class="container">
      <detail-head class="header"/>
      <div class="detail-body">
        <div class="wk wk-focus-on"><span class="font-title">2019年度报告</span></div>
        <div class="main-info">发件人：</div>
        <div class="main-info">收件人：</div>
        <div class="main-info">时间：</div>
      </div>
      <div class="article">
        时光飞逝，伴随着比较紧凑又略显紧张的工作节奏，20XX年就这样快接近尾声，虽然我来公司时间还不太长，可是时间的脚步依然没有放慢它前行的脚步，经过这一段时间的工作，有很多所感所悟，现总结如下：
        对于工作这个词，是潜移默化的理解的，作为一名从高校毕业时间很短的学生来说，社会经验、工作经验都很缺乏，所以在平时我要多学多问，付出比别人更多的努力。在公司里面我深切的感受到的是领导们无微不至的关怀，同事们团结奋发、互帮互助的干劲，工作中认真务实的作风，这对走上工作岗位时间短的我来说是受益匪浅的，为我迈向正确的人生道路打下了良好的基础。
        没有太多宏伟的高瞻远瞩，也没有过于细腻的深切体会，只是在工作的当中的一些琐碎的想法和话语，分为几方面总结：
      </div>

    </div>
    <!-- </div> -->
  </slide-view>
</template>

<script>
import DetailHead from './components/DetailHead'
import SlideView from '@/components/SlideView'

export default {
  // 客户管理 的 客户详情
  name: 'EmailDetail',
  components: {
    DetailHead,
    SlideView
  },
  // mixins: [detail],
  props: {
    id: [String, Number],
    emailType: {
      type: String,
      default: ''
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {},
  mounted() {},
  methods: {
    /**
     * 关闭详情
     */
    hideView() {
      this.$emit('close')
    }

  }
}
</script>

<style lang="scss" scoped>
.slide-fade-leave-active {
  will-change: transform;
  transition: all 0.1s;
}
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}


.container {
  padding: 33px 22px 20px 20px;
  .header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 60px;
    padding-bottom: 40px;
  }
  .detail-body {
    .font-title {
      color: #666666;
      font-size: 16px;
      line-height: 30px;
      margin-left: 14px;
    }
    .main-info {
      color: #666666;
      font-size: 12px;
      line-height: 24px;
    }
  }
  .article {
    width: 100%;
    margin-top: 15px;
    background: #F5F5F5;
    padding: 42px 62px 70px 47px;
    text-align: justify;
    text-indent: 2em;
    color: #666666;
    font-size: 16px;
    line-height: 27px;
  }
}

/** 客户管理详情页面的 css 侧滑进入的详情 */
.d-view {
  position: fixed;
  min-width: 926px;
  width: 75%;
  top: 60px;
  bottom: 0px;
  right: 0px;
  background: #fff;
}

@import './styles/emaildetail.scss';
</style>
