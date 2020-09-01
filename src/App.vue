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
    <!-- <call-out-windows
      :model-data="modelData"
      is-show
      @close="showCall = false"/> -->
    <!-- 转接 -->
    <!-- <refer/> -->
    <el-dialog
      :visible.sync="dialogFormVisible"
      class="refer"
      width="30%"
      title="转接">
      <span>成员</span>
      <xh-user-cell
        radio
        style="z-index:100000000000000000;"
        class="xh-user-cell"
        is-refer
        placeholder="选择员工"
        @value-change="userChange" />
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmRefer()">确 定</el-button>
      </div>
    </el-dialog>
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
import callCenter from './callCenter/callWebSokets'
import XhUserCell from '@/components/CreateCom/XhUserCell'
import cache from '@/utils/cache'


export default {
  name: 'App',
  components: {
    VuePictureViewer,
    XrImport,
    IncomingWindows,
    CallOutWindows,
    CRMImport,
    XhUserCell
  },
  mixins: [XrImportMixins],
  data() {
    return {
      showPreviewImg: false,
      previewIndex: 0,
      showCall: false,
      modelData: {},
      previewImgs: [],
      upgradeDialogShow: false,
      dialogFormVisible: false,
      referUser: [] // 转接的用户
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
    this.$bus.on('showRefer', (data) => {
      console.log(data)
      this.dialogFormVisible = data
    })
  },
  methods: {
    // 确认选择转接人
    confirmRefer() {
      console.log(this.referUser)
      callCenter.OnRefer(1001)
      // if (this.referUser.hardPhone) {
      //   callCenter.OnRefer(this.referUser.hardPhone)
      //   this.dialogFormVisible = false
      // } else {
      //   this.$message.error('没有转接号码')
      // }
    },
    userChange(data) {
      this.referUser = data.value[0] ? data.value[0] : {}
    },
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

<style lang="scss">
#app {
  width: 100%;
  position: relative;
  height: 100%;
  min-width: 1200px;
  min-height: 605px;
}
.refer /deep/.user-container{
     width:400px;
     margin-left:20px;
}
.refer /deep/ .el-dialog__body{
   display: flex;
   align-items: center;
}
</style>
