<template>
  <div class="menu-item-content">
    <i
      :class="['wk', `wk-${icon}`]"/>
    <span>{{ title }}</span>
    <el-badge
      v-if="num && num > 0"
      :max="99"
      :value="num"/>
  </div>
</template>

<script>

export default {
  name: 'Item',
  components: {},
  props: {
    icon: String,
    title: String,
    num: [String, Number]
  },
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
.menu-item-content {
  width: 100%;
  border-radius: $xr-border-radius-base;
  line-height: 36px;
  margin: 5px 0;
  padding-left: 10px;
  position: relative;
  cursor: pointer;
}

.menu-item-content.is-close {
  .el-badge {
    position: absolute;
    top: 6px;
    left: 50%;
    right: auto;
    transform: translateX(-50%);
  }
}

.wk {
  margin-right: 8px;
}

// 消息数
.el-badge {
  position: absolute;
  right: 4px;
  top: 6px;
  /deep/ .el-badge__content {
    border-width: 0;
  }
}
</style>
