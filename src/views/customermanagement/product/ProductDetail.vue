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
              lazy>
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
import { crmProductRead } from '@/api/customermanagement/product'

import SlideView from '@/components/SlideView'
import CRMDetailHead from '../components/CRMDetailHead'
import CRMBaseInfo from '../components/CRMBaseInfo' // 产品基本信息
import RelativeFiles from '../components/RelativeFiles' // 相关附件
import RelativeHandle from '../components/RelativeHandle' // 相关操作

import CRMCreateView from '../components/CRMCreateView' // 新建页面
import detail from '../mixins/detail'
import DetailImg from './components/detailImg'
export default {
  // 客户管理 的 产品详情
  name: 'ProductDetail',
  components: {
    SlideView,
    CRMDetailHead,
    DetailImg,
    CRMBaseInfo,
    RelativeFiles,
    RelativeHandle,
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
      crmType: 'product',
      headDetails: [
        { title: '产品类别', value: '' },
        { title: '产品单位', value: '' },
        { title: '产品价格', value: '' },
        { title: '产品编码', value: '' }
      ],
      tabCurrentName: 'CRMBaseInfo',
      // 编辑操作
      isCreate: false
    }
  },
  computed: {
    tabNames() {
      return [
        { label: '基本信息', name: 'CRMBaseInfo' },
        { label: this.getTabName('附件', this.tabsNumber.fileCount), name: 'RelativeFiles' },
        { label: '操作记录', name: 'RelativeHandle' },
        { label: '产品图片详情', name: 'DetailImg' }
      ]
    }
  },
  mounted() {},
  methods: {
    /**
     * 详情
     */
    getDetial() {
      this.loading = true
      crmProductRead({
        productId: this.id
      })
        .then(res => {
          this.loading = false
          this.detailData = res.data

          this.headDetails[0].value = res.data.categoryName
          this.headDetails[1].value = res.data.单位
          this.headDetails[2].value = res.data.price
          this.headDetails[3].value = res.data.num
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
