<template>
  <div class="table-head-container">
    <flexbox
      v-show="selectionList.length == 0"
      class="th-container">
      <slot name="custom"/>
      <div v-if="showSceneView">场景：</div>
      <el-popover
        v-if="showSceneView"
        v-model="showScene"
        trigger="click"
        popper-class="no-padding-popover"
        width="180">
        <el-input
          slot="reference"
          v-model="sceneName"
          :readonly="true"
          placeholder="请选择选择"
          class="scene-select">
          <i
            slot="suffix"
            :class="['el-input__icon', 'el-icon-' + iconClass]" />
        </el-input>
        <scene-list
          ref="sceneList"
          :crm-type="crmType"
          @scene="sceneSelect"
          @scene-handle="sceneHandle"
          @hidden-scene="showScene=false" />
      </el-popover>
      <el-button
        v-if="showFilterView"
        type="primary"
        class="filter-button"
        icon="wk wk-screening"
        @click="showFilterClick">高级筛选</el-button>
      <el-button
        v-if="crmType == 'customer'"
        type="primary"
        class="filter-button"
        icon="wk wk-screening"
        @click="globalSearch">全局检索</el-button>
      <filter-form
        v-if="showFilterView"
        :field-list="fieldList"
        :dialog-visible.sync="showFilter"
        :obj="filterObj"
        :crm-type="crmType"
        :save-scene="!isSeas"
        @filter="handleFilter" />
      <slot />
    </flexbox>
    <flexbox
      v-if="selectionList.length > 0"
      class="selection-bar">
      <div class="selected—title">已选中 <span class="selected—count">{{ selectionList.length }}</span> 项</div>
      <flexbox class="selection-items-box">
        <el-button
          v-for="(item, index) in getSelectionHandleItemsInfo()"
          v-if="whetherTypeShowByPermision(item.type)"
          :icon="item.icon | wkIconPre"
          :key="index"
          type="primary"
          @click.native="selectionBarClick(item.type)">{{ item.name }}</el-button>
      </flexbox>
    </flexbox>
    <filter-content
      v-if="filterObj.form && filterObj.form.length > 0"
      :obj="filterObj"
      @delete="handleDeleteField" />

    <transfer-handle
      :crm-type="crmType"
      :selection-list="selectionList"
      :dialog-visible.sync="transferDialogShow"
      @handle="handleCallBack" />
    <teams-handle
      :crm-type="crmType"
      :title="teamsTitle"
      :selection-list="selectionList"
      :dialog-visible.sync="teamsDialogShow"
      @handle="handleCallBack" />
    <alloc-handle
      :crm-type="crmType"
      :pool-id="poolId"
      :selection-list="selectionList"
      :dialog-visible.sync="allocDialogShow"
      @handle="handleCallBack" />
    <alloc-class-teacher
      :crm-type="crmType"
      :selection-list="selectionList"
      :dialog-visible.sync="allocClassTeacherDialogShow"
      @handle="handleCallBack" />
    <deal-status-handle
      :crm-type="crmType"
      :selection-list="selectionList"
      :visible.sync="dealStatusShow"
      @handle="handleCallBack" />

    <scene-set
      :dialog-visible.sync="showSceneSet"
      :crm-type="crmType"
      @save-success="updateSceneList" />

    <scene-create
      :field-list="fieldList"
      :crm-type="crmType"
      :dialog-visible.sync="showSceneCreate"
      :obj="sceneFilterObj"
      @save-success="updateSceneList" />

    <put-pool-handle
      :visible.sync="putPoolShow"
      :selection-list="selectionList"
      @handle="handleCallBack" />

    <change-pool-handle
      :visible.sync="changePoolShow"
      :selection-list="selectionList"
      @handle="handleCallBack" />

    <change-dept-handle
      :visible.sync="changeDeptShow"
      :selection-list="selectionList"
      @handle="handleCallBack" />

    <online-recharge
      :visible.sync="isShowOnline"
      :selection-list="selectionList"
      @handle="handleCallBack" />

    <offline-with-draw
      :visible.sync="isOfflineWithDraw"
      :money-type="moneyType"
      :selection-list="selectionList"
      @handle="handleCallBack"
      @reset-type="moneyType = ''" />

    <dispute-examine
      :visible.sync="isDispute"
      :selection-list="selectionList"
      :examine-info="examineInfo"
      @handle="handleCallBack" />

    <mode-follow
      :visible.sync="isFollow"
      :selection-list="selectionList"
      @handle="handleCallBack" />

    <mark-alloc
      :visible.sync="markAllocShow"
      :selection-list="selectionList"
      @handle="handleCallBack" />

    <!-- <update-contract
      v-if="isUpdate"
      :action="createActionInfo"
      @hiden-view="hideView"
    /> -->
    <c-r-m-create-view
      v-if="isUpdate"
      :crm-type="createCRMType"
      :action="createActionInfo"
      @save-success="createSaveSuccess"
      @hiden-view="hideView"/>

    <!-- 全局搜索 -->
    <global-search :visible.sync="globalSearchShow" />

    <!-- 换挡 -->
    <shift-handle
      v-if="isShift"
      :selection-list="selectionList"
      @save-success="createSaveSuccess"
      @hiden-view="hideView"/>

    <!-- 插班 -->
    <insert-class
      v-if="isInsert"
      :crm-type="crmType"
      :selection-list="selectionList"
      @save-success="createSaveSuccess"
      @hiden-view="hideView"/>

    <!-- 排课 -->
    <rank-course
      v-if="isRank"
      :selection-list="selectionList"
      @save-success="createSaveSuccess"
      @hiden-view="hideView"/>

    <!-- 确认课时 -->
    <confirm-class-time
      v-if="isConfirm"
      :selection-list="selectionList"
      @save-success="createSaveSuccess"
      @hiden-view="hideView"/>

    <!-- 创建教室 -->
    <create-classroom
      v-if="isClassroom"
      :selection-list="selectionList"
      type="edit"
      @save-success="createSaveSuccess"
      @hiden-view="hideView"/>

    <!-- 创建班级 -->
    <create-class
      v-if="isClass"
      :selection-list="selectionList"
      type="edit"
      @save-success="createSaveSuccess"
      @hiden-view="hideView"/>

    <!-- 提升预警等级 -->
    <!-- v-if="isWarning" -->
    <raise-warning
      :visible="isWarning"
      :selection-list="selectionList"
      @save-success="createSaveSuccess"
      @hiden-view="hideView"/>

    <!-- 解除预警 -->
    <!-- v-if="isDismiss" -->
    <dismiss-warning
      :visible="isDismiss"
      :selection-list="selectionList"
      @save-success="createSaveSuccess"
      @hiden-view="hideView"/>

    <!-- 上传人脸照片 -->
    <facial-photo
      :visible.sync="isFacialPhoto"
      :selection-list="selectionList"
      type="edit"
    />
  </div>
