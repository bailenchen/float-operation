<template>
  <flexbox class="xr-header">
    <div
      :style="{ backgroundColor: iconColor }"
      class="xr-header__icon">
      <i :class="iconClass" />
    </div>
    <div class="xr-header__label">{{ label }}</div>
  </flexbox>
</template>

<script>

export default {
  // 公共头部
  name: 'XrHeader',
  components: {},
  props: {
    iconClass: [String, Array],
    iconColor: String,
    label: String
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
.xr-header {
  padding: 15px;
  &__icon {
    width: 30px;
    height: 30px;
    text-align: center;
    line-height: 30px;
    border-radius: 4px;
    margin-right: 10px;
    .wk {
      color: white;
      font-size: 18px;
    }
  }
  &__label {
    font-size: 16px;
    color: #333333;
    font-weight: 600;
  }
}
</style>
