<template>
  <slide-view
    v-empty="!canShowDetail"
    :listener-ids="listenerIDs"
    :no-listener-ids="noListenerIDs"
    :no-listener-class="noListenerClass"
    :body-style="{padding: 0, height: '100%'}"
    xs-empty-icon="nopermission"
    xs-empty-text="暂无权限"
    @close="hideView">
    <flexbox
      v-loading="loading"
      v-if="canShowDetail"
      direction="column"
      align="stretch"
      class="d-container">
      <c-r-m-detail-head
        :is-seas="isSeasDetail"
        :detail="detailData"
        :head-details="headDetails"
        :id="id"
        crm-type="customer"
        @handle="detailHeadHandle"
        @close="hideView" />
      <flexbox class="d-container-bd" align="stretch">
        <el-tabs
          v-model="tabCurrentName"
          type="border-card"
          class="d-container-bd--left"
          @tab-click="handleClick">
          <el-tab-pane
            v-for="(item, index) in tabnames"
            :key="index"
            :label="item.label"
            :name="item.name"
            lazy
            class="t-loading-content">
            <component
              :is="item.name"
              :detail="detailData"
              :id="id"
              :handle="activityHandle"
              :is-seas="isSeasDetail"
              crm-type="customer" />
          </el-tab-pane>
        </el-tabs>
        <transition name="slide-fade">
          <el-tabs
            v-if="showFirstDetail"
            value="chiefly-contacts"
            type="border-card"
            class="d-container-bd--right">
            <el-tab-pane
              label="重要信息"
              name="chiefly-contacts"
              lazy>
              <chiefly-contacts/>
            </el-tab-pane>
          </el-tabs>
        </transition>

      </flexbox>
    </flexbox>

    <el-button
      class="firse-button"
      @click="showFirstDetail= !showFirstDetail">重<br>要<br>信<br>息<br><i class="el-icon-arrow-right el-icon--right" /></el-button>
    <c-r-m-create-view
      v-if="isCreate"
      :action="{type: 'update', id: id, batchId: detailData.batchId}"
      crm-type="customer"
      @save-success="editSaveSuccess"
      @hiden-view="isCreate=false" />
  </slide-view>
</template>

<script>
import { crmCustomerRead } from '@/api/customermanagement/customer'

import SlideView from '@/components/SlideView'
import CRMDetailHead from '../components/CRMDetailHead'
import CustomerFollow from './components/CustomerFollow' // 跟进记录
import Activity from '../components/activity'
import ChieflyContacts from './components/ChieflyContacts' // 首要联系人
import CRMBaseInfo from '../components/CRMBaseInfo' // 基本信息
import RelativeContacts from '../components/RelativeContacts' // 相关联系人
import RelativeBusiness from '../components/RelativeBusiness' // 相关商机
import RelativeContract from '../components/RelativeContract' // 相关合同
import RelativeReturnMoney from '../components/RelativeReturnMoney' // 相关回款
import RelativeFiles from '../components/RelativeFiles' // 相关附件
import RelativeHandle from '../components/RelativeHandle' // 相关操作
import RelativeTeam from '../components/RelativeTeam' // 相关团队

import CRMCreateView from '../components/CRMCreateView' // 新建页面
import detail from '../mixins/detail'

