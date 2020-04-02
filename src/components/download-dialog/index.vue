<template>
  <el-dialog
    :visible="visible"
    :append-to-body="true"
    :close-on-click-modal="false"
    class="xr-download-dialog"
    title="客户端下载"
    width="700px"
    @close="close">
    <div class="xr-download-dialog__title">您可以在多平台使用悟空CRM</div>
    <flexbox class="xr-download-dialog__body">
      <xr-download-cell
        v-for="(item, index) in list"
        :key="index"
        :icon="item.icon"
        :label="item.label"
        :hover-icon="item.hoverIcon"
        :hover-label="item.hoverLabel"
        :url="item.url"
        :can-hover="item.hover"/>
    </flexbox>
  </el-dialog>
</template>

<script>
import XrDownloadCell from './XrDownloadCell'

export default {
  name: 'DownloadDialog',
  components: {
    XrDownloadCell
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
      default: false
    }
  },
  data() {
    return {
      list: [{
        icon: require('@/assets/login/android.png'),
        label: 'Android',
        hover: true,
        hoverIcon: require('@/assets/android_10.png'),
        hoverLabel: '应用市场下载',
        url: WKConfig.androidUrl
      }, {
        icon: require('@/assets/login/ios.png'),
        label: 'IOS',
        hover: true,
        hoverIcon: require('@/assets/ios_10.png'),
        hoverLabel: 'AppStore下载',
        url: WKConfig.iOSUrl
      }, {
        icon: require('@/assets/login/windows.png'),
        label: 'Windows',
        hover: false,
        url: WKConfig.winUrl
      }, {
        icon: require('@/assets/login/mac.png'),
        label: 'Mac',
        hover: false,
        url: WKConfig.macUrl
      }]
    }
  },
  computed: {},
  watch: {},
  mounted() {},

  beforeDestroy() {},
  methods: {
    close() {
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.xr-download-dialog {
  &__title {
    text-align: center;
    color: #333;
    font-size: 16px;
  }

  &__body {
    margin-top: 20px;
  }

  .xr-download-cell + .xr-download-cell {
    margin-left: 10px;
  }
}
</style>
