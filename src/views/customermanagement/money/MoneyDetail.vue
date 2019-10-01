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
    <div
      v-loading="loading"
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
          @close="hideView"/>
        <examine-info
          :id="id"
          :record-id="detailData.examineRecordId"
          :owner-user-id="detailData.ownerUserId"
          class="examine-info"
          examine-type="crm_receivables"/>
        <flexbox class="d-container-bd" align="stretch">
          <el-tabs
            v-model="tabCurrentName"
            type="border-card"
            class="d-container-bd--left">
            <el-tab-pane
              v-for="(item, index) in tabNames"
              :key="index"
              :label="item.label"
              :name="item.name"
              lazy
              class="t-loading-content">
              <component
                :is="item.name"
                :detail="detailData"
                :id="id"
                :crm-type="crmType" />
            </el-tab-pane>
          </el-tabs>
        </flexbox>
      </flexbox>
    </div>

    <c-r-m-create-view
      v-if="isCreate"
      :action="{type: 'update', id: id, batchId: detailData.batchId}"
      :crm-type="crmType"
      @save-success="editSaveSuccess"
      @hiden-view="isCreate=false"/>
  </slide-view>
</template>

<script>
import { crmReceivablesRead } from '@/api/customermanagement/money'

import SlideView from '@/components/SlideView'
import CRMDetailHead from '../components/CRMDetailHead'
import CRMBaseInfo from '../components/CRMBaseInfo' // 基本信息
import RelativeHandle from '../components/RelativeHandle' // 相关操作
import CRMCreateView from '../components/CRMCreateView' // 新建页面
import ExamineInfo from '@/components/Examine/ExamineInfo'
import detail from '../mixins/detail'

export default {
  // 客户管理 的 回款详情
  name: 'MoneyDetail',
  components: {
    SlideView,
    CRMDetailHead,
    CRMBaseInfo,
    RelativeHandle,
    ExamineInfo,
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
      // 展示加载loading
      loading: false,
      crmType: 'receivables',
      // 名称
      name: '',
      headDetails: [
        { title: '客户名称', value: '' },
        { title: '合同金额', value: '' },
        { title: '合同名称', value: '' },
        { title: '回款日期', value: '' },
        { title: '回款金额', value: '' },
        { title: '负责人', value: '' }
      ],
      tabNames: [
        { label: '基本信息', name: 'CRMBaseInfo' },
        { label: '操作记录', name: 'RelativeHandle' }
      ],
      tabCurrentName: 'CRMBaseInfo',
      // 编辑操作
      isCreate: false
    }
  },
  computed: {},
  mounted() {},
  methods: {
    /**
     * 详情
     */
    getDetial() {
      this.loading = true
      crmReceivablesRead({
        receivablesId: this.id
      })
        .then(res => {
          this.loading = false
          this.name = res.data.number
          this.detailData = res.data
          //   // 负责人
          this.headDetails[0].value = res.data.customerName
          this.headDetails[1].value = res.data.contractMoney
          this.headDetails[2].value = res.data.contractName
          this.headDetails[3].value = res.data.returnTime
          this.headDetails[4].value = res.data.money
          this.headDetails[5].value = res.data.ownerUserName
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 关闭
     */
    hideView() {
      this.$emit('hide-view')
    },

    /**
     * 编辑成功
     */
    editSaveSuccess() {
      this.$emit('handle', { type: 'save-success' })
      this.getDetial()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/crmdetail.scss';
</style>
