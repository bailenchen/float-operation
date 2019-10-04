<template>
  <div
    :class="{'is-select':select}"
    class="xr-menu-item">
    <i
      :class="['xr-menu-item__icon', iconClass]"
      :style="{ backgroundColor: iconColor }" />
    <span class="xr-menu-item__label">{{ label }}</span>
  </div>
</template>

<script>
export default {
  // 菜单
  name: 'XrMenuItem',
  components: {},
  props: {
    iconClass: String,
    iconColor: String,
    label: String,
    // 关键字
    name: String,
    select: Boolean
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
.xr-menu-item {
  padding: 12px 20px;
  position: relative;

  &__icon {
    display: inline-block;
    font-size: 12px;
    padding: 6px;
    border-radius: 4px;
    color: white;
  }

  &__label {
    color: #333;
    font-size: 13px;
    margin-left: 10px;
  }
}

.xr-menu-item.is-select,
.xr-menu-item:hover {
  background-color: #f6f8fa;
}

.xr-menu-item::before {
  content: ' ';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background-color: $xr-color-primary;
  opacity: 0;
}

.xr-menu-item.is-select::before {
  opacity: 1;
}
</style>