</template>

<script type="text/javascript">
import { mapGetters } from 'vuex'
import crmTypeModel from '@/views/customermanagement/model/crmTypeModel'
import {
  filterIndexfields,
  filterIndexPoolfields,
  crmSceneSave,
  filedGetInformation
} from '@/api/customermanagement/common'
import {
  crmWeixinDeleteAPI,
  CrmWeixinLeadsExportLeadsAPI,
  crmWeixinChangeLeadsAPI
} from '@/api/customermanagement/applet'
import {
  crmLeadsTransform,
  crmLeadsExcelExport,
  crmLeadsDelete
} from '@/api/customermanagement/clue'
import {
  crmCustomerLock,
  crmCustomerExcelExport,
  crmCustomerPoolExcelExportAPI,
  crmCustomerDelete,
  crmCustomerPoolDeleteAPI,
  crmCustomerReceive
} from '@/api/customermanagement/customer'
import {
  crmAccountExcelExport,
  crmAccountDelete
} from '@/api/customermanagement/account'
import {
  crmContactsDelete,
  crmContactsExcelExport
} from '@/api/customermanagement/contacts'
import {
  crmBusinessDelete,
  crmBusinessExcelExportAPI
} from '@/api/customermanagement/business'
import {
  crmContractDelete,
  crmContractExcelExportAPI,
  CrmContractAffirmContractStatusAPI
} from '@/api/customermanagement/contract'
import {
  crmReceivablesDelete,
  crmReceivablesExcelExportAPI
} from '@/api/customermanagement/money'
import {
  crmProductStatus,
  crmProductExcelExport,
  crmProductDeleteAPI
} from '@/api/customermanagement/product'
import {
  crmProductSetMealStatus,
  crmProductSetMealExcelExport,
  crmProductSetMealDeleteAPI
} from '@/api/customermanagement/meal'
import {
  crmMarketingIsEnableAPI,
  crmMarketingDeleteAPI
} from '@/api/customermanagement/marketing'
import {
  crmReturnVisitDeleteAPI
} from '@/api/customermanagement/visit'
import {
  crmInsideUserDelete,
  CrmInsideUserExcelExport
} from '@/api/customermanagement/address'
import {
  crmReceiveExcelExport,
  crmReceiveDeleteAPI
} from '@/api/customermanagement/receive'
import {
  crmRefundExcelExport,
  crmRefundDeleteAPI
} from '@/api/customermanagement/refund'


import {
  crmClassroomDelete
} from '@/api/educationmanage/classroom'
import {
  crmClassDelete,
  crmClassClose
} from '@/api/educationmanage/class'
import {
  crmStudentSchduleDelete,
  crmStudentSchduleLeave
} from '@/api/educationmanage/studentSchedule'
import {
  crmClassSchduleDelete
} from '@/api/educationmanage/classSchedule'
import { crmCreateExamineFlow } from '@/api/customermanagement/common'


import filterForm from './filterForm'
import filterContent from './filterForm/filterContent'
import SceneList from './sceneForm/SceneList' // 场景
import SceneSet from './sceneForm/SceneSet' // 场景设置
import SceneCreate from './sceneForm/SceneCreate'

import TransferHandle from './selectionHandle/TransferHandle' // 转移
import TeamsHandle from './selectionHandle/TeamsHandle' // 操作团队成员
import AllocHandle from './selectionHandle/AllocHandle' // 公海分配操作
import AllocClassTeacher from './selectionHandle/AllocClassTeacher' // 分配班主任操作
import DealStatusHandle from './selectionHandle/DealStatusHandle' // 客户状态修改操作
import PutPoolHandle from './selectionHandle/PutPoolHandle' // 放入公海
import ChangePoolHandle from './selectionHandle/ChangePoolHandle' // 转移到其他公海
import ChangeDeptHandle from './selectionHandle/ChangeDeptHandle' // 变更中心
import OnlineRecharge from './selectionHandle/OnlineRecharge' // 在线充值
import OfflineWithDraw from './selectionHandle/OfflineWithDraw' // 线下充值和提现
import DisputeExamine from './selectionHandle/DisputeExamine' // 争议审批
import ModeFollow from './selectionHandle/ModeFollow' // 修改跟进
import MarkAlloc from './selectionHandle/MarkAlloc' // 业绩分配
import UpdateContract from './selectionHandle/UpdateContract' // 合同变更
import InsertClass from '@/views/EducationManage/components/InsertClass' // 学员插班
import ConfirmClassTime from '@/views/EducationManage/components/ConfirmClassTime' // 课时确认
import RankCourse from '@/views/EducationManage/components/RankCourse' // 排课
import ShiftHandle from '@/views/EducationManage/components/ShiftHandle' // 换挡
import CreateClassroom from '@/views/EducationManage/classroom/components/CreateClassroom' // 创建教室
import CreateClass from '@/views/EducationManage/class/components/CreateClass' // 创建班级
import DismissWarning from '../warning/components/DismissWarning' // 提升预警等级
import RaiseWarning from '../warning/components/RaiseWarning' // 解除等级
import FacialPhoto from './selectionHandle/FacialPhoto' // 线下充值和提现
import { Loading } from 'element-ui'
import GlobalSearch from '@/views/customermanagement/customer/components/GlobalSearch'
import CRMCreateView from './CRMCreateView'

