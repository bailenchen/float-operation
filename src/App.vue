<template>
  <div id="app">
    <router-view class="router-view" />
    <vue-picture-viewer
      v-if="showPreviewImg"
      :img-data="previewImgs"
      :select-index="previewIndex"
      @close-viewer="showPreviewImg=false"/>
    <incoming-windows @sendMsg="getInfo"/>
    <call-out-windows
      :is-show="showOutCall"
      :model-data="modelData"
      @close="showCall = false"/>
    <xr-import
      v-if="showFixImport"
      :process-status="crmImportStatus"
      @click.native="fixImportClick"/>
    <c-r-m-import
      :show.sync="showCRMImport"
      :crm-type="crmType"
      :is-seas="isSeas"
      :is-record="isRecord"
      :cache-show.sync="cacheShow"
      :cache-done="cacheDone"
      @status="crmImportChange"
      @close="crmImportClose"/>
  </div>
</template>

<script>
/** 常用图片预览创建组件 */
import VuePictureViewer from '@/components/vuePictureViewer/index'
import XrImport from '@/components/xr-import'
import XrImportMixins from '@/components/xr-import/XrImportMixins'
import CRMImport from '@/views/customermanagement/components/CRMImport'
import { mapGetters } from 'vuex'
import IncomingWindows from './callCenter/IncomingWindows'
import CallOutWindows from './callCenter/CallOutWindows'
import cache from '@/utils/cache'


export default {
  name: 'App',
  components: {
    VuePictureViewer,
    XrImport,
    IncomingWindows,
    CallOutWindows,
    CRMImport
  },
  mixins: [XrImportMixins],
  data() {
    return {
      showPreviewImg: false,
      previewIndex: 0,
      showCall: false,
      modelData: {},
      previewImgs: [],
      upgradeDialogShow: false
    }
  },
  computed: {
    ...mapGetters(['activeIndex', 'addRouters', 'userInfo']),
    showOutCall() {
      if (this.$store.state.customer.isCall && this.$route.name !== 'login') {
        return this.$store.state.customer.showCallOut
      }
      return false
    }
  },
  watch: {
    $route(to, from) {
      this.showPreviewImg = false // 切换页面隐藏图片预览
    },

    addRouters() {
      if (this.userInfo && this.userInfo.isReadNotice != 1) {
        setTimeout(() => {
          this.upgradeDialogShow = true
        }, 3000)
      }
    }
  },
  mounted() {
    this.addBus()
    this.addDocumentVisibilityChange()
    this.setMinHeight()
  },
  methods: {
    addDocumentVisibilityChange() {
      // 网页当前状态判断
      // hidden,
      var state, visibilityChange
      if (typeof document.hidden !== 'undefined') {
        // hidden = 'hidden'
        visibilityChange = 'visibilitychange'
        state = 'visibilityState'
      } else if (typeof document.mozHidden !== 'undefined') {
        // hidden = 'mozHidden'
        visibilityChange = 'mozvisibilitychange'
        state = 'mozVisibilityState'
      } else if (typeof document.msHidden !== 'undefined') {
        // hidden = 'msHidden'
        visibilityChange = 'msvisibilitychange'
        state = 'msVisibilityState'
      } else if (typeof document.webkitHidden !== 'undefined') {
        // hidden = 'webkitHidden'
        visibilityChange = 'webkitvisibilitychange'
        state = 'webkitVisibilityState'
      }
      // 添加监听器，在title里显示状态变化
      document.addEventListener(visibilityChange, () => {
        if (document[state] == 'visible') {
          cache.updateAxiosHeaders()
        }
        this.$bus.emit('document-visibility', document[state])
      }, false)
    },

    addBus() {
      var self = this
      this.$bus.on('preview-image-bus', function(data) {
        self.previewIndex = data.index
        self.previewImgs = data.data
        self.showPreviewImg = true
      })
    },
    /** 获取呼出信息 */
    getInfo(data) {
      this.modelData = data
    },

    setMinHeight() {
      this.$nextTick(() => {
        const dpr = window.devicePixelRatio || 1
        const clientWidth = document.body.clientWidth
        const dom = document.getElementById('app')
        if (dpr !== 1 && clientWidth > 1600) {
          dom.style.minHeight = '800px'
        } else if (dpr === 1 && clientWidth > 1600) {
          dom.style.minWidth = '1650px'
        } else {
          // dom.style.minWidth = '1200px'
          dom.style.minHeight = '605px'
        }
      })
    }
  }
}
</script>

<style>
#app {
  width: 100%;
  position: relative;
  height: 100%;
  min-width: 1200px;
  min-height: 605px;
}
</style>
