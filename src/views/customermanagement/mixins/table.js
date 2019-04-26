/** crm自定义列表 公共逻辑 */
import {
  mapGetters
} from 'vuex'
import crmTypeModel from '@/views/customermanagement/model/crmTypeModel'
import CRMListHead from '../components/CRMListHead'
import CRMTableHead from '../components/CRMTableHead'
import FieldsSet from '../components/fieldsManager/FieldsSet'
import {
  filedGetTableField,
  crmSceneIndex,
  crmFieldColumnWidth,
  crmMainIndex
} from '@/api/customermanagement/common'

export default {
  components: {
    CRMListHead,
    CRMTableHead,
    FieldsSet
  },
  data() {
    return {
      loading: false, // 加载动画
      tableHeight: document.documentElement.clientHeight - 240, // 表的高度
      list: [],
      fieldList: [],
      currentPage: 1,
      pageSize: 15,
      pageSizes: [15, 30, 45, 60],
      total: 0,
      search: '', // 搜索内容
      /** 控制详情展示 */
      rowID: '', // 行信息
      rowType: '', //详情类型
      showDview: false,
      /** 格式化规则 */
      formatterRules: {},
      /** 高级筛选 */
      filterObj: {}, // 筛选确定数据
      scene_id: '', // 场景筛选ID
      scene_name: '', // 场景名字
      /** 列表展示字段管理 */
      showFieldSet: false,
      /** 勾选行 */
      selectionList: [] // 勾选数据 用于全局导出
    }
  },

  computed: {
    ...mapGetters(['crm'])
  },

  mounted() {
    var self = this
    /** 控制table的高度 */
    window.onresize = function () {
      var offsetHei = document.documentElement.clientHeight
      var removeHeight = Object.keys(self.filterObj).length > 0 ? 310 : 240
      self.tableHeight = offsetHei - removeHeight
    }
    // document.getElementById('crm-table').addEventListener('click', e => {
    //   e.stopPropagation()
    // })
    if (this.crm[this.crmType].index) {
      if (this.isSeas) {
        this.getFieldList()
      } else {
        this.loading = true
      }
    }
  },

  methods: {
    /** 获取列表数据 */
    getList() {
      this.loading = true
      var params = {
        page: this.currentPage,
        limit: this.pageSize,
        search: this.search,
        type: this.isSeas ? 8 : crmTypeModel[this.crmType] // 8是公海
      }
      if (this.scene_id) {
        params.scene_id = this.scene_id
      }
      if (this.filterObj && Object.keys(this.filterObj).length > 0) {
        params.data = this.filterObj
      }
      crmMainIndex(params)
        .then(res => {
          if (this.crmType === 'customer') {
            this.list = res.data.list.map(element => {
              element.show = false // 控制列表商机展示
              return element
            })
          } else {
            this.list = res.data.list
          }

          this.total = res.data.totalRow

          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },
    /** 获取字段 */
    getFieldList() {
      if (this.fieldList.length == 0) {
        this.loading = true
        filedGetTableField({
            label: this.isSeas ? 8 : crmTypeModel[this.crmType] // 8 是公海
          })
          .then(res => {
            for (let index = 0; index < res.data.length; index++) {
              const element = res.data[index]

              var width = 0
              if (!element.width) {
                if (element.name && element.name.length <= 6) {
                  width = element.name.length * 15 + 45
                } else {
                  width = 140
                }
              } else {
                width = element.width
              }

              this.fieldList.push({
                prop: element.fieldName,
                label: element.name,
                width: width
              })
            }

            // 获取好字段开始请求数据
            this.getList()
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        // 获取好字段开始请求数据
        this.getList()
      }
    },
    /** 格式化字段 */
    fieldFormatter(row, column) {
      // 如果需要格式化
      var aRules = this.formatterRules[column.property]
      if (aRules) {
        if (aRules.type === 'crm') {
          if (column.property) {
            return aRules.formatter(row[column.property + '_info'])
          } else {
            return ''
          }
        } else {
          return aRules.formatter(row[column.property])
        }
      }
      return row[column.property]
    },
    /** */
    /** */
    /** 搜索操作 */
    crmSearch(value) {
      this.search = value
      if (this.fieldList.length) {
        this.getList()
      }
    },
    /** 列表操作 */
    // 当某一行被点击时会触发该事件
    handleRowClick(row, column, event) {
      if (column.type === 'selection') {
        return // 多选布局不能点击
      }
      if (this.crmType === 'leads') {
        this.rowID = row.leads_id
        this.showDview = true
      } else if (this.crmType === 'customer') {
        if (column.property === 'business-check' && row.business_count > 0) {
          return // 列表查看商机不展示详情
        }
        this.rowID = row.customer_id
        this.rowType = 'customer'
        this.showDview = true
      } else if (this.crmType === 'contacts') {
        if (column.property === 'customer_name') {
          this.rowID = row.customer_id
          this.rowType = 'customer'
        } else {
          this.rowID = row.contacts_id
          this.rowType = 'contacts'
        }
        this.showDview = true
      } else if (this.crmType === 'business') {
        if (column.property === 'customer_name') {
          this.rowID = row.customer_id
          this.rowType = 'customer'
        } else {
          this.rowID = row.business_id
          this.rowType = 'business'
        }
        this.showDview = true
      } else if (this.crmType === 'contract') {
        if (column.property === 'customer_name') {
          this.rowID = row.customer_id
          this.rowType = 'customer'
        } else if (column.property === 'business_name') {
          this.rowID = row.business_id
          this.rowType = 'business'
        } else if (column.property === 'contacts_name') {
          this.rowID = row.contacts_id
          this.rowType = 'contacts'
        } else {
          this.rowID = row.contract_id
          this.rowType = 'contract'
        }
        this.showDview = true
      } else if (this.crmType === 'product') {
        this.rowID = row.product_id
        this.showDview = true
      } else if (this.crmType === 'receivables') {
        if (column.property === 'customer_name') {
          this.rowID = row.customer_id
          this.rowType = 'customer'
        } else if (column.property === 'contract_num') {
          this.rowID = row.contract_id
          this.rowType = 'contract'
        } else {
          this.rowID = row.receivables_id
          this.rowType = 'receivables'
        }
        this.showDview = true
      }
    },
    /** 筛选操作 */
    handleFilter(data) {
      this.filterObj = data
      var offsetHei = document.documentElement.clientHeight
      var removeHeight = Object.keys(this.filterObj).length > 0 ? 310 : 240
      this.tableHeight = offsetHei - removeHeight
      this.getList()
    },
    /** 场景操作 */
    handleScene(data) {
      this.scene_id = data.id
      this.scene_name = data.name
      this.currentPage = 1
      this.getFieldList()
    },
    /** 勾选操作 */
    handleHandle(data) {
      if (data.type === 'alloc' || data.type === 'get' || data.type === 'transfer' || data.type === 'transform' || data.type === 'delete') {
        this.showDview = false
      }
      this.getList()
    },
    /** 自定义字段管理 */
    setSave() {
      this.fieldList = []
      this.getFieldList()
    },
    /** */
    /** 页面头部操作 */
    listHeadHandle(data) {
      if (data.type === 'save-success') {
        // 重新请求第一页数据
        this.currentPage = 1
        this.getList()
      }
    },
    // 设置点击
    handleTableSet() {
      this.showFieldSet = true
    },
    /** 勾选操作 */
    // 当选择项发生变化时会触发该事件
    handleSelectionChange(val) {
      this.selectionList = val // 勾选的行
      this.$refs.crmTableHead.headSelectionChange(val)
    },
    // 当拖动表头改变了列的宽度的时候会触发该事件
    handleHeaderDragend(newWidth, oldWidth, column, event) {
      if (column.property) {
        const crmType = this.isSeas ? this.crmType + '_pool' : this.crmType
        crmFieldColumnWidth({
            types: 'crm_' + crmType,
            field: column.property,
            width: newWidth
          })
          .then(res => {
            this.$message({
              type: 'success',
              message: res.data
            })
          })
          .catch(() => {})
      }
    },
    // 更改每页展示数量
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    // 更改当前页数
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    // 0待审核、1审核中、2审核通过、3审核未通过
    getStatusStyle(status) {
      if (status == 0) {
        return {
          'border-color': '#E6A23C',
          'background-color': '#FDF6EC',
          'color': '#E6A23C'
        }
      } else if (status == 1) {
        return {
          'border-color': '#409EFF',
          'background-color': '#ECF5FF',
          'color': '#409EFF'
        }
      } else if (status == 2) {
        return {
          'border-color': '#67C23A',
          'background-color': '#F0F9EB',
          'color': '#67C23A'
        }
      } else if (status == 3) {
        return {
          'border-color': '#F56C6B',
          'background-color': '#FEF0F0',
          'color': '#F56C6B'
        }
      }
    },
    getStatusName(status) {
      if (status == 0) {
        return '待审核'
      } else if (status == 1) {
        return '审核中'
      } else if (status == 2) {
        return '通过'
      } else if (status == 3) {
        return '拒绝'
      }
      return ''
    },
  },

  beforeDestroy() {}
}
