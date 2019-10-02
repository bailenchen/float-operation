<template>
  <div class="main">
    <examine-tabs-head
      :tabs="tabs"
      :select-list="selectList"
      @change="tabsChange"
      @select="tabsSelect" />

    <div
      v-infinite-scroll="getList"
      :infinite-scroll-disabled="scrollDisabled"
      class="cell-section">
      <examine-cell
        v-for="(item, index) in list"
        :key="index"
        :data="item" />
      <p
        v-if="loading"
        class="scroll-bottom-tips">加载中...</p>
      <p
        v-if="noMore"
        class="scroll-bottom-tips">没有更多了</p>
    </div>
  </div>
</template>

<script>
import {
  oaExamineCategoryList,
  oaExamineMyCreateIndex
} from '@/api/oamanagement/examine'
import ExamineTabsHead from './components/ExamineTabsHead'
import ExamineCell from './components/ExamineCell'
import Examine from './components/ExamineMixin'

export default {
  /** 审批 */
  name: 'Index',
  components: {
    ExamineTabsHead,
    ExamineCell
  },
  mixins: [Examine],
  props: {},
  data() {
    return {
      selectList: [],
      tabs: [
        {
          label: '全部',
          name: 'all'
        },
        {
          label: '待审批',
          name: '0'
        },
        {
          label: '审批通过',
          name: '1'
        },
        {
          label: '审批拒绝',
          name: '2'
        }
      ],
      list: [],
      loading: false,
      noMore: false,
      page: 1,
      // 空是全部
      selectId: '',
      // 状态 空是全部
      checkStatus: ''
    }
  },
  computed: {
    // 无线滚动控制
    scrollDisabled() {
      return this.loading || this.noMore
    }
  },
  watch: {},
  mounted() {
    this.getSelectList()
  },

  beforeDestroy() {},
  methods: {
    /**
     * 刷新列表
     */
    refreshList() {
      this.noMore = false
      this.page = 1
      this.list = []
      this.getList()
    },

    /**
     * 获取数据列表
     */
    getList() {
      this.loading = true
      const params = {
        page: this.page,
        limit: 15,
        categoryId: this.selectId
      }
      params.checkStatus = this.checkStatus

      oaExamineMyCreateIndex(params)
        .then(res => {
          this.loading = false
          if (!this.noMore) {
            this.list = this.list.concat(res.data.list)
            this.page++
          }
          this.noMore = res.data.list.length < 15
        })
        .catch(() => {
          this.noMore = true
          this.loading = false
        })
    },

    /**
     * 获取审批类型
     */
    getSelectList() {
      oaExamineCategoryList()
        .then(res => {
          this.selectList = res.data.map(item => {
            const iconItem = this.getCategoryIcon(item.type)
            iconItem.label = item.title
            iconItem.command = item.categoryId
            return iconItem
          })
          this.selectList.unshift({
            icon: 'approve',
            color: '#9376FF',
            command: '',
            label: '全部审批'
          })
        })
        .catch(() => {
        })
    },

    /**
     * 中间tabs改变
     */
    tabsChange(type) {
      this.checkStatus = type == 'all' ? '' : type
      this.refreshList()
    },

    /**
     * 单选
     */
    tabsSelect(id) {
      this.selectId = id
      this.refreshList()
    }
  }
}
</script>

<style lang="scss" scoped>
.main {
  position: relative;
  height: 100%;
  width: 920px;
}

.examine-tabs-head {
  margin-bottom: 15px;
}

.cell-section {
  height: calc(100% - 70px);
  overflow: auto;
  overflow: overlay;
}
</style>
