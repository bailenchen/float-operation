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
                v-if="item.name === 'CRMEditBaseInfo'"
                :is="item.name"
                :detail="detailData"
                :id="id"
                :crm-type="crmType"/>
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
      :action="{type: 'update', id: id, batchId: detailData.batchId, editDetail: detailData}"
      :crm-type="crmType"
      @save-success="editSaveSuccess"
      @hiden-view="isCreate=false"/>
  </slide-view>
</template>

<script>
import { crmReturnVisitReadAPI } from '@/api/customermanagement/visit'

import SlideView from '@/components/SlideView'
import CRMDetailHead from '../components/CRMDetailHead'
import CRMEditBaseInfo from '../components/CRMEditBaseInfo' // 产品基本信息
import CRMBaseInfo from '../components/CRMBaseInfo' // 产品基本信息
import RelativeFiles from '../components/RelativeFiles' // 相关附件
import RelativeHandle from '../components/RelativeHandle' // 相关操作

import CRMCreateView from '../components/CRMCreateView' // 新建页面
import Sections from '../components/Sections'

import detail from '../mixins/detail'

export default {
  name: 'VisitDetail', // 回访详情
  components: {
    SlideView,
    CRMDetailHead,
    CRMEditBaseInfo,
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
      crmType: 'visit',
      headDetails: [
        { title: '学员姓名', value: '', field: 'customerName' },
        { title: '第一联系人电话', value: '', field: 'mobile' },
        { title: '课程顾问', value: '', field: 'ownerUserName' },
        { title: '作者', value: '', field: 'authorName' }
      ],
      // tabCurrentName: 'CRMEditBaseInfo',
      tabCurrentName: 'CRMBaseInfo',
      // 编辑操作
      isCreate: false
    }
  },
  computed: {
    tabNames() {
      return [
        // { label: '详细资料', name: 'CRMEditBaseInfo' },
        { label: '详细资料', name: 'CRMBaseInfo' },
        { label: this.getTabName('附件', this.tabsNumber.fileCount), name: 'RelativeFiles' },
        { label: '操作记录', name: 'RelativeHandle' }
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
      crmReturnVisitReadAPI({
        visitId: this.id
      })
        .then(res => {
          this.loading = false
          this.detailData = res.data

          this.headDetails.forEach(o => {
            o.value = res.data[o.field] || '--'
          })
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
      this.$bus.emit('crm-detail-update')
      this.getDetial()
    },

    /**
     * 预览图片
     */
    previewImage(list, index) {
      this.$bus.emit('preview-image-bus', {
        index: index,
        data: list.map(item => {
          item.url = item.filePath
          return item
        })
      })
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

    &__list {
      overflow-x: auto;
      white-space: nowrap;

      img {
        margin-top: 15px;
        border-radius: $xr-border-radius-base;
        cursor: pointer;
      }

      img + img {
        margin-left: 20px;
      }

      .main-img {
        width: 100px;
        height: 76px;
      }

      .detial-img {
        width: 100px;
        height: 80px;
      }
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
