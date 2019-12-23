export default {
  data() {
    return {
      showCRMImport: false,
      crmType: '',
      isSeas: false,
      crmImportStatus: ''
    }
  },

  mounted() {
    this.addImportBus()
  },

  computed: {
    // 1.导入框展示 2.导入状态状态为空或者是等待状态  缩小框不展示
    showFixImport() {
      return !this.showCRMImport && this.crmImportStatus && this.crmImportStatus != 'wait'
    }
  },

  methods: {
    addImportBus() {
      this.$bus.on('import-crm-bus', (crmType, isSeas) => {
        if (this.crmType != crmType && this.showFixImport) {
          this.$message.error('请先处理当前导入的数据')
        } else {
          this.crmType = crmType
          this.isSeas = isSeas
          this.showCRMImport = true
        }
      })
    },

    crmImportChange(status) {
      this.crmImportStatus = this.showCRMImport && status == 'finish' ? '' : status
    },

    fixImportClick() {
      this.showCRMImport = true
    },

    crmImportClose(status) {
      if (status == 'finish') {
        this.crmImportStatus = ''
      }
    }
  }

}
