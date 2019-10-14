<template>
  <div class="main">
    <task-tabs-head
      :tabs="tabs"
      @change="tabsChange" />

    <div class="content-wrapper">
      <flexbox class="content-wrapper__hd">
        <div
          v-photo="userInfo"
          v-lazy:background-image="$options.filters.filterUserLazyImg(userInfo.img)"
          class="div-photo head-img" />
        <el-progress
          :percentage="progressValue"
          :format="progressFormat" />
        <span class="label margin-left">截止时间</span>
        <el-date-picker
          v-model="dueDate"
          type="date"
          placeholder="选择日期"
          value-format="yyyy-MM-dd"
          @change="refreshList" />
        <span class="label">优先级</span>
        <el-select
          v-model="priority"
          placeholder="请选择"
          @change="refreshList">
          <el-option
            v-for="item in priorityOptions"
            :key="item.key"
            :label="item.label"
            :value="item.key" />
        </el-select>

        <span class="label">显示已完成</span>
        <el-switch
          v-model="showDone"
          @change="refreshList" />
      </flexbox>
      <div class="cell-section">
        <div
          v-infinite-scroll="getList"
          infinite-scroll-disabled="scrollDisabled">
          <task-cell
            v-for="(item, index) in list"
            :key="index"
            :data="item"
            :data-index="index"
            @on-handle="taskCellHandle" />
        </div>
        <p
          v-if="loading"
          class="scroll-bottom-tips">加载中...</p>
        <p
          v-if="noMore"
          class="scroll-bottom-tips">没有更多了</p>
      </div>
    </div>

    <div class="task-add">
      <task-quick-add @send="refreshList"/>
    </div>

    <task-detail
      v-if="taskDetailShow"
      ref="particulars"
      :id="taskID"
      :detail-index="detailIndex"
      :no-listener-class="['xr-cells']"
      @on-handle="detailHandle"
      @close="taskDetailShow = false" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TaskTabsHead from './components/TaskTabsHead'
import TaskCell from './components/TaskCell'
import TaskDetail from './components/TaskDetail'
import TaskQuickAdd from './components/TaskQuickAdd'
import { taskListAPI } from '@/api/task/task'


