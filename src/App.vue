<template>
  <div id="app">
    <router-view class="router-view" />
    <vue-picture-viewer
      v-if="showPreviewImg"
      :img-data="previewImgs"
      :select-index="previewIndex"
      @close-viewer="showPreviewImg=false"/>
    <xr-import
      v-if="showFixImport"
      :process-status="crmImportStatus"
      @click.native="fixImportClick"/>
    <c-r-m-import
      :show.sync="showCRMImport"
      :crm-type="crmType"
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


export default {
  name: 'App',
  components: {
    VuePictureViewer,
    XrImport,
    CRMImport
  },
  mixins: [XrImportMixins],
  data() {
    return {
      showPreviewImg: false,
      previewIndex: 0,
      previewImgs: []
    }
  },
  computed: {
    ...mapGetters(['activeIndex'])
  },
  watch: {
    $route(to, from) {
      this.showPreviewImg = false // 切换页面隐藏图片预览
      if (to.meta.menuIndex) {
        this.$store.commit('SET_ACTIVEINDEX', to.meta.menuIndex)
      } else {
        this.$store.commit('SET_ACTIVEINDEX', to.path)
      }
    }
  },
  mounted() {
    this.addBus()
  },
  methods: {
    addBus() {
      var self = this
      this.$bus.on('preview-image-bus', function(data) {
        self.previewIndex = data.index
        self.previewImgs = data.data
        self.showPreviewImg = true
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
}
</style>
