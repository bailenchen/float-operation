<template>
  <div class="main">
    <examine-tabs-head
      :tabs="tabs"
      :select-list="selectList"
      @change="tabsChange"
      @select="tabsSelect" />

    <div class="cell-section">
      <examine-cell
        v-for="(item, index) in list"
        :key="index"
        :data="item" />
    </div>
  </div>
</template>

<script>
import {
  oaExamineCategoryList,
  oaExamineMyExamineIndex
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
          label: '待我审批的',
          name: '1'
        },
        {
          label: '我已审批的',
          name: '2'
        }
      ],
      list: [],
      // 空是全部
      selectId: '',
      // 空是全部
      status: ''
    }
  },
  computed: {},
  watch: {},
  mounted() {
    this.getSelectList()
    this.getList()
  },

  beforeDestroy() {},
  methods: {
    /**
     * 刷新列表
     */
    refreshList() {
      this.list = []
      this.getList()
    },

    /**
     * 获取数据列表
     */
    getList() {
      this.loading = true
      const params = {
        page: 1,
        limit: 15,
        categoryId: this.selectId
      }
      params.status = this.status

      oaExamineMyExamineIndex(params)
        .then(res => {
          this.list = this.list.concat(res.data.list)
        })
        .catch(() => {})
    },

    /**
     * 获取审批类型
     */
    getSelectList() {
      oaExamineCategoryList()
        .then(res => {
          this.selectList = res.data.map(item => {
            const iconItem = this.getCategoryIcon(item.categoryId)
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
          this.loading = false
        })
    },

    /**
     * 中间tabs改变
     */
    tabsChange(type) {
      this.status = type == 'all' ? '' : type
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
