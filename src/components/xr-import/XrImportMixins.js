export default {
  data() {
    return {
      showCRMImport: false,
      crmType: '',
      crmImportStatus: ''
    }
  },

  mounted() {
    this.addImportBus()
  },

  computed: {
    showFixImport() {
      return this.crmImportStatus && this.crmImportStatus != 'wait'
    }
  },

  methods: {
    addImportBus() {
      this.$bus.on('import-crm-bus', (crmType) => {
        if (this.crmType != crmType && this.showFixImport) {
          this.$message.error('请先处理当前导入的数据')
        } else {
          this.crmType = crmType
          this.showCRMImport = true
        }
      })
    },

    crmImportChange(status) {
      this.crmImportStatus = status
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
