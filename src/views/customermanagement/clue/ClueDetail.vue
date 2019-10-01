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
        :detail="detailData"
        :head-details="headDetails"
        :id="id"
        crm-type="leads"
        @handle="detailHeadHandle"
        @close="hideView"/>
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
              :handle="activityHandle"
              crm-type="customer" />
          </el-tab-pane>
        </el-tabs>
        <transition name="slide-fade">
          <el-tabs
            v-show="showImportInfo"
            value="chiefly-contacts"
            type="border-card"
            class="d-container-bd--right">
            <el-tab-pane
              label="重要信息"
              name="chiefly-contacts"
              lazy>
              <import-info :list="importList" />
            </el-tab-pane>
          </el-tabs>
        </transition>
      </flexbox>
    </flexbox>

    <el-button
      class="firse-button"
      @click="showImportInfo= !showImportInfo">重<br>要<br>信<br>息<br><i :class="{ 'is-reverse': !showImportInfo }" class="el-icon-arrow-right el-icon--right" /></el-button>
    <c-r-m-create-view
      v-if="isCreate"
      :action="{type: 'update', id: id, batchId: detailData.batchId}"
      crm-type="leads"
      @save-success="editSaveSuccess"
      @hiden-view="isCreate=false"/>
  </slide-view>
</template>

<script>
import { crmLeadsRead } from '@/api/customermanagement/clue'
import { filedGetInformation } from '@/api/customermanagement/common'
import crmTypeModel from '@/views/customermanagement/model/crmTypeModel'

import SlideView from '@/components/SlideView'
import CRMDetailHead from '../components/CRMDetailHead'
import Activity from '../components/activity'
import ImportInfo from './components/ImportInfo' // 重要信息
import CRMBaseInfo from '../components/CRMBaseInfo' // 线索基本信息
import RelativeFiles from '../components/RelativeFiles' // 相关附件
import RelativeHandle from '../components/RelativeHandle' // 相关操作

import CRMCreateView from '../components/CRMCreateView' // 新建页面
import detail from '../mixins/detail'

export default {
  // 线索管理 的 线索详情
  name: 'ClueDetail',
  components: {
    SlideView,
    CRMDetailHead,
    Activity,
    CRMBaseInfo,
    RelativeFiles,
    RelativeHandle,
    ImportInfo,
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
      crmType: 'leads',
      // 详情
      detailData: {},
      headDetails: [
        { title: '姓名', value: '' },
        { title: '线索来源', value: '' },
        { title: '手机', value: '' },
        { title: '负责人', value: '' },
        { title: '创建时间', value: '' }
      ],
      tabNames: [
        { label: '活动', name: 'Activity' },
        { label: '附件', name: 'RelativeFiles' },
        { label: '操作记录', name: 'RelativeHandle' }
      ],
      tabCurrentName: 'Activity',
      // 编辑操作
      isCreate: false,
      // 活动操作
      activityHandle: [
        {
          type: 'log',
          label: '写跟进'
        }
      ],
      // 展示重要信息
      showImportInfo: true,
      importList: []
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
      crmLeadsRead({
        leadsId: this.id
      })
        .then(res => {
          this.detailData = res.data

          this.headDetails[0].value = res.data.name
          this.headDetails[1].value = res.data.线索来源
          this.headDetails[2].value = res.data.mobile
          // 负责人
          this.headDetails[3].value = res.data.ownerUserName
          this.headDetails[4].value = res.data.createTime
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
      this.getBaseInfo()
    },

    /**
     * 获取基础信息
     */
    getBaseInfo() {
      this.loading = true
      filedGetInformation({
        types: crmTypeModel[this.crmType],
        id: this.id
      })
        .then(res => {
          this.importList = res.data
          this.loading = false
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
