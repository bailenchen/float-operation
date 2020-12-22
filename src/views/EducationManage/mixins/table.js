/** crm自定义列表 公共逻辑 */
import {
  mapGetters
} from 'vuex'
import crmTypeModel from '@/views/customermanagement/model/crmTypeModel'
import CRMListHead from '../../customermanagement/components/CRMListHead'
import CRMTableHead from '../../customermanagement/components/CRMTableHead'

import { crmClassroomIndex, crmClassroomExcelAllExport } from '@/api/educationmanage/classroom'
import {
  crmFieldColumnWidth,
  crmPoolFieldColumnWidth
} from '@/api/customermanagement/common'
import {
  crmCustomerExcelAllExport,
  crmCustomerPoolExcelAllExport
} from '@/api/customermanagement/customer'
import {
  CrmInsideUserExcelAllExport
} from '@/api/customermanagement/address'
import {
  crmAccountExcelAllExport
} from '@/api/customermanagement/account'
import {
  CrmWeixinLeadsExportLeadsAPI
} from '@/api/customermanagement/applet'
import {
  crmLeadsExcelAllExport
} from '@/api/customermanagement/clue'
import {
  crmContactsExcelAllExport
} from '@/api/customermanagement/contacts'
import {
  crmBusinessExcelAllExportAPI
} from '@/api/customermanagement/business'
import {
  crmContractExcelAllExportAPI
} from '@/api/customermanagement/contract'
import {
  crmProductExcelAllExport
} from '@/api/customermanagement/product'
import {
  crmProductSetMealExcelAllExport
} from '@/api/customermanagement/meal'
import {
  crmReceivablesExcelAllExportAPI
} from '@/api/customermanagement/money'
import {
  crmReceiveExcelAllExport
} from '@/api/customermanagement/receive'


import Lockr from 'lockr'
import { Loading } from 'element-ui'
import CheckStatusMixin from '@/mixins/CheckStatusMixin'

export default {
  components: {
    CRMListHead,
    CRMTableHead
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

      /** 高级筛选 */
      filterObj: {}, // 筛选确定数据
      sceneId: '', // 场景筛选ID
      sceneName: '', // 场景名字
      /** 勾选行 */
      selectionList: [] // 勾选数据 用于全局导出

    }
  },

  mixins: [CheckStatusMixin],

  computed: {
    ...mapGetters(['education'])
  },
  mounted() {
    /** 控制table的高度 */
    window.onresize = () => {
      this.updateTableHeight()
    }
    if (['classroom', 'class', 'classschedule', 'studentschedule', 'teacherschedule'].includes(this.crmType)) {
      if (this.education[this.crmType].index) {
        // this.loading = true
        this.getFieldList()
      }
      this.list = [
        {
          a: '教室编号',
          b: '中心',
          c: '教室名称',
          d: '开通时间',
          e: '添加人',
          f: '教室状态',
          g: '关联老师',
          h: '最后修改人',
          i: '最后修改时间'
        }
      ]
    }
  },

  methods: {
    /** 获取列表数据 */
    getList() {
      this.loading = true
      var crmIndexRequest = this.getIndexRequest()
      let params = {
        page: this.currentPage,
        limit: this.pageSize,
        search: this.search,
        type: crmTypeModel[this.crmType] // 9是公海
      }
      if (this.sortData.order) {
        params.sortField = this.sortData.prop
        params.order = this.sortData.order == 'ascending' ? 2 : 1
      }

      if (this.sceneId) {
        params.sceneId = this.sceneId
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

      crmIndexRequest(params)
        .then(res => {
          this.list = res.data.list

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
      if (this.crmType == 'classroom') {
        return crmClassroomIndex
      }
    },
    genListHead(obj) {
      const list = []
      for (const key in obj) {
        list.push({
          prop: key,
          label: obj[key]
        })
      }
      return list
    },
    /** 获取字段 */
    getFieldList(force) {
      const fieldObj = {
        // 教室管理
        classroom: {
          classroomNumber: '教室编号',
          deptName: '中心',
          classroomName: '教室名称',
          createTime: '开通时间',
          createUserName: '添加人',
          statusType: '教室状态',
          relatedTeachers: '关联老师',
          updateUserName: '最后修改人',
          updateTime: '最后修改时间'
        },
        // 班级管理
        class: {
          a: '中心',
          b: '班级类型',
          c: '班级名称',
          d: '教室名称',
          e: '年级',
          f: '科目',
          g: '学科老师',
          h: '已排次数',
          i: '班级状态',
          j: '已排未上课次',
          k: '最后排课时间,',
          l: '备注',
          m: '是否排课'
        },
        // 班级排课表
        classschedule: {
          a: '中心',
          b: '班级类型',
          c: '班级名称',
          d: '教室名称',
          e: '年级',
          f: '科目',
          g: '学科老师',
          h: '状态',
          i: '上课时间',
          j: '时间段',
          k: '排课人数,',
          l: '实际上课人数',
          m: '最大上课人数'
        },
        // 学员排课表
        studentschedule: {
          a: '校区',
          b: '合同编号',
          c: '学员编号',
          d: '学员姓名',
          e: '辅导方式',
          f: '班级类型',
          g: '班级名称',
          h: '教室',
          i: '年级',
          j: '科目',
          k: '学科老师,',
          l: '上课日期',
          m: '上课时段',
          n: '总课次/已确认',
          x: '考勤',
          y: '课时确认'
        }
      }[this.crmType]

      if (['classroom', 'class', 'classschedule', 'studentschedule'].includes(this.crmType)) {
        this.fieldList = this.genListHead(fieldObj)
      } else {
        return
      }
      this.getList()
    },
    /** 格式化字段 */
    fieldFormatter(row, column, cellValue) {
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
          receive: crmReceiveExcelAllExport,
          classroom: crmClassroomExcelAllExport
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
    handleHandle() {
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
