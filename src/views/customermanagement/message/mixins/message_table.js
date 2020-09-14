/** crm自定义列表 公共逻辑 */
import {
  filedGetTableField
} from '@/api/customermanagement/common'
import crmTypeModel from '@/views/customermanagement/model/crmTypeModel'
import {
  crmMessageTodayCustomerAPI,
  crmMessagePromiseAPI,
  crmMessageCheckContractAPI,
  crmMessageCheckReceivablesAPI,
  crmMessageFollowLeadsAPI,
  // crmMessageFollowCustomerAPI,
  crmMessagEndContractAPI,
  crmMessagRemindreceivablesplanAPI,
  crmMessagRemindCustomerAPI,
  crmMessagVisitRemindAPI,
  crmMessageCheckDisputedAPI
} from '@/api/customermanagement/message'
import CheckStatusMixin from '@/mixins/CheckStatusMixin'

export default {
  components: {},
  data() {
    return {
      loading: false, // 加载动画
      tableHeight: document.documentElement.clientHeight - 300, // 表的高度
      list: [],
      fieldList: [],
      currentPage: 1,
      pageSize: 15,
      pageSizes: [15, 30, 45, 60],
      total: 0
    }
  },

  mixins: [CheckStatusMixin],

  computed: {
    // 展示options下拉选择
    showOptions() {
      // if (this.infoType == 'putInPoolRemind' || this.infoType == 'returnVisitRemind') {
      //   return false
      // }
      // return true
      return [
        'todayCustomer'
      ].includes(this.infoType)
    }
  },

  mounted() {
    this.$bus.on('message-scroll', tableHeight => {
      this.tableHeight = tableHeight
    })

    this.$bus.on('examine-handle-bus', () => {
      console.log('监听了examine-handle-bus事件')

      this.getList()
    })

    /** 控制table的高度 */
    window.onresize = () => {
      this.updateTableHeight()
    }
  },

  methods: {
    /**
     * 当某一行被点击时会触发该事件
     * @param {*} row
     * @param {*} column
     * @param {*} event
     */
    handleRowClick(row, column, event) {
      if (this.crmType === 'leads') {
        if (column.property === 'leadsName') {
          this.rowID = row.leadsId
          this.rowType = 'leads'
          this.showDview = true
        } else {
          this.showDview = false
        }
      } else if (this.crmType === 'customer') {
        if (['leadsNumber', 'customerName'].includes(column.property)) {
          this.rowID = row.customerId
          this.rowType = 'customer'
          this.showDview = true
        } else {
          this.showDview = false
        }
      } else if (this.crmType === 'contacts') {
        if (column.property === 'customerName') {
          this.rowID = row.customerId
          this.rowType = 'customer'
          this.showDview = true
        } else if (column.property === 'name') {
          this.rowID = row.contactsId
          this.rowType = 'contacts'
          this.showDview = true
        } else {
          this.showDview = false
        }
      } else if (this.crmType === 'business') {
        if (column.property === 'customerName') {
          this.rowID = row.customerId
          this.rowType = 'customer'
          this.showDview = true
        } else if (column.property === 'businessName') {
          this.rowID = row.businessId
          this.rowType = 'business'
          this.showDview = true
        } else {
          this.showDview = false
        }
      } else if (this.crmType === 'contract') {
        if (column.property === 'customerName') {
          this.rowID = row.customerId
          this.rowType = 'customer'
          this.showDview = true
        } else if (column.property === 'businessName') {
          this.rowID = row.businessId
          this.rowType = 'business'
          this.showDview = true
        } else if (column.property === 'contactsName') {
          this.rowID = row.contactsId
          this.rowType = 'contacts'
          this.showDview = true
        } else if (column.property === 'num') {
          this.rowID = row.contractId
          this.rowType = 'contract'
          this.showDview = true
        } else {
          this.showDview = false
        }
      } else if (this.crmType === 'product') {
        if (column.property === 'name') {
          this.rowID = row.productId
          this.showDview = true
        } else {
          this.showDview = false
        }
      } else if (this.crmType === 'receivables') {
        if (column.property === 'customerName') {
          this.rowID = row.customerId
          this.rowType = 'customer'
          this.showDview = true
        } else if (column.property === 'contractNum') {
          this.rowID = row.contractId
          this.rowType = 'contract'
          this.showDview = true
        } else if (column.property === 'number') {
          this.rowID = row.receivablesId
          this.rowType = 'receivables'
          this.showDview = true
        } else {
          this.showDview = false
        }
      } else if (this.crmType === 'receivables_plan') {
        if (column.property === 'customerName') {
          this.rowID = row.customerId
          this.rowType = 'customer'
          this.showDview = true
        } else if (column.property === 'contractNum' || column.property === 'contractName') {
          this.rowID = row.contractId
          this.rowType = 'contract'
          this.showDview = true
        } else {
          this.showDview = false
        }
      }
    },

    /** 获取列表数据 */
    getList(loading = true) {
      const crmIndexRequest = this.getIndexRequest()
      if (!crmIndexRequest) return
      this.loading = loading
      const params = {
        page: this.currentPage,
        limit: this.pageSize,
        isSub: this.isSubType
      }
      if (this.infoType === 'disputed') {
        params.type = 23
      }
      if (this.showOptions) {
        params.type = this.optionsType
      }

      const filterObj = this.filterObj.obj
      if (filterObj && Object.keys(filterObj).length > 0) {
        params.data = filterObj
      }

      crmIndexRequest(params)
        .then(res => {
          this.list = res.data.list
          this.total = res.data.totalRow

          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    },

    /** 获取列表请求 */
    getIndexRequest() {
      return {
        'todayCustomer': crmMessageTodayCustomerAPI,
        'followCustomer': crmMessagePromiseAPI,
        'followLeads': crmMessageFollowLeadsAPI,
        // 'followCustomer': crmMessageFollowCustomerAPI,
        'checkContract': crmMessageCheckContractAPI,
        'checkReceivables': crmMessageCheckReceivablesAPI,
        'remindReceivablesPlan': crmMessagRemindreceivablesplanAPI,
        'endContract': crmMessagEndContractAPI,
        'putInPoolRemind': crmMessagRemindCustomerAPI,
        'returnVisitRemind': crmMessagVisitRemindAPI,
        'disputed': crmMessageCheckDisputedAPI
      }[this.infoType]
    },

    /** 获取字段 */
    getFieldList() {
      if (this.crmType == 'receivables_plan') {
        const list = [{
          fieldName: 'num',
          formType: 'text',
          name: '期数'
        },
        {
          fieldName: 'customerName',
          formType: 'customerName',
          name: '客户名称'
        },
        {
          fieldName: 'contractNum',
          formType: 'contractNum',
          name: '合同编号'
        },
        {
          fieldName: 'money',
          formType: 'text',
          name: '计划回款金额'
        },
        {
          fieldName: 'returnDate',
          formType: 'text',
          name: '计划回款日期'
        },
        {
          fieldName: 'returnType',
          formType: 'text',
          name: '计划回款方式'
        },
        {
          fieldName: 'remind',
          formType: 'text',
          name: '提前几日提醒'
        },
        {
          fieldName: 'remark',
          formType: 'text',
          name: '备注'
        }
        ]
        this.handelFieldList(list)
        // 获取好字段开始请求数据
        this.getList()
        return
      }

      filedGetTableField({
        label: crmTypeModel[this.crmType]
      })
        .then(res => {
          this.handelFieldList(res.data)

          // 获取好字段开始请求数据
          this.getList()
        })
        .catch(() => {
          this.loading = false
        })
    },

    handelFieldList(list) {
      for (let index = 0; index < list.length; index++) {
        const element = list[index]
        var width = 0
        if (!element.width) {
          if (element.name && element.name.length <= 6) {
            width = element.name.length * 15 + 45
          } else {
            width = 140
          }
        } else {
          if (['leadsNumber', 'mobile', 'telephone', 'gradeName', 'followUpTime', 'nextTime', 'visitTime', 'promisedVisitTime', 'createTime', 'updateTime'].includes(element.fieldName)) {
            width = {
              leadsNumber: 140,
              mobile: 135,
              telephone: 135,
              gradeName: 80,
              followUpTime: 150,
              nextTime: 150,
              visitTime: 150,
              promisedVisitTime: 150,
              createTime: 150,
              updateTime: 150
            }[element.fieldName]
          } else {
            width = element.width
          }
        }

        this.fieldList.push({
          prop: element.fieldName,
          label: element.name,
          width: width
        })
      }

      // // 待进入公海的客户 添加距进入公海天数字段
      // if (this.infoType == 'putInPoolRemind') {
      //   this.fieldList.push({
      //     prop: 'poolDay',
      //     label: '距进入公海天数',
      //     width: 140
      //   })
      // }
    },

    /** 格式化字段 */
    fieldFormatter(row, column) {
      // 如果需要格式化
      return row[column.property] === '' || row[column.property] === null ? '--' : row[column.property]
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
      return {
        backgroundColor: this.getStatusColor(status)
      }
    },

    /**
     * 更新表高
     */
    updateTableHeight() {
      var offsetHei = document.documentElement.clientHeight
      var removeHeight = Object.keys(this.filterObj).length > 0 ? 360 : 300
      this.tableHeight = offsetHei - removeHeight
    }
  },

  beforeDestroy() {
    this.$bus.off('message-scroll')
    this.$bus.off('examine-handle-bus')

    if (document.getElementById('crm-table')) {
      document.getElementById('crm-table').removeEventListener('click', e => {
        e.stopPropagation()
      })
    }
  }
}
