<template>
  <slide-view
    v-empty="!canShowDetail"
    :listener-ids="listenerIDs"
    :no-listener-ids="noListenerIDs"
    :no-listener-class="noListenerClass"
    :body-style="{padding: 0, height: '100%'}"
    xs-empty-icon="nopermission"
    xs-empty-text="暂无权限"
    class="d-view"
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
          crm-type="marketing"
          @handle="detailHeadHandle"
          @close="hideView"/>
        <flexbox class="d-container-bd" align="stretch">
          <el-tabs
            v-model="tabCurrentName"
            type="border-card"
            class="d-container-bd--left"
            @tab-click="handleClick">
            <el-tab-pane
              v-for="(item, index) in tabNames"
              :key="index"
              :label="item.label"
              :name="item.name"
              lazy>
              <c-r-m-base-info
                v-if="item.name === 'CRMBaseInfo'"
                :detail="detailData"
                :id="id"
                :filed-list="baseDetailList"
                crm-type="marketing">
                <sections
                  class="b-cells"
                  title="图片信息"
                  content-height="auto">
                  <div class="image">
                    <div v-if="mainFileList.length > 0" class="image-info">
                      <div class="image-info__label">活动图片</div>
                      <div class="image-info__list">
                        <img
                          v-src="item.filePath"
                          v-for="(item, index) in mainFileList"
                          :key="index"
                          class="main-img"
                          @click="previewImage(mainFileList, index)">
                      </div>
                    </div>
                    <div v-if="detailFileList.length > 0" class="image-info">
                      <div class="image-info__label">活动详情图片</div>
                      <div class="image-info__list">
                        <img
                          v-src="item.filePath"
                          v-for="(item, index) in detailFileList"
                          :key="index"
                          class="detial-img"
                          @click="previewImage(detailFileList, index)">
                      </div>
                    </div>
                    <div v-if="detailFileList.length == 0 && mainFileList.length == 0" class="no-img">暂无图片</div>
                  </div>
                </sections>
              </c-r-m-base-info>
              <component
                v-else
                :is="item.name"
                :detail="detailData"
                :id="id"
                :filed-list="baseDetailList"
                crm-type="marketing"/>
            </el-tab-pane>
          </el-tabs>
        </flexbox>
      </flexbox>
    </div>
    <create
      v-if="isCreate"
      :action="{type: 'update', id: id, detail: detailData}"
      @save-success="editSaveSuccess"
      @hiden-view="isCreate=false"/>
  </slide-view>
</template>

<script>
import { crmMarketingReadAPI } from '@/api/customermanagement/marketing'

import SlideView from '@/components/SlideView'
import CRMDetailHead from '../components/CRMDetailHead'
import CRMBaseInfo from '../components/CRMBaseInfo' // 基本信息
import Overview from './components/overview'
import Statistics from './components/statistics'
import Create from './components/create'
import Sections from '../components/Sections'

import detail from '../mixins/detail'

export default {
  /** 客户管理 的 活动详情 */
  name: 'Detail',

  components: {
    SlideView,
    CRMDetailHead,
    CRMBaseInfo,
    Overview,
    Statistics,
    Create,
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
      loading: false, // 展示加载loading
      crmType: 'marketing',
      detailData: {}, // read 详情
      baseDetailList: [], // 基本详情list
      headDetails: [
        { title: '关联对象', value: '' },
        { title: '状态', value: '' },
        { title: '负责人', value: '' },
        { title: '截止时间', value: '' }
      ],
      tabCurrentName: 'Overview',
      isCreate: false // 编辑操作
    }
  },

  computed: {
    tabNames() {
      var tempsTabs = []
      tempsTabs.push({ label: '预览', name: 'Overview' })
      tempsTabs.push({ label: '基本信息', name: 'CRMBaseInfo' })
      tempsTabs.push({ label: '统计分析', name: 'Statistics' })
      return tempsTabs
    },
    mainFileList() {
      if (this.detailData && this.detailData.mainFileList) {
        return this.detailData.mainFileList
      }

      return []
    },

    detailFileList() {
      if (this.detailData && this.detailData.detailFileList) {
        return this.detailData.detailFileList
      }

      return []
    }
  },

  mounted() {},

  methods: {
    getDetial() {
      this.loading = true
      crmMarketingReadAPI({
        marketingId: this.id
      })
        .then(res => {
          this.loading = false
          this.detailData = res.data
          this.getBaseList(res.data)

          // 负责人
          this.headDetails[0].value = res.data.crmType == 1 ? '线索' : '客户'
          this.headDetails[1].value = res.data.status == 1 ? '启用' : '停用'
          this.headDetails[2].value = res.data.ownerUserName
          this.headDetails[3].value = res.data.endTime
        })
        .catch(() => {
          this.loading = false
        })
    },

    /**
     * 获取基本信息数据
     */
    getBaseList(data) {
      this.baseDetailList = [
        {
          name: '基本信息',
          list: [
            {
              name: '活动名称',
              formType: 'text',
              value: data.marketingName
            },
            {
              name: '关联对象',
              formType: 'text',
              value: data.crmType == 2 ? '客户' : '线索'
            },
            {
              name: '参与人员',
              formType: 'text',
              value: data.relationUserInfo ? data.relationUserInfo.map(item => {
                return item.realname
              }).join('，') : ''
            },
            {
              name: '活动类型',
              formType: 'text',
              value: data.marketingType
            },
            {
              name: '开始时间',
              formType: 'text',
              value: data.startTime
            },
            {
              name: '截止时间',
              formType: 'text',
              value: data.endTime
            },
            {
              name: '浏览数',
              formType: 'text',
              value: data.browse
            },
            {
              name: '提交数',
              formType: 'text',
              value: data.submitNum
            },
            {
              name: '活动预算',
              formType: 'text',
              value: data.marketingMoney
            },
            {
              name: '活动地址',
              formType: 'text',
              value: data.address
            },
            {
              name: '活动简介',
              formType: 'text',
              value: data.synopsis
            },
            {
              name: '状态',
              formType: 'text',
              value: data.status == 1 ? '启用' : '停用'
            },
            {
              name: '创建人',
              formType: 'text',
              value: data.createUserInfo ? data.createUserInfo.realname : ''
            },

            {
              name: '创建时间',
              formType: 'text',
              value: data.createTime
            },
            {
              name: '更新时间',
              formType: 'text',
              value: data.updateTime
            }
          ]
        }
      ]
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
@import '../styles/detailview.scss';
</style>
