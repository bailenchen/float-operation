/** 教务模块列表 公共逻辑 */
import {
  mapGetters
} from 'vuex'
import crmTypeModel from '@/views/customermanagement/model/crmTypeModel'
import CRMListHead from '../../customermanagement/components/CRMListHead'
import CRMTableHead from '../../customermanagement/components/CRMTableHead'

import { crmClassroomIndex, crmClassroomExcelAllExport } from '@/api/educationmanage/classroom'
import { crmClassIndex, crmClassExcelAllExport } from '@/api/educationmanage/class'
import { crmClassSchduleIndex, crmClassSchduleExcelAllExport } from '@/api/educationmanage/classSchedule'
import { crmStudentSchduleIndex, crmStudentSchduleExcelAllExport } from '@/api/educationmanage/studentSchedule'
import {
  crmFieldColumnWidth
} from '@/api/customermanagement/common'

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
  created() {
    if (['classroom', 'class', 'classschedule', 'studentschedule', 'teacherschedule'].includes(this.crmType)) {
      if (this.education[this.crmType].index) {
        this.getFieldList()
      }
    }
  },
  mounted() {
    /** 控制table的高度 */
    window.onresize = () => {
      this.updateTableHeight()
    }
  },

  methods: {
    /** 获取列表数据 */
    getList() {
      this.loading = true
      var crmIndexRequest = this.getIndexRequest()
      const params = {
        page: this.currentPage,
        limit: this.pageSize,
        search: this.search,
        type: crmTypeModel[this.crmType]
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
      } else if (this.crmType == 'class') {
        return crmClassIndex
      } else if (this.crmType == 'classschedule') {
        return crmClassSchduleIndex
      } else if (this.crmType == 'studentschedule') {
        return crmStudentSchduleIndex
      }
    },
    /** 获取字段 */
    getFieldList() {
      let list = []
      if (this.crmType === 'classroom') {
        list = [
          { prop: 'classroomNumber', label: '教室编号', width: 120 },
          { prop: 'deptName', label: '中心', width: 150 },
          { prop: 'classroomName', label: '教室名称', width: 200 },
          { prop: 'createTime', label: '开通时间', width: 150 },
          { prop: 'createUserName', label: '添加人', width: 90 },
          { prop: 'statusType', label: '教室状态', width: 100 },
          { prop: 'relatedTeachers', label: '关联老师', width: 200 },
          { prop: 'updateUserName', label: '最后修改人', width: 115 },
          { prop: 'updateTime', label: '最后修改时间', width: 150 }
        ]
      } else if (this.crmType === 'class') {
        list = [
          { prop: 'deptName', label: '中心', width: 150 },
          { prop: 'coachType', label: '班级类型', width: 100 },
          { prop: 'className', label: '班级名称', width: 150 },
          { prop: 'classroomName', label: '教室名称', width: 200 },
          { prop: 'gradeName', label: '年级', width: 80 },
          { prop: 'subjectName', label: '科目', width: 80 },
          { prop: 'subjectTeacherName', label: '学科老师', width: 100 },
          { prop: 'totalNumber', label: '满班人数', width: 100 },
          { prop: 'usageTimes', label: '已排次数', width: 100 },
          { prop: 'statusType', label: '班级状态', width: 100 },
          { prop: 'notOn', label: '已排未上课次', width: 125 },
          { prop: 'updateTime', label: '最后排课时间', width: 150 },
          { prop: 'remarks', label: '备注', width: 80 },
          { prop: 'isCourse', label: '是否排课', width: 100 }
        ]
      } else if (this.crmType === 'classschedule') {
        list = [
          { prop: 'deptName', label: '中心', width: 150 },
          { prop: 'classType', label: '班级类型', width: 100 },
          { prop: 'className', label: '班级名称', width: 150 },
          { prop: 'classroomName', label: '教室名称', width: 200 },
          { prop: 'gradeName', label: '年级', width: 80 },
          { prop: 'subjectName', label: '科目', width: 80 },
          { prop: 'subjectTeacherName', label: '学科老师', width: 100 },
          { prop: 'classConfirmationName', label: '状态' },
          { prop: 'classTime', label: '上课时间', width: 100 },
          { prop: 'timeSlot', label: '时间段', width: 100 },
          { prop: 'actualNumber', label: '排课人数', width: 100 },
          { prop: 'rowNumber', label: '实际上课人数', width: 125 },
          { prop: 'totalNumber', label: '最大上课人数', width: 125 }
        ]
      } else if (this.crmType === 'studentschedule') {
        list = [
          { prop: 'deptName', label: '校区', width: 130 },
          { prop: 'num', label: '合同编号', width: 150 },
          { prop: 'leadsNumber', label: '学员编号', width: 110 },
          { prop: 'customerName', label: '学员姓名', width: 100 },
          { prop: 'coachType', label: '辅导方式', width: 100 },
          { prop: 'classType', label: '班级类型', width: 100 },
          { prop: 'className', label: '班级名称', width: 150 },
          { prop: 'classroomName', label: '教室', width: 200 },
          { prop: 'gradeName', label: '年级', width: 80 },
          { prop: 'subjectName', label: '科目', width: 80 },
          { prop: 'subjectTeacherName', label: '学科老师', width: 100 },
          { prop: 'classTime', label: '上课日期', width: 100 },
          { prop: 'timeSlot', label: '上课时段', width: 100 },
          { prop: 'status', label: '总课次/已确认', width: 130 },
          { prop: 'classStatusType', label: '考勤', width: 80 },
          { prop: 'classConfirmationType', label: '课时确认', width: 100 }
        ]
      }

      if (['classroom', 'class', 'classschedule', 'studentschedule'].includes(this.crmType)) {
        this.fieldList = list
      } else {
        return
      }
    },
    /** 格式化字段 */
    fieldFormatter(row, column, cellValue) {
      if (column.property === 'classTime') {
        if (row.classTime) {
          return row['classTime'].slice(0, 10)
        }
      } else if (column.property === 'timeSlot') {
        if (row.timeSlotStart && row.timeSlotEnd) {
          return `${row.timeSlotStart.slice(0, 5)}~${row.timeSlotEnd.slice(0, 5)}`
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
    },
    /**
     * 导出
     * @param {*} data
     */
    // 导出操作
    exportInfos() {
      var params = {
        search: this.search
      }
      if (this.sceneId) {
        params.sceneId = this.sceneId
      }
      if (this.filterObj && Object.keys(this.filterObj).length > 0) {
        params.data = this.filterObj
      }
      const request = {
        classroom: crmClassroomExcelAllExport,
        class: crmClassExcelAllExport,
        classschedule: crmClassSchduleExcelAllExport,
        studentschedule: crmStudentSchduleExcelAllExport
      }[this.crmType]
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
      this.getList()
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

        request = crmFieldColumnWidth
        params.types = `crm_${this.crmType}`

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
