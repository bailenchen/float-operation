<template>
  <el-popover
    v-model="popoverShow"
    :visible-arrow="false"
    :disabled="disabled"
    placement="bottom"
    width="250"
    popper-class="no-padding-popover"
    trigger="click">
    <xr-user-view />
    <el-avatar
      slot="reference"
      v-bind="$attrs"
      :class="{ 'cursor-pointer': !disabled }"
      :size="size"
      @error="errorHandler">{{ showName }}</el-avatar>
  </el-popover>

</template>

<script>

export default {
  // Avatar 头像
  name: 'XrAvatar',
  components: {
    XrUserView: () => import('../xr-user-view')
  },
  inheritAttrs: false,
  props: {
    name: String,
    size: {
      type: [Number, String],
      default: 38
    },
    disabled: {
      type: Boolean,
      default: true
    }
    // size: [Number, String],
    // shape: {
    //   type: String,
    //   default: 'circle'
    // },
    // icon: String,
    // src: String,
    // alt: String,
    // srcSet: String,
    // error: Function,
    // fit: {
    //   type: String,
    //   default: 'cover'
    // }
  },
  data() {
    return {
      popoverShow: false
    }
  },
  computed: {
    showName() {
      return this.name && this.name.length > 2 ? this.name.slice(-2) : this.name
    }
  },
  watch: {},
  mounted() {},

  beforeDestroy() {},
  methods: {
    errorHandler() {

    }
  }
}
</script>

<style lang="scss" scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
