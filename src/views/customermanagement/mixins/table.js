/** crm自定义列表 公共逻辑 */
import {
  mapGetters
} from 'vuex'
import crmTypeModel from '@/views/customermanagement/model/crmTypeModel'
import CRMListHead from '../components/CRMListHead'
import CRMTableHead from '../components/CRMTableHead'
import FieldSet from '../components/fieldSet'
import {
  filedGetTableField,
  filedGetPoolTableField,
  crmFieldColumnWidth,
  crmPoolFieldColumnWidth
} from '@/api/customermanagement/common'
import {
  crmCustomerIndex,
  crmCustomerPool,
  crmCustomerExcelAllExport,
  crmCustomerPoolExcelAllExport,
  crmCustomerStarAPI
} from '@/api/customermanagement/customer'
import {
  crmInsideUserIndex,
  CrmInsideUserExcelAllExport
} from '@/api/customermanagement/address'
import {
  crmAccountExcelAllExport
} from '@/api/customermanagement/account'
import { crmAccountIndex } from '@/api/customermanagement/account'
import {
  crmAppletIndexAPI,
  CrmWeixinLeadsExportLeadsAPI
} from '@/api/customermanagement/applet'
import {
  crmLeadsIndex,
  crmLeadsExcelAllExport,
  crmLeadsStarAPI
} from '@/api/customermanagement/clue'
import {
  crmContactsIndex,
  crmContactsExcelAllExport,
  crmContactsStarAPI
} from '@/api/customermanagement/contacts'
import {
  crmBusinessIndex,
  crmBusinessExcelAllExportAPI,
  crmBusinessStarAPI
} from '@/api/customermanagement/business'
import {
  crmContractIndex,
  crmContractExcelAllExportAPI
} from '@/api/customermanagement/contract'
import {
  crmProductIndex,
  crmProductExcelAllExport
} from '@/api/customermanagement/product'
import {
  crmproductSetMealIndex,
  crmProductSetMealExcelAllExport
} from '@/api/customermanagement/meal'
import {
  crmReceivablesIndex,
  crmReceivablesExcelAllExportAPI
} from '@/api/customermanagement/money'
import {
  crmMarketingIndexAPI
} from '@/api/customermanagement/marketing'
import {
  crmReturnVisitIndexAPI
} from '@/api/customermanagement/visit'
import {
  crmReceiveIndex,
  crmReceiveExcelAllExport
} from '@/api/customermanagement/receive'


import Lockr from 'lockr'
import { Loading } from 'element-ui'
import CheckStatusMixin from '@/mixins/CheckStatusMixin'
import { separator } from '@/filters/vue-numeral-filter/filters'

