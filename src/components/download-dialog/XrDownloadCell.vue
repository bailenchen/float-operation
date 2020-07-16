<template>
  <div class="xr-download-cell">
    <div class="xr-download-cell__body">
      <template v-if="hovering">
        <img :src="hoverIcon" class="code-img" >
        <div class="code-label" >扫码下载客户端</div>
      </template>
      <template v-else>
        <img :src="icon" class="download-img" >
        <div class="download-label">{{ label }}</div>
      </template>
    </div>
    <div class="xr-download-cell__footer">
      <span
        @mouseenter="mouseenter"
        @mouseleave="mouseleave">
        <el-button
          type="primary"
          plain
          @click="download"
        >{{ hovering ? hoverLabel : '立即下载' }}</el-button>
      </span>
    </div>
  </div>
</template>

<script>

export default {
  name: 'XrDownloadCell',
  components: {},
  props: {
    icon: String,
    label: String,
    canHover: {
      type: Boolean,
      default: false
    },
    hoverIcon: String,
    hoverLabel: String,
    url: String
  },
  data() {
    return {
      hovering: false
    }
  },
  computed: {},
  watch: {},
  mounted() {},

  beforeDestroy() {},
  methods: {
    mouseenter() {
      if (this.canHover) {
        this.hovering = true
      }
    },

    mouseleave() {
      if (this.canHover) {
        this.hovering = false
      }
    },

    download() {
      if (this.canHover) {
        if (this.hovering) {
          window.open(this.url)
        }
      } else {
        window.open(this.url)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.xr-download-cell {
  padding: 30px 0;
  width: 150px;
  text-align: center;
  color: #666;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  border: 1px solid #ebeef5;
  border-radius: 4px;

  &__body {
    height: 100px;

    .download-img {
      width: 50px;
      height: 50px;
    }

    .download-label {
      font-size: 13px;
      margin-top: 15px;
    }
    .code-img {
      width: 90px;
      margin-top: -14px;
    }

    .code-label {
      font-size: 12px;
    }
  }

  &__footer {
    .el-button {
      border-radius: 15px;
    }
  }
}
</style>
