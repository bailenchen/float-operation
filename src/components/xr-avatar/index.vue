<template>
  <el-popover
    v-model="popoverShow"
    :visible-arrow="false"
    :disabled="popoverDisabled"
    placement="bottom"
    width="250"
    popper-class="no-padding-popover"
    trigger="click">
    <xr-user-view
      v-loading="loading"
      :data="userData"
    />
    <el-avatar
      slot="reference"
      v-bind="$attrs"
      :style="{ fontSize: fontSize }"
      :class="{ 'cursor-pointer': !disabled }"
      :size="size">{{ showName }}</el-avatar>
  </el-popover>

</template>

<script>
import { systemUserInfoAPI } from '@/api/common'

export default {
  // Avatar 头像
  name: 'XrAvatar',
  components: {
    XrUserView: () => import('../xr-user-view')
  },
  inheritAttrs: false,
  props: {
    name: String,
    id: [Number, String],
    size: {
      type: [Number, String],
      default: 38
    },
    disabled: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      popoverShow: false,
      loading: false,
      userData: null
    }
  },
  computed: {
    fontSize() {
      if (this.size <= 30) {
        return '12px'
      }
      return '14px'
    },

    showName() {
      return this.name && this.name.length > 2 ? this.name.slice(-2) : this.name
    },

    popoverDisabled() {
      if (this.disabled) {
        return true
      }

      return !this.id
    }
  },
  watch: {
    popoverShow(val) {
      if (!this.userData) {
        this.getUserData()
      }
    }
  },
  mounted() {},

  beforeDestroy() {},
  methods: {
    getUserData() {
      systemUserInfoAPI({
        userId: this.id
      }).then(res => {
        this.userData = res.data
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