export default {
  /** 任务列表 */
  name: 'Index',
  components: {
    TaskTabsHead,
    TaskCell,
    TaskDetail,
    TaskQuickAdd
  },
  props: {},
  data() {
    return {
      // 任务类型 区分我的任务和下属任务
      taskType: '',
      list: [],
      loading: false,
      noMore: false,
      page: 1,
      type: '0',
      dueDate: '',
      priority: '',
      showDone: true,
      // 任务总进程
      progress: {
        stopTask: 0,
        // 总数量
        allTask: 0
      },
      // 优先级
      priorityOptions: [
        { label: '全部', key: '' },
        { label: '高', key: '3' },
        { label: '中', key: '2' },
        { label: '低', key: '1' },
        { label: '无', key: '0' }
      ],
      // 跟多操作
      moreTypes: [
        {
          type: 'show/hide',
          name: '显示已完成任务/隐藏已完成任务',
          icon: 'eye'
        }
      ],

      // 详情
      // 详情数据
      taskID: '',
      detailIndex: -1,
      taskDetailShow: false
    }
  },
  computed: {
    ...mapGetters(['userInfo']),

    tabs() {
      if (this.taskType == 1) {
        return [
          {
            label: '全部',
            name: '0'
          },
          {
            label: '我负责的',
            name: '1'
          },
          {
            label: '我参与的',
            name: '3'
          }
        ]
      } else {
        return [
          {
            label: '全部',
            name: '0'
          },
          {
            label: '下属负责的',
            name: '1'
          },
          {
            label: '下属参与的',
            name: '3'
          }
        ]
      }
    },

    // 无线滚动控制
    scrollDisabled() {
      return this.loading || this.noMore
    },

    /**
     * 子任务完成进度
     */
    progressValue() {
      if (this.progress.stopTask == 0) {
        return 0
      }
      return parseInt(this.progress.stopTask / this.progress.allTask * 100)
    }
  },
  watch: {},
  mounted() {
    this.taskType = this.$route.params.type
  },
  beforeRouteUpdate(to, from, next) {
    this.taskType = to.params.type
    this.showDone = true
    this.type = '0'
    this.dueDate = ''
    this.priority = ''

    this.refreshList()
    next()
  },

  beforeDestroy() {},
  methods: {
    /**
     * 总完成进度展示
     */
    progressFormat(percentage) {
      return `${this.progress.stopTask}/${this.progress.allTask}`
    },

    /**
     * 刷新列表
     */
    refreshList() {
      this.page = 1
      this.list = []
      this.noMore = false
    },

    /**
     * 获取数据列表
     */
    getList() {
      this.loading = true
      const params = {
        page: this.page,
        limit: 15,
        type: this.type,
        priority: this.priority,
        dueDate: this.dueDate,
        status: this.showDone ? '' : '1'
      }

      if (this.taskType != 1) {
        params.mold = 1 // 下属任务
      }

      taskListAPI(params)
        .then(res => {
          this.loading = false
          if (!this.noMore) {
            for (const item of res.data.list) {
              if (item.status == 5) {
                item.checked = true
              }
            }
            this.list = this.list.concat(res.data.list)
            this.page++
          }
          this.noMore = res.data.lastPage
          this.progress = res
        })
        .catch(() => {
          this.noMore = true
          this.loading = false
        })
    },

    /**
     * 中间tabs改变
     */
    tabsChange(type) {
      this.type = type
      this.refreshList()
    },

    /**
     * 任务cell 操作
     */
    taskCellHandle(type, data, index) {
      if (type == 'view') {
        this.taskID = data.taskId
        this.detailIndex = index
        this.taskDetailShow = true
      } else if (type == 'complete') {
        this.progress.stopTask = data.checked ? ++this.progress.stopTask : --this.progress.stopTask
      }
    },

    /**
     * 详情操作
     */
    detailHandle(data) {
      if (data.type == 'delete') {
        this.list.splice(data.index, 1)
      } else {
        // 获取5条数据
        let page = 1
        if (data.index > 0) {
          page = Math.ceil(data.index / 5)
        }
        const params = {
          page: page,
          limit: 5,
          type: this.type,
          priority: this.priority,
          dueDate: this.dueDate,
          status: this.showDone ? '' : '1'
        }

        if (this.taskType != 1) {
          params.mold = 1 // 下属任务
        }

        taskListAPI(params)
          .then(res => {
            const task = this.list[data.index]
            for (let index = 0; index < res.data.list.length; index++) {
              const element = res.data.list[index]
              if (element.taskId == task.taskId) {
                if (element.status == 5) {
                  element.checked = true
                }
                this.list.splice(index, 1, element)
                break
              }
            }
            this.progress = res
          })
          .catch(() => {
          })
      }
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

.content-wrapper {
  height: calc(100% - 70px);
  overflow: hidden;
  margin-top: 15px;
  background-color: white;
  border-radius: $xr-border-radius-base;
  border: 1px solid $xr-border-line-color;
  padding-bottom: 70px;

  &__hd {
    padding: 15px;

    .head-img {
      display: block;
      width: 40px;
      height: 40px;
      border-radius: 20px;
      margin-right: 30px;
    }

    .el-date-editor {
      width: 150px;
    }

    .el-select {
      width: 80px;
    }

    .el-progress {
      width: 300px;
    }

    .label {
      color: #999999;
      font-size: 12px;
      margin: 0 10px 0 20px;
    }

    .label.margin-left {
      margin-left: 30px;
    }
  }
}

.cell-section {
  height: 100%;
  overflow: auto;
}

.scroll-bottom-tips {
  margin-bottom: 80px;
}

// 快捷添加
.task-add {
  position: absolute;
  left: 1px;
  bottom: 7px;
  right: 1px;
  z-index: 5;
  background-color: white;
  padding: 15px;
}
</style>
