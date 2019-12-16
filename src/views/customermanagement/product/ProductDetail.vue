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
              <c-r-m-base-info
                v-if="item.name === 'CRMBaseInfo'"
                :is="item.name"
                :detail="detailData"
                :id="id"
                :crm-type="crmType">
                <sections
                  class="b-cells"
                  title="产品图片"
                  content-height="auto">
                  <div class="image">
                    <div v-if="primaryUrl" class="image-info">
                      <div class="image-info__label">产品主图</div>
                      <img
                        v-src="primaryUrl"
                        :key="primaryUrl"
                        class="main-img">
                    </div>
                    <div v-if="detaiUrl" class="image-info">
                      <div class="image-info__label">详情图片</div>
                      <img
                        v-src="detaiUrl"
                        :key="detaiUrl"
                        class="detial-img">
                    </div>
                    <div v-if="!detaiUrl && !primaryUrl" class="no-img">暂无图片</div>
                  </div>
                </sections>
              </c-r-m-base-info>
              <component
                v-else
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
import DetailImg from './components/DetailImg'
import Sections from '../components/Sections'

import detail from '../mixins/detail'

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
    CRMCreateView,
    Sections
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
        { label: '详细资料', name: 'CRMBaseInfo' },
        { label: this.getTabName('附件', this.tabsNumber.fileCount), name: 'RelativeFiles' },
        { label: '操作记录', name: 'RelativeHandle' },
        { label: '产品图片详情', name: 'DetailImg' }
      ]
    },
    primaryUrl() {
      if (this.detail && this.detail.mainFile) {
        return this.detail.mainFile.filePath
      }

      return ''
    },

    detaiUrl() {
      if (this.detail && this.detail.detailFileList && this.detail.detailFileList.length > 0) {
        return this.detail.detailFileList[0].filePath
      }

      return ''
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
.image {
  color: #333;
  &-info {
    margin: 10px 25px 0;

    &__label {
      font-size: 13px;
    }

    img {
      margin-top: 15px;
      border-radius: $xr-border-radius-base;
    }

    .main-img {
      width: 290px;
      height: 220px;
    }

    .detial-img {
      width: 375px;
      height: 300px;
    }
  }

  .no-img {
    color: #666;
    margin: 50px 0;
    text-align: center;
  }
}
@import '../styles/crmdetail.scss';
</style>
