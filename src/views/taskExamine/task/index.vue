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
          :percentage="20"
          :stroke-width="8"
          :format="progressFormat" />
        <span class="label margin-left">截止时间</span>
        <el-date-picker
          v-model="dueDate"
          type="date"
          placeholder="选择日期"
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
          v-model="showHide"
          @change="refreshList" />
      </flexbox>

      <flexbox
        class="cell-section__bd"
        align="stretch"
        direction="column">
        <div class="xr-cells">
          <task-cell
            v-for="(item, index) in list"
            :key="index"
            :data="item"
            :data-index="index"
            @on-handle="taskCellHandle" />
        </div>
        <div :class="['add', { 'unfold': isUnfold, 'is-close': !isUnfold }]">
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
            clearable
            placeholder="添加任务"
            @focus="inputFocus" />

          <div class="add-info">
            <el-date-picker
              ref="endTime"
              :class="{ 'no-time-top': !stopTime }"
              v-model="stopTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="" />
            <i class="wk wk-persons add-info--person" />
          </div>

          <el-button
            icon="wk wk-top"
            class="send-btn"
            type="primary">发布</el-button>
        </div>
      </flexbox>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TaskTabsHead from './components/TaskTabsHead'
import TaskCell from './components/TaskCell'
import { taskListAPI } from '@/api/oamanagement/task'

export default {
  /** 任务列表 */
  name: 'Index',
  components: {
    TaskTabsHead,
    TaskCell
  },
  props: {},
  data() {
    return {
      isUnfold: false, // 默认闭合
      list: [],
      type: '0',
      dueDate: '',
      priority: '',
      showHide: true,
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
      sendContent: '',
      stopTime: ''
    }
  },
  computed: {
    ...mapGetters(['userInfo']),

    tabs() {
      if (this.$route.params.type == 1) {
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
    }
  },
  watch: {},
  mounted() {
    this.getList()
  },
  beforeRouteUpdate(to, from, next) {
    this.type = '0'
    this.dueDate = ''
    this.priority = ''
    this.refreshList()
    next()
  },

  beforeDestroy() {},
  methods: {
    /**
     * 头部逻辑
     */
    progressFormat(percentage) {
      return '1/6'
    },

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
        type: this.type,
        priority: this.priority,
        dueDate: this.dueDate
      }
      console.log('this.$route.params.type---', this.$route.params.type)
      if (this.$route.params.type != 1) {
        params.mold = 1
      }

      taskListAPI(params)
        .then(res => {
          for (const item of res.data.list) {
            if (item.status == 5) {
              item.checked = true
            }
          }
          this.list = this.list.concat(res.data.list)
        })
        .catch(() => {})
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
    taskCellHandle(data) {},

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
  overflow: overlay;
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
    display: none;
    padding: 0 8px;
    .el-date-editor {
      width: 100px;
      font-size: 12px;
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
  .add-info {
    display: block;
  }

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
