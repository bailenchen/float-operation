<template>
  <slide-view
    v-empty="!canShowDetail"
    :listener-ids="listenerIDs"
    :no-listener-ids="noListenerIDs"
    :no-listener-class="noListenerClass"
    :body-style="{padding: 0, height: '100%'}"
    xs-empty-icon="nopermission"
    xs-empty-text="暂无权限"
    @afterEnter="viewAfterEnter"
    @close="hideView">
    <div
      v-loading="loading"
      ref="crmDetailMain"
      class="detail-main">
      <flexbox
        v-if="canShowDetail && detailData"
        direction="column"
        align="stretch"
        class="d-container">
        <c-r-m-detail-head
          :detail="detailData"
          :head-details="headDetails"
          :id="id"
          :crm-type="crmType"
          @handle="detailHeadHandle"
          @close="hideView">
          <template slot="name">
            <span v-if="detailData.checkStatus == 8" class="is-invalid">（已作废）</span>
          </template>
        </c-r-m-detail-head>

        <examine-info
          v-if="detailData.examineRecordId"
          :id="id"
          :record-id="detailData.examineRecordId"
          :owner-user-id="detailData.ownerUserId"
          class="examine-info"
          examine-type="crm_contract"
          @on-handle="examineHandle"/>

        <div class="d-container-bd">
          <el-tabs
            v-model="tabCurrentName"
            type="border-card"
            class="d-container-bd--left">
            <el-tab-pane
              v-for="(item, index) in tabNames"
              :key="index"
              :label="item.label"
              :name="item.name"
              lazy>
              <component
                :is="item.name"
                :detail="detailData"
                :type-list="logTyps"
                :id="id"
                :handle="activityHandle"
                :crm-type="crmType"
                @on-handle="detailHeadHandle" />
            </el-tab-pane>
          </el-tabs>
        </div>
      </flexbox>
    </div>
  </slide-view>
</template>

<script>
import { crmAccountWaterDetail } from '@/api/customermanagement/account'

import SlideView from '@/components/SlideView'
import CRMDetailHead from '../../components/CRMDetailHead'
import CRMEditBaseInfo from '../../components/CRMEditBaseInfo' // 商机基本信息
import RelativeHandle from '../../components/RelativeHandle' // 相关操作
import RelativeFiles from '../../components/RelativeFiles' // 相关附件
import ExamineInfo from '@/components/Examine/ExamineInfo'

import detail from '../../mixins/detail'
// import { separator } from '@/filters/vue-numeral-filter/filters'

export default {
  // 客户管理 的 合同详情
  name: 'ContractDetail',
  components: {
    SlideView,
    CRMDetailHead,
    CRMEditBaseInfo,
    RelativeHandle,
    RelativeFiles,
    ExamineInfo
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
      // 展示加载loading
      loading: false,
      crmType: 'water',
      headDetails: [
        { title: '学员编号', value: '' },
        { title: '交易类型', value: '' },
        { title: '支付方式', value: '' },
        { title: '金额（元）', value: '' }
      ],
      tabCurrentName: 'CRMEditBaseInfo',
      // 活动操作
      activityHandle: [
        {
          type: 'log',
          label: '写跟进'
        }
        // , {
        //   type: 'task',
        //   label: '创建任务'
        // }, {
        //   type: 'receivables',
        //   label: '创建回款'
        // }
      ]
    }
  },
  computed: {
    tabNames() {
      var tempsTabs = []
      if (this.crm.contract && this.crm.contract.read) {
        tempsTabs.push({ label: '详细资料', name: 'CRMEditBaseInfo' })
      }
      tempsTabs.push({ label: this.getTabName('附件', this.tabsNumber.fileCount), name: 'RelativeFiles' })
      tempsTabs.push({ label: '操作记录', name: 'RelativeHandle' })
      return tempsTabs
    },

    /**
     * 根据记录筛选
     */
    logTyps() {
      return [{
        icon: 'all',
        color: '#2362FB',
        command: '',
        label: '全部活动'
      }, {
        icon: 'contract',
        color: '#FD5B4A',
        command: 6,
        label: '合同'
      }, {
        icon: 'o-task',
        color: '#D376FF',
        command: 11,
        label: '任务'
      }, {
        icon: 'receivables',
        color: '#FFB940',
        command: 7,
        label: '回款'
      }, {
        icon: 'log',
        color: '#5864FF',
        command: 8,
        label: '日志'
      }, {
        icon: 'approve',
        color: '#9376FF',
        command: 9,
        label: '审批'
      }]
    }
  },
  mounted() {
    if (this.crm.contract && this.crm.contract.read) {
      this.tabCurrentName = 'CRMEditBaseInfo'
    }
  },
  methods: {
    /**
     * 详情
     */
    getDetial() {
      this.loading = true
      crmAccountWaterDetail({
        waterId: this.id
      })
        .then(res => {
          this.loading = false
          // 创建回款计划的时候使用
          this.detailData = res.data

          this.headDetails[0].value = res.data.leadsNumber
          this.headDetails[1].value = {
            1: '线下',
            2: '线上'
          }[res.data.transactionType]
          this.headDetails[2].value = {
            1: '线下资金收款',
            2: '资金退款'
          }[res.data.payment]
          this.headDetails[3].value = res.data.price
        })
        .catch(() => {
          this.loading = false
          this.hideView()
        })
    },

    /**
     * 关闭
     */
    hideView() {
      this.$emit('hide-view')
    },

    /**
     * 审核操作
     */
    examineHandle(data) {
      // 1 审核通过 2 审核拒绝 4 已撤回
      if (data.type == 1) {
        this.getDetial()
      }
      this.$emit('handle', { type: 'examine' })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/crmdetail.scss';
.is-invalid {
  color: #ccc;
}
</style>
