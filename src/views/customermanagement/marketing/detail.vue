<template>
  <slide-view
    v-empty="!canShowDetail"
    :listener-ids="listenerIDs"
    :no-listener-ids="noListenerIDs"
    :no-listener-class="noListenerClass"
    :body-style="{padding: 0, height: '100%'}"
    class="d-view"
    @side-close="hideView">
    <flexbox
      v-loading="loading"
      v-if="canShowDetail"
      xs-empty-icon="nopermission"
      xs-empty-text="暂无权限"
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
      <div class="tabs">
        <el-tabs
          v-model="tabCurrentName"
          @tab-click="handleClick">
          <el-tab-pane
            v-for="(item, index) in tabnames"
            :key="index"
            :label="item.label"
            :name="item.name"/>
        </el-tabs>
      </div>
      <div
        id="follow-log-content"
        class="t-loading-content">
        <keep-alive>
          <component
            :is="tabName"
            :detail="detailData"
            :id="id"
            :filed-list="baseDetailList"
            :is-seas="isSeas"
            crm-type="marketing"/>
        </keep-alive>
      </div>
    </flexbox>
    <create
      v-if="isCreate"
      :action="{type: 'update', id: id, detail: detailData}"
      @save-success="editSaveSuccess"
      @hiden-view="isCreate=false"/>
  </slide-view>
</template>

<script>
import { crmMarketingReadAPI } from '@/api/customermanagement/marketing'
import { timestampToFormatTime } from '@/utils'

import SlideView from '@/components/SlideView'
import CRMDetailHead from '../components/CRMDetailHead'
import CRMBaseInfo from '../components/CRMBaseInfo' // 基本信息
import Overview from './components/overview'
import Statistics from './components/statistics'
import Create from './components/create'

import detail from '../mixins/detail'

export default {
  /** 客户管理 的 推广详情 */
  name: 'Detail',

  components: {
    SlideView,
    CRMDetailHead,
    CRMBaseInfo,
    Overview,
    Statistics,
    Create
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
      baseDetailList: [], // 基本详情list
      headDetails: [
        { title: '关联对象', value: '' },
        { title: '状态', value: '' },
        { title: '负责人', value: '' },
        { title: '截止时间', value: '' }
      ],
      tabCurrentName: 'overview',
      isCreate: false // 编辑操作
    }
  },

  computed: {
    tabName() {
      if (this.tabCurrentName == 'basicinfo') {
        return 'c-r-m-base-info'
      } else if (this.tabCurrentName == 'overview') {
        return 'overview'
      } else if (this.tabCurrentName == 'statistics') {
        return 'statistics'
      }
      return ''
    },

    tabnames() {
      var tempsTabs = []
      tempsTabs.push({ label: '预览', name: 'overview' })
      tempsTabs.push({ label: '基本信息', name: 'basicinfo' })
      tempsTabs.push({ label: '统计分析', name: 'statistics' })
      return tempsTabs
    }
  },

  mounted() {},

  methods: {
    getDetial() {
      this.loading = true
      crmMarketingReadAPI({
        id: this.id
      })
        .then(res => {
          this.loading = false
          this.detailData = res.data

          this.getBaseList(res.data)

          // 负责人
          this.headDetails[0].value = res.data.object == 1 ? '客户' : '线索'
          this.headDetails[1].value = res.data.state == 1 ? '启用' : '停用'
          this.headDetails[2].value = res.data.owner_user_id_info
            .map(item => {
              return item.realname
            })
            .join('，')
          this.headDetails[3].value = res.data.end_time
            ? timestampToFormatTime(res.data.end_time, 'YYYY-MM-DD HH:mm:ss')
            : ''
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
          name: '推广名称',
          form_type: 'text',
          value: data.name
        },
        {
          name: '关联对象',
          form_type: 'text',
          value: data.object == 1 ? '客户' : '线索'
        },
        {
          name: '关联人员',
          form_type: 'text',
          value: data.relation_user_id_info
            .map(item => {
              return item.realname
            })
            .join('，')
        },
        {
          name: '管理员',
          form_type: 'text',
          value: data.owner_user_id_info
            .map(item => {
              return item.realname
            })
            .join('，')
        },
        {
          name: '备注',
          form_type: 'text',
          value: data.remark
        },
        {
          name: '状态',
          form_type: 'text',
          value: data.state == 1 ? '启用' : '停用'
        },
        {
          name: '创建人',
          form_type: 'text',
          value: data.create_user_id_info.realname
        },
        {
          name: '截止时间',
          form_type: 'text',
          value: timestampToFormatTime(data.end_time, 'YYYY-MM-DD HH:mm:ss')
        },
        {
          name: '创建时间',
          form_type: 'text',
          value: data.create_time
        },
        {
          name: '更新时间',
          form_type: 'text',
          value: data.update_time
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

.d-view {
  position: fixed;
  width: 950px;
  top: 0px;
  bottom: 0px;
  right: 0px;
}
</style>
