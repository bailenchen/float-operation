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
          :is-seas="isSeasDetail"
          :detail="detailData"
          :model-data="modelData"
          :head-details="headDetails"
          :id="id"
          :pool-id="poolId"
          :crm-type="crmType"
          :click-field="clickField"
          @handle="detailHeadHandle"
          @close="hideView"/>

        <examine-info
          v-if="detailData.examineRecordId"
          :id="id"
          :record-id="detailData.examineRecordId"
          :owner-user-id="detailData.ownerUserId"
          module-type=""
          class="examine-info"
          examine-type="crm_refund"/>

        <flexbox
          class="d-container-bd"
          align="stretch">
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
                :id="id"
                :pool-id="poolId"
                :is-seas="isSeasDetail"

                :crm-type="crmType"
                @on-handle="detailHeadHandle" />
            </el-tab-pane>
          </el-tabs>

        </flexbox>
      </flexbox>
    </div>

    <c-r-m-create-view
      v-if="isCreate"
      :action="createActionInfo"
      :crm-type="createCRMType"
      @save-success="editSaveSuccess"
      @hiden-view="isCreate=false" />
  </slide-view>
</template>

<script>
import { crmRefundReadAPI } from '@/api/customermanagement/refund'
import SlideView from '@/components/SlideView'
import CRMDetailHead from '../../components/CRMDetailHead'
import CRMBaseInfo from '../../components/CRMBaseInfo' // 基本信息
import RelativeFiles from '../../components/RelativeFiles' // 相关附件
import RelativeHandle from '../../components/RelativeHandle' // 相关操作
import ExamineInfo from '@/components/Examine/ExamineInfo'
import CRMCreateView from '../../components/CRMCreateView' // 新建页面
import detail from '../../mixins/detail'
import { filedGetInformation } from '@/api/customermanagement/common'

export default {
  name: 'RefundDetail',
  components: {
    SlideView,
    CRMDetailHead,
    CRMBaseInfo,
    RelativeFiles,
    RelativeHandle,
    CRMCreateView,
    ExamineInfo
  },
  mixins: [detail],
  props: {
    // 详情信息id
    id: [String, Number],
    poolId: [String, Number],
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
    },
    /** 呼出信息 */
    modelData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    clickField: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 展示加载loading
      loading: false,
      crmType: 'refund',
      headDetails: [
        { title: '学员姓名', value: '' },
        { title: '合同充值返还日期', value: '' },
        { title: '合同充值返还金额（元）', value: '' },
        { title: '课程顾问', value: '' }
      ],
      tabCurrentName: 'CRMBaseInfo',
      // 编辑操作
      createActionInfo: null,
      createCRMType: '',
      isCreate: false
    }
  },
  computed: {
    tabNames() {
      var tempsTabs = []
      if (this.crm.refund && this.crm.refund.read) {
        tempsTabs.push({ label: '详细资料', name: 'CRMBaseInfo' })
      }

      if (this.tabsNumber && this.tabsNumber.hasOwnProperty('callRecordCount')) {
        tempsTabs.push({ label: this.getTabName('呼叫记录', this.tabsNumber.callRecordCount), name: 'RelativeCallRecord' })
      }
      tempsTabs.push({ label: this.getTabName('附件', this.tabsNumber.fileCount), name: 'RelativeFiles' })
      tempsTabs.push({ label: '操作记录', name: 'RelativeHandle' })
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
    /**
     * 详情
     */
    getDetial() {
      this.loading = true
      const params = {
        refundId: this.id
      }

      if (this.poolId) {
        params.poolId = this.poolId
      }

      crmRefundReadAPI(params)
        .then(res => {
          this.loading = false
          this.detailData = res.data

          this.headDetails[0].value = res.data.customerName
          this.headDetails[1].value = res.data.refundTime
          this.headDetails[2].value = res.data.money
          this.headDetails[3].value = res.data.ownerUserName
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
     * 顶部头 操作
     * @param {*} data
     */
    detailHeadHandle(data) {
      if (data.type === 'edit') {
        var params = { types: 29, id: this.id }
        filedGetInformation(params).then(res => {
          console.log('Information', res.data)
          this.createCRMType = 'refund'
          this.createActionInfo = {
            type: 'update',
            id: this.id,
            batchId: this.detailData.batchId,
            information: res.data
          }
          this.isCreate = true
        }).catch(() => {})
      } else if (data.type === 'delete' || data.type === 'exit-team') {
        this.hideView()
      }
      this.$emit('handle', data)
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

.wk-circle-password  {
  background-color: #f56c6c;
  color: white;
  margin-left: 5px;
  border-radius: 3px;
  font-size: 12px;
  padding: 2px;
  transform: scale(0.6);
}
@import '../../styles/crmdetail';
</style>
