// 邮件内列表 公共逻辑
import {
  mapGetters
} from 'vuex'
import EmailListHead from '../components/EmailListHead'
import EmailTableHead from '../components/EmailTableHead'

import Lockr from 'lockr'

export default {
  components: {
    EmailListHead,
    EmailTableHead
  },
  data() {
    return {
      tableHeight: document.documentElement.clientHeight - 240, // 表的高度
      selectionList: [], // 勾选数据
      currentPage: 1,
      pageSize: Lockr.get('crmPageSizes') || 15,
      pageSizes: [15, 30, 60, 100],
      total: 0,
      rowID: ''

    }
  },
  computed: {
    ...mapGetters(['crm'])
  },
  created() {
    console.log(this.emailType, this.sideNavTitle, 'yxlx')
  },
  methods: {
    /**
     * 勾选列表项
     */
    handleSelectionChange(val) {
      this.selectionList = val
      this.$refs.crmTableHead.headSelectionChange(val)
      console.log(val, 'kk')
    },

    /**
     * 列表操作
     * 点击某一行
     */
    handleRowClick(row, column, event) {
      console.log(row, column, 'lie')
      this.rowID = row.id
      this.showDview = true
    },

    // 更改每页展示数量
    handleSizeChange(val) {
      Lockr.set('crmPageSizes', val)
      this.pageSize = val
      // this.getList()
    },
    // 更改当前页数
    handleCurrentChange(val) {
      this.currentPage = val
      // this.getList()
    },

    /**
     * 关闭详情
     */
    hideView() {
      this.showDview = false
    }
  }
}
