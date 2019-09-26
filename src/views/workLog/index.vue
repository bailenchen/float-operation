<template>
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

    <create-log class="add-card card" @update="getList('update')" />

    <div class="filter-control card">
      <xh-user-cell
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
    </div>

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
      filterActiveTab: 'read',
      listData: [],

      page: 0,
      distance: 15, // 滚动距离阀值
      isOver: false,

      options: [
        { label: '全部', value: 0 },
        { label: '日报', value: 1 },
        { label: '周报', value: 2 },
        { label: '月报', value: 3 }
      ],

      filterForm: {
        categoryId: 0
      },
      now: moment(),
      showLoading: false // loading
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ]),
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
        this.getList()
      },
      deep: true
    }
  },
  created() {
    this.now.locale('zh-cn')
    this.getList()
  },
  methods: {
    /**
     * 获取日志列表
     */
    getList(action = null) {
      if (this.showLoading) return
      this.showLoading = true
      if (action === 'update') {
        this.page = 1
      } else {
        this.page++
      }
      const params = {
        page: this.page,
        limit: 15,
        ...this.filterForm
      }
      if (params.hasOwnProperty('categoryId') && params.categoryId === 0) {
        delete params.categoryId
      }
      journalList(params).then(res => {
        console.log(res)
        if (this.page === 1) {
          this.listData = []
        }
        this.isOver = res.data.lastPage
        this.showLoading = false
        console.log('list', res.data.list)
        this.listData = this.listData.concat(res.data.list || [])
        this.$nextTick(() => {
          this.initScroll()
        })
      }).catch(() => {
        this.showLoading = false
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
        this.filterForm.createUserId = data.value[0].userId
      } else {
        this.filterForm.createUserId = null
      }
    },

    /**
     * 滚动初始化
     */
    initScroll() {
      const dom = document.getElementsByClassName('scroll-body')[0].parentNode.parentNode
      console.log('dom', dom)
      dom.addEventListener('scroll', () => {
        if (this.timer || this.showLoading) return
        this.timer = setTimeout(() => {
          this.timer = null
        }, 30)
        // 派发滚动事件
        this.$bus.emit('load-more-work-log', dom.clientHeight)
        // 判断是否将要滚动到底部，加载下一页
        const flag = dom.scrollTop + dom.clientHeight + this.distance >= dom.scrollHeight
        if (flag && !this.isOver) {
          this.getList()
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  @import "./style";
</style>