export default {
  name: 'CRMTableHead', // 客户管理下 重要提醒 回款计划提醒
  components: {
    filterForm,
    filterContent,
    SceneList,
    TransferHandle,
    TeamsHandle,
    AllocHandle,
    SceneCreate,
    SceneSet,
    DealStatusHandle,
    PutPoolHandle,
    AllocClassTeacher,
    ChangePoolHandle,
    ChangeDeptHandle,
    OnlineRecharge,
    OfflineWithDraw,
    DisputeExamine,
    ModeFollow,
    MarkAlloc,
    UpdateContract,
    GlobalSearch,
    CRMCreateView,
    InsertClass,
    ConfirmClassTime,
    RankCourse,
    ShiftHandle,
    CreateClassroom,
    CreateClass,
    RaiseWarning,
    DismissWarning,
    FacialPhoto
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    /** 没有值就是全部类型 有值就是当个类型 */
    crmType: {
      type: String,
      default: ''
    },
    // 辅助 使用 公海没有场景
    isSeas: {
      type: Boolean,
      default: false
    },
    poolId: [String, Number]
  },
  data() {
    return {
      loading: false, // loading
      loadingObj: null, // loading 对象
      sceneTypes: [
        { type: 'enter', name: '我负责的' },
        { type: 'out', name: '我' }
      ],
      sceneType: null,
      showScene: false, // 场景操作
      showFilter: false, // 控制筛选框
      fieldList: [],
      filterObj: { form: [] }, // 筛选确定数据
      sceneData: { id: '', bydata: '', name: '' },
      showSceneSet: false, // 展示场景设置
      showSceneCreate: false, // 展示场景添加
      sceneFilterObj: { form: [] }, // 筛选确定数据

      /** 勾选操作数据 */
      selectionList: [],
      transferDialogShow: false,
      teamsDialogShow: false, // 团队操作提示框
      teamsTitle: '', // 团队操作标题名
      allocDialogShow: false, // 公海分配操作提示框
      allocClassTeacherDialogShow: false, // 分配班主任操作提示框
      dealStatusShow: false, // 成交状态修改框
      putPoolShow: false, // 客户放入公海
      changePoolShow: false, // 变更公海
      changeDeptShow: false, // 变更中心
      isShowOnline: false, // 在线充值
      isOfflineWithDraw: false, // 线下充值和提现
      isDispute: false,
      moneyType: '',
      examineInfo: {}, // 审核争议信息
      globalSearchShow: false, // 全局检索显隐
      isFollow: false, // 修改跟进
      markAllocShow: false, // 业绩分配
      upContractShow: false, // 合同变更
      isUpdate: false,
      createCRMType: 'contract',
      isInsert: false, // 学员插班
      isRank: false, // 排课
      isConfirm: false, // 确认课时
      isShift: false, // 换挡
      isClassroom: false, // 编辑教室
      isClass: false, // 编辑班级
      isWarning: false, // 提升预警等级
      isDismiss: false, // 解除预警
      isFacialPhoto: false, // 上传人脸照片
      createActionInfo: { type: 'save' }, // 创建的相关信息
      closeTxt: '关闭'
    }
  },
  computed: {
    // ...mapState('user', ['crm']),
    ...mapGetters(['crm', 'education', 'userInfo']),
    iconClass() {
      return this.showScene ? 'arrow-up' : 'arrow-down'
    },
    sceneName() {
      return this.sceneData.name || this.getDefaultSceneName()
    },
    // 展示场景
    showSceneView() {
      if (this.isSeas || ['marketing', 'applet'].includes(this.crmType)) {
        return false
      } else if (['teacherschedule'].includes(this.crmType)) {
        return false
      } else {
        return true
      }
    },

    // 展示筛选
    showFilterView() {
      if (['marketing', 'applet', 'teacherschedule'].includes(this.crmType)) {
        return false
      } else {
        return true
      }
    }
  },
  watch: {
    loading(val) {
      if (val) {
        this.loadingObj = Loading.service({
          target: document.querySelector('#crm-main-container')
        })
      } else {
        this.loadingObj && this.loadingObj.close()
      }
    }
  },
  mounted() {},
  methods: {
    /** 发布 时候的类型选择 */
    handleTypeDrop(command) {
      this.sceneType = command
    },
    /** 展示高级筛选 */
    showFilterClick() {
      this.getFilterFieldInfo()
    },
    // 获取高级筛选字段数据
    getFilterFieldInfo() {
      console.log('获取高级筛选字段数据')
      const params = {}
      if (this.isSeas) {
        params.poolId = this.poolId
      } else {
        const keytype = this.crmType === 'student' ? 'customer' : this.crmType
        params.label = crmTypeModel[keytype]
      }

      console.log(this.isSeas)
      const request = this.isSeas ? filterIndexPoolfields : filterIndexfields

      request(params)
        .then(res => {
          this.fieldList = res.data
          this.showFilter = true
        })
        .catch(() => {})
    },
    handleFilter(form) {
      this.filterObj = form
      this.showFilter = false
      if (form.saveChecked) {
        crmSceneSave({
          type: crmTypeModel[this.crmType],
          isDefault: form.saveDefault ? 1 : 0,
          name: form.saveName,
          data: JSON.stringify(form.obj)
        })
          .then(res => {
            this.updateSceneList()
          })
          .catch(() => {})
      }
      console.log('头，向上发送事件', form.obj)
      this.$emit('filter', form.obj)
    },
    // 删除
    handleDeleteField(data) {
      this.filterObj = data.obj
      this.$emit('filter', this.filterObj.obj)
    },
    // 场景操作
    /** 选择了场景 */
    sceneSelect(data) {
      this.sceneData = data
      this.$emit('scene', data)
    },
    sceneHandle(data) {
      if (data.type == 'set') {
        this.showSceneSet = true
      } else if (data.type == 'add') {
        const keytype = this.crmType == 'student' ? 'customer' : this.crmType
        filterIndexfields({
          label: crmTypeModel[keytype]
        })
          .then(res => {
            this.fieldList = res.data
            this.showSceneCreate = true
          })
          .catch(() => {})
      }
    },
    /**  创建保存成功 */
    updateSceneList() {
      this.$refs.sceneList.getSceneList()
    },
    /** 勾选后的表头操作 */
    headSelectionChange(array) {
      this.selectionList = array
    },
    /** 操作 */
    selectionBarClick(type) {
      console.log('点击')
      console.log(type)
      if (type == 'transfer') {
        // 转移
        this.transferDialogShow = true
      } else if (type == 'export') {
        var params = {}
        var request = null
        if (this.isSeas) {
          request = crmCustomerPoolExcelExportAPI
          params.poolId = this.poolId
          params.ids = this.selectionList
            .map(function(item, index, array) {
              return item.customerId
            })
            .join(',')
        } else if (this.crmType === 'applet') {
          request = CrmWeixinLeadsExportLeadsAPI
          params.ids = this.selectionList
            .map(function(item, index, array) {
              return item.weixinLeadsId
            })
            .join(',')
        } else {
          request = {
            customer: crmCustomerExcelExport,
            capitalAccount: crmAccountExcelExport,
            leads: crmLeadsExcelExport,
            contacts: crmContactsExcelExport,
            business: crmBusinessExcelExportAPI,
            contract: crmContractExcelExportAPI,
            receivables: crmReceivablesExcelExportAPI,
            product: crmProductExcelExport,
            productSetMeal: crmProductSetMealExcelExport,
            insideUser: CrmInsideUserExcelExport,
            receive: crmReceiveExcelExport,
            refund: crmRefundExcelExport
          }[this.crmType]
          params.ids = this.selectionList
            .map((item) => {
              if (this.crmType == 'productSetMeal') {
                return item.productId
              } else if (this.crmType == 'capitalAccount') {
                return item.capitalId
              } else if (this.crmType == 'insideUser') {
                return item.insideId
              } else if (this.crmType == 'receive') {
                return item.contractCapitalId
              } else {
                return item[`${this.crmType}Id`]
              }
            })
            .join(',')
        }
        // return

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
          })
          .catch(() => {})
      } else if (
        type == 'transform' ||
        type == 'delete' ||
        type == 'leave' ||
        type == 'lock' ||
        type == 'unlock' ||
        type == 'start' ||
        type == 'disable' ||
        type == 'transformLead' ||
        type == 'state_start' ||
        type == 'state_disable' ||
        type == 'get' ||
        type == 'give_up' ||
        type == 'confirm_give_up' ||
        type == 'close'
      ) {
        var message = ''
        if (type == 'transform') {
          message = '确定将这些线索转换为客户吗?'
        } else if (type == 'delete') {
          message = '确定删除?'
        } else if (type == 'lock') {
          message = '确定要锁定这些LEADS吗？锁定后将不会掉入公海。'
        } else if (type == 'unlock') {
          message = '确定要解锁这些LEADS吗？'
        } else if (type == 'start') {
          message = '确定要上架这些产品吗?'
        } else if (type == 'disable') {
          message = '确定要下架这些产品吗?'
        } else if (type == 'state_start') {
          message = '确定要启用这些活动吗?'
        } else if (type == 'state_disable') {
          message = '确定要停用这些活动吗?'
        } else if (type == 'get') {
          message = '确定要领取该LEADS吗?'
        } else if (type === 'transformLead') {
          message = '确定将这些名片线索转化为线索吗?'
        } else if (type === 'give_up') {
          if (this.selectionList[0].contractStatus == 2) {
            message = '取消放弃么?'
          } else if (this.selectionList[0].contractStatus == 3) {
            this.$message.error('合同已经完成,无法操作')
            return
          } else {
            message = '确定放弃么?'
          }
        } else if (type === 'confirm_give_up') {
          if (this.selectionList[0].contractStatus == 1) {
            this.$message.error('当前合同为正常状态,无法操作')
            return
          } else if (this.selectionList[0].contractStatus == 3) {
            this.$message.error('合同已经完成,无法操作')
            return
          } else {
            message = '确定确认放弃吗?'
          }
        } else if (type == 'close') {
          message = '确认关闭吗?'
        } else if (type == 'leave') {
          message = '确认请假吗?'
        }
        this.$confirm(message, '提示', {
          confirmButtonText: type === 'confirm_give_up' ? '提交家长确认' : '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.confirmHandle(type)
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            })
          })
      } else if (type == 'add_user') {
        // 团队操作
        this.teamsTitle = '添加团队成员'
        this.teamsDialogShow = true
      } else if (type == 'delete_user') {
        // 团队操作
        this.teamsTitle = '移除团队成员'
        this.teamsDialogShow = true
      } else if (type == 'alloc') {
        // 公海分配操作
        this.allocDialogShow = true
      } else if (type == 'assignHeadTeacher') {
        // 分配班主任操作
        this.allocClassTeacherDialogShow = true
      } else if (type == 'deal_status') {
        // 客户成交状态操作
        this.dealStatusShow = true
      } else if (type == 'put_seas') {
        // 客户放入公海
        this.putPoolShow = true
      } else if (type === 'change_seas') {
        // 转移到其他公海
        this.changePoolShow = true
      } else if (type === 'change_dept') {
        // 变更中心
        console.log('change dept 变更中心')
        this.changeDeptShow = true
      } else if (type == 'online_recharge') {
        this.isShowOnline = true
      } else if (type == 'offline_recharge') {
        this.moneyType = 'offline'
        this.isOfflineWithDraw = true
      } else if (type == 'refound') {
        this.moneyType = 'refound'
        this.isOfflineWithDraw = true
      } else if (type == 'dispute') {
        // 点击争议
        const data = { categoryType: 4 }
        crmCreateExamineFlow(data)
          .then(res => {
            console.log('争议接口')
            console.log(res)
            this.examineInfo = res.data
            this.isDispute = true
          })
          .catch()
      } else if (type == 'follow') {
        this.isFollow = true
      } else if (type == 'mark_alloc') {
        this.markAllocShow = true
      } else if (type == 'update_contract') {
        var params = { types: 6, id: this.selectionList[0].contractId }
        filedGetInformation(params).then(res => {
          this.isUpdate = true

          this.createActionInfo = {
            type: 'save',
            attr: 'change',
            id: 7,
            detail: this.selectionList[0],
            information: res.data,
            userInfo: {
              userId: this.userInfo.userId,
              realname: this.userInfo.realname
            }
          }
        }).catch(() => {})
      } else if (type == 'insert_class') {
        this.isInsert = true
      } else if (type == 'schedule') {
        this.isRank = true
      } else if (type == 'confirm') {
        this.isConfirm = true
      } else if (type == 'shift') {
        this.isShift = true
      } else if (type == 'mode') {
        this.isClassroom = true
      } else if (type == 'mode_class') {
        this.isClass = true
      } else if (type == 'raise_warning') {
        this.isWarning = true
      } else if (type == 'dismiss_warning') {
        this.isDismiss = true
      } else if (type == 'facialPhoto') {
        this.isFacialPhoto = true
      }
    },
    confirmHandle(type) {
      console.log('type', type)
      if (type === 'lock' || type === 'unlock') {
        this.loading = true
        var customerId = this.selectionList.map(function(item, index, array) {
          return item.customerId
        })
        crmCustomerLock({
          status: type === 'lock' ? '9' : '10', // 1是正常 2 是锁定 9锁定  10正常
          ids: customerId.join(',')
        })
          .then(res => {
            this.loading = false
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.$emit('handle', { type: type })
          })
          .catch(() => {
            this.loading = false
          })
      } else if (type === 'transform') {
        this.loading = true
        var leadsId = this.selectionList.map(function(item, index, array) {
          return item.leadsId
        })
        crmLeadsTransform({
          leadsIds: leadsId.join(',')
        })
          .then(res => {
            this.loading = false
            this.$message({
              type: 'success',
              message: '转化成功'
            })
            // 刷新待办
            this.$store.dispatch('GetMessageNum')

            this.$emit('handle', { type: type })
          })
          .catch(() => {
            this.loading = false
          })
      } else if (type === 'start' || type === 'disable') {
        var productId = this.selectionList.map(function(item, index, array) {
          return item.productId
        })
        this.loading = true
        var req = null
        console.log(this.crmType, 'leixing')
        if (this.crmType == 'product') {
          req = crmProductStatus
        } else if (this.crmType == 'productSetMeal') {
          req = crmProductSetMealStatus
        }

        req({
          ids: productId.join(','),
          status: type === 'start' ? '1' : '0'
        })
          .then(res => {
            this.loading = false
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.$emit('handle', { type: type })
          })
          .catch(() => {
            this.loading = false
          })
      } else if (type === 'state_start' || type === 'state_disable') {
        var marketingId = this.selectionList.map(function(item, index, array) {
          return item.marketingId
        })
        this.loading = true
        crmMarketingIsEnableAPI({
          marketingIds: marketingId.join(','),
          status: type === 'state_start' ? 1 : 0
        })
          .then(res => {
            this.loading = false
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            this.$emit('handle', { type: type })
          })
          .catch(() => {
            this.loading = false
          })
      } else if (type === 'delete') {
        let crmTypes = ''
        if (this.crmType === 'applet') {
          crmTypes = 'weixinLeads'
        } else {
          crmTypes = this.crmType
        }
        var ids = null
        if (this.crmType == 'productSetMeal') {
          ids = this.selectionList.map(function(item, index, array) {
            return item['productId']
          })
        } else if (this.crmType == 'capitalAccount') {
          ids = this.selectionList.map(function(item, index, array) {
            return item['capitalId']
          })
        } else if (this.crmType == 'insideUser') {
          ids = this.selectionList.map(function(item, index, array) {
            return item['insideId']
          })
        } else if (this.crmType == 'receive') {
          ids = this.selectionList.map(function(item, index, array) {
            return item['contractCapitalId']
          })
        } else if (this.crmType == 'classroom') {
          ids = this.selectionList.map(function(item, index, array) {
            return item['classroomId']
          })
        } else if (this.crmType == 'class') {
          ids = this.selectionList.map(function(item, index, array) {
            return item['classId']
          })
        } else if (this.crmType == 'classschedule') {
          ids = this.selectionList.map(function(item, index, array) {
            return item['timeId']
          })
        } else if (this.crmType == 'studentschedule') {
          ids = this.selectionList.map(function(item, index, array) {
            return item['id']
          })
        } else {
          ids = this.selectionList.map(function(item, index, array) {
            return item[crmTypes + 'Id']
          })
        }

        const request = {
          leads: crmLeadsDelete,
          customer: this.isSeas ? crmCustomerPoolDeleteAPI : crmCustomerDelete,
          capitalAccount: crmAccountDelete,
          contacts: crmContactsDelete,
          business: crmBusinessDelete,
          contract: crmContractDelete,
          receivables: crmReceivablesDelete,
          applet: crmWeixinDeleteAPI,
          marketing: crmMarketingDeleteAPI,
          visit: crmReturnVisitDeleteAPI,
          product: crmProductDeleteAPI,
          productSetMeal: crmProductSetMealDeleteAPI,
          insideUser: crmInsideUserDelete,
          receive: crmReceiveDeleteAPI,
          refund: crmRefundDeleteAPI,
          classroom: crmClassroomDelete,
          class: crmClassDelete,
          classschedule: crmClassSchduleDelete,
          studentschedule: crmStudentSchduleDelete
        }[this.crmType]
        var params = null
        if (this.crmType == 'productSetMeal') {
          params = {
            productIds: ids.join(',')
          }
        } else if (this.crmType == 'capitalAccount') {
          params = {
            capitalIds: ids.join(',')
          }
        } else if (this.crmType == 'insideUser') {
          params = {
            insideIds: ids.join(',')
          }
        } else if (this.crmType == 'receive') {
          params = {
            ids: ids
          }
        } else if (this.crmType == 'classroom') {
          params = {
            classroomIds: ids.join(',')
          }
        } else if (this.crmType == 'class') {
          params = {
            classIds: ids.join(',')
          }
        } else if (this.crmType == 'classschedule') {
          params = {
            timeIds: ids.join(',')
          }
        } else if (this.crmType == 'studentschedule') {
          params = {
            ids: ids.join(',')
          }
        } else {
          params = {
            [crmTypes + 'Ids']: ids.join(',')
          }
        }
        if (this.isSeas) {
          params.poolId = this.poolId
        }
        this.loading = true
        request(params)
          .then(res => {
            this.loading = false
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            this.$emit('handle', { type: type })
          })
          .catch(() => {
            this.loading = false
          })
      } else if (type == 'leave') {
        var ids = null
        var params = null
        if (this.crmType == 'studentschedule') {
          ids = this.selectionList.map(function(item, index, array) {
            return item['id']
          })
          params = {
            ids: ids.join(',')
          }
        }
        this.loading = true
        crmStudentSchduleLeave(params)
          .then(res => {
            this.loading = false
            this.$message({
              type: 'success',
              message: '请假成功'
            })
            this.$emit('handle', { type: type })
          })
          .catch(() => {
            this.loading = false
          })
      } else if (type === 'get') {
        // 领取
        var customerId = this.selectionList.map(function(item, index, array) {
          return item.customerId
        })
        this.loading = true
        crmCustomerReceive({
          ids: customerId.join(','),
          poolId: this.poolId
        })
          .then(res => {
            this.loading = false
            this.$message({
              type: 'success',
              message: '操作成功'
            })
            // 刷新待办
            this.$store.dispatch('GetMessageNum')

            this.$emit('handle', { type: type })
          })
          .catch(() => {
            this.loading = false
          })
      } else if (type === 'transformLead') {
        var ids = this.selectionList.map(function(item, index, array) {
          return item.weixinLeadsId
        })
        this.loading = true
        crmWeixinChangeLeadsAPI({
          'weixinLeadsIds': ids.join(',')
        }).then(res => {
          this.loading = false
          this.$message.success('转化为线索成功')
          this.$emit('handle', { type: type })
        }).catch(() => {
          this.loading = false
        })
        return
      } else if (type === 'give_up') {
        var ids = this.selectionList.map(function(item, index, array) {
          return item.contractId
        }).join(',')
        const params = {
          contractId: ids
        }
        if (this.selectionList[0].contractStatus == 2) {
          params['contractStatus'] = 5
        } else {
          params['contractStatus'] = 2
        }
        this.loading = true
        CrmContractAffirmContractStatusAPI(params)
          .then(res => {
            this.loading = false
            this.$message.success('操作成功')
            this.$emit('handle', { type: type })
          }).catch(() => {
            this.loading = false
          })
        return
      } else if (type === 'confirm_give_up') {
        var ids = this.selectionList.map(function(item, index, array) {
          return item.contractId
        }).join(',')
        const params = {
          contractId: ids,
          contractStatus: 8
        }
        this.loading = true
        CrmContractAffirmContractStatusAPI(params)
          .then(res => {
            this.loading = false
            this.$message.success('操作成功')
            this.$emit('handle', { type: type })
          }).catch(() => {
            this.loading = false
          })
        return
      } else if (type == 'close') {
        var ids = this.selectionList.map(function(item, index, array) {
          return item.classId
        }).join(',')
        const params = {
          classIds: ids,
          status: this.closeTxt == '关闭' ? 2 : 1
        }
        crmClassClose(params).then(res => {
          this.loading = false
          this.$message.success('操作成功')
          this.$emit('handle', { type: type })
        }).catch(() => {
          this.loading = false
        })
      }
    },
    /** 获取展示items */
    getSelectionHandleItemsInfo() {
      const handleInfos = {
        transfer: {
          name: '转移教育顾问',
          type: 'transfer',
          icon: 'transfer'
        },
        transform: {
          name: '转化为客户',
          type: 'transform',
          icon: 'transform'
        },
        transformLead: {
          name: '转化为线索',
          type: 'transformLead',
          icon: 'transform'
        },
        export: {
          name: '导出选中',
          type: 'export',
          icon: 'export'
        },
        delete: {
          name: '删除',
          type: 'delete',
          icon: 'delete'
        },
        put_seas: {
          name: '放入公海',
          type: 'put_seas',
          icon: 'seas'
        },
        lock: {
          name: '锁定',
          type: 'lock',
          icon: 'lock'
        },
        unlock: {
          name: '解锁',
          type: 'unlock',
          icon: 'unlock'
        },
        add_user: {
          name: '添加团队成员',
          type: 'add_user',
          icon: 'add'
        },
        delete_user: {
          name: '移除团队成员',
          type: 'delete_user',
          icon: 'remove'
        },
        alloc: {
          name: '分配',
          type: 'alloc',
          icon: 'alloc'
        },
        get: {
          name: '领取',
          type: 'get',
          icon: 'receive'
        },
        start: {
          name: '上架',
          type: 'start',
          icon: 'shelves'
        },
        disable: {
          name: '下架',
          type: 'disable',
          icon: 'sold-out'
        },
        state_start: {
          name: '启用',
          type: 'state_start',
          icon: 'activation'
        },
        state_disable: {
          name: '停用',
          type: 'state_disable',
          icon: 'remove'
        },
        deal_status: {
          name: '更改成交状态',
          type: 'deal_status',
          icon: 's-status'
        },
        assignHeadTeacher: {
          name: '分配班主任',
          type: 'assignHeadTeacher',
          icon: 'alloc'
        },
        change_seas: {
          name: '转移到其他公海',
          type: 'change_seas',
          icon: 'seas'
        },
        change_dept: {
          name: '变更中心',
          type: 'change_dept',
          icon: 'transfer'
        },
        online_recharge: {
          name: '线上资金收款',
          type: 'online_recharge',
          icon: 'shelves'
        },
        offline_recharge: {
          name: '线下资金收款',
          type: 'offline_recharge',
          icon: 'sold-out'
        },
        refound: {
          name: '资金退款',
          type: 'refound',
          icon: 'activation'
        },
        dispute: {
          name: '争议',
          type: 'dispute',
          icon: 'transfer'
        },
        follow: {
          name: '修改跟进',
          type: 'follow',
          icon: 'transfer'
        },
        give_up: {
          name: '放弃/取消放弃',
          type: 'give_up',
          icon: 'unlock'
        },
        confirm_give_up: {
          name: '确认放弃',
          type: 'confirm_give_up',
          icon: 'lock'
        },
        mark_alloc: {
          name: '业绩分配',
          type: 'mark_alloc',
          icon: 'alloc'
        },
        update_contract: {
          name: '合同变更',
          type: 'update_contract',
          icon: 'transfer'
        },
        mode: {
          name: '修改',
          type: 'mode',
          icon: 'transfer'
        },
        mode_class: {
          name: '修改',
          type: 'mode_class',
          icon: 'transfer'
        },
        schedule: {
          name: '排课',
          type: 'schedule',
          icon: 'transfer'
        },
        close: {
          name: this.closeTxt,
          type: 'close',
          icon: 'remove'
        },
        insert_class: {
          name: '学员插班',
          type: 'insert_class',
          icon: 'transfer'
        },
        shift: {
          name: '换挡',
          type: 'shift',
          icon: 'transfer'
        },
        confirm: {
          name: '课时确认',
          type: 'confirm',
          icon: 'transfer'
        },
        leave: {
          name: '请假',
          type: 'leave',
          icon: 'transfer'
        },
        raise_warning: {
          name: '提升预警等级',
          type: 'raise_warning',
          icon: 'activation'
        },
        dismiss_warning: {
          name: '解除预警',
          type: 'dismiss_warning',
          icon: 'remove'
        },
        facialPhoto: {
          name: '上传人脸照片',
          type: 'facialPhoto',
          icon: 'upload'
        }
      }
      if (this.crmType == 'leads') {
        return this.forSelectionHandleItems(handleInfos, [
          'transfer',
          'transform',
          'export',
          'delete'
        ])
      } else if (this.crmType == 'customer') {
        if (this.isSeas) {
          return this.forSelectionHandleItems(handleInfos, [
            'alloc',
            'get',
            'export',
            'delete',
            'change_seas'
          ])
        } else {
          const items = [
            'assignHeadTeacher',
            'transfer',
            'put_seas',
            'export',
            'delete',
            'lock',
            'unlock'
          ]

          if (this.crm.customer.dispute === true) {
            items.push('dispute')
          }

          return this.forSelectionHandleItems(handleInfos, items)

          // return this.forSelectionHandleItems(handleInfos, [
          //   'assignHeadTeacher',
          //   'transfer',
          //   'put_seas',
          //   // 'deal_status',
          //   'export',
          //   'delete',
          //   'lock',
          //   'unlock',
          //   // 'dispute'
          //   // 'add_user',
          //   // 'delete_user'
          // ])
        }
      } else if (this.crmType == 'student') {
        return this.forSelectionHandleItems(handleInfos, [
          // 'change_dept',
          // 'transfer',
          // 'export',
          // 'delete',
          // 'facialPhoto'
        ])
      } else if (this.crmType == 'capitalAccount') {
        return this.forSelectionHandleItems(handleInfos, [
          'online_recharge',
          'offline_recharge',
          'refound',
          'export',
          'delete'
        ])
      } else if (this.crmType == 'studentWarning') {
        return this.forSelectionHandleItems(handleInfos, [
          'raise_warning',
          'dismiss_warning'
        ])
      } else if (this.crmType == 'contacts') {
        return this.forSelectionHandleItems(handleInfos, [
          'transfer',
          'export',
          'delete'
        ])
      } else if (this.crmType == 'business') {
        return this.forSelectionHandleItems(handleInfos, [
          'transfer',
          'export',
          'delete',
          'add_user',
          'delete_user'
        ])
      } else if (this.crmType == 'contract') {
        return this.forSelectionHandleItems(handleInfos, [
          'export',
          'delete',
          'give_up',
          'confirm_give_up',
          'mark_alloc',
          'update_contract'
        ])
      } else if (this.crmType == 'receivables') {
        return this.forSelectionHandleItems(handleInfos, ['transfer', 'export', 'delete'])
      } else if (this.crmType == 'product') {
        return this.forSelectionHandleItems(handleInfos, [
          'transfer',
          'export',
          'delete',
          'start',
          'disable'
        ])
      } else if (this.crmType === 'applet') {
        return this.forSelectionHandleItems(handleInfos, [
          'export',
          'delete',
          'transformLead'
        ])
      } else if (this.crmType == 'product') {
        return this.forSelectionHandleItems(handleInfos, [
          'export',
          'start',
          'disable'
        ])
      } else if (this.crmType == 'productSetMeal') {
        return this.forSelectionHandleItems(handleInfos, [
          'export',
          'delete',
          'start',
          'disable'
        ])
      } else if (this.crmType == 'marketing') {
        return this.forSelectionHandleItems(handleInfos, [
          'state_start',
          'state_disable',
          'delete'
        ])
      } else if (this.crmType == 'visit') {
        return this.forSelectionHandleItems(handleInfos, [
          'delete'
        ])
      } else if (this.crmType == 'insideUser') {
        return this.forSelectionHandleItems(handleInfos, [
          'follow',
          'export',
          'delete'
        ])
      } else if (this.crmType == 'receive') {
        return this.forSelectionHandleItems(handleInfos, [
          'export',
          'delete'
        ])
      } else if (this.crmType == 'refund') {
        return this.forSelectionHandleItems(handleInfos, [
          'export',
          'delete'
        ])
      } else if (this.crmType == 'classroom') {
        return this.forSelectionHandleItems(handleInfos, [
          'mode',
          'delete'
        ])
      } else if (this.crmType == 'class') {
        return this.forSelectionHandleItems(handleInfos, [
          'mode_class',
          'delete',
          'schedule',
          'close',
          'insert_class'
        ])
      } else if (this.crmType == 'classschedule') {
        return this.forSelectionHandleItems(handleInfos, [
          'shift',
          'insert_class',
          'confirm',
          'delete'
        ])
      } else if (this.crmType == 'studentschedule') {
        return this.forSelectionHandleItems(handleInfos, [
          'leave',
          'delete'
        ])
      }
    },
    forSelectionHandleItems(handleInfos, array) {
      var tempsHandles = []
      for (let index = 0; index < array.length; index++) {
        tempsHandles.push(handleInfos[array[index]])
      }
      return tempsHandles
    },
    // 判断是否展示
    whetherTypeShowByPermision: function(type) {
      if (type == 'transfer') {
        if (this.crmType == 'student') {
          if (this.selectionList.length == 1) {
            return this.crm[this.crmType].transfer
          } else {
            return false
          }
        }
        return this.sceneData.bydata == 'transform'
          ? false
          : this.crm[this.crmType].transfer
      } else if (type == 'transform') {
        return this.sceneData.bydata == 'transform'
          ? false
          : this.crm[this.crmType].transform
      } else if (type == 'export') {
        if (this.isSeas) {
          return this.crm.pool.excelexport
        }
        if (this.crm[this.crmType]) {
          return this.crm[this.crmType].excelexport
        } else {
          return true
        }
      } else if (type == 'delete') {
        if (this.isSeas) {
          return this.crm.pool.delete
        }
        if (this.crmType == 'capitalAccount') {
          const regordRes = []
          for (let index = 0; index < this.selectionList.length; index++) {
            const element = this.selectionList[index]
            if ((element.price == null || parseFloat(element.price) == 0) &&
            (element.surplus == null || parseFloat(element.surplus) == 0)) {
              regordRes.push(true)
            } else {
              regordRes.push(false)
            }
          }
          if (regordRes.includes(false)) {
            return false
          } else {
            return this.crm[this.crmType].delete
          }
        } else if (this.crmType == 'classroom') {
          return this.education[this.crmType].delete
        } else if (this.crmType == 'class') {
          const isDel = []
          for (let index = 0; index < this.selectionList.length; index++) {
            const element = this.selectionList[index]
            isDel.push(element.isCourse)
          }
          if (isDel.includes('是')) {
            return false
          } else {
            return this.education[this.crmType].delete
          }
        } else if (this.crmType == 'classschedule' || this.crmType == 'studentschedule') {
          const statusList = []
          this.selectionList.forEach(item => {
            statusList.push(item.classConfirmation)
          })
          if (statusList.includes(1)) {
            return false
          } else {
            return this.education[this.crmType].delete
          }
        } else {
          return this.crm[this.crmType].delete
        }
      } else if (type == 'put_seas') {
        // 放入公海(客户)
        return this.crm[this.crmType].putinpool
      } else if (type == 'lock' || type == 'unlock') {
        // 锁定解锁(客户)
        return this.crm[this.crmType].lock
      } else if (type == 'add_user' || type == 'delete_user') {
        // 添加 移除团队成员
        return this.crm[this.crmType].teamsave
      } else if (type == 'alloc') {
        // 分配(公海)
        return this.crm.pool.distribute
      } else if (type == 'get') {
        // 领取(公海)
        return this.crm.pool.receive
      } else if (type == 'start') {
        // 上架 下架(产品)
        for (let index = 0; index < this.selectionList.length; index++) {
          const element = this.selectionList[index]
          if (element.是否上下架 == '上架') {
            return false
          }
        }
        return this.crm[this.crmType].status
      } else if (type == 'disable') {
        // 上架 下架(产品)
        for (let index = 0; index < this.selectionList.length; index++) {
          const element = this.selectionList[index]
          console.log(element, 'njkiii---')
          if (element.是否上下架 == '下架') {
            return false
          }
        }
        return this.crm[this.crmType].status
      } else if (type == 'deal_status') {
        // 客户状态修改
        return this.crm[this.crmType].dealStatus
      } else if (type === 'transformLead') {
        return true
      } else if (type == 'state_start' || type == 'state_disable') {
        // 活动停用/启用
        return this.crm[this.crmType].updateStatus
      } else if (type === 'assignHeadTeacher') {
        return this.crm[this.crmType].assignHeadTeacher
      } else if (type == 'online_recharge') {
        if (this.selectionList.length == 1) {
          return this.crm[this.crmType].onlineCollection
        } else {
          return false
        }
      } else if (type == 'offline_recharge') {
        if (this.selectionList.length == 1) {
          return this.crm[this.crmType].offlineCollection
        } else {
          return false
        }
      } else if (type == 'refound') {
        if (this.selectionList.length == 1) {
          return this.crm[this.crmType].refund
        } else {
          return false
        }
      } else if (type == 'dispute') {
        if (this.crm[this.crmType].dispute) {
          if (this.selectionList.length == 1) {
            return true
          } else {
            return false
          }
        }
      } else if (type == 'follow') {
        if (this.selectionList.length == 1) {
          return this.crm[this.crmType].activity
        } else {
          return false
        }
      } else if (type == 'give_up') {
        if (this.selectionList.length == 1) {
          return this.crm[this.crmType].abandon
        } else {
          return false
        }
      } else if (type == 'confirm_give_up') {
        if (this.selectionList.length == 1) {
          return this.crm[this.crmType].affirmabandon
        } else {
          return false
        }
      } else if (type == 'mark_alloc') {
        if (this.selectionList.length == 1 && this.selectionList[0].isNew != 0 && this.selectionList[0].channel != '特殊关系') {
          return this.crm[this.crmType].distributionOfEarnings
        } else {
          return false
        }
      } else if (type == 'update_contract') {
        if (this.selectionList.length == 1 && this.selectionList[0].checkStatus == 1 && this.selectionList[0].contractType != 2 && this.selectionList[0].allotStatus == '是') {
          return this.crm[this.crmType].update
        } else {
          return false
        }
      } else if (type == 'mode') {
        if (this.selectionList.length === 1) {
          return this.education[this.crmType].update
        } else {
          return false
        }
      } else if (type == 'schedule') {
        if (this.selectionList.length === 1 && this.selectionList[0].status === 1) {
          return this.education[this.crmType].course
        } else {
          return false
        }
      } else if (type == 'close') {
        const status = []
        for (let index = 0; index < this.selectionList.length; index++) {
          const element = this.selectionList[index]
          if (!(element.usageTimes || element.usageTimes) && element.status === 1) {
            status.push('close')
          } else if (element.status === 2) {
            status.push('open')
          }
        }
        if (status.includes('close') && status.includes('open')) {
          return false
        } else if (status.includes('close') && !(status.includes('open'))) {
          this.closeTxt = '关闭'
          return this.education[this.crmType].close
        } else if (status.includes('open') && !(status.includes('close'))) {
          this.closeTxt = '开启'
          return this.education[this.crmType].close
        } else {
          return false
        }
      } else if (type == 'insert_class') {
        if (this.selectionList.length === 1) {
          if (this.crmType == 'class' && this.selectionList[0].notOn) {
            return this.education[this.crmType].insert
          } else if (this.crmType == 'classschedule' && this.selectionList[0].actualNumber < this.selectionList[0].totalNumber) {
            return this.education[this.crmType].insert
          } else {
            return false
          }
        } else {
          return false
        }
      } else if (type == 'confirm') {
        if (this.selectionList.length === 1 && this.selectionList[0].classConfirmationName == '未确认') {
          return this.education[this.crmType].confirm
        } else {
          return false
        }
      } else if (type == 'shift') {
        if (this.selectionList.length === 1) {
          return this.education[this.crmType].shifts
        } else {
          return false
        }
      } else if (type == 'leave') {
        // 默认仅适用于--教务管理--学员排课表studentschedule
        const statusList = []
        this.selectionList.forEach(item => {
          statusList.push(item.classConfirmation)
        })
        if (statusList.includes(1)) {
          return false
        } else {
          return this.education[this.crmType].leave
        }
      } else if (type == 'mode_class') {
        if (this.selectionList.length === 1) {
          if (this.crmType == 'class' && this.selectionList[0].isCourse === '否') {
            return this.education[this.crmType].update
          } else if (this.crmType == 'classroom') {
            return this.education[this.crmType].update
          } else {
            return false
          }
        } else {
          return false
        }
      } else if (type == 'raise_warning' || type == 'dismiss_warning') {
        return true
      }

      return true
    },
    // 子组件 回调的 结果
    handleCallBack(data) {
      this.$emit('handle', { type: data.type })
    },
    // 获取默认场景名字
    getDefaultSceneName() {
      if (this.crmType == 'leads') {
        return '全部线索'
      } else if (this.crmType == 'customer') {
        return '全部LEADS'
      } else if (this.crmType == 'contacts') {
        return '全部联系人'
      } else if (this.crmType == 'business') {
        return '全部商机'
      } else if (this.crmType == 'contract') {
        return '全部合同'
      } else if (this.crmType == 'receivables') {
        return '全部回款'
      } else if (this.crmType == 'product') {
        return '全部课程单品'
      } else if (this.crmType === 'applet') {
        return '全部名片线索'
      } else if (this.crmType === 'visit') {
        return '全部回访'
      } else if (this.crmType == 'capitalAccount') {
        return '全部学员'
      } else if (this.crmType == 'productSetMeal') {
        return '全部套餐'
      } else if (this.crmType == 'insideUser') {
        return '全部通讯录'
      } else if (this.crmType == 'student') {
        return '全部学员'
      } else if (this.crmType == 'receive') {
        return '全部合同充值'
      } else if (this.crmType == 'classroom') {
        return '全部教室'
      } else if (this.crmType == 'class') {
        return '全部班级'
      } else if (this.crmType == 'classschedule') {
        return '全部班级排课表'
      } else if (this.crmType == 'studentschedule') {
        return '全部学员排课表'
      } else if (this.crmType == 'studentWarning') {
        return '全部预警'
      }
    },

    // 全局检索
    globalSearch() {
      this.globalSearchShow = true
    },
    // 保存成功
    createSaveSuccess(data) {
      console.log('保存成功')
      this.$emit('handle', { type: data.type })
    },
    hideView(type) {
      if (type == 'insert_class') {
        this.isInsert = false
      } else if (type == 'schedule') {
        this.isRank = false
      } else if (type == 'confirm') {
        this.isConfirm = false
      } else if (type == 'shift') {
        this.isShift = false
      } else if (type == 'mode') {
        this.isClassroom = false
      } else if (type == 'mode_class') {
        this.isClass = false
      } else if (type == 'raise_warning') {
        this.isWarning = false
      } else if (type == 'dismiss_warning') {
        this.isDismiss = false
      } else {
        this.isUpdate = false
      }
    },
    saveSuccess() {
      console.log('插班成功')
    }
  }
}
</script>
<style lang="scss" scoped>
.table-head-container {
  border-bottom: 1px solid #e6e6e6;
}

