<template>
  <div class="work-log-index scroll-body">
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

    <!--<div class="filter-control card">
      <el-tabs v-model="filterActiveTab" @tab-click="handleToggleRead">
        <el-tab-pane label="已读" name="read" />
        <el-tab-pane label="未读" name="unread" />
      </el-tabs>
      <div class="read-all">
        <span class="icon wk wk-tag" />
        <span>标记全部已读</span>
      </div>
    </div>-->

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

      options: [
        { label: '全部', value: 0 },
        { label: '日报', value: 1 },
        { label: '周报', value: 2 },
        { label: '月报', value: 3 }
      ],
      filterForm: {},

      page: 0,
      now: moment(),
      distance: 15, // 滚动距离阀值

      showLoading: false, // loading
      isOver: false
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
        this.listData = this.listData.concat(res.data.list || [])
        this.$nextTick(() => {
          this.initScroll()
        })
      }).catch(() => {
        this.showLoading = false
      })
    },

    /**
     * 日志已读未读切换
     */
    handleToggleRead() {},

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
/deep/ .el-tabs__header {
  margin: 0;
}
/deep/ .el-tabs__nav-wrap {
  padding: 0 18px;
}

/deep/ .el-tabs__nav-wrap::after {
  height: 1px;
}

.work-log-index {
  .card {
    width: 1130px;
    background-color: white;
    border: 1px solid #E6E6E6;
    border-radius: 4px;
    box-sizing: border-box;
    margin-bottom: 16px;

    &.hello-card {
      padding: 26px 32px 22px 15px;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .user-info {
        margin-right: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        .user-img {
          width: 38px;
          height: 38px;
        }
        .status {
          font-size: 12px;
          margin-top: 10px;
          display: flex;
          align-items: center;
          .icon {
            font-size: 12px;
            color: #67C23A;
            margin-right: 4px;
          }
        }
      }

      .greeting {
        flex: 1;
        .hello {
          font-size: 16px;
          font-weight: bold;
        }
        .text {
          font-size: 14px;
          color: #999;
          margin-top: 15px;
        }
      }

      .statistics {
        font-size: 16px;
        .title {
          .icon {
            color: #2772FF;
            margin-right: 10px;
          }
        }
        .info {
          font-size: 12px;
          text-align: center;
          margin-top: 20px;
          .special {
            font-size: 24px;
            font-weight: bold;
            color: #2772FF;
            margin-right: 10px;
          }
        }
      }
    }

    &.filter-control {
      padding: 8px;
      display: block;
      align-items: center;
      justify-content: flex-start;
      .xh-user-cell, .el-date-editor, .el-select {
        width: 150px;
      }
      .el-date-editor, .el-select {
        margin-left: 15px;
      }
      .xh-user-cell /deep/ .el-popover__reference {
        width: 150px;
        display: inline-block;
      }
    }
  }
}
</style>
