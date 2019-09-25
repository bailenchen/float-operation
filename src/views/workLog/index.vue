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
      <el-input />
      <el-input />
      <el-select>

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

export default {
  name: 'WorkLog',
  components: {
    LogItem,
    CreateLog
  },
  data() {
    return {
      filterActiveTab: 'read',
      listData: [],

      options: [
        { label: '日报', value: '' },
        { label: '周报', value: '' },
        { label: '月报', value: '' }
      ],

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
      journalList({
        page: this.page,
        limit: 15
      }).then(res => {
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
      position: relative;
      height: 44px;
      padding-top: 4px;
      border-bottom: 0 none;
      .read-all {
        position: absolute;
        top: 0;
        right: 16px;
        height: 100%;
        color: #2362FB;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        .icon {
          font-size: 14px;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
