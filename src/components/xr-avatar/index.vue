<template>
  <el-avatar
    v-if="popoverDisabled"
    v-bind="$attrs"
    :src="dataSrc"
    :key="dataSrc"
    :style="{ fontSize: fontSize, background: background }"
    :class="{ 'cursor-pointer': !disabled }"
    :size="size"
    fit="fill">{{ showName }}</el-avatar>
  <el-popover
    v-else
    v-model="popoverShow"
    :visible-arrow="false"
    :trigger="trigger"
    placement="bottom"
    width="250"
    popper-class="no-padding-popover">
    <xr-user-view
      v-loading="loading"
      :data="userData" />
    <el-avatar
      slot="reference"
      v-bind="$attrs"
      :src="dataSrc"
      :key="dataSrc"
      :style="{ fontSize: fontSize, background: background }"
      :class="{ 'cursor-pointer': !disabled }"
      :size="size"
      fit="fill">{{ showName }}</el-avatar>
  </el-popover>

</template>

<script>
import { systemUserInfoAPI } from '@/api/common'
import { getImageData } from '@/utils'
import XRTheme from '@/styles/xr-theme.scss'

const dataCatch = {}

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
    src: String,
    disabled: {
      type: Boolean,
      default: true
    },
    trigger: {
      type: String,
      default: 'click'
    },
    background: {
      type: String,
      default: XRTheme.xrColorPrimary
    }
  },
  data() {
    return {
      popoverShow: false,
      loading: false,
      userData: null,
      dataSrc: ''
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
    },
    src() {
      this.dataSrc = this.src
      this.handleImage()
    }
  },
  created() {
    this.dataSrc = this.src
    this.handleImage()
  },

  beforeDestroy() {},
  methods: {
    handleImage() {
      if (this.src) {
        if (dataCatch[this.src]) {
          this.dataSrc = dataCatch[this.src]
        } else {
          getImageData(this.src)
            .then(data => {
              this.dataSrc = data.src
              dataCatch[this.src] = data.src
            })
            .catch(() => {})
        }
      }
    },

    getUserData() {
      systemUserInfoAPI({
        userId: this.id
      })
        .then(res => {
          this.userData = res.data
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.cursor-pointer {
  cursor: pointer;
}

.el-avatar {
  /deep/ img {
    width: 100%;
  }
}
</style>
