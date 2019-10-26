<template>
  <div class="xr-mian">
    <flexbox class="xr-mian__hd user">
      <div class="user-info">
        <div class="user-info__name">
          <span>名字</span>
          <i class="wk wk-woman" />
        </div>
        <div class="user-info__company">
          公司
        </div>
      </div>

      <el-avatar :size="44" class="user-img"> 111</el-avatar>
    </flexbox>
    <div class="xr-mian__bd">
      <flexbox class="info-cell">
        <i class="wk wk-department" />
        <div class="info-cell__label">部门</div>
        <div class="info-cell__value text-one-line">销售1部销售1部销售1部</div>
      </flexbox>
      <flexbox class="info-cell">
        <i class="wk wk-tie" />
        <div class="info-cell__label">岗位</div>
        <div class="info-cell__value text-one-line">销售1部销售1部销售1部</div>
      </flexbox>
      <flexbox class="info-cell">
        <i class="wk wk-b-mobile" />
        <div class="info-cell__label">手机</div>
        <div class="info-cell__value text-one-line">销售1部销售1部销售1部</div>
      </flexbox>
      <flexbox class="info-cell">
        <i class="wk wk-email" />
        <div class="info-cell__label">邮箱</div>
        <div class="info-cell__value text-one-line">销售1部销售1部销售1部</div>
      </flexbox>
    </div>
  </div>
</template>

<script>

export default {
  // 弹窗详情
  name: 'XrUserView',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  mounted() {},

  beforeDestroy() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.xr-mian {
  &__hd {
    padding: 20px 15px;
    background-color: #F7F8FA;
  }

  &__bd {
    padding-top: 1px solid $xr-border-line-color;
    padding: 20px 15px;
  }
}

.user {
  &-info {
    flex: 1;
    &__name {
      font-size: 16px;
      color: #333;
      font-weight: bold;

      i {
        font-size: 14px;
        margin-left: 8px;
      }
    }

    &__company {
      margin-top: 8px;
      font-size: 12px;
      color: #666;
    }
  }

  &-img {
    flex-shrink: 0;
    margin-left: 15px;
  }
}

.info-cell {
  font-size: 12px;
  i {
    font-size: 12px;
    color: #999;
  }

  &__label {
    margin-left: 5px;
    color: #666;
    widows: 50px;
  }

  &__value {
    color: #333;
    margin-left: 30px;
  }

  & + & {
    margin-top: 15px;
  }
}
</style>
