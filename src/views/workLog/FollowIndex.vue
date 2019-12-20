<template>
  <div class="main">
    <record-tab-head
      :tabs="tabs"
      :count="count"
      :select-value.sync="tabsSelectValue"
      @change="tabsChange" />

    <flexbox class="filter-control card">
      <xh-user-cell
        v-if="userSelectShow"
        radio
        class="xh-user-cell"
        placeholder="选择人员"
        @value-change="userChange" />
      <time-type-select
        :width="190"
        :default-type="timeSelect.value"
        @change="timeTypeChange" />
      <el-select
        v-model="filterForm.crmType"
        placeholder="类型">
        <el-option
          v-for="(item, index) in options"
          :key="index"
          :label="item.label"
          :value="item.value" />
      </el-select>
    </flexbox>

    <div
      v-infinite-scroll="getList"
      :key="`${scrollKey}${tabsSelectValue}`"
      infinite-scroll-distance="100"
      infinite-scroll-disabled="scrollDisabled"
      class="cell-section">
      <log-cell
        v-for="(item, index) in list"
        :item="item"
        :index="index"
        :key="index"
        :can-delete="false"
        class="log-cell"
        @crm-detail="checkRelationDetail">
        <div
          class="relate-cell"
          @click="checkRelationDetail(item.activityType, item.activityTypeId, true)">
          <i
            :class="item.activityType | crmIconClass"
            class="relate-cell-icon" />
          <span class="relate-cell-type">{{ item.activityType | crmName }}-</span>
          <span class="relate-cell-name">{{ item.crmTypeName }}</span>
        </div>
      </log-cell>
      <p
        v-if="loading"
        class="scroll-bottom-tips">加载中...</p>
      <p
        v-if="noMore"
        class="scroll-bottom-tips">没有更多了</p>
    </div>

    <c-r-m-full-screen-detail
      :visible.sync="showFullDetail"
      :crm-type="relationCrmType"
      :id="relationID"
      @handle="detailHandle" />
  </div>
</template>

<script>
import { crmIndexGetRecordListAPI } from '@/api/customermanagement/workbench'

import RecordTabHead from './components/RecordTabHead'
import XhUserCell from '@/components/CreateCom/XhUserCell'
import timeTypeSelect from '@/components/timeTypeSelect'
import LogCell from '@/views/customermanagement/components/activity/LogCell'

import crmTypeModel from '@/views/customermanagement/model/crmTypeModel'

export default {
  // 跟进记录
  name: 'FollowIndex',
  components: {
    RecordTabHead,
    XhUserCell,
    timeTypeSelect,
    LogCell,
    CRMFullScreenDetail: () =>
      import('@/views/customermanagement/components/CRMFullScreenDetail.vue')
  },
  filters: {
    crmIconClass(type) {
      return `wk wk-${crmTypeModel.convertTypeToKey(type)}`
    },

    crmName(type) {
      return crmTypeModel.convertTypeToName(type)
    }
  },
  props: {},
  data() {
    return {
      tabsSelectValue: 'all',
      tabs: [
        {
          label: '全部',
          name: 'all'
        },
        {
          label: '我创建的',
          name: '0'
        },
        {
          label: '我下属创建的',
          name: '1'
        }
      ],

      options: [
        { label: '全部', value: '' },
        { label: '线索', value: 1 },
        { label: '客户', value: 2 },
        { label: '联系人', value: 3 },
        { label: '商机', value: 5 },
        { label: '合同', value: 6 }
      ],

      // 总数量
      count: 0,

      // 默认全部  subUser  0 我的  1 我下属的
      filterForm: {
        crmType: '',
        isUser: 1,
        userId: '',
        subUser: ''
      },

      timeSelect: {
        type: 'default',
        value: 'month'
      },

      list: [],
      loading: false,
      noMore: false,
      page: 1,
      scrollKey: Date.now(),

      showFullDetail: false, // 查看相关客户管理详情
      relationID: '', // 相关ID参数
      relationCrmType: '' // 相关类型
    }
  },
  computed: {
    // 无线滚动控制
    scrollDisabled() {
      return this.loading || this.noMore
    },

    userSelectShow() {
      return this.filterForm.subUser !== '0' // 0 是我的
    }
  },
  watch: {
    filterForm: {
      handler() {
        this.refreshList()
      },
      deep: true
    }
  },
  mounted() {},

  beforeDestroy() {},
  methods: {
    /**
     * 中间tabs改变
     */
    tabsChange(type) {
      this.filterForm.subUser = type === 'all' ? '' : type
    },

    /**
     * 刷新列表
     */
    refreshList() {
      this.page = 1
      this.list = []
      this.noMore = false
      this.scrollKey = Date.now()
    },

    /**
     * 获取数据列表
     */
    getList() {
      this.loading = true
      let params = {
        page: this.page,
        limit: 15,
        isUser: 1,
        queryType: 0
      }

      if (this.timeSelect.type) {
        if (this.timeSelect.type === 'custom') {
          params.startTime = this.timeSelect.startTime.replace(/\./g, '-')
          params.endTime = this.timeSelect.endTime.replace(/\./g, '-')
        } else {
          params.type = this.timeSelect.value || ''
        }
      }

      if (this.userSelectShow) {
        params = { ...params, ...this.filterForm }
      } else {
        params.crmType = this.filterForm.crmType
        params.subUser = this.filterForm.subUser
      }

      crmIndexGetRecordListAPI(params)
        .then(res => {
          this.loading = false

          if (this.filterForm.subUser != params.subUser) {
            this.refreshList()
          } else {
            if (!this.noMore) {
              this.list = this.list.concat(res.data.list)
              this.page++
            }
            this.count = res.data.totalRow || 0
            this.noMore = res.data.lastPage
          }
        })
        .catch(() => {
          this.noMore = true
          this.loading = false
        })
    },

    /**
     * 查看相关客户管理详情
     */
    checkRelationDetail(type, id, convert = false) {
      this.relationID = id
      this.relationCrmType = convert ? crmTypeModel.convertTypeToKey(type) : type
      this.showFullDetail = true
    },

    /**
     * 筛选条件人员选择
     */
    userChange(data) {
      this.filterForm.userId = data.value.length > 0 ? data.value[0].userId : ''
    },

    /**
     * 时间更改
     */
    timeTypeChange(data) {
      this.timeSelect = data
      this.refreshList()
    },

    /**
     * 详情操作
     */
    detailHandle(data) {
      if (data.type == 'delete') {
        this.refreshList()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style';

.base-tabs-head {
  margin-bottom: 15px;
}

.cell-section {
  height: calc(100% - 140px);
  overflow: auto;
}

.log-cell {
  border: 1px solid $xr-border-line-color;
  border-radius: $xr-border-radius-base;
  padding-bottom: 50px !important;
  margin-bottom: 15px;
  position: relative;
}

.relate-cell {
  padding: 13px 55px;
  background-color: #f5f7fa;
  border-radius: 4px;
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  font-size: 12px;
  color: #333;

  &-icon {
    display: inline-block;
    font-size: 14px;
    color: #666;
    margin-right: 5px;
  }

  &-name {
    cursor: pointer;
    color: $xr-color-primary;
  }

  &-name:hover {
    text-decoration: underline;
  }
}
</style>
