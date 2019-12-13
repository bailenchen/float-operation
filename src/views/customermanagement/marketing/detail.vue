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
              <component
                :is="item.name"
                :detail="detailData"
                :id="id"
                :filed-list="baseDetailList"
                :is-seas="isSeas"
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
import DetailImg from './components/detailImg'

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
    DetailImg
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
      tempsTabs.push({ label: '活动图片', name: 'DetailImg' })
      return tempsTabs
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
@import '../styles/crmdetail.scss';
@import '../styles/detailview.scss';
</style>
