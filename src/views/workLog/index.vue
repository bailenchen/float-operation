<template>
  <div
    v-infinite-scroll="getList"
    class="main"
    infinite-scroll-disabled="scrollDisabled">
    <div class="work-log scroll-body">
      <div class="hello-card card">
        <div class="user-info">
          <div
            v-photo="userInfo"
            v-lazy:background-image="$options.filters.filterUserLazyImg(userInfo.img)"
            :key="userInfo.img"
            class="user-img div-photo"/>
          <div class="status">
            <span class="icon wk wk-success" />
            <span>今日已完成</span>
          </div>
        </div>

        <div class="greeting">
          <div class="hello">
            {{ now.format('A') }}好，{{ nickName }}
          </div>
          <div class="text">
            工作一天幸苦啦，完成日志结束一天的工作吧！
          </div>
        </div>

        <div class="statistics">
          <div class="title">
            <span class="icon wk wk-task" />
            <span>本月完成日志</span>
          </div>
          <div class="info">
            <span class="special">28</span>篇
          </div>
        </div>
      </div>

      <create-log v-if="showAdd" class="add-card card" @update="refreshList" />

      <flexbox class="filter-control card">
        <xh-user-cell
          v-if="showUserSelect"
          class="xh-user-cell"
          placeholder="选择人员"
          @value-change="userChange" />
        <el-date-picker
          v-model="filterForm.createTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="提交时间" />
        <el-select
          v-model="filterForm.categoryId"
          placeholder="类型">
          <el-option
            v-for="(item, index) in options"
            :key="index"
            :label="item.label"
            :value="item.value" />
        </el-select>
      </flexbox>

      <div
        v-for="(item, index) in listData"
        :key="index"
        class="card">
        <log-item
          :data="item"
          :index="index"
          @read="handleRead(index)"
          @add-comment="handleAddComment"
          @delete="handleDelete" />
      </div>
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
import { journalList } from '@/api/oamanagement/journal'

import { mapGetters } from 'vuex'
import moment from 'moment'

import LogItem from './components/logItem'
import CreateLog from './components/createLog'
import XhUserCell from '@/components/CreateCom/XhUserCell'

export default {
  name: 'WorkLog',
  components: {
    LogItem,
    CreateLog,
    XhUserCell
  },
  data() {
    return {
      logType: '', // all send 我发出的 received 我收到的

      listData: [],
      loading: false, // loading
      noMore: false,
      page: 1,

      options: [
        { label: '全部', value: 0 },
        { label: '日报', value: 1 },
        { label: '周报', value: 2 },
        { label: '月报', value: 3 }
      ],

      filterForm: {
        categoryId: 0,
        createUserId: ''
      },
      now: moment()
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),

    showUserSelect() {
      return this.logType != 'send'
    },

    showAdd() {
      return this.logType != 'received'
    },

    // 无线滚动控制
    scrollDisabled() {
      return this.loading || this.noMore
    },

    nickName() {
      if (!this.userInfo.realname) return this.userInfo.username
      const reg = /[a-zA-Z]+/
      if (reg.test(this.userInfo.realname) || !this.userInfo.sex) {
        return this.userInfo.realname
      }
      return this.userInfo.realname.slice(0, 1) + this.userInfo.sex === 1 ? '先生' : '女士'
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
  created() {
    this.logType = this.$route.params.type

    this.now.locale('zh-cn')
  },

  beforeRouteUpdate(to, from, next) {
    this.logType = to.params.type
    this.filterForm = {
      categoryId: 0,
      createUserId: ''
    }

    this.refreshList()
    next()
  },
  methods: {
    /**
     * 刷新列表
     */
    refreshList() {
      this.page = 1
      this.listData = []
      this.noMore = false
    },

    /**
     * 获取日志列表
     */
    getList(action = null) {
      if (this.loading) return
      this.loading = true
      const params = {
        page: this.page,
        limit: 15,
        ...this.filterForm
      }

      if (this.logType != 'all') {
        params.by = {
          send: 2,
          received: 3
        }[this.logType]
      }
      if (params.hasOwnProperty('categoryId') && params.categoryId === 0) {
        delete params.categoryId
      }
      journalList(params).then(res => {
        this.loading = false
        if (!this.noMore) {
          this.listData = this.listData.concat(res.data.list)
          this.page++
        }
        this.noMore = res.data.lastPage
      }).catch(() => {
        this.loading = false
      })
    },

    /**
     * 添加回复
     */
    handleAddComment(data) {
      this.listData[data.index].replyList.unshift(data.data)
    },

    /**
     * 日志删除
     * @param index {number}
     */
    handleDelete(index) {
      this.listData.splice(index, 1)
    },

    /**
     * 日志已读
     * @param index
     */
    handleRead(index) {
      this.listData[index].isRead = 1
    },

    /**
     * 筛选条件人员选择
     */
    userChange(data) {
      if (data.value.length > 0) {
        this.filterForm.createUserId = data.value.map(item => {
          return item.userId
        }).join(',')
      } else {
        this.filterForm.createUserId = ''
      }
    }
  }
}
</script>

<style scoped lang="scss">
  @import "./style";
</style>