.th-container {
  font-size: 13px;
  height: 50px;
  padding: 0 20px;

  .scene-select {
    width: 180px;
    /deep/ .el-input__inner {
      cursor: pointer;
    }
  }

  .filter-button {
    margin-left: 20px;
    /deep/ i {
      font-size: 14px;
      margin-right: 5px;
    }
  }
}
/** 场景和筛选 */
.condition_title {
  cursor: pointer;
}
.condition_title:hover {
  color: $xr-color-primary;
}

.m-arrow {
  margin: 0 8px;
}
.c-filtrate {
  margin: 0 10px 0 30px;
  width: 12px;
}

/** 勾选操作 */
.selection-bar {
  font-size: 12px;
  height: 50px;
  padding: 0 20px;
  color: #777;

  .selected—title {
    flex-shrink: 0;
    padding-right: 20px;
    color: #333;
    .selected—count {
      color: $xr-color-primary;
    }
  }
}

.selection-items-box {
  overflow-x: auto;
  overflow-y: hidden;
  padding: 0 15px;

  .el-button {
    color: #666;
    background-color: $xr--background-color-base;
    border-color: $xr--background-color-base;
    font-size: 12px;
    height: 28px;
    border-radius: 14px;
    /deep/ i {
      font-size: 12px;
      margin-right: 5px;
    }
  }

  .el-button--primary:hover {
    background: $xr-color-primary;
    border-color: $xr-color-primary;
    color: #ffffff;
  }

  .el-button + .el-button {
    margin-left: 15px;
  }
}
</style>