export default {
  components: {
    CRMListHead,
    CRMTableHead,
    FieldSet
  },
  data() {
    return {
      loading: false, // 加载动画
      tableHeight: document.documentElement.clientHeight - 235, // 表的高度
      list: [],
      fieldList: [],
      sortData: {}, // 字段排序
      currentPage: 1,
      pageSize: Lockr.get('crmPageSizes') || 15,
      pageSizes: [15, 30, 60, 100],
      total: 0,
      search: '', // 搜索内容
      /** 控制详情展示 */
      rowID: '', // 行信息
      rowType: '', // 详情类型
      showDview: false,
      /** 高级筛选 */
      filterObj: {}, // 筛选确定数据
      sceneId: '', // 场景筛选ID
      sceneName: '', // 场景名字
      /** 勾选行 */
      selectionList: [], // 勾选数据 用于全局导出
      // 金额字段
      moneyFields: [],

      clickField: '' // 点击列表字段名称
    }
  },

  mixins: [CheckStatusMixin],

  computed: {
    ...mapGetters(['crm'])
  },
  watch: {
    showDview() {
      const callOutData = JSON.parse(localStorage.getItem('callOutData'))
      if (callOutData) {
        this.modelData = {
          modelId: callOutData.id,
          model: callOutData.type
        }
      }
    }
  },
  mounted() {
    /** 控制table的高度 */
    window.onresize = () => {
      this.updateTableHeight()
    }
    // document.getElementById('crm-table').addEventListener('click', e => {
    //   e.stopPropagation()
    // })
    if (!this.isSeas) {
      if (this.crmType === 'applet') {
        this.getFieldList()
      } else if (this.crmType === 'marketing') {
        if (this.crm[this.crmType].index) {
          this.getList()
        }
      } else if (this.crm[this.crmType].index) {
        this.loading = true
      }
    }
  },

  methods: {
    /** 获取列表数据 */
    getList() {
      this.loading = true
      var crmIndexRequest = this.getIndexRequest()
      const keytype = this.crmType == 'student' ? 'customer' : this.crmType
      let params = {
        page: this.currentPage,
        limit: this.pageSize,
        search: this.search,
        type: this.isSeas ? crmTypeModel.pool : crmTypeModel[keytype] // 9是公海
      }
      if (this.sortData.order) {
        params.sortField = this.sortData.prop
        params.order = this.sortData.order == 'ascending' ? 2 : 1
      }
      if (this.crmType === 'applet') {
        params.type = this.appletType
      }
      if (this.sceneId) {
        params.sceneId = this.sceneId
      }

      // 活动关联对象
      if (this.marketingCrmType) {
        params.crmType = this.marketingCrmType
      }

      // 公海切换
      if (this.poolId) {
        params.poolId = this.poolId
      }

      if (this.filterObj && Object.keys(this.filterObj).length > 0) {
        console.log('DSAD')
        params.data = this.filterObj
      }
      if (this.getOtherParams && typeof this.getOtherParams === 'function') {
        params = {
          ...params,
          ...this.getOtherParams()
        }
      }

      // console.log('传递给后端的数据', params)

      crmIndexRequest(params)
        .then(res => {
          if (this.crmType === 'customer') {
            this.list = res.data.list.map(element => {
              element.show = false // 控制列表商机展示
              return element
            })
          } else {
            if (this.crmType === 'contract' ||
              this.crmType === 'receivables' ||
              this.crmType === 'business') {
              // 合同/回款列表展示金额信息
              this.moneyData = res.data.money
            }
            this.list = res.data.list
          }

          if (res.data.totalRow && Math.ceil(res.data.totalRow / this.pageSize) < this.currentPage && this.currentPage > 1) {
            this.currentPage = this.currentPage - 1
            this.getList()
          } else {
            this.total = res.data.totalRow
            this.loading = false
          }

          this.$nextTick(() => {
            document.querySelector('.el-table__body-wrapper').scrollTop = 1
          })
        })
        .catch(() => {
          this.loading = false
        })
    },
    /** 获取列表请求 */
    getIndexRequest() {
      if (this.crmType === 'leads') {
        return crmLeadsIndex
      } else if (this.crmType === 'applet') {
        return crmAppletIndexAPI
      } else if (this.crmType === 'customer' || this.crmType == 'student') {
        if (this.isSeas) {
          return crmCustomerPool
        } else {
          return crmCustomerIndex
        }
      } else if (this.crmType === 'contacts') {
        return crmContactsIndex
      } else if (this.crmType === 'business') {
        return crmBusinessIndex
      } else if (this.crmType === 'contract') {
        return crmContractIndex
      } else if (this.crmType === 'product') {
        return crmProductIndex
      } else if (this.crmType == 'productSetMeal') {
        return crmproductSetMealIndex
      } else if (this.crmType === 'receivables') {
        return crmReceivablesIndex
      } else if (this.crmType === 'marketing') {
        return crmMarketingIndexAPI
      } else if (this.crmType === 'visit') {
        return crmReturnVisitIndexAPI
      } else if (this.crmType === 'capitalAccount') {
        return crmAccountIndex
      } else if (this.crmType === 'insideUser') {
        return crmInsideUserIndex
      } else if (this.crmType == 'receive') {
        return crmReceiveIndex
      }
    },
    /** 获取字段 */
    getFieldList(force) {
      if (this.crmType === 'applet') {
        this.fieldList = [
          { prop: 'weixinName', label: '微信名称', width: '115px' },
          { prop: 'weixinImg', label: '头像', width: '115px' },
          { prop: 'mobile', label: '手机号', width: '115px' },
          { prop: 'ownerUserName', label: '负责人', width: '115px' },
          { prop: 'createTime', label: '创建时间', width: '115px' },
          { prop: 'isTransform', label: '是否转化' }
        ]
        this.getList()
        return
      }
      if (this.fieldList.length == 0 || force) {
        this.loading = true

        const params = {}
        if (this.isSeas) {
          if (this.poolId) {
            params.poolId = this.poolId
          }
        } else {
          params.label = this.crmType == 'student' ? 19 : crmTypeModel[this.crmType]
        }

        const request = this.isSeas ? filedGetPoolTableField : filedGetTableField
        request(params)
          .then(res => {
            console.log('请求的自动', res)
            const fieldList = []
            const moneyFields = []
            if (this.crmType == 'contract') {
              this.baseList = res.data
            }
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
                if ([
                  'leadsNumber',
                  'mobile',
                  'telephone',
                  'gradeName',
                  'followUpTime',
                  'nextTime',
                  'visitTime',
                  'promisedVisitTime',
                  'channelIdName',
                  'leadsStatus',
                  'createTime',
                  'customerType',
                  'followUpText',
                  'signUpPossibility',
                  'introducerTypeName',
                  'leadsRegistrantName',
                  'seaDays',
                  'updateTime'].includes(element.fieldName)) {
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
                    updateTime: 150,
                    channelIdName: 120,
                    leadsStatus: 115,
                    customerType: 80,
                    followUpText: 130,
                    signUpPossibility: 120,
                    introducerTypeName: 110,
                    leadsRegistrantName: 120,
                    seaDays: 135
                  }[element.fieldName]
                } else {
                  width = element.width
                }
              }

              // 金额字段 需要格式化
              if (element.formType === 'floatnumber') {
                moneyFields.push(element.fieldName || '')
              }

              fieldList.push({
                prop: element.fieldName,
                label: element.name,
                width: width
              })
            }

            this.moneyFields = moneyFields
            this.fieldList = fieldList
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
    fieldFormatter(row, column, cellValue) {
      if (this.moneyFields.includes(column.property)) {
        return separator(row[column.property] || 0)
      }
      // 如果需要格式化
      if (column.property === 'isTransform') {
        return ['否', '是'][cellValue] || '--'
      } else if (column.property === 'contractType') {
        return {
          1: '购买',
          2: '赠送'
        }[row[column.property]]
      } else if (column.property === 'isEarlyRetirement') {
        return {
          0: '否',
          1: '是',
          null: ''
        }[row[column.property]]
      } else if (column.property === 'isNew') {
        return {
          0: '续签',
          1: '新签',
          2: '引流'
        }[row[column.property]]
      } else if (column.property === 'contractStatus') {
        return {
          1: '申请中',
          2: '放弃',
          3: '合同完成',
          4: '合同变更中',
          5: '执行中',
          6: '草稿',
          7: '合同充值返还',
          8: '确认放弃'
        }[row[column.property]]
      }

      if (this.crmType == 'receive') {
        if (column.property === 'payment') {
          return {
            1: '现金交易',
            2: '刷卡交易',
            3: '支票交易',
            4: '微信交易',
            5: '支付宝交易',
            6: '转账交易'
          }[row[column.property]]
        } else if (column.property === 'checkStatus') {
          return {
            0: '待审核',
            1: '通过',
            2: '拒绝',
            3: '审核中',
            4: '撤回',
            5: '未提交',
            6: '创建 ',
            7: '已删除',
            8: '作废'
          }[row[column.property]]
        }
      }

      if (this.crmType == 'contract') {
        if (column.property === 'orderDate') {
          return row[column.property].slice(0, 10)
        }
      }
      return row[column.property] === '' || row[column.property] === null ? '--' : row[column.property]
    },
    /** */
    /** */
    /** 搜索操作 */
    crmSearch(value) {
      this.currentPage = 1
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
        if (column.property === 'leadsName') {
          this.rowID = row.leadsId
          this.rowType = 'leads'
          this.showDview = true
        } else {
          this.showDview = false
        }
      } else if (this.crmType === 'customer') {
        if (column.property === 'businessCheck' && row.businessCount > 0) {
          return // 列表查看商机不展示详情
        }
        // if (column.property === 'leadsNumber') {
        // , 'customerName'
        if (['leadsNumber', 'customerName'].includes(column.property) && !this.isSeas) {
          this.rowID = row.customerId
          this.rowType = 'customer'
          this.showDview = true
        } else {
          // console.log('b')
          this.showDview = false
        }
      } else if (this.crmType === 'student') {
        if (['leadsNumber', 'customerName'].includes(column.property) && !this.isSeas) {
          this.rowID = row.customerId
          this.clickField = column.property
          this.rowType = 'student'
          this.showDview = true
        } else {
          this.showDview = false
        }
      } else if (this.crmType == 'capitalAccount') {
        if (column.property == 'accountNumber') {
          this.rowID = row.capitalId
          this.clickField = column.property
          this.rowType = 'capitalAccount'
          this.showDview = true
        } else if (column.property == 'customerName') {
          this.rowID = row.customerId
          this.clickField = column.property
          this.rowType = 'student'
          this.showDview = true
        } else if (column.property == 'leadsNumber') {
          this.rowID = row.customerId
          this.clickField = column.property
          this.rowType = 'student'
          this.showDview = true
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
        if (column.property === 'num') {
          this.rowID = row.contractId
          this.rowType = 'contract'
          this.clickField = column.property
          this.showDview = true
        } else if (column.property === 'customerName') {
          this.rowID = row.customerId
          this.rowType = 'customer'
          this.clickField = column.property
          this.showDview = true
        } else if (column.property === 'leadsNumber') {
          this.rowID = row.customerId
          this.rowType = 'student'
          this.clickField = column.property
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
      } else if (this.crmType === 'productSetMeal') {
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
      } else if (this.crmType == 'marketing') {
        if (column.property === 'marketingName') {
          this.rowID = row.marketingId
          this.rowType = 'marketing'
          this.showDview = true
        } else {
          this.showDview = false
        }
      } else if (this.crmType == 'visit') {
        if (column.property === 'visitNumber') {
          this.rowID = row.visitId
          this.rowType = 'visit'
          this.showDview = true
        } else if (column.property === 'customerName') {
          this.rowID = row.customerId
          this.rowType = 'customer'
          this.showDview = true
        } else if (column.property === 'contractNum') {
          this.rowID = row.contractId
          this.rowType = 'contract'
          this.showDview = true
        } else if (column.property === 'contactsName') {
          this.rowID = row.contactsId
          this.rowType = 'contacts'
          this.showDview = true
        } else {
          this.showDview = false
        }
      } else if (this.crmType == 'receive') {
        if (column.property === 'number') {
          this.rowID = row.contractCapitalId
          this.rowType = 'receive'
          this.clickField = column.property
          this.showDview = true
        } else if (column.property === 'leadsNumber' || column.property === 'customerName') {
          this.rowID = row.customerId
          this.rowType = 'student'
          this.clickField = column.property
          this.showDview = true
        } else if (column.property === 'contractNum') {
          this.rowID = row.contractId
          this.rowType = 'contract'
          this.clickField = 'num'
          this.showDview = true
        }
      }

      if (this.showDview) {
        this.$store.commit('SET_COLLAPSE', this.showDview)
      }
    },
    /**
     * 导出 线索 客户 联系人 产品
     * @param {*} data
     */
    // 导出操作
    exportInfos() {
      var params = {
        search: this.search
      }
      if (this.crmType == 'applet') {
        params.type = this.appletType
      }
      if (this.sceneId) {
        params.sceneId = this.sceneId
      }
      if (this.filterObj && Object.keys(this.filterObj).length > 0) {
        params.data = this.filterObj
      }
      let request
      // 公海的请求
      if (this.isSeas) {
        request = crmCustomerPoolExcelAllExport
        params.poolId = this.poolId
      } else {
        const keytype = this.crmType === 'student' ? 'customer' : this.crmType
        request = {
          customer: crmCustomerExcelAllExport,
          capitalAccount: crmAccountExcelAllExport,
          leads: crmLeadsExcelAllExport,
          contacts: crmContactsExcelAllExport,
          applet: CrmWeixinLeadsExportLeadsAPI,
          business: crmBusinessExcelAllExportAPI,
          contract: crmContractExcelAllExportAPI,
          receivables: crmReceivablesExcelAllExportAPI,
          product: crmProductExcelAllExport,
          productSetMeal: crmProductSetMealExcelAllExport,
          insideUser: CrmInsideUserExcelAllExport,
          receive: crmReceiveExcelAllExport
        }[keytype]
      }
      const loading = Loading.service({ fullscreen: true, text: '导出中...' })
      request(params)
        .then(res => {
          var blob = new Blob([res.data], {
            type: 'application/vnd.ms-excel;charset=utf-8'
          })
          var downloadElement = document.createElement('a')
          var href = window.URL.createObjectURL(blob) // 创建下载的链接
          downloadElement.href = href
          downloadElement.download =
            decodeURI(
              res.headers['content-disposition'].split('filename=')[1]
            ) || '' // 下载后文件名
          document.body.appendChild(downloadElement)
          downloadElement.click() // 点击下载
          document.body.removeChild(downloadElement) // 下载完成移除元素
          window.URL.revokeObjectURL(href) // 释放掉blob对象
          loading.close()
        })
        .catch(() => {
          loading.close()
        })
    },
    /** 筛选操作 */
    handleFilter(data) {
      this.filterObj = data
      var offsetHei = document.documentElement.clientHeight
      var removeHeight = Object.keys(this.filterObj).length > 0 ? 295 : 235
      this.tableHeight = offsetHei - removeHeight
      this.currentPage = 1
      console.log('进行筛选')
      this.getList()
    },
    /** 场景操作 */
    handleScene(data) {
      this.sceneId = data.id
      this.sceneName = data.name
      this.currentPage = 1
      this.getFieldList()
    },
    /** 勾选操作 */
    handleHandle(data) {
      if ([
        'alloc',
        'assignHeadTeacher',
        'get',
        'transfer',
        'transform',
        'delete',
        'put_seas',
        'exit-team',
        'give_up',
        'confirm_give_up'
      ].includes(data.type)) {
        this.showDview = false
      }

      this.getList()
    },
    /** 自定义字段管理 */
    setSave() {
      this.getFieldList(true)
    },
    /** */
    /** 页面头部操作 */
    listHeadHandle(data) {
      if (data.type === 'save-success' || data.type === 'import-crm') {
        // 重新请求第一页数据
        this.currentPage = 1
        this.getList()
      }
    },
    /**
     * 字段排序
     */
    sortChange(column, prop, order) {
      this.currentPage = 1
      this.sortData = column
      this.getList()
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
        let request = null
        const params = {
          field: column.property,
          width: newWidth
        }

        if (this.isSeas) {
          if (!this.poolId) {
            return
          }
          request = crmPoolFieldColumnWidth
          params.poolId = this.poolId
        } else {
          request = crmFieldColumnWidth
          params.types = `crm_${this.crmType}`
        }

        request(params)
          .then(res => {
          })
          .catch(() => { })
      }
    },
    // 更改每页展示数量
    handleSizeChange(val) {
      Lockr.set('crmPageSizes', val)
      this.pageSize = val
      this.getList()
    },
    // 更改当前页数
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    // 0待审核、1审核中、2审核通过、3已拒绝 4已撤回 5未提交
    getStatusStyle(status) {
      return {
        backgroundColor: this.getStatusColor(status)
      }
    },

    /**
     * 切换关注状态
     * @param index
     * @param status
     */
    toggleStar(data) {
      this.loading = true

      const request = {
        leads: crmLeadsStarAPI,
        customer: crmCustomerStarAPI,
        contacts: crmContactsStarAPI,
        business: crmBusinessStarAPI
      }[this.crmType]

      const params = {}
      params[`${this.crmType}Id`] = data[`${this.crmType}Id`]

      request(params).then(() => {
        this.loading = false
        this.$message.success(data.star > 0 ? '取消关注成功' : '关注成功')
        data.star = data.star > 0 ? 0 : 1
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * 更新表高
     */
    updateTableHeight() {
      var offsetHei = document.documentElement.clientHeight
      var removeHeight = Object.keys(this.filterObj).length > 0 ? 285 : 235
      this.tableHeight = offsetHei - removeHeight
    }
  },

  beforeDestroy() { }
}