export default {
  /** 客户管理 的 客户详情 */
  name: 'CustomerDetail',
  components: {
    SlideView,
    CustomerFollow,
    Activity,
    ChieflyContacts,
    CRMDetailHead,
    CRMBaseInfo,
    RelativeContacts,
    RelativeBusiness,
    RelativeContract,
    RelativeReturnMoney,
    RelativeFiles,
    RelativeHandle,
    RelativeTeam,
    CRMCreateView
  },
  mixins: [detail],
  props: {
    // 详情信息id
    id: [String, Number],
    // 监听的dom 进行隐藏详情
    listenerIDs: {
      type: Array,
      default: () => {
        return ['crm-main-container']
      }
    },
    // 不监听
    noListenerIDs: {
      type: Array,
      default: () => {
        return []
      }
    },
    noListenerClass: {
      type: Array,
      default: () => {
        return ['el-table__body']
      }
    }
  },
  data() {
    return {
      loading: false, // 展示加载loading
      crmType: 'customer',
      detailData: {}, // read 详情
      headDetails: [
        { title: '客户级别', value: '' },
        { title: '成交状态', value: '' },
        { title: '负责人', value: '' },
        { title: '更新时间', value: '' }
      ],
      tabCurrentName: 'Activity',
      isCreate: false, // 编辑操作
      // 活动操作
      activityHandle: [
        {
          type: 'log',
          label: '写跟进'
        }, {
          type: 'task',
          label: '创建任务'
        }, {
          type: 'email',
          label: '发邮件'
        }, {
          type: 'business',
          label: '创建商机'
        }, {
          type: 'contract',
          label: '创建合同'
        }, {
          type: 'contacts',
          label: '创建联系人  '
        }, {
          type: 'receivables',
          label: '创建回款  '
        }
      ]
    }
  },
  computed: {
    tabnames() {
      var tempsTabs = []
      tempsTabs.push({ label: '活动', name: 'Activity' })
      if (this.crm.customer && this.crm.customer.read) {
        tempsTabs.push({ label: '基本信息', name: 'c-r-m-base-info' })
      }
      if (this.crm.contacts && this.crm.contacts.index) {
        tempsTabs.push({ label: '联系人', name: 'relative-contacts' })
      }
      tempsTabs.push({ label: '相关团队', name: 'relative-team' })
      if (this.crm.business && this.crm.business.index) {
        tempsTabs.push({ label: '商机', name: 'relative-business' })
      }
      if (this.crm.contract && this.crm.contract.index) {
        tempsTabs.push({ label: '合同', name: 'relative-contract' })
      }
      if (this.crm.receivables && this.crm.receivables.index) {
        tempsTabs.push({ label: '回款信息', name: 'relative-return-money' })
      }
      tempsTabs.push({ label: '附件', name: 'file' })
      tempsTabs.push({ label: '操作记录', name: 'relative-handle' })
      return tempsTabs
    },
    /**
     * isSeas 是从公海模块传入的 配合详情is_pool字段确定
     */
    isSeasDetail() {
      if (this.detailData && this.detailData.hasOwnProperty('isPool')) {
        return this.detailData.isPool == 1
      }
      return this.isSeas
    }
  },
  mounted() {},
  methods: {
    getDetial() {
      this.loading = true
      crmCustomerRead({
        customerId: this.id
      })
        .then(res => {
          this.loading = false
          this.detailData = res.data
          // 负责人
          this.headDetails[0].value = res.data.客户级别
          const dealItem = this.headDetails[1]
          dealItem.showIcon = true
          dealItem.icon = res.data.dealStatus == '已成交' ? 'wk wk-success deal-suc' : 'wk wk-close deal-un'
          dealItem.style = res.data.dealStatus == '已成交' ? { fontSize: '14px', color: '#20b559', marginRight: '3px' } : { fontSize: '14px', color: '#f95a5a', marginRight: '3px' }
          dealItem.value = res.data.dealStatus
          this.headDetails[2].value = res.data.ownerUserName
          this.headDetails[3].value = res.data.updateTime
        })
        .catch(() => {
          this.loading = false
        })
    },
    //* * 点击关闭按钮隐藏视图 */
    hideView() {
      this.$emit('hide-view')
    },
    //* * tab标签点击 */
    handleClick(tab, event) {},
    editSaveSuccess() {
      this.$emit('handle', { type: 'save-success' })
      this.getDetial()
    }
  }
}
</script>

<style lang="scss" scoped>
.slide-fade-leave-active {
  will-change: transform;
  transition: all 0.1s;
}
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
@import '../styles/crmdetail.scss';
</style>
