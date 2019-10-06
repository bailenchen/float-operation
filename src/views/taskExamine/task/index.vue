<template>
  <div class="main">
    <task-tabs-head
      :tabs="tabs"
      @change="tabsChange" />

    <div class="cell-section">
      <flexbox class="cell-section__hd">
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

      <flexbox
        class="cell-section__bd"
        align="stretch"
        direction="column">
        <div
          v-infinite-scroll="getList"
          :infinite-scroll-disabled="scrollDisabled"
          class="xr-cells">
          <task-cell
            v-for="(item, index) in list"
            :key="index"
            :data="item"
            :data-index="index"
            @on-handle="taskCellHandle" />
          <p
            v-if="loading"
            class="scroll-bottom-tips">加载中...</p>
          <p
            v-if="noMore"
            class="scroll-bottom-tips">没有更多了</p>
        </div>

        <div v-loading="sendLoading" :class="['add', { 'unfold': isUnfold, 'is-close': !isUnfold }]">
          <i
            v-if="isUnfold"
            class="wk wk-close"
            @click="addClose" />
          <el-input
            ref="input"
            v-model="sendContent"
            :maxlength="50"
            :prefix-icon="isUnfold ? '' : 'el-icon-plus'"
            class="input"
            placeholder="添加任务"
            @focus="inputFocus" />

          <flexbox class="add-info">
            <el-date-picker
              ref="endTime"
              :class="{ 'no-time-top': !sendStopTime }"
              v-model="sendStopTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="" />
            <xh-user-cell
              :value="mainUser"
              placement="top"
              @value-change="selectMainUser">
              <div
                slot="reference"
                class="select-user">
                <i
                  v-if="!createMainUser"
                  class="wk wk-persons add-info--person" />
                <div
                  v-photo="createMainUser"
                  v-lazy:background-image="$options.filters.filterUserLazyImg(createMainUser.img)"
                  v-else
                  :key="createMainUser.img"
                  class="div-photo" />
              </div>

            </xh-user-cell>
          </flexbox>

          <el-button
            v-debounce="send"
            icon="wk wk-top"
            class="send-btn"
            type="primary">发布</el-button>
        </div>
      </flexbox>
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
import { taskListAPI, setTaskAPI } from '@/api/task/task'
import { XhUserCell } from '@/components/CreateCom'

export default {
  /** 任务列表 */
  name: 'Index',
  components: {
    TaskTabsHead,
    TaskCell,
    TaskDetail,
    XhUserCell
  },
  props: {},
  data() {
    return {
      // 默认闭合
      isUnfold: false,
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
      // 添加
      sendLoading: false,
      sendContent: '',
      sendStopTime: '',
      mainUser: [],

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

    createMainUser() {
      return this.mainUser.length ? this.mainUser[0] : null
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
    },

    /**
     * 任务添加
     */
    inputFocus() {
      this.isUnfold = true
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },

    /**
     * 选择负责人
     */
    selectMainUser(data) {
      this.mainUser = data.value
    },

    /**
     * 创建任务
     */
    send() {
      if (!this.sendContent.length) {
        this.$message.error('请填写任务标题')
      } else {
        this.sendLoading = true
        setTaskAPI({
          name: this.sendContent,
          stopTime: this.sendStopTime,
          mainUserId: this.createMainUser ? this.createMainUser.userId : ''
        })
          .then(res => {
            this.sendLoading = false
            this.resetSendData()
            this.refreshList()
          })
          .catch(() => {
            this.sendLoading = false
          })
      }
    },

    resetSendData() {
      this.sendContent = ''
      this.sendStopTime = ''
      this.mainUser = []
      this.isUnfold = false
    },

    /**
     * 关闭
     */
    addClose() {
      this.isUnfold = false
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
  margin-top: 15px;
  background-color: white;
  border-radius: 4px;
  border: 1px solid $xr-border-line-color;

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

  &__bd {
    height: calc(100% - 75px);
    overflow: hidden;
  }
}

// 列表区域
.xr-cells {
  flex: 1;
  overflow: auto;
}

// 添加
.add {
  position: relative;
  flex-shrink: 0;
  background-color: white;
  border-radius: 4px;
  border: 1px solid $xr-border-line-color;
  padding: 5px;
  margin: 15px;

  .input {
    width: calc(100% - 50px);

    /deep/.el-input__inner {
      border: none;
    }
  }

  .add-info {
    padding: 0 8px;
    .el-date-editor {
      width: 100px;
      font-size: 12px;
      margin-right: 8px;
      /deep/ .el-input__prefix {
        left: 0;
        .el-icon-date {
          width: 24px;
          line-height: 24px;
        }
      }

      /deep/ .el-input__inner {
        border-radius: 12px;
        line-height: 24px;
        height: 24px;
        padding-left: 20px;
        padding-right: 5px;
        border: none;
        background-color: #f0f0f0;
      }
    }

    &--person {
      margin-left: 5px;
      border: 1px solid #e6e6e6;
      color: #c0c4cc;
      width: 24px;
      height: 24px;
      border-radius: 12px;
      display: inline-block;
      text-align: center;
      line-height: 24px;
      font-size: 12px;
      cursor: pointer;
    }

    &--person:hover {
      border-color: $xr-color-primary;
      color: $xr-color-primary;
    }

    .no-time-top {
      width: 24px;
      cursor: pointer;
      /deep/ .el-input__inner {
        background-color: white;
        border: 1px solid $xr-border-line-color;
        padding: 0;
        line-height: 24px;
        height: 24px;
      }
    }

    .no-time-top:hover {
      /deep/ .el-input__inner {
        border-color: $xr-color-primary;
      }

      /deep/ .el-icon-date {
        color: $xr-color-primary;
      }
    }
  }
}

.add.is-close {
  .add-info {
    display: none;
  }
}

// 闭合
.add.is-close:hover {
  cursor: pointer;
  border-color: #c0c4cc;
  .input {
    /deep/ .el-icon-plus {
      color: $xr-color-primary;
    }
  }
}

// 展开
.add.unfold {
  .input {
    margin-bottom: 15px;
  }
}

.send-btn {
  position: absolute;
  z-index: 1;
  right: 10px;
  bottom: 5px;

  /deep/ i {
    font-size: 13px;
    margin-right: 5px;
  }
}

// 选择负责人
.select-user {
  display: inline-block;
  .div-photo {
    width: 24px;
    height: 24px;
  }
}

// 关闭按钮
.wk-close {
  border: 0;
  color: #d9d9d9;
  font-size: 22px;
  cursor: pointer;
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  padding: 4px;
  transform: scale(0.8);
}

.wk-close:hover {
  color: #2362fb;
}
</style>
